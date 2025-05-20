import { CreateTodoRequest, UpdateTodoRequest } from '../../types'

export const mockManyTodoCreateFields: CreateTodoRequest[] = [
  {
    title: 'New Todo 1',
    description: 'Todo 1 description',
    status: 'To Do',
  },
  {
    title: 'New Todo 2',
    description: 'Todo 2 description',
    status: 'In Progress',
  },
  {
    title: 'New Todo 3',
    description: 'Todo 3 description',
    status: 'Done',
  },
]

export const mockTodoCreateFields = mockManyTodoCreateFields[0]

export const mockTodoUpdateFields: UpdateTodoRequest = {
  title: 'Updated Title Todo',
  description: 'Updated description',
  status: 'Done',
}
