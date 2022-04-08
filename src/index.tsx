import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import reportWebVitals from './reportWebVitals'

import 'sanitize.css'
import 'sanitize.css/assets.css'
import 'sanitize.css/forms.css'
import 'sanitize.css/reduce-motion.css'
import 'sanitize.css/system-ui.css'
import 'sanitize.css/typography.css'
import 'sanitize.css/ui-monospace.css'
import './index.css'

const prepare = async () => {
  if (process.env.NODE_ENV !== 'test') {
    const { worker } = await import('./mocks/browser')

    worker.start({ onUnhandledRequest: 'bypass' })
  }
}

prepare().then(() => {
  const container = document.getElementById('root')

  if (container === null) {
    throw new Error("Couldn't find root element")
  }

  const root = createRoot(container)

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals()
})
