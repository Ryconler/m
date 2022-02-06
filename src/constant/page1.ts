export interface Page1ConfigType {
  brand?: string
  flow?: string
  negativesGiveDescs?: any //0不送、1全送、2部分送
}

export interface Page1DataType {
  banners?: Page1BannerType[]
  content?: Page1ContentType[]
}
export interface Page1BannerType {
  img: string
  link: string
}
export interface Page1ContentType {
  level4Category: string
  elementInfo: Page1ContentElementType[]
  themes: Page1ContentThemeType[]
}
export interface Page1ContentElementType {
  id: number
  title: string
  subTitle: string
  image: string
  desc: string
  minNum: number
  link: string
}
export interface Page1ContentThemeType {
  id?: number
  name?: string
  images?: string[]
  styles?: string[]
}

export interface Page1GroupType {
  id: number
  subTitle: number
  title: string
  address: string
  link: string
}

export interface Page1MinElementType {
  id?: number
  title?: string
  subTitle?: string
  num?: number
}
