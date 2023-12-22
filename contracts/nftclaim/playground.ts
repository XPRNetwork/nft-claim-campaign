import { Name,PermissionLevel,UInt32  } from "@greymass/eosio";
import { AccountPermission, Blockchain, bigIntToBn, bnToBigInt, mintTokens, nameToBigInt } from "@proton/vert";
import { AIRDROP_MONTH_DURATION } from "./constants/time.constant";
import { Authority } from "proton-tsc";


async function wait(ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function main() {
    const blockchain = new Blockchain();
    blockchain.resetTables()
    const michel = blockchain.createAccounts('michel');
    const airdrop = blockchain.createContract('airdrop', 'target/airdrop.contract',true);
    const bqtoken = blockchain.createContract('bqtoken', 'node_modules/proton-tsc/external/xtokens/xtokens',true);
    
    
    const airdropActive = airdrop.permissions.find((perms) => perms.perm_name.toString() == 'active')
    if (!airdropActive) throw new Error('No active permission existis for Airdrop')
    
    const airdropActiveMutated = AccountPermission.from({...airdropActive})
    airdropActiveMutated.required_auth.accounts.filter((account)=>account.permission.permission.toString() == "eosio.code")
    airdropActiveMutated.perm_name = Name.from('airdrop')
    airdropActiveMutated.parent = Name.from('owner')
    
    bqtoken.setPermissions([
        ...bqtoken.permissions,
        airdropActiveMutated
    ])

    console.log(JSON.stringify(airdrop.permissions, null, 4));
    
    const atomicassets = blockchain.createContract('atomicassets', 'node_modules/proton-tsc/external/atomicassets/atomicassets');
    
    //#################################################################################################################################
    //Create and issue token
    
    await wait(0);
    await mintTokens(bqtoken,'BQX',4,5000000000,0,[])
  
    await wait(0);
    await atomicassets.actions.init().send(`${atomicassets.name}@active`);
    await atomicassets.actions.createcol([
        'michel',
        'testcolairdr',
        true,
        ['michel'],
        ['michel'],
        0.15,
        []
    ]).send(`michel@active`);
    await atomicassets.actions.createschema([
        'michel',
        'testcolairdr',
        'testcolairdr',
        [
            { "name": "name", "type": "string" },
            { "name": "image", "type": "string" },
            { "name": "url", "type": "string" },
            { "name": "description", "type": "string" }
          
        ],
    ]).send(`michel@active`);
    
    await atomicassets.actions.createtempl([
        'michel',
        'testcolairdr',
        'testcolairdr',
        true,
        true,
        10,
        [
            {"key":"name","value":["string","template"]},
            {"key":"image","value":["string","Qmca9Hy8qgQkZgj5GsVfV3QX3xGWrC8WiMdaBSiKbHZKy9"]},
            {"key":"url","value":["string","https://nft.com"]},
            {"key":"description","value":["string","Template !"]},
        ]
    ]).send(`michel@active`);
    await atomicassets.actions.mintasset([
        'michel',
        'testcolairdr',
        'testcolairdr',
        1,
        "michel",
        [
            {"key":"name","value":["string","template"]},
            {"key":"image","value":["string","Qmca9Hy8qgQkZgj5GsVfV3QX3xGWrC8WiMdaBSiKbHZKy9"]},
            {"key":"url","value":["string","https://nft.com"]},
            {"key":"description","value":["string","Template !"]},
        ],
        [],
        []
    ]).send(`michel@active`);
    //await bqtoken.actions.create([bqtoken.name, '5000000000 BQX']).send(`${bqtoken.name}@active`);
    //await bqtoken.actions.issue([bqtoken.name, '1000000000 BQX', '']).send(`${bqtoken.name}@active`);
  
    //#################################################################################################################################
    await wait(0);
    // Put you actions calls here
    await airdrop.actions.areg([
        '1.0000 BQX',
        [],
        [],
        [],
        'peritem',
        0,
        2629746000,
        'test ad',
        true
    ]).send(`michel@active`);

    const actorAsBigInt = nameToBigInt('michel')
    const aaAssetsTable = atomicassets.tables.assets(actorAsBigInt).getTableRows();
    const assetId = aaAssetsTable[0].asset_id;

    await wait(0);
    await airdrop.actions.asreg([
        'michel',
        [
            {
                asset:assetId,
                time:0
            }
        ]    

    ]).send('michel@active')
    await airdrop.actions.asreg([
        'michel',
        [
            {
                asset:assetId,
                time:0
            }
        ]    

    ]).send('michel@active')
    
    await airdrop.actions.setastime([
        'michel',
        [
            assetId,
        ],
        Math.floor(AIRDROP_MONTH_DURATION / 2)

    ]).send('michel@active')

    await wait(0);
    const assetsTable = airdrop.tables.airdrop().getTableRows();
    const airdropKey = assetsTable[0].key;
    console.log(airdropKey);

    await airdrop.actions["airdrp.claim"]([
        'michel',
        airdropKey

    ]).send([
        new PermissionLevel({
            actor: 'airdrop',
            permission:'active'
        })

    ])
}



main();
