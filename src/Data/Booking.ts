// Note: Ignore unsafe decoding of data

import { DateRange, DateRangeEncoded } from './DateRange'
import { Price, PriceEncoded } from './Price'
import { Stashpoint, StashpointEncoded } from './Stashpoint'

export type Booking = {
  readonly bagCount: number
  readonly currencyCode: string
  readonly dateRange: DateRange
  readonly id: string
  readonly stashpoint: Stashpoint
  readonly totalPrice: Price
}

export type BookingEncoded = {
  readonly bagCount: number
  readonly currencyCode: string
  readonly dateRange: DateRangeEncoded
  readonly id: string
  readonly stashpoint: StashpointEncoded
  readonly totalPrice: PriceEncoded
}

export const Booking = {
  decode: (
    input: unknown,
  ): readonly [Error, undefined] | readonly [undefined, Booking] => {
    const [error1, dateRange] = DateRange.decode((input as any).dateRange)

    if (error1 !== undefined) return [error1, undefined]

    const [error2, totalPrice] = Price.decode((input as any).totalPrice)

    if (error2 !== undefined) return [error2, undefined]

    const [error3, stashpoint] = Stashpoint.decode((input as any).stashpoint)

    if (error3 !== undefined) return [error3, undefined]

    return [undefined, { ...(input as any), dateRange, stashpoint, totalPrice }]
  },
  encode: (booking: Booking): BookingEncoded => {
    return {
      ...booking,
      dateRange: DateRange.encode(booking.dateRange),
      stashpoint: Stashpoint.encode(booking.stashpoint),
      totalPrice: Price.encode(booking.totalPrice),
    }
  },
}
