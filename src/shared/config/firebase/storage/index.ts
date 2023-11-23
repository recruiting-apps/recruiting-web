import app from '../config'
import { getDownloadURL, getStorage, ref, uploadBytes, getBlob, deleteObject } from 'firebase/storage'
import { v4 } from 'uuid'

interface UploadResponse {
  url: string
  newName: string
  originalName: string
}

export const storage = getStorage(app)

export async function uploadFile (file: File, path: string): Promise<UploadResponse> {
  const ext = file.name.split('.').pop() ?? 'pdf'

  const newName = `${String(v4())}.${ext}`
  const fullPath = `${path}/${newName}`

  const storageRef = ref(storage, fullPath)

  try {
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    return await Promise.resolve({
      url,
      newName,
      originalName: file.name
    })
  } catch (error) {
    return await Promise.reject(error)
  }
}

export async function deleteFile (path: string): Promise<void> {
  const storageRef = ref(storage, path)

  try {
    await deleteObject(storageRef)
    await Promise.resolve()
  } catch (error) {
    await Promise.reject(error)
  }
}

export async function downloadAsBlob (path: string): Promise<Blob> {
  const storageRef = ref(storage, path)

  try {
    const blob = await getBlob(storageRef)
    return await Promise.resolve(blob)
  } catch (error) {
    return await Promise.reject(error)
  }
}
