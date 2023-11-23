import React, { useEffect, useState } from 'react'

type ButtonType = 'button' | 'submit' | 'reset' | undefined
export type ButtonColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  color: ButtonColor
  type?: ButtonType
  isLoading?: boolean
  disabled?: boolean
  isActive?: boolean
}

const getButtonColor = (buttonColor: ButtonColor): string => {
  const colors = {
    primary: 'bg-blue',
    secondary: 'bg-black',
    success: 'bg-success',
    info: 'bg-info',
    warning: 'bg-warning',
    danger: 'bg-red'
  }

  return colors[buttonColor]
}

const getDisableButtonColor = (buttonColor: ButtonColor): string => {
  const colors = {
    primary: 'bg-blue-hover',
    secondary: 'bg-black-light',
    success: 'bg-success-dark',
    info: 'bg-info-dark',
    warning: 'bg-warning-dark',
    danger: 'bg-red-dark'
  }

  return colors[buttonColor]
}

const getHoverButtonColor = (buttonColor: ButtonColor): string => {
  const colors = {
    primary: 'hover:bg-blue-hover',
    secondary: 'hover:bg-black-hover',
    success: 'hover:bg-success-hover',
    info: 'hover:bg-info-hover',
    warning: 'hover:bg-warning-hover',
    danger: 'hover:bg-red-hover'
  }

  return colors[buttonColor]
}

const Button: React.FC<ButtonProps> = ({
  children,
  color,
  onClick,
  disabled = false,
  type = 'button',
  isLoading = false,
  className = '',
  isActive = false
}) => {
  const [bgColor, setBgColor] = useState('bg-blue')
  const [hoverBgColor, setHoverBgColor] = useState('hover:bg-blue-hover')

  useEffect(() => {
    if (disabled) {
      setBgColor(getDisableButtonColor(color))
      return
    }

    const actualBgColor = getButtonColor(color) + (isActive ? '-hover' : '')
    setBgColor(actualBgColor)
    setHoverBgColor(getHoverButtonColor(color))
  }, [color, disabled, isActive])

  const loadingStyle = 'text-transparent after:absolute after:w-5 after:h-5 after:top-0 after:right-0 after:left-0 after:bottom-0 after:m-auto after:border-4 after:border-t-white after:opacity-100 after:rounded-[50%] after:animate-spin'

  return (
    <button
      className={`${className} ${bgColor} ${!disabled && !isLoading ? hoverBgColor : ''} capitalize px-4 py-[6px] rounded-md relative ${isLoading ? loadingStyle : 'text-white'} `}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}

export default Button
