const url = 'http://localhost:3000'
export const getStash = () => {
  return fetch(url + '/api/stashpoints', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
export const postStash = (carts: any) => {
  return fetch(url + '/api/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(carts),
  })
}
export const postBooking = (priceQuote: any) => {
  return fetch(url + '/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(priceQuote),
  })
}
export const postPayment = (id: any) => {
  return fetch(url + '/api/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bookingId: id }),
  })
}
