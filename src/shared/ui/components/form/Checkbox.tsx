import { useState } from 'react'

interface CheckboxInputProps extends React.HTMLProps<HTMLInputElement> {
  initialValue?: boolean
  label: string
  handleOnChange?: (value: boolean) => void
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  initialValue = false,
  label,
  name,
  className = '',
  disabled = false,
  handleOnChange = () => { }
}) => {
  const [value, setValue] = useState(initialValue)

  return (
    <label className={`flex items-center gap-4 cursor-pointer ${className}`}>
      <span className='text-gray-700'>{label}</span>
      <div className='relative'>
        <input
          name={name}
          type='checkbox'
          className='hidden'
          onChange={(event) => {
            const { checked } = event.target
            setValue(checked)
            handleOnChange(checked)
          }}
          disabled={disabled}
        />
        <div className='w-5 h-5 bg-white border border-gray-500 rounded'>
          {value && (
            <div
              className='absolute w-3 h-3 bg-success transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full'
            />
          )}
        </div>
      </div>
    </label>
  )
}

export default CheckboxInput
