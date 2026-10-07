import { useCallback } from 'react'
import { API_BASE_URL } from '../config/api.js'
import { useCollectionData } from '../hooks/useCollectionData.js'
import CollectionStatus from './CollectionStatus.jsx'

function Activities() {
  const loadActivities = useCallback(
    (signal) => fetch(`${API_BASE_URL}/api/activities/`, { signal }),
    [],
  )
  const { records, loading, error } = useCollectionData(loadActivities)

  return (
    <section aria-labelledby="activities-title">
      <p className="section-kicker mb-1">Every effort counts</p>
      <h1 className="h2 fw-bold mb-4" id="activities-title">Activities</h1>
      <CollectionStatus loading={loading} error={error} records={records} label="Activities" />
      {!loading && !error && records.length > 0 && (
        <div className="table-responsive card dashboard-card">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Activity</th>
                <th scope="col">Athlete</th>
                <th scope="col">Team</th>
                <th scope="col">Duration</th>
                <th scope="col">Calories</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {records.map((activity) => (
                <tr key={activity._id}>
                  <td className="text-capitalize">{activity.activityType}</td>
                  <td>{activity.user?.name ?? 'Athlete'}</td>
                  <td>{activity.team?.name ?? 'Individual'}</td>
                  <td>{activity.durationMinutes} min</td>
                  <td>{activity.calories} kcal</td>
                  <td>{activity.date ? new Date(activity.date).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Activities
