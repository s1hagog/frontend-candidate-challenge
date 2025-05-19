import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  CookieTodoService,
  createTodoService,
  LocalTodoService,
} from '../services'
import { RootState } from '../store'
import {
  CreateTodoRequest,
  GetTodosRequest,
  Todo,
  TodoPartial,
  UpdateTodoRequest,
} from '../types'
import { createAppAsyncThunk } from '../utils/createAppAsyncThunk'

export type TodoServiceKey = 'local-storage' | 'cookies'

export const isCookieServiceUsed = (serviceKey: TodoServiceKey) =>
  serviceKey === 'cookies'

const todoService = (serviceKey: TodoServiceKey) =>
  createTodoService(
    isCookieServiceUsed(serviceKey)
      ? new CookieTodoService()
      : new LocalTodoService(),
  )

export interface TodoState {
  todo: Todo | null
  todos: TodoPartial[]
  totalCount: number
  filters: GetTodosRequest
  todoServiceKey: TodoServiceKey
}

const initialState: TodoState = {
  todo: null,
  todos: [],
  totalCount: 0,
  filters: {
    title: '',
    description: '',
    status: undefined,
  },
  todoServiceKey: 'local-storage',
}

export const fetchTodos = createAppAsyncThunk(
  'todos/fetchTodos',
  async (_, { getState }) => {
    const { todoServiceKey, filters } = getState().todos
    return todoService(todoServiceKey).getTodos(filters)
  },
)

export const fetchTodo = createAppAsyncThunk(
  'todos/fetchTodo',
  async (id: string, { getState }) => {
    const { todoServiceKey } = getState().todos
    if (!id) return undefined
    return todoService(todoServiceKey).getTodo(id)
  },
)

export const addTodo = createAppAsyncThunk(
  'todos/addTodo',
  async (body: CreateTodoRequest, { getState }) => {
    const { todoServiceKey } = getState().todos
    return todoService(todoServiceKey).createTodo(body)
  },
)

export const updateTodo = createAppAsyncThunk(
  'todos/updateTodo',
  async (
    { id, body }: { id: string; body: UpdateTodoRequest },
    { getState },
  ) => {
    const { todoServiceKey } = getState().todos
    todoService(todoServiceKey).updateTodo(id, body)
    return { id, body }
  },
)

export const removeTodo = createAppAsyncThunk(
  'todos/deleteTodo',
  async (id: string, { getState }) => {
    const { todoServiceKey } = getState().todos
    todoService(todoServiceKey).deleteTodo(id)
    return id
  },
)

export const flushTodos = createAppAsyncThunk(
  'todos/flushTodos',
  async (_, { getState }) => {
    const { todoServiceKey } = getState().todos
    todoService(todoServiceKey).flushTodos()
    return []
  },
)

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    changeTodoServiceKey: (state, action: PayloadAction<TodoServiceKey>) => {
      state.todoServiceKey = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<GetTodosRequest>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = {
        title: '',
        description: '',
        status: undefined,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload.todos
        state.totalCount = action.payload.totalCount
      })
      .addCase(fetchTodo.fulfilled, (state, action) => {
        state.todo = action.payload ?? null
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos = [...state.todos, action.payload]
        state.totalCount += 1
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) {
          state.todos[index] = {
            ...state.todos[index],
            ...action.payload.body,
          }
        }
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((t) => t.id !== action.payload)
        state.totalCount -= 1
      })
      .addCase(flushTodos.fulfilled, (state) => {
        state.todos = []
        state.totalCount = 0
        state.todo = null
      })
  },
})

export const { setFilters, resetFilters, changeTodoServiceKey } =
  todoSlice.actions

export const selectTodos = (state: RootState) => state.todos.todos
export const selectTodo = (state: RootState) => state.todos.todo
export const selectTodoServiceKey = (state: RootState) =>
  state.todos.todoServiceKey
export const selectTotalCount = (state: RootState) => state.todos.totalCount
export const selectFilters = (state: RootState) => state.todos.filters

export default todoSlice.reducer
