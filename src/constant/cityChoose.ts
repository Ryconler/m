export interface CityType {
  NAME: string
  ID: string
  PINYIN: string
}

export interface GroupedCitysCity {
  [key: string]: CityType[] //索引签名
}
