import { useState } from 'react'
import '@/css/globals.css'

// 아이템 타입 정의
type Item = {
  id: string
  name: string
  description: string
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [error, setError] = useState('')

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/graphql2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              items {
                id
                name
                description
              }
            }
          `,
        }),
      })

      const json = await res.json()
      if (json.errors) {
        setError(JSON.stringify(json.errors, null, 2))
        setItems([])
      } else {
        setItems(json.data.items)
        setError('')
      }
    } catch (err) {
      setError('요청 실패: ' + err)
      setItems([])
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-200 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-blue-600">GraphQL Yoga 호출 예제</h1>

      <button
        onClick={fetchItems}
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        아이템 불러오기
      </button>

      {error && (
        <pre className="bg-red-100 text-red-700 p-4 rounded max-w-md text-sm overflow-auto whitespace-pre-wrap">
          {error}
        </pre>
      )}

      {items.length > 0 && (
        <ul className="bg-white p-4 rounded shadow max-w-md w-full space-y-3">
          {items.map((item) => (
            <li key={item.id} className="border-b pb-2">
              <strong>{item.name}</strong>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}