import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ResultType } from 'types/http'
import { ComponentInstance } from 'vant/lib/utils'

function createService(options: AxiosRequestConfig) {
  let toast: ComponentInstance | null = null
  const service = axios.create({
    ...options
  })
  service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )
  service.interceptors.response.use(
    (response: AxiosResponse) => {
      const res: ResultType<any> =
        response && response.data ? response.data : response
      return res || {}
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )
  return service
}

/* 带cookie */
const $http = createService({ withCredentials: true })
export const http = $http

/* 不带cookie */
const $ajax = createService({ withCredentials: false })
export const ajax = $ajax
