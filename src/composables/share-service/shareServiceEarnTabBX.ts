import { queryShareInsurances } from '@/api/shareService'
import {
  InsuranceEarnDetailType,
  ShareInsuranceType
} from '@/constant/shareService'
import { Toast } from 'vant'
import { reactive, Ref, ref } from 'vue'

/* 保险模块分享赚商品列表 */
export const useShareInsurances = () => {
  const insuranceList = reactive({
    list: <ShareInsuranceType[]>[],
    loading: false,
    error: false,
    finished: false,
    load: async () => {
      try {
        const data = (await queryShareInsurances()).ItemList || []
        insuranceList.loading = false
        insuranceList.list.push(...data)
        insuranceList.finished = true
      } catch (error) {
        insuranceList.loading = false
        insuranceList.error = true
      }
    }
  })
  return {
    insuranceList
  }
}

export const useEarnDetail = () => {
  const earnDetailShow = ref(false)
  const earnDetailData: Ref<InsuranceEarnDetailType> = ref({})
  const earnDetailClick = async (e: Event, insurance: ShareInsuranceType) => {
    e.preventDefault()
  }
  return {
    earnDetailData,
    earnDetailShow,
    earnDetailClick
  }
}

export const useInsuranceClick = () => {
  const shareClick = (insurance: ShareInsuranceType) => {
    Toast('模拟拉起原生分享面板成功')
  }
  const signClick = (insurance: ShareInsuranceType) => {
    location.href = insurance.shareIntegrationUrl
  }
  return {
    shareClick,
    signClick
  }
}
