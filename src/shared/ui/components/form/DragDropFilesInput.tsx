import React, { useState, type ReactElement, useRef } from 'react'
import Button from './Button'
import { CloseCircleIcon, DownloadFileIcon } from '../../assets/icons/AppIcons'
import { useToast } from '@/shared/hooks/useToast'

interface DragDropFilesProps {
  files: File[]
  setFiles: (files: File[]) => void
  maxMB?: number
}

const DragDropFiles = ({ files, setFiles, maxMB = 5 }: DragDropFilesProps): ReactElement => {
  const [dragActive, setDragActive] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isFileSizeValid = (file: File): boolean => {
    const maxSizeInBytes = maxMB * 1024 * 1024 // 10 MB (ajusta este valor según tus necesidades)
    return file.size <= maxSizeInBytes
  }

  const handleFile = (newFiles: FileList): void => {
    const actualFilesNames = files.map((file) => file.name)
    const newFilesArray = Array.from(newFiles)
    const noRepeatedFiles: File[] = []
    const invalidFiles: string[] = []

    newFilesArray.forEach((file) => {
      if (actualFilesNames.includes(file.name)) return
      if (!isFileSizeValid(file)) {
        invalidFiles.push(file.name)
        return
      }
      noRepeatedFiles.push(file)
    })

    if (invalidFiles.length > 0) {
      useToast({ message: `Hay archivos que superan el tamaño máximo de ${maxMB}MB`, type: 'error' })
    }

    setFiles([...files, ...noRepeatedFiles])
  }

  const handleRemoveFile = (index: number): void => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
  }

  const handleDrag = function (event: React.DragEvent<HTMLFormElement | HTMLDivElement>): void {
    event.preventDefault()
    event.stopPropagation()
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true)
    } else if (event.type === 'dragleave') {
      setDragActive(false)
    }
  }

  // triggers when file is dropped
  const handleDrop = function (event: React.DragEvent<HTMLFormElement | HTMLDivElement>): void {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)
    if (event.dataTransfer.files?.[0]) {
      handleFile(event.dataTransfer.files)
    }
  }

  // triggers when file is selected with click
  const handleChange = function (event: React.ChangeEvent<HTMLInputElement>): void {
    event.preventDefault()
    if (event.target.files?.[0]) {
      handleFile(event.target.files)
    }
  }

  const onButtonClick = (): void => {
    inputRef.current?.click()
  }

  return (
    <form
      className='h-full min-h-[16rem] w-[28rem] max-w-full text-center relative'
      onDragEnter={handleDrag} onSubmit={(e) => { e.preventDefault() }}>
      <input
        className='hidden'
        ref={inputRef} type="file" multiple={true} onChange={handleChange} />
      <label
        htmlFor="input-file-upload"
        className={`h-full min-h-[16rem] flex ${files.length === 0 ? 'items-center justify-center' : ''} border-2 rounded-sm border-[#cbd5e1] border-dashed  ${dragActive ? 'bg-white' : 'bg-[#f8fafc]'}`}>
        {files.length === 0
          ? (
            <div className='flex flex-col justify-center items-center'>
              <p>Arrastra y suelta tus archivos o</p>
              <Button
                color='secondary'
                onClick={onButtonClick}
                className='flex gap-2'
              >Sube tus archivos<DownloadFileIcon className='w-6 h-6' /></Button>
              <p className='text-sm text-red'>(MAX 5MB)</p>
              {/* <button className="upload-button" onClick={onButtonClick}>Upload a file</button> */}
            </div>
            )
          : (
            <div className='flex flex-col justify-between items-start w-full'>
              <div className='flex flex-col gap-1 w-full p-2'>
                {
                  files.map((file, index) => (
                    <div
                      className='bg-gray-300 rounded-md w-full text-start px-4 py-[2px] flex items-center justify-between'
                      key={index}>
                      <p className=''>{file.name}</p>
                      <CloseCircleIcon
                        onClick={() => { handleRemoveFile(index) }}
                        className='cursor-pointer w-5 h-5 hover:text-red' />
                    </div>
                  ))
                }
              </div>

              <Button
                color='secondary'
                onClick={onButtonClick}
                className='flex gap-2 m-2 text-sm'
              >Subir más archivos<DownloadFileIcon className='w-4 h-4' /></Button>
            </div>
            )
        }
      </label>
      {dragActive &&
        <div
          className='absolute top-0 left-0 w-full h-full bg-gray-300 bg-opacity-50 z-10'
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}></div>}

    </form>
  )
}

export default DragDropFiles
