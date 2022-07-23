import {
  getInsuranceEarnDetail,
  queryShareInsurances
} from '@/api/shareService'
import {
  InsuranceEarnDetailType,
  ShareInsuranceType,
  TrackTerm
} from '@/constant/shareService'
import { getKwtargetUrl } from '@/utils'
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
    if (insurance.recomType == 2) {
      earnDetailData.value = await getInsuranceEarnDetail(insurance.itemId)
      earnDetailShow.value = true
    }
  }
  return {
    earnDetailData,
    earnDetailShow,
    earnDetailClick
  }
}

export const useInsuranceClick = () => {
  const shareClick = (insurance: ShareInsuranceType) => {
    location.href = getKwtargetUrl(insurance.shareIntegrationUrl)
  }
  const signClick = (insurance: ShareInsuranceType) => {
    location.href = getKwtargetUrl(
      `https://finance.xingbeibaoxian.com/insurance-agent/order-prompt?bizCode=kw&sourceChannel=n3-41&version=1.3.63&itemId=${insurance.itemId}`
    )
  }
  return {
    shareClick,
    signClick
  }
}
