import { type Offer } from '@/offers/models/offer.interface'
import { useEffect, useState } from 'react'
import OfferFormView from './OfferFormView'
import { useNavigate, useParams } from 'react-router-dom'
import { OffersService } from '@/offers/services/offers.service'

const EditOfferView: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [offer, setOffer] = useState<Offer | null>(null)

  useEffect(() => {
    if (!id) {
      navigate(-1)
      return
    }

    void new OffersService()
      .findById(+id)
      .then((offer) => {
        console.log(offer)
        setOffer(offer)
      })
      .catch((error) => {
        console.log(error)
        navigate(-1)
      })
  }, [id])

  return (
    <OfferFormView offerToEdit={offer}/>
  )
}

export default EditOfferView
