import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, type ReactElement } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
  className?: string
  onTop?: boolean
  width?: 'max-w-lg' | 'max-w-md' | 'max-w-sm' | 'max-w-xl' | 'max-w-2xl' | 'max-w-3xl' | 'max-w-4xl' | 'max-w-5xl' | 'max-w-6xl' | 'max-w-7xl'
}

const Modal = ({ isOpen, onClose, children, className = '', onTop = false, width = 'max-w-lg' }: ModalProps): ReactElement => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className={`flex ${onTop ? '' : 'min-h-full'} w-full items-center justify-center p-4 text-center`}>
            <Transition.Child
                as={Fragment}
              >
                <Dialog.Panel className={`w-full ${width} transform rounded-2xl bg-white p-5 text-left align-middle shadow-xl transition-all  ${className}`}>
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
  )
}

export default Modal
