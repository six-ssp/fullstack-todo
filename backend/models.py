from sqlalchemy import Column, Integer, String, Boolean
from database import Base

# 这代表数据库里的一张表，表名叫 "todos"
class TodoDB(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True) # 主键，自动生成 1, 2, 3...
    title = Column(String, index=True)                 # 标题
    is_completed = Column(Boolean, default=False)      # 是否完成