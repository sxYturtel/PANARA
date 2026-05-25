import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useProvinces() {
  const [provinces, setProvinces] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .rpc('get_distinct_provinces')

      if (!error && data) {
        setProvinces(data.map((r: any) => r.provinsi))
      }
      setLoading(false)
    }
    fetch()
  }, [])

  return { provinces, loading }
}