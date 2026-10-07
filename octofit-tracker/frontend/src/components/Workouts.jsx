import { useCallback } from 'react'
import { API_BASE_URL } from '../config/api.js'
import { useCollectionData } from '../hooks/useCollectionData.js'
import CollectionStatus from './CollectionStatus.jsx'

function Workouts() {
  const loadWorkouts = useCallback(
    (signal) => fetch(`${API_BASE_URL}/api/workouts/`, { signal }),
    [],
  )
  const { records, loading, error } = useCollectionData(loadWorkouts)

  return (
    <section aria-labelledby="workouts-title">
      <p className="section-kicker mb-1">Find your next session</p>
      <h1 className="h2 fw-bold mb-4" id="workouts-title">Workouts</h1>
      <CollectionStatus loading={loading} error={error} records={records} label="Workouts" />
      {!loading && !error && records.length > 0 && (
        <div className="row g-3">
          {records.map((workout) => (
            <div className="col-md-6 col-xl-4" key={workout._id}>
              <article className="card dashboard-card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between gap-3">
                    <h2 className="h5 fw-bold">{workout.name}</h2>
                    <span className="badge text-bg-success-subtle text-success-emphasis align-self-start text-capitalize">
                      {workout.category}
                    </span>
                  </div>
                  <p className="text-secondary">{workout.description}</p>
                  <p className="small mb-2">
                    {workout.durationMinutes} min · {workout.difficulty}
                  </p>
                  {workout.exercises?.length > 0 && (
                    <ul className="small mb-0">
                      {workout.exercises.map((exercise, index) => (
                        <li key={`${exercise.name}-${index}`}>{exercise.name}</li>
                      ))}
                    </ul>
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

export default Workouts
