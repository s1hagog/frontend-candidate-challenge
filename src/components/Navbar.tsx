import { useState } from 'react'
import { TodoServiceKeyEnum } from '../constants'
import { useAppDispatch, useAppSelector } from '../hooks'
import {
  changeTodoServiceKey,
  fetchTodos,
  flushTodos,
  selectTodoServiceKey,
  setFilters,
} from '../reducers/todos'

const Navbar = () => {
  const dispatch = useAppDispatch()
  const todoServiceKey = useAppSelector(selectTodoServiceKey)
  const [localTodoServiceKey, setLocalTodoServiceKey] = useState(todoServiceKey)

  return (
    <nav className="navbar">
      <div className="forsta-logo" />
      <div>
        <button
          className="button-search"
          style={{
            width: '100px',
            backgroundColor: '#d35353',
            marginRight: '30px',
          }}
          onClick={() => {
            dispatch(flushTodos())
          }}
        >
          Flush todos
        </button>
        <div className="select-wrapper">
          <select
            value={localTodoServiceKey}
            onChange={(e) => {
              dispatch(
                changeTodoServiceKey(e.target.value as TodoServiceKeyEnum),
              )
              dispatch(fetchTodos())
              dispatch(
                setFilters({
                  title: '',
                  description: '',
                  status: undefined,
                }),
              )
              setLocalTodoServiceKey(e.target.value as TodoServiceKeyEnum)
            }}
            data-testid="select-change-storage"
          >
            <option value={TodoServiceKeyEnum.LOCAL_STORAGE}>
              💾 Local Storage
            </option>
            <option value={TodoServiceKeyEnum.COOKIES}>🍪 Cookie </option>
          </select>
        </div>
        <div
          style={{
            position: 'absolute',
            width: '70px',
            top: '-10px',
            right: 0,
            fontSize: '8px',
            color: '#717171',
            textAlign: 'right',
          }}
        >
          Choose where to store your todos
        </div>
      </div>
    </nav>
  )
}

export default Navbar
