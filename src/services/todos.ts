import { nanoid } from '@reduxjs/toolkit'
import {
  CreateTodoRequest,
  GetTodosRequest,
  Todo,
  TodosResponse,
  UpdateTodoRequest,
} from '../types'

export abstract class TodoService {
  abstract getTodo: (id: string) => Todo | undefined
  abstract getTodos: (req: GetTodosRequest) => TodosResponse
  abstract createTodo: (body: CreateTodoRequest) => Todo
  abstract updateTodo: (id: string, body: UpdateTodoRequest) => void
  abstract deleteTodo: (id: string) => void
  abstract flushTodos: () => void

  // I ve decided to leave this feature out to better display that we are saving to different storages
  // abstract extractMigrateData: () => { todos: Todo[] }
  // abstract insertMigrationData: (migrationData: { todos: Todo[] }) => void
}

export class LocalTodoService implements TodoService {
  private storageKey = 'Todos'

  private saveAll(todos: Todo[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(todos))
  }

  private getAllTodos(): Todo[] {
    const raw = localStorage.getItem(this.storageKey)
    return raw ? JSON.parse(raw) : []
  }

  getTodo(id: string): Todo | undefined {
    const todos = this.getAllTodos()
    return todos.find((todo) => todo.id === id)
  }

  getTodos(req?: GetTodosRequest): TodosResponse {
    const todos = this.getAllTodos()

    const filtered = todos.filter((todo) => {
      if (
        req?.title &&
        !todo.title.toLowerCase().includes(req.title.toLowerCase())
      ) {
        return false
      }
      if (
        req?.description &&
        !todo.description.toLowerCase().includes(req.description.toLowerCase())
      ) {
        return false
      }
      if (req?.status && todo.status !== req.status) {
        return false
      }
      return true
    })

    return {
      todos: filtered,
      totalCount: todos.length,
    }
  }

  createTodo(body: CreateTodoRequest): Todo {
    const newTodo: Todo = {
      id: nanoid(),
      ...body,
      createdAt: new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }),
      updatedAt: new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }),
    }
    const todos = this.getAllTodos()
    todos.push(newTodo)
    this.saveAll(todos)
    return newTodo
  }

  updateTodo(id: string, body: UpdateTodoRequest): void {
    const todos = this.getAllTodos().map((t) =>
      t.id === id
        ? {
            ...t,
            ...body,
            updatedAt: new Date().toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            }),
          }
        : t,
    )
    this.saveAll(todos)
  }

  deleteTodo(id: string): void {
    const todos = this.getAllTodos().filter((t) => t.id !== id)
    this.saveAll(todos)
  }

  flushTodos() {
    this.saveAll([])
  }

  // extractMigrateData() {
  //   const todos = this.getAllTodos()
  //   return { todos }
  // }

  // insertMigrationData({ todos }: { todos: Todo[] }) {
  //   this.saveAll(todos)
  // }
}

export class CookieTodoService implements TodoService {
  private cookieKey = 'Todos'
  private cookieExpDays = 1

  private setCookie(name: string, value: string, days: number) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = `expires=${date.toUTCString()}`
    document.cookie = `${name}=${value};${expires};path=/`
  }

  private getCookie(name: string): string {
    const nameEQ = `${name}=`
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return ''
  }

  private saveAll(todos: Todo[]) {
    this.setCookie(this.cookieKey, JSON.stringify(todos), this.cookieExpDays)
  }

  private getAllTodos(): Todo[] {
    const raw = this.getCookie(this.cookieKey)
    return raw ? JSON.parse(raw) : []
  }

  getTodo(id: string): Todo | undefined {
    const todos = this.getAllTodos()
    return todos.find((todo) => todo.id === id)
  }

  getTodos(req?: GetTodosRequest): TodosResponse {
    const todos = this.getAllTodos()

    const filtered = todos.filter((todo) => {
      if (
        req?.title &&
        !todo.title.toLowerCase().includes(req.title.toLowerCase())
      ) {
        return false
      }
      if (
        req?.description &&
        !todo.description.toLowerCase().includes(req.description.toLowerCase())
      ) {
        return false
      }
      if (req?.status && todo.status !== req.status) {
        return false
      }
      return true
    })

    return {
      todos: filtered,
      totalCount: todos.length,
    }
  }

  createTodo(body: CreateTodoRequest): Todo {
    const newTodo: Todo = {
      id: nanoid(),
      ...body,
      createdAt: new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }),
      updatedAt: new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }),
    }
    const todos = this.getAllTodos()
    todos.push(newTodo)
    this.saveAll(todos)
    return newTodo
  }

  updateTodo(id: string, body: UpdateTodoRequest): void {
    const todos = this.getAllTodos().map((t) =>
      t.id === id
        ? {
            ...t,
            ...body,
            updatedAt: new Date().toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            }),
          }
        : t,
    )
    this.saveAll(todos)
  }

  deleteTodo(id: string): void {
    const todos = this.getAllTodos().filter((t) => t.id !== id)
    this.saveAll(todos)
  }

  flushTodos() {
    this.saveAll([])
  }

  // extractMigrateData() {
  //   const todos = this.getAllTodos()
  //   return { todos }
  // }

  // insertMigrationData({ todos }: { todos: Todo[] }) {
  //   this.saveAll(todos)
  // }
}

export const createTodoService = (instance: TodoService) => {
  return instance
}
