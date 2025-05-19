import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import { fetchTodos } from './reducers/todos'
import './reset.scss'
import { AppRoutes } from './routes'
import { store } from './store'
import './styles.scss'

export default function App() {
  store.dispatch(fetchTodos())

  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  )
}
