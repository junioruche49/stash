import { setupWorker } from 'msw'
import { devHandlers } from './handlers'

export const worker = setupWorker(...devHandlers)
