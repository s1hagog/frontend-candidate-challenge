import { nanoid } from '@reduxjs/toolkit'
import { act, screen } from '@testing-library/react'
import { fetchTodos } from '../../reducers/todos'
import { Todo } from '../../types/todo'
import { renderWithProviders } from '../../utils/test-utils'
import TodoList from '../TodoList'

const mockTodos: Todo[] = [
  {
    id: nanoid(),
    title: 'Mock Todo 1',
    description: 'sample description',
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
    status: 'Done',
  },
  {
    id: nanoid(),
    title: 'Mock Todo 2',
    description: 'another description',
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
    status: 'Done',
  },
]

const mockLocalStorage = {
  getItem: jest.fn<string, [string]>(),
  setItem: jest.fn<void, [string, string]>(),
}

const mockCookieTodos = () => {
  const todos = JSON.stringify(mockTodos)
  const date = new Date()
  date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `Todos=${todos};${expires};path=/`
}

describe('test TodoList.tsx', () => {
  describe('test empty store', () => {
    it('has no todos', () => {
      renderWithProviders(<TodoList />)
      // for each column
      expect(screen.queryAllByText(/no todos/i)).toHaveLength(3)
      expect(screen.getByText(/displaying 0 of 0/i)).toBeInTheDocument()
    })

    it('has create todo button', () => {
      renderWithProviders(<TodoList />)
      expect(screen.getByText(/create new todo/i)).toBeInTheDocument()
    })
  })

  describe('test preloaded store', () => {
    it('has todos', () => {
      renderWithProviders(<TodoList />, {
        preloadedState: {
          todos: {
            todo: null,
            todos: mockTodos,
            totalCount: mockTodos.length,
            filters: {},
            todoServiceKey: 'local-storage',
          },
        },
      })

      expect(screen.getByText(/displaying 2 of 2/i)).toBeInTheDocument()
      expect(screen.getByText('Mock Todo 1')).toBeInTheDocument()
      expect(screen.getByText('Mock Todo 2')).toBeInTheDocument()
    })

    it('has create todo', () => {
      renderWithProviders(<TodoList />)
      expect(screen.getByText(/create new todo/i)).toBeInTheDocument()
    })
  })

  describe('test with mocked local storage', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      })

      mockLocalStorage.getItem.mockClear()
      mockLocalStorage.setItem.mockClear()
    })

    it('renders empty TodoList when localStorage is empty', async () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([]))

      const { store } = renderWithProviders(<TodoList />)

      await act(async () => {
        await store.dispatch(fetchTodos())
      })

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('Todos')

      expect(screen.queryAllByText(/no todos/i)).toHaveLength(3)
      expect(screen.getByText(/displaying 0 of 0/i)).toBeInTheDocument()
    })

    it('renders couple todos from localStorage on init', async () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTodos))

      const { store } = renderWithProviders(<TodoList />)

      await act(async () => {
        await store.dispatch(fetchTodos())
      })

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('Todos')

      expect(screen.getByText(/displaying 2 of 2/i)).toBeInTheDocument()
      expect(screen.getByText('Mock Todo 1')).toBeInTheDocument()
      expect(screen.getByText('Mock Todo 2')).toBeInTheDocument()
    })
  })

  describe('test with mocked cookies', () => {
    it('renders empty TodoList when cookie storage is empty', async () => {
      Object.defineProperty(document, 'cookie', {
        value: '',
        writable: true,
      })

      const { store } = renderWithProviders(<TodoList />, {
        preloadedState: {
          todos: {
            todo: null,
            todos: [],
            totalCount: mockTodos.length,
            filters: {},
            todoServiceKey: 'cookies',
          },
        },
      })

      await act(async () => {
        await store.dispatch(fetchTodos())
      })

      expect(screen.queryAllByText(/no todos/i)).toHaveLength(3)
      expect(screen.getByText(/displaying 0 of 0/i)).toBeInTheDocument()
    })

    it('renders couple todos from cookie storage on init', async () => {
      Object.defineProperty(document, 'cookie', {
        value: mockCookieTodos(),
        writable: true,
      })

      const { store } = renderWithProviders(<TodoList />, {
        preloadedState: {
          todos: {
            todo: null,
            todos: mockTodos,
            totalCount: mockTodos.length,
            filters: {},
            todoServiceKey: 'cookies',
          },
        },
      })

      await act(async () => {
        await store.dispatch(fetchTodos())
      })

      expect(screen.getByText(/displaying 2 of 2/i)).toBeInTheDocument()
      expect(screen.getByText('Mock Todo 1')).toBeInTheDocument()
      expect(screen.getByText('Mock Todo 2')).toBeInTheDocument()
    })
  })
})
