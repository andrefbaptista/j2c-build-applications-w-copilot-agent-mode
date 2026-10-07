import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import logo from '../../../docs/octofitapp-small.png'
import { API_BASE_URL } from './config/api.js'

const collections = [
  { key: 'users', label: 'Athletes', path: 'users' },
  { key: 'teams', label: 'Teams', path: 'teams' },
  { key: 'activities', label: 'Activities', path: 'activities' },
  { key: 'leaderboard', label: 'Leaderboard', path: 'leaderboard' },
  { key: 'workouts', label: 'Workouts', path: 'workouts' },
]

function Home() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadDashboard() {
      try {
        const results = await Promise.all(
          collections.map(async ({ key, path }) => {
            const response = await fetch(`${API_BASE_URL}/api/${path}/`, {
              signal: controller.signal,
            })
            if (!response.ok) {
              throw new Error(`${path}: API returned ${response.status}`)
            }
            return [key, await response.json()]
          }),
        )
        setData(Object.fromEntries(results))
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(
            `Could not load tracker data. Check that the API is running at ${API_BASE_URL}. ${requestError.message}`,
          )
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadDashboard()
    return () => controller.abort()
  }, [])

  return (
    <>
      <header className="navbar navbar-expand bg-white border-bottom">
        <div className="container py-2">
          <a className="navbar-brand d-flex align-items-center gap-2 fw-bold" href="/">
            <img src={logo} alt="" className="brand-logo" />
            OctoFit Tracker
          </a>
          <span className="badge rounded-pill text-bg-success-subtle text-success-emphasis">
            Fitness dashboard
          </span>
        </div>
      </header>

      <main className="container py-4 py-lg-5">
        <section className="dashboard-hero rounded-4 p-4 p-lg-5 mb-4 mb-lg-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <p className="text-uppercase small fw-semibold mb-2">Move together</p>
              <h1 className="display-5 fw-bold mb-3">Your progress, at a glance.</h1>
              <p className="lead mb-0">
                Track activity, cheer on your team, and find your next workout.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <span className="badge rounded-pill bg-white text-success px-3 py-2">
                {loading ? 'Syncing tracker data' : error ? 'API connection issue' : 'Live from OctoFit API'}
              </span>
            </div>
          </div>
        </section>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="d-flex justify-content-center align-items-center gap-3 py-5">
            <div className="spinner-border text-success" role="status" />
            <span>Loading your tracker data…</span>
          </div>
        ) : !error ? (
          <>
            <section className="row g-3 mb-4 mb-lg-5" aria-label="Tracker summary">
              {collections.map(({ key, label }) => (
                <div className="col-6 col-lg" key={key}>
                  <div className="card summary-card h-100">
                    <div className="card-body">
                      <p className="text-secondary small mb-2">{label}</p>
                      <p className="h2 fw-bold mb-0">{data[key]?.length ?? 0}</p>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <section className="mb-5" aria-labelledby="leaderboard-title">
              <div className="d-flex align-items-end justify-content-between mb-3">
                <div>
                  <p className="section-kicker mb-1">Friendly competition</p>
                  <h2 className="h3 fw-bold mb-0" id="leaderboard-title">Leaderboard</h2>
                </div>
              </div>
              <div className="card dashboard-card overflow-hidden">
                {data.leaderboard?.length ? (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th scope="col">Rank</th>
                          <th scope="col">Athlete</th>
                          <th scope="col">Team</th>
                          <th scope="col">Activities</th>
                          <th scope="col" className="text-end">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.leaderboard.map((entry, index) => (
                          <tr key={entry._id}>
                            <td><span className="rank-badge">{index + 1}</span></td>
                            <td className="fw-semibold">{entry.user?.name ?? 'Athlete'}</td>
                            <td>{entry.team?.name ?? 'Unassigned'}</td>
                            <td>{entry.activitiesCount}</td>
                            <td className="text-end fw-bold text-success">{entry.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <EmptyState label="Leaderboard entries" />}
              </div>
            </section>

            <section className="mb-5" aria-labelledby="activity-title">
              <div className="mb-3">
                <p className="section-kicker mb-1">Every effort counts</p>
                <h2 className="h3 fw-bold mb-0" id="activity-title">Recent activity</h2>
              </div>
              <div className="row g-3">
                {data.activities?.length ? data.activities.map((activity) => (
                  <div className="col-md-6 col-xl-3" key={activity._id}>
                    <article className="card dashboard-card h-100">
                      <div className="card-body">
                        <span className="badge text-bg-success-subtle text-success-emphasis text-capitalize mb-3">
                          {activity.activityType}
                        </span>
                        <h3 className="h5 fw-bold">{activity.user?.name ?? 'Athlete'}</h3>
                        <p className="text-secondary mb-3">{activity.team?.name ?? 'Individual activity'}</p>
                        <div className="d-flex justify-content-between small">
                          <span>{activity.durationMinutes} min</span>
                          <span>{activity.calories} kcal</span>
                        </div>
                      </div>
                    </article>
                  </div>
                )) : <EmptyState label="Activities" />}
              </div>
            </section>

            <div className="row g-4">
              <section className="col-lg-6" aria-labelledby="teams-title">
                <div className="mb-3">
                  <p className="section-kicker mb-1">Better together</p>
                  <h2 className="h3 fw-bold mb-0" id="teams-title">Teams</h2>
                </div>
                <div className="d-grid gap-3">
                  {data.teams?.length ? data.teams.map((team) => (
                    <article className="card dashboard-card" key={team._id}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between gap-3">
                          <div>
                            <h3 className="h5 fw-bold">{team.name}</h3>
                            <p className="text-secondary mb-0">{team.description}</p>
                          </div>
                          <span className="badge text-bg-light align-self-start">
                            {team.members?.length ?? 0} members
                          </span>
                        </div>
                        {team.members?.length > 0 && (
                          <p className="small mt-3 mb-0">
                            {team.members.map((member) => member.name).join(' · ')}
                          </p>
                        )}
                      </div>
                    </article>
                  )) : <EmptyState label="Teams" />}
                </div>
              </section>

              <section className="col-lg-6" aria-labelledby="workouts-title">
                <div className="mb-3">
                  <p className="section-kicker mb-1">Find your next session</p>
                  <h2 className="h3 fw-bold mb-0" id="workouts-title">Workouts</h2>
                </div>
                <div className="d-grid gap-3">
                  {data.workouts?.length ? data.workouts.map((workout) => (
                    <article className="card dashboard-card" key={workout._id}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between gap-3">
                          <div>
                            <h3 className="h5 fw-bold">{workout.name}</h3>
                            <p className="text-secondary">{workout.description}</p>
                          </div>
                          <span className="badge text-bg-success-subtle text-success-emphasis align-self-start text-capitalize">
                            {workout.category}
                          </span>
                        </div>
                        <div className="small text-secondary">
                          {workout.durationMinutes} min · {workout.difficulty}
                        </div>
                      </div>
                    </article>
                  )) : <EmptyState label="Workouts" />}
                </div>
              </section>
            </div>

            <section className="mt-5" aria-labelledby="athletes-title">
              <div className="mb-3">
                <p className="section-kicker mb-1">Your community</p>
                <h2 className="h3 fw-bold mb-0" id="athletes-title">Athletes</h2>
              </div>
              <div className="row g-3">
                {data.users?.length ? data.users.map((user) => (
                  <div className="col-sm-6 col-lg-4" key={user._id}>
                    <article className="card dashboard-card h-100">
                      <div className="card-body">
                        <h3 className="h5 fw-bold mb-1">{user.name}</h3>
                        <p className="text-secondary mb-2">@{user.username}</p>
                        <span className="small">{user.team?.name ?? 'No team yet'}</span>
                      </div>
                    </article>
                  </div>
                )) : <EmptyState label="Athletes" />}
              </div>
            </section>
          </>
        ) : null}
      </main>

      <footer className="border-top bg-white py-4">
        <div className="container small text-secondary">
          OctoFit Tracker · Keep moving, keep cheering.
        </div>
      </footer>
    </>
  )
}

function EmptyState({ label }) {
  return (
    <div className="col-12">
      <div className="card dashboard-card">
        <div className="card-body text-secondary">No {label.toLowerCase()} yet.</div>
      </div>
    </div>
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
