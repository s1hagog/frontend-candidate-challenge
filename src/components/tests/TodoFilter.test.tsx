import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '../../utils/test-utils'
import TodoFilter from '../TodoFilter'

const mockLocalStorage = {
  getItem: jest.fn<string, [string]>(),
  setItem: jest.fn<void, [string, string]>(),
}

describe('test TodoFilter.tsx', () => {
  describe('test empty store', () => {
    it('renders with no filters setup)', () => {
      renderWithProviders(<TodoFilter />)

      expect(
        screen.getByPlaceholderText(/enter the title.../i),
      ).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/enter the title.../i)).toHaveValue('')
      expect(
        screen.getByPlaceholderText(/enter the description.../i),
      ).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText(/enter the description.../i),
      ).toHaveValue('')
      expect(screen.getByRole('combobox')).toBeInTheDocument()
      expect(screen.getByRole('combobox')).toHaveValue('')
      expect(
        screen.getByRole('button', { name: /search/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /reset filters/i }),
      ).toBeInTheDocument()
    })
  })

  describe('test preset store', () => {
    it('renders with preset storage option', () => {
      renderWithProviders(<TodoFilter />, {
        preloadedState: {
          todos: {
            todo: null,
            todos: [],
            totalCount: 0,
            filters: {
              title: 'Filter title',
              description: 'Filter description',
              status: 'In Progress',
            },
            todoServiceKey: 'local-storage',
          },
        },
      })

      expect(screen.getByDisplayValue('Filter title')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Filter description')).toBeInTheDocument()
      expect(screen.getByRole('combobox')).toHaveValue('In Progress')
    })
  })

  describe('test interactions', () => {
    it('updates filters', () => {
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      })
      renderWithProviders(<TodoFilter />)

      fireEvent.change(screen.getByPlaceholderText(/enter the title.../i), {
        target: { value: 'test title' },
      })
      fireEvent.change(
        screen.getByPlaceholderText(/enter the description.../i),
        {
          target: { value: 'test description' },
        },
      )
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'In Progress' },
      })

      fireEvent.click(screen.getByRole('button', { name: /search/i }))

      // because we refetch from todoService we actually can check for getItem to be called
      expect(mockLocalStorage.getItem).toHaveBeenCalled()
    })

    it('reset filters', () => {
      renderWithProviders(<TodoFilter />, {
        preloadedState: {
          todos: {
            todo: null,
            todos: [],
            totalCount: 0,
            filters: {
              title: 'Filter title',
              description: 'Filter description',
              status: 'In Progress',
            },
            todoServiceKey: 'local-storage',
          },
        },
      })

      fireEvent.click(screen.getByRole('button', { name: /reset filters/i }))

      expect(screen.getByPlaceholderText(/enter the title.../i)).toHaveValue('')
      expect(
        screen.getByPlaceholderText(/enter the description.../i),
      ).toHaveValue('')
      expect(screen.getByRole('combobox')).toHaveValue('')
    })
  })
})
