import { useCallback } from 'react'
import { API_BASE_URL } from '../config/api.js'
import { useCollectionData } from '../hooks/useCollectionData.js'
import CollectionStatus from './CollectionStatus.jsx'

function Leaderboard() {
  const loadLeaderboard = useCallback(
    (signal) => fetch(`${API_BASE_URL}/api/leaderboard/`, { signal }),
    [],
  )
  const { records, loading, error } = useCollectionData(loadLeaderboard)

  return (
    <section aria-labelledby="leaderboard-title">
      <p className="section-kicker mb-1">Friendly competition</p>
      <h1 className="h2 fw-bold mb-4" id="leaderboard-title">Leaderboard</h1>
      <CollectionStatus loading={loading} error={error} records={records} label="Leaderboard entries" />
      {!loading && !error && records.length > 0 && (
        <div className="table-responsive card dashboard-card">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">Athlete</th>
                <th scope="col">Team</th>
                <th scope="col">Activities</th>
                <th scope="col">Points</th>
              </tr>
            </thead>
            <tbody>
              {records.map((entry, index) => (
                <tr key={entry._id}>
                  <td><span className="rank-badge">{index + 1}</span></td>
                  <td className="fw-semibold">{entry.user?.name ?? 'Athlete'}</td>
                  <td>{entry.team?.name ?? 'Unassigned'}</td>
                  <td>{entry.activitiesCount}</td>
                  <td className="fw-bold text-success">{entry.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Leaderboard
