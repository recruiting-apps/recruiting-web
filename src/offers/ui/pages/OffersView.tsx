import Divider from '@/shared/ui/components/utils/Divider'
import OfferDetail from '../components/OfferDetail'
import { type Offer } from '@/offers/models/offer.interface'
import { useEffect, useState } from 'react'
import { useOffersQuery } from '../hooks/useOffersQuery'
import OfferCard from '../components/OfferCard'
import { SearchIcon } from '@/shared/ui/assets/icons/AppIcons'

const OffersView: React.FC = () => {
  const { offers, onSearch } = useOffersQuery()
  const [selectedOffer, setOffer] = useState<Offer | null>(null)

  useEffect(() => {
    const offerFound = offers.find(offer => offer.id === selectedOffer?.id)

    if (offerFound) {
      setOffer(offerFound)
    }
  }, [offers])

  const handleOfferClick = (offer: Offer) => {
    setOffer(offer.id === selectedOffer?.id ? null : offer)
  }

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    const search = data.get('search') as string

    const searchQuery = search.trim()

    onSearch(searchQuery)
  }

  return (
    <>
      <header className='grid grid-cols-[60%_40%] items-center mb-3'>
        <h1 className='text-3xl font-semibold uppercase'>Job Offers</h1>
        <form className='' onSubmit={handleSearch}>
          <label>
            Search for an offer
            <div className='flex items-center gap-2'>
              <input
                className='border border-gray-300 p-1 rounded-md w-full focus:outline-none focus:border-blue-era transition-all duration-100'
                name='search' type="text" />
              <SearchIcon className='w-6 h-6' />
            </div>
          </label>
          <button type='submit' className='hidden'></button>
        </form>
      </header>
      <div className={`grid ${selectedOffer ? 'grid-cols-[40%_60%]' : ''} gap-2 h-auto max-h-[700px] overflow-hidden`}>
        <div>
          <Divider className='mt-1' />
          <main className={`px-2 overflow-y-auto ${!selectedOffer && 'grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4'}`}>
            {
              offers.length === 0 && (
                <div className='bg-gray-100 border p-3 rounded-md'>
                  <p className='text-center'>No offers available</p>
                </div>
              )
            }

            {
              offers.map(offer => <OfferCard key={offer.id} offer={offer} handleClick={handleOfferClick} isSelected={offer.id === selectedOffer?.id} />)
            }
          </main>
        </div>

        <aside className={`${selectedOffer ? 'visible opacity-100' : 'invisible opacity-0'} px-3 py-2 overflow-y-auto transition-[opacity] duration-300 ease-in`}>
          <OfferDetail
            offer={selectedOffer}
          />
        </aside>

      </div>
    </>
  )
}

export default OffersView
