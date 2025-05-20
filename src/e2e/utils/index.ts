import { Page } from '@playwright/test'
import { CreateTodoRequest, UpdateTodoRequest } from '../../types'

export const createTodoProcess = async (
  page: Page,
  { title, description, status }: CreateTodoRequest,
) => {
  const createButton = page.getByRole('button', { name: /create new todo/i })
  await createButton.click()

  await page
    .getByPlaceholder('Title', {
      exact: true,
    })
    .fill(title)
  await page
    .getByPlaceholder('Description', {
      exact: true,
    })
    .fill(description)
  await page.getByTestId('select-todo-status').selectOption(status)
  await page.getByRole('button', { name: 'Create', exact: true }).click()
}

export const updateTodoProcess = async (
  page: Page,
  selectedTodo: CreateTodoRequest,
  { title, description, status }: UpdateTodoRequest,
) => {
  const todoClickable = page.getByText(selectedTodo.title, { exact: true })
  await todoClickable.click()

  await page.locator('input[value="' + selectedTodo.title + '"]').fill(title!)
  await page.waitForTimeout(500)
  await page.locator('input[value="' + selectedTodo.description + '"]').click()
  await page.waitForTimeout(500)
  await page.getByTestId('select-todo-status').selectOption(status!)
  await page.waitForTimeout(500)

  await page
    .locator('input[value="' + selectedTodo.description + '"]')
    .fill(description!)
  await page.getByTestId('select-todo-status').selectOption(status!)
  await page.getByRole('button', { name: 'Save Changes', exact: true }).click()
}
