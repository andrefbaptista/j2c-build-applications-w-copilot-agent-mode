import { Route, Routes } from 'react-router-dom'
import logo from '../../../docs/octofitapp-small.png'

function Home() {
  return (
    <main className="container py-5">
      <section className="row align-items-center justify-content-center min-vh-75">
        <div className="col-12 col-md-8 col-lg-6 text-center">
          <img className="img-fluid mb-4" src={logo} alt="OctoFit Tracker" />
          <h1 className="display-5 fw-bold">OctoFit Tracker</h1>
          <p className="lead text-secondary">
            Your fitness journey starts here.
          </p>
        </div>
      </section>
    </main>
  )
}

function NotFound() {
  return (
    <main className="container py-5">
      <h1 className="h3">Page not found</h1>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
