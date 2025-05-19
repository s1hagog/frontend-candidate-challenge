import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import {
  fetchTodo,
  selectTodo,
  selectTodos,
  selectTotalCount,
} from '../reducers/todos'
import { TodoPartial, TodoStatus } from '../types'
import CreateTodo from './CreateTodo'
import EditTodo from './EditTodo'

const statusColumns: TodoStatus[] = ['To Do', 'In Progress', 'Done']

const Column = ({
  status,
  children,
}: {
  status: TodoStatus
  children: React.ReactNode
}) => {
  return (
    <div style={{ flex: 1 }}>
      <h4 style={{ textAlign: 'center', marginBottom: 10 }}>{status}</h4>
      <div
        style={{
          background: '#f8f8f8',
          padding: 10,
          borderRadius: 6,
          minHeight: 500,
          minWidth: 200,
        }}
      >
        {children}
      </div>
    </div>
  )
}

const TodoList = () => {
  const dispatch = useAppDispatch()
  const todos = useAppSelector(selectTodos)
  const todo = useAppSelector(selectTodo)
  const totalCount = useAppSelector(selectTotalCount)
  const [isCreatingTodo, setCreatingTodo] = useState(false)

  const [groupedTodos, setGroupedTodos] = useState<
    Record<TodoStatus, TodoPartial[]>
  >({
    'To Do': [],
    'In Progress': [],
    Done: [],
  })

  useEffect(() => {
    const grouped: Record<TodoStatus, TodoPartial[]> = {
      'To Do': [],
      'In Progress': [],
      Done: [],
    }
    todos.forEach((t) => {
      if (grouped[t.status]) grouped[t.status].push(t)
    })
    setGroupedTodos(grouped)
  }, [todos])

  const getTodoHandler = (id?: string) => {
    dispatch(fetchTodo(id || ''))
  }

  return (
    <div style={{ marginTop: 20 }}>
      {isCreatingTodo && (
        <CreateTodo closeHandler={() => setCreatingTodo(false)} />
      )}
      {todo && <EditTodo todo={todo} closeHandler={() => getTodoHandler()} />}

      <div className="container">
        <div
          className="flex-wrapper"
          style={{ justifyContent: 'space-between' }}
        >
          <button
            onClick={() => setCreatingTodo(true)}
            className="button-create"
            style={{
              marginLeft: 0,
            }}
          >
            Create New Todo
          </button>
        </div>

        <div
          className="todo-columns"
          style={{
            display: 'flex',
            gap: '20px',
            marginTop: '20px',
          }}
        >
          {statusColumns.map((status) => (
            <Column key={status} status={status}>
              {groupedTodos[status].length > 0 ? (
                groupedTodos[status].map((todo) => (
                  <div
                    key={todo.id}
                    onClick={() => getTodoHandler(todo.id)}
                    style={{
                      background: 'white',
                      padding: '8px',
                      marginBottom: '8px',
                      borderRadius: '4px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <strong>{todo.title}</strong>
                    <p style={{ fontSize: 12 }}>Updated: {todo.updatedAt}</p>
                  </div>
                ))
              ) : (
                <p
                  style={{
                    color: '#999',
                    textAlign: 'center',
                  }}
                >
                  No todos
                </p>
              )}
            </Column>
          ))}
        </div>
        <h3>{`Displaying ${todos.length} of ${totalCount}`}</h3>
      </div>
    </div>
  )
}

export default TodoList
