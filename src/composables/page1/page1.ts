import { onMounted, Ref, ref } from 'vue'
import { queryPage1Config, queryContents, queryGroups } from '@/api/page1'
import {
  Page1ConfigType,
  Page1DataType,
  Page1GroupType
} from '@/constant/page1'

export function getPage1Data() {
  const page1Config: Ref<Page1ConfigType> = ref({})
  const page1Data: Ref<Page1DataType> = ref({})
  const page1Groups: Ref<Page1GroupType[]> = ref([])
  onMounted(async () => {
    page1Config.value = await queryPage1Config()
    queryContents().then((data) => {
      page1Data.value = data
    })
    queryGroups().then((data) => {
      page1Groups.value = data
    })
  })
  return {
    page1Config,
    page1Data,
    page1Groups
  }
}
