// Note: Ignore unsafe decoding of data

import { Price, PriceEncoded } from './Price'

export type Stashpoint = {
  readonly address: string
  readonly bagPerDayPrice: Price
  readonly currencyCode: string
  readonly id: string
  readonly name: string
  readonly rating: number
}

export type StashpointEncoded = {
  readonly address: string
  readonly bagPerDayPrice: PriceEncoded
  readonly currencyCode: string
  readonly id: string
  readonly name: string
  readonly rating: number
}

export const Stashpoint = {
  decode: (
    input: unknown,
  ): readonly [Error, undefined] | readonly [undefined, Stashpoint] => {
    const [error, bagPerDayPrice] = Price.decode((input as any).bagPerDayPrice)

    return error === undefined
      ? [undefined, { ...(input as any), bagPerDayPrice }]
      : [error, undefined]
  },
  encode: (stashpoint: Stashpoint): StashpointEncoded => {
    return {
      ...stashpoint,
      bagPerDayPrice: Price.encode(stashpoint.bagPerDayPrice),
    }
  },
}

export type Stashpoints = readonly Stashpoint[]

export type StashpointsEncoded = readonly StashpointEncoded[]

export const Stashpoints = {
  decode: (
    input: unknown,
  ): readonly [Error, undefined] | readonly [undefined, Stashpoints] => {
    const stashpoints: Stashpoint[] = []

    for (const value of input as any) {
      const [error, stashpoint] = Stashpoint.decode(value)

      if (error !== undefined) return [error, undefined]

      stashpoints.push(stashpoint)
    }

    return [undefined, stashpoints]
  },
  encode: (stashpoints: Stashpoints): StashpointsEncoded => {
    return stashpoints.map(Stashpoint.encode)
  },
}
