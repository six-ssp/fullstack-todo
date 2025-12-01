from fastapi import FastAPI

# 创建一个 App 实例
app = FastAPI()

# 定义一个路径操作装饰器
# 当用户访问根路径 "/" 时，执行下面的函数
@app.get("/")
def read_root():
    return {"message": "Hello, World! 这是一个 Todo App 的起点"}

# 定义另一个路径 /items
@app.get("/items")
def read_items():
    return {"todos": ["买牛奶", "写代码", "睡觉"]}