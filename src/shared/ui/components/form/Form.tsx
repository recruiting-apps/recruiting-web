import { forwardRef, createContext, useState } from 'react'
import Button, { type ButtonColor } from './Button'
import { useToast } from '@/shared/hooks/useToast'

export const FormContext = createContext<{ cancelFlag: boolean }>({
  cancelFlag: false
})

interface FormProps extends React.HTMLProps<HTMLFormElement> {
  submitText?: string
  submitColor?: ButtonColor
  buttonClassName?: string
  isLoading?: boolean
  showButtons?: boolean

  hasCancelButton?: boolean
  onCancel?: () => void

  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

const Form = forwardRef(function Form (
  {
    className = '',
    onSubmit,
    children,
    submitText = 'Confirm',
    submitColor = 'primary',
    buttonClassName = '',
    isLoading = false,
    hasCancelButton = true,
    showButtons = true,
    onCancel
  }: FormProps, ref: React.Ref<HTMLFormElement>) {
  const [cancelFlag, setCancelFlag] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget

    const error = form.querySelectorAll('p.error')

    error.forEach((element) => {
      const parent = element.parentElement
      if (!parent) return

      const input = parent.querySelector('input')
      input?.classList.add('input-shake', 'input-error')

      setTimeout(() => {
        input?.classList.remove('input-shake')
      }, 1000)
    })

    if (error.length > 0) {
      useToast({ message: 'Hay errores en el formulario', type: 'error' })
      return
    }

    onSubmit(event)
  }

  const timeOutCancelFlag = () => {
    setCancelFlag(true)
    setTimeout(() => { setCancelFlag(false) }, 0)
  }

  const handleCancel = () => {
    timeOutCancelFlag()
    onCancel?.()
  }

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      className={`flex flex-col gap-3 ${className}`}
      >

      <FormContext.Provider value={{
        cancelFlag
      }}>
        {children}
      </FormContext.Provider>

      {showButtons && <div className='flex gap-2 justify-end items-center'>
        <Button
          className={buttonClassName}
          color={submitColor}
          isLoading={isLoading}
          type='submit'
        >{submitText}</Button>

        {
          hasCancelButton && (
            <Button color='danger' onClick={handleCancel}>Cancel</Button>
          )
        }
      </div>}
    </form>
  )
})

export default Form
