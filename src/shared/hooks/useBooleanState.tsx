import { useState } from 'react'

export const useBooleanState = (state: boolean = false): [
  boolean,
  () => void,
  (value: boolean) => void
] => {
  const [value, setValue] = useState(state)

  const toggle = () => { setValue(!value) }

  const handleSetValue = (newValue: boolean) => { setValue(newValue) }

  return [value, toggle, handleSetValue]
}
