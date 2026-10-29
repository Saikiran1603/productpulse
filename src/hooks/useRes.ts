import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import type { R } from '../types'

export function useRes(res: string | null, q: R = {}) {
  const [data, setData] = useState<R[]>([]); const [loading, setL] = useState(!!res); const [error, setE] = useState('')
  const key = JSON.stringify(q)
  const load = useCallback(() => {
    if (!res) { setL(false); return }
    setL(true)
    const params = import.meta.env.DEV ? q : { ...q, _cacheBust: Date.now() }
    api.get('/' + res, { params }).then(r => { setData(r.data); setE('') })
      .catch(() => setE(`Could not load ${res}. Check that JSON Server is running.`)).finally(() => setL(false))
  }, [res, key])
  useEffect(load, [load])
  return { data, loading, error, reload: load }
}
export const all = (...rs: R[]) => ({ loading: rs.some(r => r.loading), error: rs.find(r => r.error)?.error || '', reload: () => rs.forEach(r => r.reload()) })
