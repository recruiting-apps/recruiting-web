import { useAuth } from '@/auth/hooks/useAuth'
import { type Offer } from '@/offers/models/offer.interface'
import { OffersService } from '@/offers/services/offers.service'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import { createContext, useEffect, useState } from 'react'

interface OffersContextInterface {
  offers: Offer[]
  setOffers: (offers: Offer[]) => void
  addOffer: (offer: Offer) => void
  updateOffer: (offer: Offer) => void

  selectedOffer: Offer | null
  setSelectedOffer: (offer: Offer | null) => void
}

export const OffersContext = createContext<OffersContextInterface>({
  offers: [],
  setOffers: () => { },
  addOffer: () => { },
  updateOffer: () => { },
  selectedOffer: null,
  setSelectedOffer: () => { }
})

export const OffersProvider: React.FC<{ children: React.ReactNode, owner: boolean }> = ({ children, owner }) => {
  const [offers, setOffers, addOffer, updateOffer] = useArrayReducer<Offer>([])

  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)

  const { user } = useAuth()

  useEffect(() => {
    const userId = owner ? user?.id : ''

    void new OffersService()
      .findAll(userId)
      .then((response) => {
        const filteredOffers = response.filter(offer => !offer.closed)

        setOffers(owner ? response : filteredOffers)
        if (response.length > 0) {
          setSelectedOffer(response[0])
        }
      })
  }, [])

  return (
      <OffersContext.Provider value={{
        offers,
        setOffers,
        addOffer,
        updateOffer,
        selectedOffer,
        setSelectedOffer
      }}>
        { children }
      </OffersContext.Provider>
  )
}
