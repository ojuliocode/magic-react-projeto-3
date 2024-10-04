import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EnhancedFinanceAdmin from './EnhancedFinanceAdmin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <EnhancedFinanceAdmin />
  )
}

export default App
