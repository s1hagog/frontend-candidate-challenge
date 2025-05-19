export type TodoStatus = 'Done' | 'In Progress' | 'To Do'

export interface Todo {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  status: TodoStatus
}

export interface TodoRequest
  extends Pick<Todo, 'title' | 'description' | 'status'> {}

export interface TodoPartial extends Omit<Todo, 'description'> {}

export interface TodosResponse {
  todos: TodoPartial[]
  totalCount: number
}

export interface GetTodosRequest extends Partial<TodoRequest> {}

export interface CreateTodoRequest extends TodoRequest {}

export interface UpdateTodoRequest extends Partial<TodoRequest> {}
