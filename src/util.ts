import {
  addDays,
  isAfter as isDateAfter,
  isEqual as isDateEqual,
  isValid as isValidDate,
  startOfDay,
} from 'date-fns'
import * as Data from './Data'

export const isBagCountValid = (bagCount: number): boolean => {
  return Number.isSafeInteger(bagCount) && bagCount >= 1 && bagCount <= 50
}

export const isDateRangeValid = (dateRange: Data.DateRange): boolean => {
  const minDateFrom = addDays(startOfDay(new Date()), 1)
  const minDateTo = addDays(dateRange.from, 1)

  return (
    isValidDate(dateRange.from) &&
    isValidDate(dateRange.to) &&
    isDateEqual(dateRange.from, startOfDay(dateRange.from)) &&
    isDateEqual(dateRange.to, startOfDay(dateRange.to)) &&
    (isDateEqual(dateRange.from, minDateFrom) ||
      isDateAfter(dateRange.from, minDateFrom)) &&
    (isDateEqual(dateRange.to, minDateTo) ||
      isDateAfter(dateRange.to, minDateTo))
  )
}
