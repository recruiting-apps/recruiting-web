import { type ExternalToast, toast } from 'sonner'
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '../ui/assets/icons/ToastIcons'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
  type?: ToastType
  message: string
  options?: ExternalToast
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <SuccessIcon className='w-6 h-6'/>,
  error: <ErrorIcon className='w-6 h-6'/>,
  info: <InfoIcon className='w-6 h-6'/>,
  warning: <WarningIcon className='w-6 h-6'/>
}

const TOAST_FUNCTION: Record<string, (message: React.ReactNode, data?: ExternalToast | undefined) => string | number> = {
  success: toast.success,
  error: toast.error
}

const ToastContainer: React.FC<ToastOptions> = ({ type = 'success', message }) => {
  const typeClass = {
    warning: 'text-warning',
    info: 'text-info',
    success: '',
    error: ''
  }

  return (
    <div className={`flex items-center gap-2 w-full ${typeClass[type]}`}>
      {ICONS[type]}
      <p className=''>{message}</p>
    </div>
  )
}

export const useToast = ({ type = 'success', message, options = {} }: ToastOptions) => {
  const toastOptions: ExternalToast = {
    duration: 2000,
    ...options
  }

  const triggerToast = TOAST_FUNCTION[type] || toast

  triggerToast(<ToastContainer type={type} message={message} />, toastOptions)
}
