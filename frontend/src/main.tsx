import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Router } from './router.tsx'
import { ContextProvider } from './context/ContextProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContextProvider>
      <Router/>
   </ContextProvider>
  </StrictMode>,
)
