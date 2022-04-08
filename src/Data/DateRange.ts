// Note: Ignore unsafe decoding of data

export type DateRange = {
  readonly from: Date
  readonly to: Date
}

export type DateRangeEncoded = {
  readonly from: string
  readonly to: string
}

export const DateRange = {
  decode: (
    input: unknown,
  ): readonly [Error, undefined] | readonly [undefined, DateRange] => {
    return [
      undefined,
      { from: new Date((input as any).from), to: new Date((input as any).to) },
    ]
  },
  encode: (dateRange: DateRange): DateRangeEncoded => {
    return {
      from: dateRange.from.toISOString(),
      to: dateRange.to.toISOString(),
    }
  },
}
