import { SearchBarConfigType } from '@/constant/searchBar'
import { ajax, ResultType } from '@/utils'

const api = {
  getSearchBarConfig: `https://www.fastmock.site/mock/02bb778aca79775dcc77fddbc42380e4/batcave/searchBarData`
}

export async function getSearchBarConfig() {
  const result: ResultType<SearchBarConfigType> = await ajax.get(
    `${api.getSearchBarConfig}`
  )
  const { data, code, msg } = result
  if (+code === 200) {
    return data
  } else {
    return Promise.reject(msg)
  }
}
