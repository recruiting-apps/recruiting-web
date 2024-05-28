import { AppServices } from '@/shared/services/api.service'
import { type AdditionalFile, type AdditionalFileDto } from '../models/additional-file.interface'

export class AdditionalFilesService extends AppServices {
  constructor () {
    super({ baseUrl: 'additional-files', contentType: 'application/json' })
  }

  create = async (file: AdditionalFileDto): Promise<AdditionalFile> => {
    return await this.post<AdditionalFile>('', file)
      .then(response => response.data)
  }

  remove = async (id: number): Promise<AdditionalFile> => {
    return await this.delete<AdditionalFile>(`/${id}`)
      .then(response => response.data)
  }
}
