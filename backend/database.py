from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 1. 定义数据库文件的位置
# sqlite:///./todos.db 表示在当前目录下生成一个叫 todos.db 的文件
SQLALCHEMY_DATABASE_URL = "sqlite:///./todos.db"

# 2. 创建引擎 (Engine)
# check_same_thread=False 是 SQLite 特有的配置，允许在多线程中使用
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. 创建会话工厂 (SessionLocal)
# 以后我们要操作数据库，就找 SessionLocal 要一个"会话"
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. 创建基类 (Base)
# 以后所有的数据库模型（表）都要继承这个类
Base = declarative_base()