import React, { useEffect, useState } from 'react'
import { addDays, startOfDay, format } from 'date-fns'
import { isDateRangeValid } from './util'
import { Stashpoint, BookingEncoded, PriceQuote } from './Data'
import { getStash, postStash, postBooking, postPayment } from './config'
import './asset/custom.css'

type DraftCart = {
  stashpointId: any
  dateRange: { from: Date; to: Date }
  bagCount: number
}

const getInitialDraftCart = (): DraftCart => {
  const initialDateFrom = addDays(startOfDay(new Date()), 1)

  return {
    bagCount: 1,
    dateRange: { from: initialDateFrom, to: addDays(initialDateFrom, 1) },
    stashpointId: undefined,
  }
}

const Home = () => {
  const [stachList, setStachList] = useState<Stashpoint[]>()
  const [cart, setCart] = useState<DraftCart>(getInitialDraftCart)
  const [priceQuote, setPriceQuote] = useState<PriceQuote>()
  const [booking, setBooking] = useState<BookingEncoded>()
  const [bookingId, setBookingId] = useState<number>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const getStashlist = async () => {
    try {
      let data = await getStash()
      setStachList(await data.json())
    } catch (error: any) {
      setLoading(false)
      setError(error.error.code)
    }
  }

  useEffect(() => {
    getStashlist()
  }, [])

  const handleChangeData = async (e: any) => {
    console.log(e)
    let type: string = e.target.name
    let value: any = e.target.value
    let carts: DraftCart = { ...cart }
    if (value && value.length > 0) {
      switch (type) {
        case 'stashpoint':
          carts.stashpointId = value
          setCart(carts)
          break
        case 'fromDate':
          carts.dateRange.from = startOfDay(new Date(value))
          setCart(carts)

          break
        case 'toDate':
          carts.dateRange.to = startOfDay(new Date(value))
          setCart(carts)

          break
        case 'bagCount':
          carts.bagCount = parseInt(value)
          setCart(carts)

          break

        default:
          break
      }
      if (
        carts.bagCount &&
        carts.dateRange.from &&
        carts.dateRange.to &&
        carts.stashpointId &&
        isDateRangeValid(carts.dateRange)
      ) {
        setLoading(true)
        setBookingId(undefined)
        try {
          await postStash(carts)
            .then((res) => res.json())
            .then((response: any) => {
              setLoading(false)
              if (response.error) {
                setError(response.error.code)
              } else {
                setPriceQuote({ ...response })
              }
            })
            .catch((error) => {
              setLoading(false)
              setError(error.error.code)
            })
        } catch (error: any) {
          setLoading(false)
          setError(error.error.code)
        }
      }
    }
  }

  const payBooking = async () => {
    setLoading(true)

    await postBooking(priceQuote)
      .then((res) => res.json())
      .then((response: any) => {
        setBooking(response)
        if (response.error) {
          setError(response.error.code)
          return
        }
        postPayment(response.id)
          .then((res) => res.json())
          .then((response: any) => {
            if (response.error) {
              setError(response.error.code)
              return
            }
            setLoading(false)
            setBookingId(response.id)
            setPriceQuote(undefined)
            setCart(getInitialDraftCart)
          })
      })
      .catch((err) => {
        if (err.error) {
          setError(err.error.code)
          return
        }
      })
  }

  if (loading) {
    return <span>Loading stashpoints&hellip;</span>
  }

  return (
    <div className='home'>
      <div className='wrapper'>
        <div className='input-field'>
          <label htmlFor='stashpoint'>Stash Point</label>
          <select
            name='stashpoint'
            onChange={handleChangeData}
            value={cart.stashpointId}
          >
            <option>select stash point</option>
            {stachList?.map((data) => {
              return (
                <option
                  key={data.id}
                  value={data.id}
                  selected={cart.stashpointId == data.id ? true : false}
                >
                  {data.name}
                </option>
              )
            })}
          </select>
        </div>
        <div className='input-field'>
          <label htmlFor='stashpoint'>Date:</label>
          <div>
            <input
              type='date'
              className='fromDate'
              name='fromDate'
              onChange={handleChangeData}
              value={format(cart.dateRange.from, 'yyyy-MM-dd')}
            />
            <input
              type='date'
              className='toDate'
              name='toDate'
              onChange={handleChangeData}
              value={format(cart.dateRange.to, 'yyyy-MM-dd')}
            />
          </div>
        </div>
        <div className='input-field'>
          <label htmlFor='stashpoint'>Number of Bag</label>
          <input
            type='number'
            name='bagCount'
            value={cart.bagCount}
            onInput={handleChangeData}
            min={1}
            max={50}
          />
        </div>
      </div>
      <br />
      {priceQuote ? (
        <>
          <div>
            <table>
              <tr>
                <th>Stash Point</th>
                <th>Bag Count</th>
                <th>Currency Code</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Total Price</th>
              </tr>
              <tr>
                <td>
                  {
                    stachList?.find(
                      (data) => data.id == priceQuote.stashpointId,
                    )?.name
                  }
                </td>
                <td>{priceQuote.bagCount}</td>
                <td>{priceQuote.currencyCode}</td>
                <td>
                  {format(new Date(priceQuote.dateRange.from), 'yyyy-MM-dd')}
                </td>
                <td>
                  {format(new Date(priceQuote.dateRange.to), 'yyyy-MM-dd')}
                </td>
                <td>{priceQuote.totalPrice}</td>
              </tr>
            </table>
            <br />
            <button onClick={payBooking}>Pay</button>
          </div>
        </>
      ) : null}
      {bookingId ? (
        <>
          <div>
            <h4>Booking {bookingId} successful</h4>
          </div>
        </>
      ) : null}
      {error ? <h3 className='red'>{error}</h3> : null}
    </div>
  )
}

export default Home
