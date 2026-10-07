import { useCallback } from 'react'
import { API_BASE_URL } from '../config/api.js'
import { useCollectionData } from '../hooks/useCollectionData.js'
import CollectionStatus from './CollectionStatus.jsx'

function Teams() {
  const loadTeams = useCallback(
    (signal) => fetch(`${API_BASE_URL}/api/teams/`, { signal }),
    [],
  )
  const { records, loading, error } = useCollectionData(loadTeams)

  return (
    <section aria-labelledby="teams-title">
      <p className="section-kicker mb-1">Better together</p>
      <h1 className="h2 fw-bold mb-4" id="teams-title">Teams</h1>
      <CollectionStatus loading={loading} error={error} records={records} label="Teams" />
      {!loading && !error && records.length > 0 && (
        <div className="row g-3">
          {records.map((team) => (
            <div className="col-md-6 col-xl-4" key={team._id}>
              <article className="card dashboard-card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between gap-3 mb-2">
                    <h2 className="h5 fw-bold">{team.name}</h2>
                    <span className="badge text-bg-success-subtle text-success-emphasis align-self-start">
                      {team.members?.length ?? 0} members
                    </span>
                  </div>
                  <p className="text-secondary">{team.description}</p>
                  {team.members?.length > 0 && (
                    <p className="small mb-0">
                      {team.members.map((member) => member.name ?? 'Member').join(', ')}
                    </p>
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Teams
