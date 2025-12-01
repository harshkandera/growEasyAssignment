'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { todoAPI, authAPI, removeToken, isAuthenticated } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Circle, Trash2, Plus, LogOut, User } from 'lucide-react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [todosData, profileData] = await Promise.all([
        todoAPI.getAll(),
        authAPI.getProfile(),
      ]);
      setTodos(todosData);
      setUser(profileData);
    } catch (err: any) {
      if (err.message.includes('Could not validate credentials')) {
        handleLogout();
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      const newTodo = await todoAPI.create(newTodoTitle);
      setTodos([newTodo, ...todos]);
      setNewTodoTitle('');
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    try {
      const updatedTodo = await todoAPI.update(id, !completed);
      setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await todoAPI.delete(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-4xl space-y-6 p-6">
        {/* Header Card */}
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Welcome, {user?.name}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => router.push('/profile')}
                  className="h-10"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleLogout}
                  className="h-10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl md:text-4xl font-bold mb-1">{todos.length}</p>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-500/10">
                <p className="text-3xl md:text-4xl font-bold text-blue-500 mb-1">{activeCount}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-500/10">
                <p className="text-3xl md:text-4xl font-bold text-green-500 mb-1">{completedCount}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Todo Card */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleAddTodo} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="What needs to be done?"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                className="flex-1 h-11"
              />
              <Button type="submit" size="default" className="h-11 px-6">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Todos List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <Card>
              <CardContent className="p-16 text-center">
                <div className="flex justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center">
                    <Circle className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">No todos yet</h3>
                <p className="text-sm text-muted-foreground">
                  Add your first task to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            todos.map((todo) => (
              <Card
                key={todo.id}
                className="transition-all hover:shadow-md hover:border-border/80"
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleToggleTodo(todo.id, todo.completed)}
                      className="flex-shrink-0 transition-all hover:scale-110"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-base font-medium ${
                          todo.completed
                            ? 'line-through text-muted-foreground'
                            : 'text-foreground'
                        }`}
                      >
                        {todo.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(todo.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        {todos.length > 0 && (
          <div className="text-center py-6">
            {activeCount === 0 ? (
              <p className="text-base text-green-500 font-medium">
                ✨ All tasks completed! Great job!
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}