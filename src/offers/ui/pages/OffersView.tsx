import Divider from '@/shared/ui/components/utils/Divider'
import OfferDetail from '../components/OfferDetail'
import { OffersProvider } from '../context/offers'
import OffersList from '../components/OffersList'

const OffersView: React.FC = () => {
  return (
    <OffersProvider owner={false}>
      <h1 className='text-3xl font-semibold uppercase'>Job Offers</h1>
      <div className='flex gap-2 h-[700px] overflow-hidden'>
        <main className='w-[40%] px-2 overflow-y-auto'>

          <Divider className='mt-1' />

          <OffersList />
        </main>

        <aside className='w-[60%] px-3 py-2 overflow-y-auto'>
          <OfferDetail />
        </aside>

      </div>
    </OffersProvider>
  )
}

export default OffersView
