
import { bigIntToVmNumber, binToHex } from "@bitauth/libauth";
import type { Registry, NftType } from "./interfaces/bcmr-v2.schema.js"
import type { DetailsObj } from "./interfaces/interfaces.js";

export function validInputs(details:DetailsObj) {
  const { tokenId, tokenName, tokenDescription, tokenSymbol, hasNftFields, numberNFTs, nftName, startingNumber } = details
  let hasRequiredFields = Boolean(tokenId && tokenName && tokenDescription && tokenSymbol);
  if(hasNftFields) hasRequiredFields = Boolean(hasRequiredFields && numberNFTs && nftName && startingNumber);
  return hasRequiredFields
}

export function generateBcmr(details:DetailsObj):Registry {
  // Generate BCMR json obj
  const bcmrJsonObj: Partial<Registry> = {
    "$schema": "https://cashtokens.org/bcmr-v2.schema.json",
    "version": { "major": 0, "minor": 1, "patch": 0 },
    "latestRevision": details.date,
    "registryIdentity": {
      "name": details.registryIdentityName,
      "description": details.registryIdentityDescription,
    },
    "identities": {
      [details.tokenId]: {
        [details.date]: {
          "name": details.tokenName,
          "description": details.tokenDescription,
          "token": {
            "category": details.tokenId,
            "symbol": details.tokenSymbol
          },
          "uris": {
            "icon": details.iconUri,
            "web": details.webUrl
          }
        }
      }
    }
  }
  if(!bcmrJsonObj?.identities?.[details.tokenId][details.date]) throw new Error("Error in bcmrJsonObj")
  const snapshot = bcmrJsonObj.identities[details.tokenId][details.date];
  if(!snapshot?.token) throw new Error("Error in snapshot")
  const tokenDecimals = parseInt(details.tokenDecimals)
  if(!Number.isNaN(tokenDecimals)) snapshot.token.decimals = tokenDecimals;
  if(details.hasNftFields){
    snapshot.token.nfts = {
      description: "",
      parse: {
        types: {}
      }
    };
    const NFTtypes = snapshot.token.nfts.parse.types;
    const startingNumber = parseInt(details.startingNumber) ?? 1;
    const endingNumber = startingNumber + parseInt(details.numberNFTs);
    for(let i=startingNumber; i < endingNumber; i++){
      const nftNameNumbered = details.nftName.replace("{i}", i.toString());
      const nftDescriptionNumbered = details.nftDescription.replace("{i}", i.toString());
      let nftCommitment
      if(details.numbering === "hex"){
        nftCommitment = i.toString(16);
        if(nftCommitment.length % 2 != 0) nftCommitment = `0${nftCommitment}`;
      } else {
        const vmNumber = bigIntToVmNumber(BigInt(i) - 1n);
        nftCommitment = binToHex(vmNumber);
      }
      const newNftItem: NftType= {
        "name": nftNameNumbered,
        "description": nftDescriptionNumbered ,
        "uris": {
          "icon": details.nftIconUri + `/${i}.${details.nftIconType}`
        }
      }
      if(details.hasNftImages){
        if(!newNftItem.uris) throw new Error("Error in newNftItem.uris")
        newNftItem.uris.image = details.nftIconUri + `/${i}-img.${details.nftIconType}`
      }
      NFTtypes[nftCommitment] = newNftItem
    }
  }
  if(!snapshot?.uris) snapshot.uris = {}
  if(details.webUrl) snapshot.uris.web = details.webUrl;
  for(const [key, value] of details.listLinks){
    if(key && value) snapshot.uris[key] = value;
  }
  return bcmrJsonObj as Registry;
}