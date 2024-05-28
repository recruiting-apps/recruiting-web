import { Status } from '@/offers/models/enums/status.enum'
import { type Offer } from '@/offers/models/offer.interface'
import { OffersService } from '@/offers/services/offers.service'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

const OFFER_DETAIL_KEY = 'offer-detail'

export const useOfferDetailQuery = () => {
  const { id } = useParams()

  const { data: offer, isLoading, isFetching, isError, refetch } = useQuery<Offer | null>({
    queryKey: [OFFER_DETAIL_KEY, id],
    queryFn: async () => await new OffersService().findById(id ? +id : 0),
    retry: 5
  })

  const betterApplicant = offer?.applications.find(application => application.status === Status.ACCEPTED) ?? null

  const applications = (() => {
    if (!offer) return []

    const aux = offer.applications

    aux.sort((a, b) => a.order - b.order)

    return aux
  })()

  return {
    offer,
    betterApplicant,
    applications,
    isFetching,
    isLoading,
    isError,
    refetch
  }
}
