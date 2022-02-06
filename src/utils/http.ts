import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { get } from 'lodash'
import { Toast } from 'vant'
import { ComponentInstance } from 'vant/lib/utils'
import { auth } from '.'
import { setLoading } from './helper'

export interface ResultType<T> {
  data: T
  code: string
  msg: string
}

function createService(
  options: AxiosRequestConfig,
  loading = false,
  toasting = false
) {
  const authHeader = auth.getAuthHeader()
  let toast: ComponentInstance | null = null
  const service = axios.create({
    ...options,
    headers: authHeader
  })
  service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      if (loading) {
        setLoading(true)
      }
      if (toasting) {
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
      if (loading) {
        setLoading(false)
      }
      if (toasting && toast) {
        toast.clear()
        toast = null
      }
      const res: ResultType<any> =
        response && response.data ? response.data : response
      return res || {}
    },
    (error: AxiosError) => {
      if (get(error, 'response.data.code') == 'INVALID_CREDENTIALS') {
        location.href = '/login'
      }
      if (loading) {
        setLoading(false)
      }
      if (toasting && toast) {
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
const $lHttp = createService({ withCredentials: true }, true, false)
export const lHttp = $lHttp

/* 带cookie、带toast */
const $tHttp = createService({ withCredentials: true }, false, true)
export const tHttp = $tHttp

/* 不带cookie */
const $ajax = createService({ withCredentials: false })
export const ajax = $ajax

/* 不带cookie、带loading */
const $lAjax = createService({ withCredentials: false }, true, false)
export const lAjax = $lAjax

/* 不带cookie、带toast */
const $tAjax = createService({ withCredentials: false }, false, true)
export const tAjax = $tAjax
