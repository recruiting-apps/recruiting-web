import moment from 'moment'
import { useOffers } from '../hooks/useOffers'

const OffersList: React.FC = () => {
  const { offers, selectedOffer, setSelectedOffer } = useOffers()
  return (
    <>
      {
        offers.map(offer => (
          <div
            key={offer.id}
            className={`bg-gray-100 border ${selectedOffer?.id === offer.id ? 'border-blue-era' : ''} p-3 rounded-md cursor-pointer hover:border-blue-era transition-all duration-100 mb-2`}
            onClick={() => { setSelectedOffer(offer) }}
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
    </>
  )
}

export default OffersList
