import { setupServer } from 'msw/node'
import { testHandlers } from './handlers'

export const server = setupServer(...testHandlers)
