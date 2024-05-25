import { type Offer } from '@/offers/models/offer.interface'
import moment from 'moment'

interface OfferCardProps {
  offer: Offer
  handleClick: (offer: Offer) => void
  isSelected: boolean
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, handleClick, isSelected }) => {
  return (
    <article
      key={offer.id}
      className={`bg-gray-100 border p-3 ${isSelected ? 'border-blue-era' : ''} rounded-md cursor-pointer hover:border-blue-era transition-all duration-100 mb-2`}
      onClick={() => { handleClick(offer) }}
    >
      <header>
        <h3 className='font-bold'>{offer.title}</h3>
      </header>
      <p>{offer.company}</p>
      <p>{offer.location}</p>
      <footer>
        <p className='text-sm font-semibold'>{moment(offer.publicationDate).fromNow()}</p>
      </footer>

    </article>
  )
}

export default OfferCard
