import { AuthStore } from '@/auth/services/auth.store'
import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { StatusCodes } from 'http-status-codes'

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

export abstract class AppServices {
  protected _baseUrl: string
  protected _fullBaseApiURL: string
  protected _contentType: string
  private readonly _authStore: AuthStore = new AuthStore()

  constructor (config: { baseUrl: string, contentType: string }) {
    this._baseUrl = config.baseUrl
    this._contentType = config.contentType

    this._fullBaseApiURL = `${API_BASE_URL}/${this._baseUrl}`
    this.setHeader()
  }

  private setHeader (): void {
    const token = this._authStore.getToken()
    if (token !== null) { axios.defaults.headers.common.Authorization = `Bearer ${token}` }

    axios.defaults.headers.common['Content-Type'] = this._contentType
  }

  private handleNotAuthorized (): void {
    window.dispatchEvent(new Event('endSession'))
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await axios.get(this._fullBaseApiURL + url, config)
      .then((response: AxiosResponse) => {
        return response
      })
      .catch(async (error: AxiosError) => {
        if (error.response?.status === StatusCodes.UNAUTHORIZED) {
          this.handleNotAuthorized()
        }
        return await Promise.reject(error.response)
      })
  }

  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await axios.post(this._fullBaseApiURL + url, data, config)
      .then((response: AxiosResponse) => {
        return response
      })
      .catch(async (error: AxiosError) => {
        if (error.response?.status === StatusCodes.UNAUTHORIZED) {
          this.handleNotAuthorized()
        }
        return await Promise.reject(error.response)
      })
  }

  protected async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await axios.patch(this._fullBaseApiURL + url, data, config)
      .then((response: AxiosResponse) => {
        return response
      })
      .catch(async (error: AxiosError) => {
        if (error.response?.status === StatusCodes.UNAUTHORIZED) {
          this.handleNotAuthorized()
        }
        return await Promise.reject(error.response)
      })
  }

  protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await axios.put(this._fullBaseApiURL + url, data, config)
      .then((response: AxiosResponse) => {
        return response
      })
      .catch(async (error: AxiosError) => {
        if (error.response?.status === StatusCodes.UNAUTHORIZED) {
          this.handleNotAuthorized()
        }
        return await Promise.reject(error.response)
      })
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await axios.delete(this._fullBaseApiURL + url, config)
      .then((response: AxiosResponse) => {
        return response
      })
      .catch(async (error: AxiosError) => {
        if (error.response?.status === StatusCodes.UNAUTHORIZED) {
          this.handleNotAuthorized()
        }
        return await Promise.reject(error.response)
      })
  }

  protected async externalPost<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    axios.defaults.headers.common['Content-Type'] = 'application/json'
    axios.defaults.headers.common.Authorization = undefined

    return await axios.post(url, data, config)
      .then((response: AxiosResponse) => {
        return response
      })
      .catch(async (error: AxiosError) => {
        if (error.response?.status === StatusCodes.UNAUTHORIZED) {
          console.log(error)
        }
        return await Promise.reject(error.response)
      })
  }

  protected async externalGet<T>(url: string): Promise<AxiosResponse<T>> {
    return await axios.get(url, {})
      .then((response: AxiosResponse) => {
        return response
      })
      .catch(async (error: AxiosError) => {
        if (error.response?.status === StatusCodes.UNAUTHORIZED) {
          console.log(error)
        }
        return await Promise.reject(error.response)
      })
  }
}
