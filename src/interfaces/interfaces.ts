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
  numbering: "hex" | "vm-numbers"
  startingNumber: string
  nftName: string
  nftDescription: string
  nftIconUri: string
  nftIconType: string
  hasNftImages: boolean
  webUrl: string
  listLinks: ([] | [string | undefined, string | undefined])[]
}