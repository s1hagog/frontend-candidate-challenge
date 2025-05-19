import Navbar from '../components/Navbar'
import TodoFilter from '../components/TodoFilter'
import TodoList from '../components/TodoList'
import '../styles.scss'

const Home = () => {
  return (
    <div className="todoListApp">
      <Navbar />
      <TodoFilter />
      <TodoList />
    </div>
  )
}

export default Home
