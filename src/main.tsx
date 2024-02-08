import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupMsw } from './msw/browser.ts'
import { useState, useEffect } from 'react'

setupMsw()

const Delay = () => {
  const [show, setShow] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 500)
  }, [])
  return show ? <App /> : null

}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Delay />
)
