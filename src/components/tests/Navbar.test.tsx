import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '../../utils/test-utils'
import Navbar from '../Navbar'

const mockLocalStorage = {
  getItem: jest.fn<string, [string]>(),
  setItem: jest.fn<void, [string, string]>(),
}

describe('test Navbar.tsx', () => {
  describe('test empty store', () => {
    it('renders with default storage option', () => {
      renderWithProviders(<Navbar />)

      expect(
        screen.getByRole('button', {
          name: /flush todos/i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByRole('combobox')).toHaveValue('local-storage')
    })

    it('has both storage options', () => {
      renderWithProviders(<Navbar />)
      expect(screen.getAllByRole('option')).toHaveLength(2)
      expect(screen.getAllByRole('option')[0]).toHaveValue('local-storage')
      expect(screen.getAllByRole('option')[1]).toHaveValue('cookies')
    })
  })

  describe('test preset store', () => {
    it('renders with preset storage option', () => {
      renderWithProviders(<Navbar />, {
        preloadedState: {
          todos: {
            todo: null,
            todos: [],
            totalCount: 0,
            filters: {},
            todoServiceKey: 'cookies',
          },
        },
      })

      expect(
        screen.getByRole('button', {
          name: /flush todos/i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByRole('combobox')).toHaveValue('cookies')
    })
  })

  describe('test interactions', () => {
    it('flushes todos', () => {
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
      })
      renderWithProviders(<Navbar />)

      fireEvent.click(screen.getByRole('button', { name: /flush todos/i }))

      expect(mockLocalStorage.setItem).toHaveBeenCalled()
      expect(mockLocalStorage.setItem.mock.calls[0][0]).toBe('Todos')
    })

    it('changes storage', () => {
      renderWithProviders(<Navbar />)
      expect(screen.getByRole('combobox')).toHaveValue('local-storage')

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'cookies' },
      })
      expect(screen.getByRole('combobox')).toHaveValue('cookies')
    })
  })
})
