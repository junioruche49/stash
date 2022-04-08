import Home from './home'

export type AppProps = {
  readonly children?: never
}

export const App = (_props: AppProps) => {
  return (
    <div>
      <header>
        <h1>Stasher</h1>
      </header>

      <main>
        <Home />
      </main>
    </div>
  )
}
