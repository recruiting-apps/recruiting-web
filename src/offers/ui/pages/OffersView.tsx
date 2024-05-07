import Divider from '@/shared/ui/components/utils/Divider'
import OfferDetail from '../components/OfferDetail'
import { type Offer } from '@/offers/models/offer.interface'
import { useEffect, useState } from 'react'
import { useOffersQuery } from '../hooks/useOffersQuery'
import moment from 'moment'

const OffersView: React.FC = () => {
  const { offers } = useOffersQuery()
  const [selectedOffer, setOffer] = useState<Offer | null>(null)

  useEffect(() => {
    const offerFound = offers.find(offer => offer.id === selectedOffer?.id)

    if (offerFound) {
      setOffer(offerFound)
    } else {
      setOffer(offers[0])
    }
  }, [offers])

  return (
    <>
      <h1 className='text-3xl font-semibold uppercase'>Job Offers</h1>
      <div className='flex gap-2 h-[700px] overflow-hidden'>
        <main className='w-[40%] px-2 overflow-y-auto'>

          <Divider className='mt-1' />

          {
            offers.map(offer => (
              <div
                key={offer.id}
                className={`bg-gray-100 border p-3 ${selectedOffer?.id === offer.id ? 'border-blue-era' : ''} rounded-md cursor-pointer hover:border-blue-era transition-all duration-100 mb-2`}
                onClick={() => { setOffer(offer) }}
              >
                <header>
                  <h3 className='font-bold'>{offer.title}</h3>
                </header>
                <p>{offer.company}</p>
                <p>{offer.location}</p>
                <footer>
                  <p className='text-sm font-semibold'>{moment(offer.publicationDate).fromNow()}</p>
                </footer>

              </div>
            ))
          }
        </main>

        <aside className='w-[60%] px-3 py-2 overflow-y-auto'>
          <OfferDetail
            offer={selectedOffer}
          />
        </aside>

      </div>
    </>
  )
}

export default OffersView
