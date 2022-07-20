<template>
  <div class="search">
    <SearchBar is-searching></SearchBar>
  </div>
</template>

<script lang="ts" setup>
import { getSelectCity, setSelectCity } from '@/utils'
import { onMounted, Ref, ref } from 'vue'
import { useLocation } from '@/composables/common'
import { DefaultCity } from '@/constant/city'
import { CityType } from '@/types/city'

const selectCity: Ref<CityType> = ref(DefaultCity)
onMounted(async () => {
  const cookieCity = getSelectCity()
  if (cookieCity) {
    selectCity.value = cookieCity
  } else {
    const { position } = await useLocation()
    if (position.value != null) {
      selectCity.value = {
        cityId: position.value.cityId,
        cityName: position.value.cityName
      }
    } else {
      selectCity.value = DefaultCity
    }
    setSelectCity(selectCity.value.cityId, selectCity.value.cityName)
  }
})
</script>
