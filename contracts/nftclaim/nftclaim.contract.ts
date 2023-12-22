import {
  Asset,
  Contract,
  Name,
  SafeMath,
  TableStore,
  check,
  currentTimeMs,
  requireAuth,
} from "proton-tsc";
import {
  ATOMICASSETS_CONTRACT,
  AtomicAttribute,
  Templates,
  sendMintAsset,
} from "proton-tsc/atomicassets";

import {ClaimablesTable, ClaimsTable} from "./tables";

import {
  templateNotExistMessage,
  duplicateTemplateMessage,
  emptyClaimableListMessage,
  alreadyClaimedMessage,
} from "./constants";

@contract
export class NftClaimContract extends Contract {
  
  private claimablesTable: TableStore<ClaimablesTable> =
    new TableStore<ClaimablesTable>(this.receiver);

  @action("template.reg")
  registerTemplate(
    templateId: u32,
    collectionName: Name,
    activeStartTime: u64,
    activeEndTime: u64
  ): void {
    requireAuth(this.receiver);
    const aaTemplatesTable: TableStore<Templates> = new TableStore<Templates>(
      ATOMICASSETS_CONTRACT,
      collectionName
    );
    aaTemplatesTable.requireGet(
      templateId,
      templateNotExistMessage(templateId, collectionName)
    );

    const duplicatedTemplate = this.claimablesTable.exists(u64(templateId));
    check(!duplicatedTemplate, duplicateTemplateMessage(templateId));

    const newClaimable = new ClaimablesTable(
      u64(templateId),
      collectionName,
      activeStartTime,
      activeEndTime
    );
    this.claimablesTable.store(newClaimable, this.receiver);
  }

  @action("claim.mint")
  claimMint(account: Name): void {
    let currentClaimable = this.claimablesTable.first();
    check(!!currentClaimable, emptyClaimableListMessage());

    if (!currentClaimable) return;

    if (this.hasCurrentClaimRightNow(currentClaimable)) {
      check(
        !this.accountHasClaim(account, currentClaimable),
        alreadyClaimedMessage()
      );
      this.applyMint(account, currentClaimable);
      return;
    }

    while (currentClaimable) {
      if (this.hasCurrentClaimRightNow(currentClaimable)) {
        check(
          !this.accountHasClaim(account, currentClaimable),
          alreadyClaimedMessage()
        );
        this.applyMint(account, currentClaimable);
        break;
      }
      currentClaimable = this.claimablesTable.next(currentClaimable);
    }

    check(false, emptyClaimableListMessage());
  }

  @action("logmint", notify)
  onLogMint(
    assetId: u64,
    minter: Name,
    collection: Name,
    schema: Name,
    templateId: i32,
    new_asset_owner: Name,
    immutableData: AtomicAttribute[],
    mutableData: AtomicAttribute[],
    backedTokens: Asset[],
    immutableTemplateData: AtomicAttribute[]
  ): void {
    const now = currentTimeMs();
    const claimsTable: TableStore<ClaimsTable> = new TableStore<ClaimsTable>(
      this.receiver,
      new_asset_owner
    );
    const newClaim: ClaimsTable = new ClaimsTable(
      u64(templateId),
      assetId,
      now
    );
    claimsTable.store(newClaim, this.receiver);
  }

  @action("dev.gentmpl")
  generateTemplate(): void {
    requireAuth(this.receiver);
    this.removeAllClaimables();
    const h24: u32 = 3600000;
    const now: u64 = currentTimeMs();

    const ids = [
      1795, 1796, 1797, 1798, 1799, 1800, 1801, 1802, 1803, 1804, 1805, 1806,
    ];
    const totalLength = ids.length;

    while (ids.length > 0) {
      const index = totalLength - ids.length;
      const id = ids.shift();
      const generatedClaimable = new ClaimablesTable(
        id,
        this.receiver,
        now + u64(h24 * index),
        now + u64(h24 * index) + u64(h24 - 1)
      );
      
      this.claimablesTable.store(generatedClaimable, this.receiver);
    }
  }

  private hasCurrentClaimRightNow(claimable: ClaimablesTable): boolean {
    const now = currentTimeMs();
    
    return now >= claimable.activeStartTime && now <= claimable.activeEndTime;
  }

  private accountHasClaim(account: Name, claimable: ClaimablesTable): boolean {
    const claimsTable: TableStore<ClaimsTable> = new TableStore<ClaimsTable>(
      this.receiver,
      account
    );
    const existingClaim = claimsTable.get(claimable.templateId);
    return !!existingClaim;
  }

  private applyMint(account: Name, claimable: ClaimablesTable): void {
    const aaTemplatesTable: TableStore<Templates> = new TableStore<Templates>(
      ATOMICASSETS_CONTRACT,
      claimable.collectionName
    );
    const aaTemplate = aaTemplatesTable.requireGet(
      claimable.templateId,
      "🎅 Santa says: Oh Oh Oh Template not exists"
    );
    sendMintAsset(
      this.receiver,
      this.receiver,
      claimable.collectionName,
      aaTemplate.schema_name,
      u32(aaTemplate.template_id),
      account,
      [],
      [],
      []
    );
  }

  private removeAllClaimables(): void {
    while (!this.claimablesTable.isEmpty()) {
      const claimableToRemove = this.claimablesTable.first();
      if (claimableToRemove) {
        this.claimablesTable.remove(claimableToRemove);
      }
    }
  }
}
