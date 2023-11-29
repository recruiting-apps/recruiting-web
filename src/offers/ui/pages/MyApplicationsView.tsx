import Divider from '@/shared/ui/components/utils/Divider'
import { type Offer } from '@/offers/models/offer.interface'
import { OffersService } from '@/offers/services/offers.service'
import Button from '@/shared/ui/components/form/Button'
import { useState, useEffect } from 'react'
import { useAuth } from '@/auth/hooks/useAuth'
import { useToast } from '@/shared/hooks/useToast'
import { Status, StatusColor } from '@/offers/models/enums/status.enum'
import moment from 'moment'

const MyApplicationsView: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([])
  const { user } = useAuth()

  useEffect(() => {
    void new OffersService()
      .findAllMyApplications()
      .then((response) => {
        setOffers(response)
      })
  }, [])

  const handleCancelApplication = (offer: Offer) => () => {
    const application = offer.applications.find(application => application.user.id === user?.id)

    void new OffersService()
      .cancelApplication(offer.id, application?.id ?? '')
      .then((response) => {
        setOffers(offers.filter(offer => offer.id !== response.id))
        useToast({ message: 'Application canceled successfully', type: 'success' })
      })
  }

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h1 className='uppercase text-3xl font-semibold'>My Applications</h1>
      </div>

      <Divider className='my-2'></Divider>

      <main className='grid gap-2 grid-cols-[repeat(auto-fill,minmax(400px,1fr))] mt-4'>
        {
          offers.length === 0 && (
            <div className='bg-gray-100 border p-3 rounded-md'>
              <p className='text-center'>No applications found</p>
            </div>
          )
        }
        {
          offers.map(offer => {
            const application = offer.applications.find(app => app.user.id === user?.id)

            return (
              <div
                key={offer.id}
                className='bg-gray-100 border p-3 rounded-md hover:border-blue-era transition-all duration-100'
              >

                <h3 className='font-bold text-lg'>{offer.title}</h3>

                <div className='my-2'>
                  <p className='font-semibold'>Application status</p>
                  <span className={`${StatusColor[application?.status ?? Status.PENDING]} text-white py-1 px-3 rounded-md inline-block mt-2`}>{application?.status}</span>
                </div>

                <footer className='[&>p]:text-sm'>
                  <p>Application date: {moment(application?.applicationDate).format('DD/MM/YYYY hh:mm A')}</p>

                  {application?.status === Status.PENDING && <div className="flex justify-end">
                    <Button color='primary' className='mt-2' onClick={handleCancelApplication(offer)}>Cancel Application</Button>
                  </div>}
                </footer>
              </div>
            )
          })
        }
      </main>
    </div>
  )
}

export default MyApplicationsView
