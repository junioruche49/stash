// Note: Ignore unsafe decoding of data

export type Price = bigint

export type PriceEncoded = string

export const Price = {
  decode: (
    input: unknown,
  ): readonly [Error, undefined] | readonly [undefined, Price] => {
    return [undefined, BigInt(input as any)]
  },
  encode: (price: Price): PriceEncoded => {
    return price.toString()
  },
}
