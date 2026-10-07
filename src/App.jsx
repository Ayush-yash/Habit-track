import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('habits')
    if (savedHabits) {
      try {
        return JSON.parse(savedHabits)
      } catch (e) {
        return []
      }
    }
    return []
  })

  const [newHabit, setNewHabit] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits))
  }, [habits])

  const handleAddHabit = (e) => {
    e.preventDefault()
    if (!newHabit.trim()) return

    const habit = {
      id: Date.now().toString(),
      text: newHabit.trim(),
      completed: false
    }

    setHabits([habit, ...habits]) // Add new habit at the top
    setNewHabit('')
  }

  const toggleComplete = (id) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ))
  }

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id))
  }

  const startEditing = (habit) => {
    setEditingId(habit.id)
    setEditValue(habit.text)
  }

  const saveEdit = (id) => {
    if (!editValue.trim()) return
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, text: editValue.trim() } : habit
    ))
    setEditingId(null)
    setEditValue('')
  }

  const totalHabits = habits.length
  const completedHabits = habits.filter(h => h.completed).length
  const completionRate = totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100)

  return (
    <div className="app-container">
      <header className="header">
        <h1>HabitFlow</h1>
        <p style={{color: 'var(--text-muted)'}}>Build better routines, one day at a time.</p>
      </header>
      
      <div className="stats-container">
        <div className="stat-card">
          <span className="stat-value">{totalHabits}</span>
          <span className="stat-label">Total Habits</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{color: 'var(--success)'}}>{completedHabits}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{color: 'var(--warning)'}}>{completionRate}%</span>
          <span className="stat-label">Success Rate</span>
        </div>
      </div>

      <form className="add-habit-form" onSubmit={handleAddHabit}>
        <input 
          type="text" 
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="What habit do you want to build?"
        />
        <button type="submit" className="btn-add">Add</button>
      </form>

      {habits.length === 0 ? (
        <div className="empty-state">
          <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🌱</div>
          <h3>No habits yet</h3>
          <p>Start your journey by adding a habit above.</p>
        </div>
      ) : (
        <ul className="habit-list">
          {habits.map(habit => (
            <li key={habit.id} className={`habit-item ${habit.completed ? 'completed' : ''}`}>
              {editingId === habit.id ? (
                <>
                  <input 
                    type="text" 
                    className="edit-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(habit.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                  />
                  <div className="habit-actions">
                    <button className="btn-save" onClick={() => saveEdit(habit.id)}>Save</button>
                    <button className="btn-cancel" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="habit-content">
                    <input 
                      type="checkbox" 
                      className="custom-checkbox"
                      checked={habit.completed}
                      onChange={() => toggleComplete(habit.id)}
                    />
                    <span className="habit-text">{habit.text}</span>
                  </div>
                  <div className="habit-actions">
                    <button className="action-btn btn-edit" onClick={() => startEditing(habit)} title="Edit">✏️</button>
                    <button className="action-btn btn-delete" onClick={() => deleteHabit(habit.id)} title="Delete">🗑️</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
