import { useState } from 'react'

export const useLoading = ({ delay = 0 }: { delay?: number }) => {
  const [loading, setLoading] = useState(false)

  const startLoading = () => { setLoading(true) }

  const stopLoading = () => {
    if (delay === 0) {
      setLoading(false)
      return
    }

    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  return {
    loading,
    startLoading,
    stopLoading
  }
}
