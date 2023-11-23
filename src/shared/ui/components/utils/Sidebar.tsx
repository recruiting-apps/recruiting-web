import React, { useRef, type ReactElement } from 'react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
  className?: string
  blockOutsideClick?: boolean
  fullScreen?: boolean
}

const Sidebar = ({ children, isOpen, blockOutsideClick = false, className = '', onClose, fullScreen = false }: SidebarProps): ReactElement => {
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  const handleOnClose = (event: React.MouseEvent): void => {
    if (blockOutsideClick) return

    if (sidebarRef.current && isNode(event.target) && sidebarRef.current.contains(event.target)) {
      onClose()
    }
  }

  const isNode = (target: any): target is Node => {
    return !!target && 'nodeType' in target
  }

  return (
    <div
      onClick={handleOnClose}
      className={`absolute top-0 right-0 bottom-0 w-full z-20 ${isOpen ? '' : '-mr-[100%]'} transition-alls duration-500 flex justify-end`}>
      <div
        ref={sidebarRef}
        onClick={(event) => { event.stopPropagation() } }
        className={`shadow-[#757575] shadow-2xl ${fullScreen ? 'w-[95%]' : 'min-w-[600px]'} max-h-full bg-white overflow-y-auto p-4`}
      >
        <div className={`w-[90%] mx-auto ${className}`}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
