# Frontend Test

## Instructions

In this project you should implement a simple booking flow for a selected place ("stashpoint"), date range and bag count.

- Everything should be implemented in a single screen/page, i.e. no routing.
- You can structure the UI however you like.
- Don't give much attention to styling. See [Adding a CSS Modules Stylesheet](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet).
- You should use TypeScript, but you can use `: any` or `as any` if you get stuck.
- All data types are defined in `/src/Data/` directory. You can do for example:

  ```ts
  import * as Data from './Data'

  const getStashpoint = async (): Promise<Data.Stashpoint | Error> => {
    const unknownJsonData = await loadStashpoint()

    const [error, stashpoint] = Data.Stashpoint.decode(unknownJsonData)

    return error === undefined ? stashpoint : error
  }

  const serializeStashpoint = (stashpoint: Data.Stashpoint): string => {
    return JSON.stringify(Data.Stashpoint.encode(stashpoint))
  }

  // So you can see `Data.Stashpoint` can be used both as a type and as a value.
  ```

- For state management you can use only built-in React hooks, like `useReducer`, `useState`, etc. You can structure and share the state however you like, e.g. by using React context, hooks, etc.
- For UI elements you can use only built-in React elements, like `input`, `button`, etc.
- For HTTP requests use the built-in `fetch` function. Pass the `headers` option with either `{ accept: 'application/json' }` or `{ accept: 'application/json', 'content-type': 'application/json' }` as value, for all requests.
- You can use the pre-installed [date-fns](https://date-fns.org/) for `Date` manipulations.
- All API endpoints are mocked. See `/src/mocks/handlers.ts`. So you can use for example `fetch('/api/stashpoints')` to get all stashpoints.
- For all HTTP requests some kind of loading indicator should be rendered to the screen until you get a response. E.g. `<span>Loading stashpoints&hellip;</span>`.
- On request/response errors some kind of error message should be rendered to the screen. E.g. `<span>Couldn't make a booking</span>`.
- This project was bootstrapped with [Create React App](https://create-react-app.dev/).

### Required

1. Fetch all stashpoints with a `GET /api/stashpoints` request. On successfull response you should decode/deserialize the incoming JSON data and render a list of all stashpoints. Each list item should contain the stashpoint's `name`, `address`, `bagPerDayPrice` and `rating`:

   ```ts
   import * as Data from './Data'

   // ...

   const [error, stashpoints] = Data.Stashpoints.decode(await response.json())

   if (error) {
     // Show an error message to the screen...
   } else {
     // Show a list of the received `stashpoints`...
   }
   ```

2. Collect the three required values in order to get a price quote and create a booking. Those values should be stored to application's state as:

   ```ts
   import { addDays, startOfDay } from 'date-fns'
   import * as Data from './Data'

   type DraftCart = {
     readonly bagCount: number
     readonly dateRange: Data.DateRange
     readonly stashpointId: string | undefined
   }

   const getInitialDraftCart = (): DraftCart => {
     const initialDateFrom = addDays(startOfDay(new Date()), 1)

     return {
       bagCount: 1,
       dateRange: { from: initialDateFrom, to: addDays(initialDateFrom, 1) },
       stashpointId: undefined,
     }
   }
   ```

   2.1. By clicking on an item of the stashpoint list, the `id` of that stahpoint should be stored in application's state as `cart.stashpointId` and that item should be rendered as "selected".

   2.2. Render two `<input type="date" />` elements to let the user enter the booking date range. You should store the two values to application's state as `cart.dateRange.from` and `cart.dateRange.to` _after_ ensuring that they are valid `Date` objects, with `dateRange.from` at least one day after the start of the current day and `dateRange.to` at least one day after `dateRange.from`. Both dates should be set at the start of day (see `startOfDay()` in `date-fns`). Use `isDateRangeValid()` in `/src/util.ts` to do the validation. The `value` prop of `<input type="date" />` shoud be formated using `formatDate(date, 'yyyy-MM-dd')` from `date-fns`.

   2.3. Render an `<input type="number" />` element to let the user enter the bag count. You should store that value to application's state as `cart.bagCount`, _after_ ensuring that it is an integer number greater that or equal to 1 and less than or equal to 50. Use `isBagCountValid()` in `/src/util.ts` to do the validation.

3. Each time a value in the `cart` changes and all three properties contain a value (except `undefined`), you should make a `POST /api/quotes` request, in order to get a price quote. The body of a succesfull response should be decoded/deserialized with `Data.PriceQuote.decode(data)` (see step `1` above). The decoded data should be stored to application's state as `priceQuote` and `priceQuote.totalPrice` should be rendered to the screen using the built-in `Intl.NumberFormat` object, combined with `priceQuote.currencyCode` and `en-GB` as locale. The type of non stringified request body should be `Data.CartEncoded` (see `/src/Data/Cart.ts`).

4. After getting a price quote, allow the user to press a `Pay` button that will do the following:

   4.1. Make a `POST /api/bookings` request to create a booking. The body of a succesfull response should be decoded/deserialized with `Data.Booking.decode(data)` (see step `1` above). The type of non stringified request body should be `Data.CartEncoded` (see `/src/Data/Cart.ts`).

   4.2. Make another `POST /api/payments` request and include the `id` of the booking from the previous response, to the request body. The type of non stringified request body should be `{ readonly bookingId: string }`.

5. After a successfull payment response, render some kind of booking success message, that includes the `booking.id`.

### Optional

- You can enable sorting of stashpoint list, by `rating` and `bagPerDayPrice`. Use a `<select>` input element for that.
- You can write a few tests (`jest` and `@testing-library/react` are ready to be used).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
