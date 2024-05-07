import { useAuth } from '@/auth/hooks/useAuth'
import { type Offer } from '@/offers/models/offer.interface'
import { OffersService } from '@/offers/services/offers.service'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const OFFERS_KEY = 'offers'

export const useOffersQuery = () => {
  const queryClient = useQueryClient()
  const { pathname } = useLocation()
  const { user } = useAuth()
  const [userId, setUserId] = useState<string>('')

  const { data, refetch, isError, isPending, isFetching, isLoading, error } = useQuery({
    queryKey: [OFFERS_KEY, userId],
    queryFn: async () => await new OffersService().findAll(userId),
    placeholderData: keepPreviousData,
    retry: 2
  })

  useEffect(() => {
    setUserId(pathname.includes('my-requests') ? user?.id ?? '' : '')
  }, [pathname])

  const handleUpdateOffer = async (offer: Offer) => {
    await queryClient.setQueryData([OFFERS_KEY, userId], (oldData: Offer[] | undefined) => {
      if (oldData === undefined) return

      let offers = oldData ?? []

      const existingRequest = offers.find((o: Offer) => o.id === offer.id)

      offers = existingRequest
        ? offers.map((o: Offer) => o.id === offer.id ? offer : o)
        : [offer, ...offers]

      return offers
    })
  }

  return {
    offers: data ?? [],
    handleUpdateOffer,
    refetch,
    isError,
    isPending,
    isFetching,
    isLoading,
    error
  }
}
