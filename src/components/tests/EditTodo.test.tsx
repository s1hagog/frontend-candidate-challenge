import { nanoid } from '@reduxjs/toolkit'
import { fireEvent, screen } from '@testing-library/react'
import { Todo } from '../../types'
import { renderWithProviders } from '../../utils/test-utils'
import EditTodo from '../EditTodo'

const mockCloseHandler = jest.fn()

const mockLocalStorage = {
  getItem: jest.fn<string, [string]>(),
  setItem: jest.fn<void, [string, string]>(),
}

const mockTodo: Todo = {
  id: nanoid(),
  title: 'Mock Todo',
  description: 'mock description',
  createdAt: 'May 17th, 2025',
  updatedAt: 'May 18th, 2025',
  status: 'Done',
}

describe('test EditTodo.tsx', () => {
  it('renders fields', () => {
    renderWithProviders(
      <EditTodo closeHandler={mockCloseHandler} todo={mockTodo} />,
    )

    expect(
      screen.getByRole('heading', { level: 2, name: 'Mock Todo' }),
    ).toBeInTheDocument()
    expect(screen.getByText(mockTodo.id)).toBeInTheDocument()
    expect(screen.getByText(mockTodo.createdAt)).toBeInTheDocument()
    expect(screen.getByText(mockTodo.updatedAt)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Title')).toHaveValue('Mock Todo')
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Description')).toHaveValue(
      'mock description',
    )
    expect(screen.getByText('Status:')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveValue('Done')
    expect(
      screen.getByRole('button', { name: /save changes/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('has inputs working', () => {
    renderWithProviders(
      <EditTodo closeHandler={mockCloseHandler} todo={mockTodo} />,
    )

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

  it('updates a todo if inputs are valid', () => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })

    renderWithProviders(
      <EditTodo closeHandler={mockCloseHandler} todo={mockTodo} />,
    )

    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'Test Value' },
    })
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'Test Description' },
    })
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'In Progress' },
    })
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    expect(mockLocalStorage.setItem).toHaveBeenCalled()
    expect(mockLocalStorage.setItem.mock.calls[0][0]).toBe('Todos')
  })

  it('does not create a todo if validation did not pass', () => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })

    renderWithProviders(
      <EditTodo closeHandler={mockCloseHandler} todo={mockTodo} />,
    )

    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: '123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'q'.repeat(256) },
    })
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'In Progress' },
    })
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    expect(mockLocalStorage.setItem).not.toHaveBeenCalled()
  })

  it('deletes a todo', () => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })

    renderWithProviders(
      <EditTodo closeHandler={mockCloseHandler} todo={mockTodo} />,
    )

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    expect(mockLocalStorage.setItem).toHaveBeenCalled()
    expect(mockLocalStorage.setItem.mock.calls[0][0]).toBe('Todos')
  })
})
