
import { cache } from 'react'
import { Metadata } from "next";
import { ClaimableDetails } from "@/components/claim/claim-details";
import { fetchClaimable } from "@/services/chain/claimable";
import { TimedTemplate } from "@/interfaces/timed-template";

const getItem = cache(async (templateId: string):Promise<TimedTemplate | undefined> => {
  
  return fetchClaimable(templateId)
  
})

type NFTPageProps = {
  params: {
    templateId:string  
  }
}

export const metadata: Metadata = {
  title: 'Gift Crypto Not Cash by Metal Pay',
  description: 'Discover a new way of gifting at GiftCryptoNotCash.com. Metal Pay simplifies crypto gifting this holiday season with an easy, six-step process and compliant trading. Embrace the spirit with free trading on select tokens daily until December 25th.',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    type:'website',
    images: '/og_image.png',
    title: 'Gift Crypto Not Cash by Metal Pay',
    description:'Discover a new way of gifting at GiftCryptoNotCash.com. Metal Pay simplifies crypto gifting this holiday season with an easy, six-step process and compliant trading. Embrace the spirit with free trading on select tokens daily until December 25th. '
  },
}

export default async function NFTPage({params}:NFTPageProps) {
  const data = await getItem(params.templateId);
  return (
    <main className="items-center justify-between grid grid-cols-1">
      <ClaimableDetails ipfsResolver={process.env.NEXT_PUBLIC_IPFS_ENDPOINT!} claimable={data}></ClaimableDetails>
    </main>
  )
}
