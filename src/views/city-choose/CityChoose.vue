<template>
  <div class="city-choose">
    <div v-if="hotCitys.length > 0" class="hot-city">
      <h2 class="hot-city-title">热门城市</h2>
      <ul class="hot-city-items clearfix">
        <li
          v-for="(item, index) in hotCitys"
          :key="'hot-city-' + index"
          class="hot-city-item"
          @click="useCity(item)"
        >
          <span>{{ item.cityName }}</span>
        </li>
      </ul>
    </div>
    <div v-if="historyCitys.length > 0" class="history-city">
      <h2 class="history-city-title">
        历史访问城市<i class="delete-icon" @click="clearHistory"> </i>
      </h2>
      <ul class="history-city-items clearfix">
        <li
          v-for="(item, index) in historyCitys"
          :key="'history-city-' + index"
          class="history-city-item"
          @click="useCity(item)"
        >
          <span>{{ item.cityName }}</span>
        </li>
      </ul>
    </div>
    <div class="city-list">
      <div v-for="(py, index) in listCitysKeys" :key="index">
        <h3 :id="py" class="city-char">{{ py }}</h3>
        <ul class="city-list-items clearfix">
          <li
            v-for="(city, index) in listCitys[py]"
            :key="'city-list-item-' + index"
            class="city-list-item"
            @click="useCity(city)"
          >
            <span>{{ city.cityName }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { CityType, setSelectCity } from '@/utils/index'
import { getCityChooseData } from '@/composables/city-choose/cityChoose'

const route = useRoute()

const { listCitys, historyCitys, hotCitys, listCitysKeys } = getCityChooseData()
const useCity = (city: CityType) => {
  setSelectCity(city.cityId, city.cityName)
  const referrer = route.query.referrer || document.referrer || ''
  location.href = referrer.toString()
}
const clearHistory = () => {
  historyCitys.value = []
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
