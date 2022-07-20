export declare type getAllCityListResultType = {
  ID: string
  NAME: string
  PINYIN: string
}

export declare type CityType = {
  cityId: string
  cityName: string
}

export declare type GroupedCitysCity = {
  [key: string]: getAllCityListResultType[]
}
