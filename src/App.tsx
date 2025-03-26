import React from 'react'
import './App.css'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { DataTable } from './components/DataTable'
import { LicenseManager } from 'ag-grid-enterprise'

// Set up AG Grid enterprise for development/trial
// Remove this in production with a valid license
LicenseManager.setLicenseKey('For_Trial_Purposes_Only')

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-12 w-full">
        <DataTable />
      </main>
      <Footer />
    </div>
  )
}

export default App