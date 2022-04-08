// Note: Ignore unsafe decoding of data

import { DateRange, DateRangeEncoded } from './DateRange'

export type Cart = {
  readonly bagCount: number
  readonly dateRange: DateRange
  readonly stashpointId: string
}

export type CartEncoded = {
  readonly bagCount: number
  readonly dateRange: DateRangeEncoded
  readonly stashpointId: string
}

export const Cart = {
  decode: (
    input: unknown,
  ): readonly [Error, undefined] | readonly [undefined, Cart] => {
    const [error, dateRange] = DateRange.decode((input as any).dateRange)

    if (error !== undefined) return [error, undefined]

    return [undefined, { ...(input as any), dateRange }]
  },
  encode: (cart: Cart): CartEncoded => {
    return { ...cart, dateRange: DateRange.encode(cart.dateRange) }
  },
}
