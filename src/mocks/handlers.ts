import faker from '@faker-js/faker'
import { differenceInCalendarDays } from 'date-fns'
import { rest } from 'msw'
import * as Data from '../Data'
import { isBagCountValid, isDateRangeValid } from '../util'

const generateStashpoint = (): Data.Stashpoint => {
  return {
    address: faker.address.streetAddress(true),
    bagPerDayPrice: BigInt(faker.datatype.number({ min: 4, max: 7 })),
    currencyCode: 'GBP',
    id: faker.datatype.uuid(),
    name: faker.company.companyName(),
    rating: faker.datatype.number({ min: 0, max: 5, precision: 0.1 }),
  }
}

const generateStashpoints = (totalStashpoints: number): Data.Stashpoints => {
  return Array.from({ length: totalStashpoints }).map(generateStashpoint)
}

const generatePriceQuote = (data: {
  readonly bagCount: number
  readonly dateRange: Data.DateRange
  readonly stashpoint: Data.Stashpoint
}): Data.PriceQuote => {
  const { bagCount, dateRange, stashpoint } = data

  return {
    bagCount,
    currencyCode: stashpoint.currencyCode,
    dateRange,
    stashpointId: stashpoint.id,
    totalPrice:
      stashpoint.bagPerDayPrice *
      BigInt(bagCount) *
      BigInt(differenceInCalendarDays(dateRange.to, dateRange.from)),
  }
}

const generateBooking = (data: {
  readonly bagCount: number
  readonly dateRange: Data.DateRange
  readonly stashpoint: Data.Stashpoint
}): Data.Booking => {
  const { bagCount, dateRange, stashpoint } = data

  return {
    bagCount,
    currencyCode: stashpoint.currencyCode,
    dateRange,
    id: faker.datatype.uuid(),
    stashpoint: stashpoint,
    totalPrice:
      stashpoint.bagPerDayPrice *
      BigInt(bagCount) *
      BigInt(differenceInCalendarDays(dateRange.to, dateRange.from)),
  }
}

const stashpoints = generateStashpoints(50)

const bookings: Data.Booking[] = []

export const devHandlers = [
  rest.get<never, never, Data.StashpointsEncoded>(
    '/api/stashpoints',
    (_req, res, ctx) => {
      return res(
        ctx.delay('real'),
        ctx.status(200),
        ctx.json(Data.Stashpoints.encode(stashpoints)),
      )
    },
  ),

  rest.post<
    {
      readonly bagCount: number
      readonly dateRange: Data.DateRangeEncoded
      readonly stashpointId: string
    },
    never,
    Data.PriceQuoteEncoded | { readonly error: { readonly code: string } }
  >('/api/quotes', (req, res, ctx) => {
    const { bagCount, dateRange: dateRangeEncoded, stashpointId } = req.body

    if (!isBagCountValid(bagCount)) {
      return res(
        ctx.delay('real'),
        ctx.status(422),
        ctx.json({ error: { code: 'INVALID_BAG_COUNT' } }),
      )
    }

    const [error, dateRange] = Data.DateRange.decode(dateRangeEncoded)

    if (error !== undefined || !isDateRangeValid(dateRange)) {
      return res(
        ctx.delay('real'),
        ctx.status(422),
        ctx.json({ error: { code: 'INVALID_DATE_RANGE' } }),
      )
    }

    const stashpoint = stashpoints.find(({ id }) => id === stashpointId)

    if (stashpoint === undefined) {
      return res(
        ctx.delay('real'),
        ctx.status(404),
        ctx.json({ error: { code: 'NOT_FOUND' } }),
      )
    }

    const priceQuote = generatePriceQuote({ bagCount, dateRange, stashpoint })

    return res(
      ctx.delay('real'),
      ctx.status(200),
      ctx.json(Data.PriceQuote.encode(priceQuote)),
    )
  }),

  rest.post<
    {
      readonly bagCount: number
      readonly dateRange: Data.DateRangeEncoded
      readonly stashpointId: string
    },
    never,
    Data.BookingEncoded | { readonly error: { readonly code: string } }
  >('/api/bookings', (req, res, ctx) => {
    const { bagCount, dateRange: dateRangeEncoded, stashpointId } = req.body

    if (!isBagCountValid(bagCount)) {
      return res(
        ctx.delay('real'),
        ctx.status(422),
        ctx.json({ error: { code: 'INVALID_BAG_COUNT' } }),
      )
    }

    const [error, dateRange] = Data.DateRange.decode(dateRangeEncoded)

    if (error !== undefined || !isDateRangeValid(dateRange)) {
      return res(
        ctx.delay('real'),
        ctx.status(422),
        ctx.json({ error: { code: 'INVALID_DATE_RANGE' } }),
      )
    }

    const stashpoint = stashpoints.find(({ id }) => id === stashpointId)

    if (stashpoint === undefined) {
      return res(
        ctx.delay('real'),
        ctx.status(404),
        ctx.json({ error: { code: 'NOT_FOUND' } }),
      )
    }

    const booking = generateBooking({ bagCount, dateRange, stashpoint })

    bookings.push(booking)

    return res(
      ctx.delay('real'),
      ctx.status(200),
      ctx.json(Data.Booking.encode(booking)),
    )
  }),

  rest.post<
    { readonly bookingId: string },
    never,
    Data.PaymentEncoded | { readonly error: { readonly code: string } }
  >('/api/payments', (req, res, ctx) => {
    const { bookingId } = req.body

    const booking = bookings.find(({ id }) => id === bookingId)

    if (booking === undefined) {
      return res(
        ctx.delay('real'),
        ctx.status(404),
        ctx.json({ error: { code: 'NOT_FOUND' } }),
      )
    }

    return res(
      ctx.delay('real'),
      ctx.status(200),
      ctx.json(Data.Payment.encode({ id: faker.datatype.uuid() })),
    )
  }),
]

export const testHandlers = []
