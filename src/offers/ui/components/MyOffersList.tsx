import Button from '@/shared/ui/components/form/Button'
import { useNavigate } from 'react-router-dom'
import { type Offer } from '@/offers/models/offer.interface'
import { useOffersQuery } from '../hooks/useOffersQuery'

const MyOffersList: React.FC = () => {
  const { offers } = useOffersQuery()
  const navigate = useNavigate()

  const handleClickDetailOffer = (offer: Offer) => () => {
    navigate(`/my-offers/${offer.id}`)
  }
  return (
    <>
      {
        offers.map(offer => (
          <div
            key={offer.id}
            className='bg-gray-100 border p-3 rounded-md hover:border-blue-era transition-all duration-100'
          >

            <h3 className='font-bold'>{offer.title}</h3>

            <p className='uppercase text-sm'>Status: {offer.closed ? 'Close' : 'Open'}</p>

            {offer.expectedAbilities.length > 0 && (
              <div className='my-2'>
                <h4 className='font-semibold'>Expected Abilities: </h4>
                <ul className='flex flex-wrap gap-1'>
                  {offer.expectedAbilities.map(ability => (
                    <li key={ability}
                      className='bg-blue-era text-white p-1 rounded-md text-sm'
                    >{ability}</li>
                  ))}
                </ul>
              </div>
            )}

            <footer className='[&>p]:text-sm'>
              <p>N° applications: {offer.applications.length}</p>
              <p>Published: {offer.publicationDate}</p>
              <p>Expires: {offer.expirationDate}</p>

              <div className="flex justify-end"><Button color='primary' className='mt-2' onClick={handleClickDetailOffer(offer)}>Ver detalle</Button></div>
            </footer>
          </div>
        ))
      }
    </>
  )
}

export default MyOffersList
