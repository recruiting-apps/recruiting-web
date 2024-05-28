import { useAuth } from '@/auth/hooks/useAuth'
import { useToast } from '@/shared/hooks/useToast'
import Button from '@/shared/ui/components/form/Button'
import Divider from '@/shared/ui/components/utils/Divider'
import { UsersService } from '@/users/services/users.service'

export const ConfigurationView = () => {
  const { user, toggleEmailNotification } = useAuth()

  const handleToggleNotifications = () => {
    void new UsersService()
      .toggleNotifications(user?.id ?? 0, user?.emailNotification ?? false)
      .then(() => {
        toggleEmailNotification()
        useToast({ type: 'success', message: 'Notifications updated' })
      })
      .catch((error) => {
        const { message } = error.data
        useToast({ type: 'error', message })
      })
  }

  return (
    <>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-semibold uppercase'>Configuration</h1>
      </div>

      <Divider className='mt-2' />

      <section className='p-3 shadow-card rounded-md'>
        <h3 className='uppercase font-semibold'>Notifications</h3>
        <p>Email notifications status: <span className="font-semibold">{user?.emailNotification ? 'Enabled' : 'Disabled'}</span></p>

        <Button color='primary' className='mt-2' onClick={handleToggleNotifications}>
          {user?.emailNotification ? 'Disable' : 'Enable'} notifications
        </Button>

      </section>
    </>
  )
}
