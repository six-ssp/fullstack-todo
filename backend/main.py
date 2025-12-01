from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware # <--- 直接从 fastapi 导入，不需要 pip install
from pydantic import BaseModel
from typing import List

app = FastAPI()

# --- 核心配置：解决跨域问题 (CORS) ---
# 这段代码允许前端(3000端口)访问后端(8000端口)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ------------------------------------

class Todo(BaseModel):
    id: int
    title: str
    is_completed: bool = False

todos_db = []

@app.get("/todos", response_model=List[Todo])
def get_todos():
    return todos_db

@app.post("/todos", response_model=Todo)
def create_todo(todo: Todo):
    todos_db.append(todo)
    return todo

@app.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, updated_todo: Todo):
    for index, todo in enumerate(todos_db):
        if todo.id == todo_id:
            todos_db[index] = updated_todo
            return updated_todo
    raise HTTPException(status_code=404, detail="Todo not found")

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    for index, todo in enumerate(todos_db):
        if todo.id == todo_id:
            todos_db.pop(index)
            return {"message": "Todo deleted successfully"}
    raise HTTPException(status_code=404, detail="Todo not found")