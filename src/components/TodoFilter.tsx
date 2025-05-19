import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchTodos, selectFilters, setFilters } from '../reducers/todos'
import { GetTodosRequest, TodoStatus } from '../types'

const statusOptions: TodoStatus[] = ['To Do', 'In Progress', 'Done']

function TodoFilter() {
  const dispatch = useAppDispatch()
  const storeFilters = useAppSelector(selectFilters)

  const [filters, setLocalFilters] = useState<GetTodosRequest>({
    title: '',
    description: '',
    status: undefined,
  })

  // when we change between local storage and cookie storage, we also dispatch reset filters.
  // so this catches change to filters in the store
  useEffect(() => {
    setLocalFilters(storeFilters)
  }, [storeFilters])

  const updateFilter = (name: keyof GetTodosRequest, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
    }))
  }

  const handleSearch = () => {
    dispatch(setFilters(filters))
    dispatch(fetchTodos())
  }

  const handleReset = () => {
    setLocalFilters({
      title: '',
      description: '',
      status: undefined,
    })
    dispatch(
      setFilters({
        title: '',
        description: '',
        status: undefined,
      }),
    )
    dispatch(fetchTodos())
  }

  return (
    <div className="container">
      <div
        style={{
          marginTop: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <input
            className="todo-input"
            type="text"
            style={{
              marginRight: '10px',
            }}
            placeholder="Enter the Title..."
            value={filters.title || ''}
            onChange={(e) => updateFilter('title', e.target.value)}
          />
          <input
            className="todo-input"
            type="text"
            placeholder="Enter the Description..."
            value={filters.description || ''}
            onChange={(e) => updateFilter('description', e.target.value)}
          />
          <div className="select-wrapper">
            <select
              value={filters.status || ''}
              onChange={(e) => updateFilter('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button
            className="button-search"
            onClick={handleSearch}
            style={{
              marginTop: 0,
            }}
          >
            Search
          </button>
          <button
            className="button-search"
            style={{
              background: '#3e3e93',
              marginTop: 0,
            }}
            onClick={handleReset}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default TodoFilter
