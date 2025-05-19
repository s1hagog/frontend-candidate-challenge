import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '../../utils/test-utils'
import CreateTodo from '../CreateTodo'

const mockCloseHandler = jest.fn()

const mockLocalStorage = {
  getItem: jest.fn<string, [string]>(),
  setItem: jest.fn<void, [string, string]>(),
}

describe('test CreatTodo.tsx', () => {
  it('renders', () => {
    renderWithProviders(<CreateTodo closeHandler={mockCloseHandler} />)

    expect(
      screen.getByRole('heading', { level: 2, name: /create new todo/i }),
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument()
    expect(screen.getByText('Status:')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
  })

  it('has inputs working', () => {
    renderWithProviders(<CreateTodo closeHandler={mockCloseHandler} />)

    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'Test Value' },
    })
    expect(screen.getByPlaceholderText('Title')).toHaveValue('Test Value')
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'Test Description' },
    })
    expect(screen.getByPlaceholderText('Description')).toHaveValue(
      'Test Description',
    )
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'In Progress' },
    })
    expect(screen.getByRole('combobox')).toHaveValue('In Progress')
  })

  it('creates a new todo if inputs are valid', () => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })

    renderWithProviders(<CreateTodo closeHandler={mockCloseHandler} />)

    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'Test Value' },
    })
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'Test Description' },
    })
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'In Progress' },
    })
    fireEvent.click(screen.getByRole('button', { name: /create/i }))

    expect(mockLocalStorage.setItem).toHaveBeenCalled()
    expect(mockLocalStorage.setItem.mock.calls[0][0]).toBe('Todos')
  })

  it('does not create a todo if validation did not pass', () => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })

    renderWithProviders(<CreateTodo closeHandler={mockCloseHandler} />)

    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: '123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'q'.repeat(256) },
    })
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'In Progress' },
    })
    fireEvent.click(screen.getByRole('button', { name: /create/i }))

    expect(mockLocalStorage.setItem).not.toHaveBeenCalled()
  })
})
