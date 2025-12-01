from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class UserProfile(UserResponse):
    todo_count: int


class AuthResponse(BaseModel):
    user: UserResponse
    token: str


# Todo Schemas
class TodoBase(BaseModel):
    title: str


class TodoCreate(TodoBase):
    pass


class TodoUpdate(BaseModel):
    completed: bool


class TodoResponse(TodoBase):
    id: int
    completed: bool
    created_at: datetime

    class Config:
        from_attributes = True
