export interface DetailsObj {
  date: string
  registryIdentityName: string
  registryIdentityDescription: string
  tokenId: string
  tokenName: string
  tokenDescription: string
  tokenSymbol: string,
  iconUri: string
  tokenDecimals: string
  hasNftFields: boolean
  numberNFTs: string
  nftName: string
  nftDescription: string
  nftIconUri: string
  nftIconType: string
  hasNftImages: boolean
  webUrl: string
  listLinks: ([] | [string | undefined, string | undefined])[]
}