import { useEffect, useState } from 'react'

function getRecords(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.data?.results)) return payload.data.results

  throw new TypeError('The API response did not contain a collection array.')
}

export function useCollectionData(load) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadCollection() {
      try {
        const response = await load(controller.signal)
        if (!response.ok) {
          throw new Error(`The API returned HTTP ${response.status}.`)
        }

        const payload = await response.json()
        setRecords(getRecords(payload))
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load this collection.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadCollection()
    return () => controller.abort()
  }, [load])

  return { records, loading, error }
}
