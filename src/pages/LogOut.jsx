import React from 'react'
import { useAuth } from './AuthContext'

function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Dashboard
