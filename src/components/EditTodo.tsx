import { useState } from 'react'
import { useAppDispatch } from '../hooks'
import { removeTodo, updateTodo } from '../reducers/todos'
import { Todo, TodoStatus, UpdateTodoRequest } from '../types'
import Popup from './Popup'

interface EditTodoProps {
  todo: Todo
  closeHandler: () => void
}

const statusOptions: TodoStatus[] = ['To Do', 'In Progress', 'Done']

const EditTodo = ({ todo, closeHandler }: EditTodoProps) => {
  const dispatch = useAppDispatch()

  const [localTodo, setLocalTodo] = useState<Todo>({ ...todo })

  const [errors, setErrors] = useState<{
    title?: string
    description?: string
  }>({})

  const validate = (updated: Partial<UpdateTodoRequest>) => {
    const { title = localTodo.title, description = localTodo.description } =
      updated
    const newErrors: typeof errors = {}

    if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    } else if (title.length > 32) {
      newErrors.title = 'Title must be less than 32 characters'
    }

    if (description && description.length > 255) {
      newErrors.description = 'Description must be under 255 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const updateField = <K extends keyof UpdateTodoRequest>(
    key: K,
    value: UpdateTodoRequest[K],
  ) => {
    const updated = { ...todo, [key]: value }
    setLocalTodo(updated)
    validate({ [key]: value })
  }

  const handleSubmit = () => {
    if (!validate(todo)) return
    dispatch(updateTodo({ id: todo.id, body: localTodo }))
    closeHandler()
  }

  const handleDelete = () => {
    if (!validate(todo)) return
    dispatch(removeTodo(todo.id))
    closeHandler()
  }

  return (
    <Popup onClose={closeHandler}>
      <div className="create-todo-form">
        <h2 style={{ marginBottom: '10px' }}>{todo.title}</h2>

        {/* Read-only fields */}
        <div
          style={{
            marginBottom: '12px',
            fontSize: '14px',
            color: '#555',
          }}
        >
          <p>
            <strong>Todo ID:</strong> {todo.id}
          </p>
          <p>
            <strong>Created At:</strong> {todo.createdAt}
          </p>
          <p>
            <strong>Updated At:</strong> {todo.updatedAt}
          </p>
        </div>
        <input
          className="todo-input"
          type="text"
          placeholder="Title"
          value={localTodo.title}
          onChange={(e) => updateField('title', e.target.value)}
        />
        {errors.title && <p className="error-text">{errors.title}</p>}

        <input
          className="todo-input"
          style={{ marginTop: '6px' }}
          type="text"
          placeholder="Description"
          value={localTodo.description}
          onChange={(e) => updateField('description', e.target.value)}
        />
        {errors.description && (
          <p className="error-text">{errors.description}</p>
        )}

        <div className="select-row" style={{ marginTop: '10px' }}>
          <p style={{ width: '80px' }}>Status:</p>
          <div className="select-wrapper">
            <select
              style={{ width: '150px' }}
              value={localTodo.status}
              onChange={(e) =>
                updateField('status', e.target.value as TodoStatus)
              }
              data-testid="select-todo-status"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          className="button-create"
          style={{
            width: '100%',
            marginTop: '20px',
            marginLeft: 0,
          }}
          onClick={handleSubmit}
          disabled={!!errors.title || !!errors.description}
        >
          Save Changes
        </button>

        <button
          className="button-create"
          style={{
            width: '100%',
            marginTop: '10px',
            marginLeft: 0,
            background: '#ad1f1f',
          }}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </Popup>
  )
}

export default EditTodo
