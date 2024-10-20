import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { downloadAsBlob } from './shared/config/firebase/storage'

export const capitalize = (str: string): string => {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleDownloadFormUrl = async (url: string, name: string) => {
  await downloadAsBlob(url)
    .then((blob) => {
      const downloadUrl = window.URL.createObjectURL(blob)
      const downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.href = downloadUrl
      downloadAnchorNode.setAttribute('download', `${name}.pdf`)
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      document.body.removeChild(downloadAnchorNode)
      window.URL.revokeObjectURL(downloadUrl)
    })
}
