import { AppServices } from '@/shared/services/api.service'
import { type Offer, type OfferDto } from '../models/offer.interface'
import { type ApplicationDto } from '../models/application.interface'

export class OffersService extends AppServices {
  constructor () {
    super({ baseUrl: 'offers', contentType: 'application/json' })
  }

  findAll = async (userId: string = '', searchQuery: string = ''): Promise<Offer[]> => {
    return await this.get<Offer[]>('', {
      params: {
        userId,
        query: searchQuery
      }
    })
      .then(response => response.data)
  }

  findAllMyApplications = async (): Promise<Offer[]> => {
    return await this.get<Offer[]>('/my-applications')
      .then(response => response.data)
  }

  create = async (offer: OfferDto): Promise<Offer> => {
    return await this.post<Offer>('', offer)
      .then(response => response.data)
  }

  findById = async (id: string | undefined): Promise<Offer | null> => {
    if (!id) return null

    return await this.get<Offer>(`/${id}`)
      .then(response => response.data)
  }

  update = async (offer: OfferDto, id: string): Promise<Offer> => {
    return await this.patch<Offer>(`/${id}`, offer)
      .then(response => response.data)
  }

  close = async (id: string): Promise<Offer> => {
    return await this.patch<Offer>(`/${id}`, { closed: true })
      .then(response => response.data)
  }

  findBetterApplicant = async (id: string): Promise<Offer> => {
    return await this.post<Offer>(`/${id}/better-application`)
      .then(response => response.data)
  }

  remove = async (id: string): Promise<Offer> => {
    return await this.delete<Offer>(`/${id}`)
      .then(response => response.data)
  }

  apply = async (offerId: string, applicationDto: ApplicationDto): Promise<Offer> => {
    return await this.post<Offer>(`/${offerId}/applications`, applicationDto)
      .then(response => response.data)
  }

  cancelApplication = async (offerId: string, applicationId: string): Promise<Offer> => {
    return await this.patch<Offer>(`/${offerId}/applications/${applicationId}`)
      .then(response => response.data)
  }
}
