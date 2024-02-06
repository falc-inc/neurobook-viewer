import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupMsw } from './msw/browser.ts'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

setupMsw()

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
  ]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)
