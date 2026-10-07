import { NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import logo from '../../../docs/octofitapp-small.png'

const pages = [
  { label: 'Activities', path: '/activities' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Teams', path: '/teams' },
  { label: 'Users', path: '/users' },
  { label: 'Workouts', path: '/workouts' },
]

function Home() {
  return (
    <section className="dashboard-hero rounded-4 p-4 p-lg-5">
      <p className="text-uppercase small fw-semibold mb-2">Move together</p>
      <h1 className="display-5 fw-bold mb-3">Your progress, at a glance.</h1>
      <p className="lead mb-0">
        Track activity, cheer on your team, and find your next workout.
      </p>
    </section>
  )
}

function NotFound() {
  return (
    <section className="py-5">
      <h1 className="h3">Page not found</h1>
      <p className="text-secondary">Choose a section from the navigation.</p>
    </section>
  )
}

function App() {
  return (
    <>
      <header className="navbar navbar-expand bg-white border-bottom">
        <div className="container flex-wrap gap-3 py-2">
          <NavLink className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
            <img src={logo} alt="" className="brand-logo" />
            OctoFit Tracker
          </NavLink>
          <nav className="nav nav-pills" aria-label="Main navigation">
            {pages.map(({ label, path }) => (
              <NavLink
                key={path}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                to={path}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="container py-4 py-lg-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="border-top bg-white py-4">
        <div className="container small text-secondary">
          OctoFit Tracker · Keep moving, keep cheering.
        </div>
      </footer>
    </>
  )
}

export default App
