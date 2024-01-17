export function validInputs(details) {

  return true
}

export function generateBcmr(details) {
  // Generate BCMR json obj
  const bcmrJsonObj = {
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
  const snapshot = bcmrJsonObj.identities[details.tokenId][details.date];
  if(details.tokenDecimals) snapshot.token.decimals = parseInt(details.tokenDecimals);
  if(details.hasNftFields){
    snapshot.token.nfts = {
      description: "",
      parse: {
        types: {}
      }
    };
    const NFTtypes = snapshot.token.nfts.parse.types;
    for(let i=1; i<= details.numberNFTs; i++){
      const nftNameNumbered = details.nftName.replace("{i}", i);
      const nftDescriptionNumbered = details.nftDescription.replace("{i}", i);
      let nftCommitment = i.toString(16);
      if(nftCommitment.length % 2 != 0) nftCommitment = `0${nftCommitment}`;
      NFTtypes[nftCommitment] = {
        "name": nftNameNumbered,
        "description": nftDescriptionNumbered ,
        "uris": {
          "icon": details.nftIconUri + `/${i}.${details.nftIconType}`
        }
      }
      if(details.hasNFTimages){
         NFTtypes[nftCommitment].uris.image = details.nftIconUri + `/${i}-img.${details.nftIconType}`
      }
    }
  }
  /*
  if(webUrl) snapshot.uris.web = webUrl;
  listUris.forEach(uri => {
    if(uri[0] && uri[1]) snapshot.uris[uri[0]] = uri[1];
  }) */
  return bcmrJsonObj;
}