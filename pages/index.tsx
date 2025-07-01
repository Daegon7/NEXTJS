import { useState, useEffect } from 'react'
import axios from 'axios'

type Item = {
  id: string
  name: string
  description: string
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    setIsLoggedIn(!!token)

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [])

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8081/auth/login', {
        username: 'demo',     // 🔐 실제 로그인 데이터로 교체
        password: 'password'  // ⛔ 테스트용 비밀번호 (UI로 대체 가능)
      })

      const accessToken = res.data.accessToken
      const refreshToken = res.data.refreshToken

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        setIsLoggedIn(true)
        alert('로그인 성공! 🎉')
      } else {
        setError('accessToken이 응답에 포함되지 않았습니다.')
      }
    } catch (err: any) {
      setError('로그인 실패: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleLogout = async () => {
    try {
      // ✅ 서버에 로그아웃 요청
      await axios.post('http://localhost:8081/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
        }
      })

      // ✅ 클라이언트에서 토큰 제거
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')

      // ✅ Axios 전역 헤더 제거
      delete axios.defaults.headers.common['Authorization']

      // ✅ 상태 초기화
      setIsLoggedIn(false)
      setItems([])
      setError('')

      alert('로그아웃 되었습니다. 👋')
    } catch (err: any) {
      console.error('로그아웃 실패:', err)
      alert('서버 로그아웃 중 오류가 발생했습니다.')
    }
  }

  const fetchItems = async () => {

    if (!isLoggedIn) {
      alert('로그인이 필요합니다 😅');
      return;
    }

    try {
      const res = await fetch('/api/graphql2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
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
          `
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
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-violet-200 via-purple-100 to-white p-6 space-y-6">
  <h1 className="text-4xl font-bold text-blue-700 drop-shadow-lg">GraphQL 인증 예제</h1>

  <div className="flex space-x-4">
    {isLoggedIn ? (
      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-gradient-to-br from-rose-400 to-rose-600 text-white rounded shadow hover:scale-105 transition"
      >
        로그아웃
      </button>
    ) : (
      <button
        onClick={handleLogin}
        className="px-6 py-2 bg-gradient-to-br from-green-400 to-green-600 text-white rounded shadow hover:scale-105 transition"
      >
        로그인
      </button>
    )}

    <button
      onClick={fetchItems}
      className="px-6 py-2 bg-gradient-to-br from-sky-400 to-sky-600 text-white rounded shadow hover:scale-105 transition"
    >
      아이템 불러오기
    </button>
  </div>

  {error && (
    <pre className="bg-red-50 border border-red-400 text-red-700 font-mono p-4 rounded max-w-md text-sm shadow-md overflow-auto whitespace-pre-wrap">
      {error}
    </pre>
  )}

  {items.length > 0 && (
    <ul className="bg-white p-5 rounded-lg shadow-lg border border-slate-300 max-w-md w-full space-y-4">
      {items.map((item) => (
        <li
          key={item.id}
          className="hover:bg-slate-100 transition p-2 border-b border-slate-200"
        >
          <strong className="text-blue-700">{item.name}</strong>
          <p className="text-gray-600 text-sm">{item.description}</p>
        </li>
      ))}
    </ul>
  )}
</div>
  )
}