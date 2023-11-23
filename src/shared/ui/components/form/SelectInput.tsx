import React, { useEffect, type ChangeEvent, type ReactElement, useState, useMemo, useRef } from 'react'
import { ArrowDown, ArrowUp } from '../../assets/icons/AppIcons'

interface SelectInputProps<T> {
  value?: string
  name: string
  label: string
  objects: T[]

  onChange?: (value: string) => void

  valueKey?: keyof T
  optionKey?: keyof T

  hasInitialValue?: boolean
  disabled?: boolean
  className?: string
  searchable?: boolean
}

const SelectInput = <T,>({
  value: initialValue = '',
  name,
  label,
  objects,
  valueKey,
  optionKey,
  disabled = false,
  className = '',
  searchable = false,
  hasInitialValue = true,
  onChange = () => { }
}: SelectInputProps<T>): ReactElement => {
  const [value, setValue] = useState<string>(initialValue)
  const [searchItem, setSearchItem] = useState('')
  const [showOptions, setShowOptions] = useState<boolean>(false)
  const selectRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (objects.length === 0) return

    if (!hasInitialValue) return

    if (initialValue !== '') {
      setValue(String(initialValue))
      return
    }

    const aux = valueKey ? objects[0][valueKey] : objects[0]
    setValue(String(aux))
  }, [objects, initialValue])

  const handleOptionClick = (): void => {
    if (disabled) return

    setShowOptions(!showOptions)
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [showOptions])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchItem(event.target.value)
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false)
      }
    }

    window.addEventListener('click', handleOutsideClick)

    return () => {
      window.removeEventListener('click', handleOutsideClick)
    }
  }, [])

  const isObject = (() => {
    if (objects.length === 0) return false

    return typeof objects[0] === 'object'
  })()

  const filteredOptions = useMemo(() => {
    return objects.filter((object) => {
      const option = isObject && object && optionKey ? object[optionKey] : object

      return String(option).toLowerCase().includes(searchItem.toLowerCase())
    })
  }, [objects, searchItem])

  const selectedOption: string | null = useMemo(() => {
    const object = objects.find((object) => {
      const objectValue = isObject && object && valueKey ? object[valueKey] : object

      return String(objectValue) === value
    })

    if (object === undefined) return null

    return isObject && object && optionKey ? String(object[optionKey]) : String(object)
  }, [objects, value])

  const highlightSearchTerm = (label: string): React.ReactNode => {
    if (searchItem.trim() === '') {
      return label
    }

    const regex = new RegExp(`(${searchItem.toLowerCase()})`, 'gi')
    const parts = label.split(regex)

    return (
      <span>
        {parts.map((part, index) =>
          regex.test(part)
            ? (
              <strong key={index}>{part}</strong>
              )
            : (
              <span key={index}>{part}</span>
              )
        )}
      </span>
    )
  }

  return (
    <div className={`mb-2 ${className}`} ref={selectRef}>
      <label htmlFor={name}>{label}</label>
      <div
        onClick={handleOptionClick}
        className={`mt-2 w-full h-10 px-2 border border-gray-300 border-solid flex flex-col  justify-center ${selectedOption == null ? 'text-blue' : ''} ${showOptions ? 'rounded-tl-md rounded-tr-md' : 'rounded-md '} ${disabled ? 'cursor-not-allowed bg-gray-200 text-gray-500' : 'cursor-pointer'}`}>

        <div className='flex justify-between items-center'>
          <p className='text-black'>{selectedOption ?? 'select a option'}</p>
          <ArrowUp className={`w-6 h-6 ${!showOptions ? 'hidden' : ''}`} />
          <ArrowDown className={`w-6 h-6 ${showOptions ? 'hidden' : ''}`} />
        </div>

        <input readOnly name={name} type="text" className='hidden' value={value}/>
      </div>
      <div className='relative'>
        {
          showOptions && (
            <div className='absolute z-10 w-full bg-white border border-gray-400 max-h-36 overflow-y-auto max-w-full overflow-x-hidden rounded-br-md rounded-bl-md'>
              {
                searchable && (
                  <input
                    ref={inputRef}
                    type="text"
                    className="w-full text-gray-600 py-1 pr-10 pl-3 focus:outline-none border-b-[1px] border-gray-300"
                    placeholder="Search..."
                    value={searchItem}
                    onChange={handleInputChange}
                  />
                )
              }
              {
                ...filteredOptions.map((object) => {
                  const isObject = typeof object === 'object'
                  const objectValue = isObject && object && valueKey ? object[valueKey] : object
                  const option = isObject && object && optionKey ? object[optionKey] : object

                  const selected = String(value) === objectValue

                  return (
                    <p
                      key={String(objectValue)}
                      className={`block w-full px-2 py-1 cursor-pointer ${selected ? 'bg-blue text-white' : 'hover:bg-gray-200'}`}
                      onClick={() => {
                        setValue(String(objectValue))
                        onChange(String(objectValue))
                        setSearchItem('')
                        setShowOptions(false)
                      }}
                    >{highlightSearchTerm(String(option))}</p>
                  )
                })
              }
            </div>
          )
        }
      </div>
      {/* {searchable &&
          (<input
            type="text"
            className="w-full py-2 pr-10 pl-3 border border-gray-300 rounded-md"
            placeholder="Search..."
            value={searchItem}
            onChange={handleInputChange}
          />)
        }
        <select
        className='capitalize block w-full h-10 px-2 border border-gray-300 rounded-md border-solid outline-none focus:shadow-blue focus:shadow-input-focus'
        name={name} id={name} value={value} onChange={handleChange} disabled={disabled}>
        {
            ...filteredOptions.map((object) => {
              const isObject = typeof object === 'object'
              const value = isObject && object && valueKey ? object[valueKey] : object
              const option = isObject && object && optionKey ? object[optionKey] : object

              return (
                <option
                  key={String(value)}
                  value={String(value)}
                >{String(option)}</option>
              )
            })
          }
        </select> */}

    </div>

  )
}

export default SelectInput
