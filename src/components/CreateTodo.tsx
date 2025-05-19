import { useState } from 'react'
import { useAppDispatch } from '../hooks'
import { addTodo } from '../reducers/todos'
import { CreateTodoRequest, TodoStatus } from '../types'
import Popup from './Popup'

interface CreateTodoProps {
  closeHandler: () => void
}

const statusOptions: TodoStatus[] = ['To Do', 'In Progress', 'Done']

const CreateTodo = ({ closeHandler }: CreateTodoProps) => {
  const dispatch = useAppDispatch()

  const [todo, setTodo] = useState<CreateTodoRequest>({
    title: '',
    description: '',
    status: 'To Do',
  })

  const [errors, setErrors] = useState<{
    title?: string
    description?: string
  }>({
    title: 'Title must be at least 3 characters',
    description: 'Description must be under 255 characters',
  })

  const validate = (updated: Partial<CreateTodoRequest>) => {
    const { title = todo.title, description = todo.description } = updated
    const newErrors: typeof errors = {}

    if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    } else if (title.length > 32) {
      newErrors.title = 'Title must be less than 32 characters'
    }

    if (description.length > 255) {
      newErrors.description = 'Description must be under 255 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const updateField = <K extends keyof CreateTodoRequest>(
    key: K,
    value: CreateTodoRequest[K],
  ) => {
    const updated = { ...todo, [key]: value }
    setTodo(updated)
  }

  const handleSubmit = () => {
    if (!validate(todo)) return
    dispatch(addTodo(todo))
    closeHandler()
  }

  return (
    <Popup onClose={closeHandler}>
      <div className="create-todo-form">
        <h2 style={{ marginBottom: '10px' }}>Create New Todo</h2>

        <input
          className="todo-input"
          type="text"
          placeholder="Title"
          value={todo.title}
          onChange={(e) => updateField('title', e.target.value)}
        />
        {errors.title && <p className="error-text">{errors.title}</p>}

        <input
          className="todo-input"
          style={{ marginTop: '6px' }}
          type="text"
          placeholder="Description"
          value={todo.description}
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
              value={todo.status}
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
        >
          Create
        </button>
      </div>
    </Popup>
  )
}

export default CreateTodo
