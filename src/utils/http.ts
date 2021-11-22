import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Toast } from 'vant'
import { ComponentInstance } from 'vant/lib/utils'

export interface ResultType<T> {
  data: T
  code: string
  msg: string
}

function createService(options: AxiosRequestConfig, loading = false) {
  let toast: ComponentInstance | null = null
  const service = axios.create(options)
  service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      if (loading && !toast) {
        toast = Toast.loading({
          forbidClick: true,
          duration: 0
        })
      }
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )
  service.interceptors.response.use(
    (response: AxiosResponse) => {
      if (toast) {
        toast.clear()
        toast = null
      }
      const res: ResultType<any> =
        response && response.data ? response.data : response
      return res || {}
    },
    (error: AxiosError) => {
      if (toast) {
        toast.clear()
        toast = null
      }
      return Promise.reject(error)
    }
  )
  return service
}

/* 带cookie */
const $http = createService({ withCredentials: true })
export const http = $http

/* 带cookie、带loading */
const $lHttp = createService({ withCredentials: true }, true)
export const lHttp = $lHttp

/* 不带cookie */
const $ajax = createService({ withCredentials: false })
export const ajax = $ajax
