import { useState, useEffect } from 'react'

const API_URL = "http://127.0.0.1:8000/todos"

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState("")

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newTodo = { id: Date.now(), title: title, is_completed: false }
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    })
    fetchTodos()
    setTitle("")
  }

  // 新增：删除函数
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      })
      fetchTodos() // 删完刷新列表
    } catch (error) {
      console.error("删除失败:", error)
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "50px auto", border: "1px solid #ddd", borderRadius: "8px", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>我的 Todo List</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入待办事项..."
          style={{ flex: 1, padding: "8px" }}
          required 
        />
        <button type="submit" style={{ padding: "8px 16px", cursor: "pointer" }}>添加</button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ 
            padding: "10px", 
            borderBottom: "1px solid #eee",
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span>{todo.title}</span>
            {/* 删除按钮 */}
            <button 
              onClick={() => handleDelete(todo.id)}
              style={{ background: "#ff4d4d", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
            >
              删除
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App