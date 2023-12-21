'use client';
type ErrorPagePros = {
  error: Error & { digest?: string }
  reset: () => void
}
export default function NFTErrorPage({error}:ErrorPagePros) {
  return <>
    NFT not exists
    <div>{ JSON.stringify(error)}</div>
  </>
}