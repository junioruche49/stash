// Note: Ignore unsafe decoding of data

export type Payment = {
  readonly id: string
}

export type PaymentEncoded = {
  readonly id: string
}

export const Payment = {
  decode: (
    input: unknown,
  ): readonly [Error, undefined] | readonly [undefined, Payment] => {
    return [undefined, input as any]
  },
  encode: (payment: Payment): PaymentEncoded => {
    return payment
  },
}
