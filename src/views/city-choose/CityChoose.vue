<template>
  <VanIndexBar>
    <template v-for="item in citysKeys" :key="item">
      <VanIndexAnchor :index="item" />
      <VanCell
        v-for="(item2, index2) in groupedCitys[item]"
        :key="index2"
        :title="item2.NAME"
        @click="cityClick(item2)"
      />
    </template>
  </VanIndexBar>
</template>

<script lang="ts" setup>
import { getAllCityList } from '@/api/city'
import { setSelectCity } from '@/utils'
import { groupBy } from 'lodash'
import { getAllCityListResultType, GroupedCitysCity } from 'types/city'
import {
  IndexBar as VanIndexBar,
  IndexAnchor as VanIndexAnchor,
  Cell as VanCell
} from 'vant'
import { nextTick, onMounted, ref, Ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const groupedCitys: Ref<GroupedCitysCity> = ref({})
const citysKeys: Ref<string[]> = ref([])
onMounted(async () => {
  const allCityList: getAllCityListResultType[] = await getAllCityList()
  groupedCitys.value = {}
  groupedCitys.value = groupBy(allCityList, item => {
    return item.PINYIN && item.PINYIN[0]
  })
  for (const citys of Object.values(groupedCitys.value)) {
    citys.sort((item1, item2) => {
      if (item1.PINYIN < item2.PINYIN) {
        return -1
      } else {
        return 1
      }
    })
  }
  citysKeys.value = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ]
  await nextTick()
  window.scrollTo(0, 1)
  window.scrollTo(0, 0)
})

const cityClick = (city: getAllCityListResultType) => {
  setSelectCity(city.ID, city.NAME)
  const referrer = route.query.referrer || document.referrer || '//m.wzmxx.com'
  location.href = decodeURIComponent(referrer.toString())
}
</script>

<style lang="scss" scoped>
.city-choose {
  min-height: 100vh;
  background-color: #fff;
  padding: 30px 24px;
  .hot-city,
  .history-city {
    margin-bottom: 24px;
    .hot-city-title,
    .history-city-title {
      font-size: 26px;
      color: $light-text-color;
      margin-bottom: 24px;
    }
    .hot-city-items,
    .history-city-items {
      .hot-city-item,
      .history-city-item {
        width: 25%;
        height: 50px;
        line-height: 50px;
        border-radius: 8px;
        font-size: 26px;
        text-align: center;
        background: $light-bg-color;
        color: $deep-text-color;
        float: left;
        margin-right: 24px;
        margin-bottom: 24px;
      }
    }
  }

  .history-city {
    position: relative;
    .delete-icon {
      width: 26px;
      height: 26px;
      background: url(@/assets/images/city-choose/icon-delete.png) no-repeat
        center center/26px 26px;
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  .city-list {
    .city-char {
      color: $light-text-color;
      font-size: 26px;
      padding: 24px 0;
    }
    .city-list-items {
      margin-bottom: 30px;
      .city-list-item {
        color: $deep-text-color;
        font-size: 28px;
        padding: 24px 0;
        border-bottom: 2px solid $light-bg-color;
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}
</style>
