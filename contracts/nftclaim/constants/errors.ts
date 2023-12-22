import { Name } from "proton-tsc";

export function templateNotExistMessage(templateId:u32,collectionName:Name):string {
  
  return `NFTCLAIM:Template ${templateId} not exists on ${collectionName}. #E001`

}

export function duplicateTemplateMessage(templateId: u32): string {
  
  return `NFTCLAIM: Template ${templateId} is already registered as claimable. #E002`

}

export function emptyClaimableListMessage(): string {
  
  return `NFTCLAIM: There is no asset to claim right now!. #E002`

}

export function alreadyClaimedMessage(): string {
  
  return `NFTCLAIM: Active template have been claimed already. #E002`

}