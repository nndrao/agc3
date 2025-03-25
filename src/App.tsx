import { useState } from 'react'
import './App.css'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { DataTable } from './components/DataTable'
import { Button } from './components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-12 w-full">
        <div className="container mx-auto px-4 w-full">
          <DataTable />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App