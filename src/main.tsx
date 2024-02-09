import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupMsw } from './msw/browser.ts'

setupMsw()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
