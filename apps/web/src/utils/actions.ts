import { RpcInterfaces } from "@proton/js";

export interface Action<T> {
  account: string;
  name: string;
  authorization: RpcInterfaces.PermissionLevel[];
  data: T;
  hex_data?: string;
}

export interface ClaimMintActionData {
  account:string
}

export function generateMintAction(actorName: string, contractName: string):Action<ClaimMintActionData> {
  
  return {
    account: contractName,
    name: 'claim.mint',
    authorization: [
      {
        actor: actorName,
        permission:"active",
      }
    ],
    data: {
      account:actorName
    }
  }

  
 }