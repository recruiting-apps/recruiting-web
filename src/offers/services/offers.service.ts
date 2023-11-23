import { AppServices } from '@/shared/services/api.service'
import { type Offer, type OfferDto } from '../models/offer.interface'

export class OffersService extends AppServices {
  constructor () {
    super({ baseUrl: 'offers', contentType: 'application/json' })
  }

  findAll = async (userId: string = ''): Promise<Offer[]> => {
    return await this.get<Offer[]>('', {
      params: { userId }
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

  findById = async (id: string): Promise<Offer> => {
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

  apply = async (offerId: string): Promise<Offer> => {
    return await this.post<Offer>(`/${offerId}/applications`)
      .then(response => response.data)
  }

  cancelApplication = async (offerId: string, applicationId: string): Promise<Offer> => {
    return await this.patch<Offer>(`/${offerId}/applications/${applicationId}`)
      .then(response => response.data)
  }
}
