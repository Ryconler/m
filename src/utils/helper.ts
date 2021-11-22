import { divide, isEmpty, round, toNumber } from 'lodash'

export function toDemotion(value: string | number, rate = 100) {
  let num = toNumber(value)
  num = isNaN(num) ? 0 : num
  return round(divide(num, rate), 2)
}

export function getYenPrice(price: string | number) {
  let integer = ''
  let decimal = ''
  const p = toDemotion(price).toString()
  const result = p.split('.')
  if (result.length === 2) {
    integer = result[0]
    if (parseInt(result[1]) > 0) {
      decimal = result[1]
    }
  } else {
    if (price >= 0) {
      integer = p
    }
  }
  let value = `${integer}`
  if (!isEmpty(decimal)) {
    value += `.${decimal}`
  }
  return value
}

export function getDistanceKm(m: number) {
  if (m <= 100) {
    return '0.1'
  } else {
    const km = round(m / 1000, 1).toString()
    if (km.split('.').length == 1) {
      return `${km}.0`
    } else {
      return `${km}`
    }
  }
}
