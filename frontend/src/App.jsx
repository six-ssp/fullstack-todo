import { useState, useEffect } from 'react'

const API_URL = "http://127.0.0.1:8000/todos"

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState("")

  // --- 逻辑部分保持不变 ---
  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setTodos(data)
    } catch (error) { console.error("Error:", error) }
  }

  useEffect(() => { fetchTodos() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newTodo = { title: title, is_completed: false }
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    })
    fetchTodos()
    setTitle("")
  }

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" })
    fetchTodos()
  }

  const toggleTodo = async (id, currentStatus) => {
    const todo = todos.find(t => t.id === id)
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: todo.title, is_completed: !currentStatus }),
    })
    fetchTodos()
  }

  // --- 样式大改版 ---
  return (
    // 背景换成渐变色 (indigo -> purple -> pink)
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-10 px-4 font-sans flex items-center justify-center">
      
      {/* 卡片换成“玻璃拟态”效果：半透明白背景 + 模糊 */}
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 overflow-hidden p-6 text-white">
        
        <h1 className="text-3xl font-extrabold text-center mb-8 drop-shadow-md">
          ✨ 任务清单 ✨
        </h1>

        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="✨ 输入新任务..."
            required 
            // 输入框：半透明黑底，白字
            className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
          />
          <button 
            type="submit" 
            // 按钮：粉色渐变
            className="bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-lg"
          >
            Go
          </button>
        </form>

        <ul className="space-y-4">
          {todos.map((todo) => (
            <li 
              key={todo.id} 
              // 列表项：白色半透明卡片
              className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                todo.is_completed 
                  ? "bg-green-400/20 border-green-400/30" 
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              }`}
            >
              <div className="flex items-center gap-4 overflow-hidden">
                 {/* 复选框：自定义外观 */}
                 <div 
                    onClick={() => toggleTodo(todo.id, todo.is_completed)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                        todo.is_completed ? "bg-green-400 border-green-400" : "border-white/50 hover:border-pink-400"
                    }`}
                 >
                    {todo.is_completed && <span className="text-white text-xs">✓</span>}
                 </div>
                 
                 <span className={`text-lg truncate ${todo.is_completed ? "line-through text-white/50" : "text-white drop-shadow-sm"}`}>
                   {todo.title}
                 </span>
              </div>

              <button 
                onClick={() => handleDelete(todo.id)}
                className="opacity-0 group-hover:opacity-100 bg-red-500/80 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full transition-all"
              >
                删除
              </button>
            </li>
          ))}
          
          {todos.length === 0 && (
            <div className="text-center py-10 opacity-70">
              <p className="text-4xl mb-2">🏝️</p>
              <p>太棒了，所有任务都搞定啦！</p>
            </div>
          )}
        </ul>
        
        {/* 底部进度条 */}
        <div className="mt-8">
            <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>进度</span>
                <span>{Math.round((todos.filter(t => t.is_completed).length / (todos.length || 1)) * 100)}%</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2">
                <div 
                    className="bg-gradient-to-r from-green-300 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(todos.filter(t => t.is_completed).length / (todos.length || 1)) * 100}%` }}
                ></div>
            </div>
        </div>

      </div>
    </div>
  )
}

export default App