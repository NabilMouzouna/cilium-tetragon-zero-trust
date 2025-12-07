import { createRoot } from 'react-dom/client'
import './index.module.css'
import AppRouter from './router'

createRoot(document.getElementById('root')!).render(
  <AppRouter />,
)
