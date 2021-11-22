import { onMounted, Ref, ref } from 'vue'
import {
  getPhotographyConfig,
  getPhotographyInfo,
  getPhotographyStores
} from '@/api/photography'
import {
  PhotoConfigType,
  PhotoDataType,
  PhotoStoreType
} from '@/constant/photography'

export function getPhotographyData() {
  const photographyConfig: Ref<PhotoConfigType> = ref({})
  const photographyData: Ref<PhotoDataType> = ref({})
  const photographyStores: Ref<PhotoStoreType[]> = ref([])
  onMounted(async () => {
    getPhotographyConfig().then((data) => {
      photographyConfig.value = data || {}
    })
    getPhotographyInfo().then((data) => {
      photographyData.value = data || {}
    })
    getPhotographyStores().then((data) => {
      photographyStores.value = data || []
    })
  })
  return {
    photographyConfig,
    photographyData,
    photographyStores
  }
}
