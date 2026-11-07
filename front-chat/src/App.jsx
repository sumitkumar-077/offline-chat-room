import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { Toaster,toast } from 'react-hot-toast'
import './App.css'
import JoinCreateChat from './components/JoinCreateChat'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <JoinCreateChat/>
    </div>
  )
}

export default App
