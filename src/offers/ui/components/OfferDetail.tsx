import { useAuth } from '@/auth/hooks/useAuth'
import Button from '@/shared/ui/components/form/Button'
import Divider from '@/shared/ui/components/utils/Divider'
import { useOffers } from '../hooks/useOffers'
import { OffersService } from '@/offers/services/offers.service'
import { useToast } from '@/shared/hooks/useToast'
import { useEffect, useState } from 'react'

const OfferDetail: React.FC = () => {
  const { selectedOffer: offer, setSelectedOffer, updateOffer } = useOffers()
  const { user } = useAuth()

  const [canApply, setCanApply] = useState(false)

  useEffect(() => {
    if (!offer || !user) return

    const hasUserApplied = offer.applications.some(application => application.user.id === user.id)

    const canApply = offer.user.id !== user.id && !hasUserApplied
    setCanApply(canApply)
  }, [offer, user])

  const handleApply = () => {
    if (!offer) return

    void new OffersService()
      .apply(offer.id)
      .then((response) => {
        setSelectedOffer(response)
        updateOffer(response)
        useToast({ message: 'Applied successfully', type: 'success' })
      })
  }

  return (
    <div className='shadow-card-bold rounded-md p-4 '>
      <header className='flex justify-between gap-2'>
        <div>
          <h2 className='text-xl font-semibold'>{offer?.title}</h2>
          <p>{offer?.location}</p>
        </div>
        <div>
          {canApply && <Button color='primary' onClick={handleApply}>Apply</Button>}
        </div>
      </header>

      <Divider className='my  -2' />
      <div className='[&>p]:font-semibold [&>p>span]:font-normal'>
        <p>Empresa: <span>{offer?.company}</span></p>
        {String(offer?.salary ?? '').length > 0 && <p>Salario: <span>{offer?.salary}</span></p>}
      </div>
      <p className='' dangerouslySetInnerHTML={{ __html: offer?.description?.replace(/\n/g, '<br>') ?? '' }}></p>

      {
        offer && offer.expectedAbilities.length > 0 && (
          <div className='my-2'>
            <h3 className='font-semibold'>Expected Abilities</h3>
            <ul className='flex flex-wrap gap-1'>
              {offer?.expectedAbilities.map(ability => (
                <li key={ability}
                  className='bg-blue-era text-white p-1 rounded-md text-sm'
                >{ability}</li>
              ))}
            </ul>
          </div>
        )
      }

      {offer && offer.applications.length > 0 && <p>Postulaciones: {offer?.applications.length}</p>}
    </div>
  )
}

export default OfferDetail
