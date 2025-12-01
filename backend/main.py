from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session

# 导入我们刚才写的两个文件
from database import SessionLocal, engine
import models

# --- 关键步骤：自动在数据库里建表 ---
# 这行代码会去 models.py 找所有继承了 Base 的类，并在数据库里建表
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CORS 配置 (和之前一样) ---
origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

# --- Pydantic 模型 (给前端看的) ---
# 注意：我们稍微把 id 改成了可选，因为创建时不需要传 id
class TodoSchema(BaseModel):
    id: int
    title: str
    is_completed: bool

    #这一行配置是为了让 Pydantic 能读取 SQLAlchemy 的数据对象
    class Config:
        from_attributes = True 

class TodoCreate(BaseModel):
    title: str
    is_completed: bool = False

# --- 依赖项：获取数据库会话 ---
# 这就是一个"借还书"的过程：借你数据库连接 -> 你用完 -> 我帮你关掉
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API 接口 (CRUD) ---

# [Read] 获取所有
@app.get("/todos", response_model=List[TodoSchema])
def get_todos(db: Session = Depends(get_db)): # 注入 db
    # 相当于 SQL: SELECT * FROM todos;
    todos = db.query(models.TodoDB).all()
    return todos

# [Create] 创建
@app.post("/todos", response_model=TodoSchema)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    # 1. 创建数据库模型实例
    db_todo = models.TodoDB(title=todo.title, is_completed=todo.is_completed)
    # 2. 添加到会话
    db.add(db_todo)
    # 3. 提交 (真正的保存到文件)
    db.commit()
    # 4. 刷新 (把生成的 id 拿回来)
    db.refresh(db_todo)
    return db_todo

# [Delete] 删除
@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    # 查找
    todo = db.query(models.TodoDB).filter(models.TodoDB.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # 删除并提交
    db.delete(todo)
    db.commit()
    return {"message": "Todo deleted"}

# [Update] 修改状态 (选做，为了完整性加上)
@app.put("/todos/{todo_id}", response_model=TodoSchema)
def update_todo(todo_id: int, updated_todo: TodoCreate, db: Session = Depends(get_db)):
    todo = db.query(models.TodoDB).filter(models.TodoDB.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todo.title = updated_todo.title
    todo.is_completed = updated_todo.is_completed
    db.commit()
    db.refresh(todo)
    return todo