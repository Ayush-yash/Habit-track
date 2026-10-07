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

    setHabits([...habits, habit])
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

  return (
    <div className="app-container">
      <h1>Daily Habit Tracker</h1>
      
      <div className="stats">
        <span>Total Habits: {totalHabits}</span>
        <span>Completed: {completedHabits}</span>
      </div>

      <form className="add-habit-form" onSubmit={handleAddHabit}>
        <input 
          type="text" 
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="➕ Add a new habit (Gym, Study, etc.)"
        />
        <button type="submit">Add</button>
      </form>

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
                    checked={habit.completed}
                    onChange={() => toggleComplete(habit.id)}
                  />
                  <span className="habit-text">{habit.text}</span>
                </div>
                <div className="habit-actions">
                  <button className="btn-edit" onClick={() => startEditing(habit)}>✏️ Edit</button>
                  <button className="btn-delete" onClick={() => deleteHabit(habit.id)}>🗑️ Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
