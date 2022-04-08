// Note: Ignore unsafe decoding of data

import { DateRange, DateRangeEncoded } from './DateRange'
import { Price, PriceEncoded } from './Price'

export type PriceQuote = {
  readonly bagCount: number
  readonly currencyCode: string
  readonly dateRange: DateRange
  readonly stashpointId: string
  readonly totalPrice: Price
}

export type PriceQuoteEncoded = {
  readonly bagCount: number
  readonly currencyCode: string
  readonly dateRange: DateRangeEncoded
  readonly stashpointId: string
  readonly totalPrice: PriceEncoded
}

export const PriceQuote = {
  decode: (
    input: unknown,
  ): readonly [Error, undefined] | readonly [undefined, PriceQuote] => {
    const [error1, dateRange] = DateRange.decode((input as any).dateRange)

    if (error1 !== undefined) return [error1, undefined]

    const [error2, totalPrice] = Price.decode((input as any).totalPrice)

    if (error2 !== undefined) return [error2, undefined]

    return [undefined, { ...(input as any), dateRange, totalPrice }]
  },
  encode: (priceQuote: PriceQuote): PriceQuoteEncoded => {
    return {
      ...priceQuote,
      dateRange: DateRange.encode(priceQuote.dateRange),
      totalPrice: Price.encode(priceQuote.totalPrice),
    }
  },
}
