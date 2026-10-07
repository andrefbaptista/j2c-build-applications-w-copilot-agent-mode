export default function CollectionStatus({ loading, error, records, label }) {
  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2 py-4" role="status">
        <span className="spinner-border spinner-border-sm text-success" />
        Loading {label.toLowerCase()}…
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Could not load {label.toLowerCase()}: {error}
      </div>
    )
  }

  if (records.length === 0) {
    return <p className="text-secondary py-3">No {label.toLowerCase()} found.</p>
  }

  return null
}
