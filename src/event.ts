import { VolatileState } from "./components/renderer"

export type ToParent = {
  type: 'load-start',
} | {
  type: 'load-complete',
  state: VolatileState
} | {
  type: 'load-error',
  error: string,
}

export type ToViewer = {
  type: 'set-page',
  page: number,
}