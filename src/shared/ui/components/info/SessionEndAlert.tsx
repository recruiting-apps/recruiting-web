import appStorage from '@/shared/config/storage'
import Button from '../form/Button'
import Modal from '../utils/Modal'
import { useEffect, useState } from 'react'
import { AUTH_STORAGE_KEY } from '@/auth/store/auth.store'
import cookiesStorage from '@/shared/config/storage/cookies'

const SessionEndAlert: React.FC = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleEndSession = () => {
      setShow(true)
    }

    window.addEventListener('endSession', handleEndSession)
    return () => { window.removeEventListener('endSession', handleEndSession) }
  }, [])

  useEffect(() => {
    const isSessionExpired = cookiesStorage.isSessionExpired()

    if (isSessionExpired) {
      setShow(true)
    }
  }, [])

  const handleEndSession = () => {
    appStorage.removeItem(AUTH_STORAGE_KEY)
    cookiesStorage.clearSessionExpiration()
    location.reload()
  }

  return (
    <Modal isOpen={show} onClose={() => {}} width='max-w-lg'>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-2xl font-bold">Su sesión ha expirado</h1>
        <p className="text-gray-500">Por favor, ingrese nuevamente</p>
        <Button color='primary' className='mt-3' onClick={handleEndSession}>Ingresar</Button>
      </div>
    </Modal>
  )
}

export default SessionEndAlert
