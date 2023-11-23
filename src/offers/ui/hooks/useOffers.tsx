import { type Offer } from '@/offers/models/offer.interface'
import { useContext } from 'react'
import { OffersContext } from '../context/offers'

export const useOffers = () => {
  const { offers, addOffer, selectedOffer, setSelectedOffer, updateOffer } = useContext(OffersContext)

  const handleSetSelectedOffer = (offer: Offer | null) => {
    setSelectedOffer(offer)
  }

  return {
    offers,
    addOffer,
    updateOffer,
    selectedOffer,
    setSelectedOffer: handleSetSelectedOffer
  }
}
