import { useCallback } from 'react'
import { API_BASE_URL } from '../config/api.js'
import { useCollectionData } from '../hooks/useCollectionData.js'
import CollectionStatus from './CollectionStatus.jsx'

function Users() {
  const loadUsers = useCallback(
    (signal) => fetch(`${API_BASE_URL}/api/users/`, { signal }),
    [],
  )
  const { records, loading, error } = useCollectionData(loadUsers)

  return (
    <section aria-labelledby="users-title">
      <p className="section-kicker mb-1">Your community</p>
      <h1 className="h2 fw-bold mb-4" id="users-title">Athletes</h1>
      <CollectionStatus loading={loading} error={error} records={records} label="Athletes" />
      {!loading && !error && records.length > 0 && (
        <div className="row g-3">
          {records.map((user) => (
            <div className="col-sm-6 col-lg-4" key={user._id}>
              <article className="card dashboard-card h-100">
                <div className="card-body">
                  <h2 className="h5 fw-bold mb-1">{user.name}</h2>
                  <p className="text-secondary mb-2">@{user.username}</p>
                  <p className="small mb-0">{user.team?.name ?? 'No team yet'}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Users
