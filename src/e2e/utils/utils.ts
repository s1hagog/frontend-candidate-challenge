import { Page, expect } from '@playwright/test'

export const createTodoProcess = async (
  page: Page,
  status: 'To Do' | 'In Progress' | 'Done' = 'To Do',
) => {
  const createButton = page.getByRole('button', { name: /create new todo/i })
  await createButton.click()

  expect(
    page.getByRole('heading', {
      level: 2,
      name: /create new todo/i,
    }),
  ).toBeVisible()

  await page
    .getByPlaceholder('Title', {
      exact: true,
    })
    .fill('Another Playwright')
  await page
    .getByPlaceholder('Description', {
      exact: true,
    })
    .fill('playwright description')
  await page.getByTestId('select-todo-status').selectOption(status)
  await page.getByRole('button', { name: 'Create', exact: true }).click()
}

export const updateTodoProcess = async (page: Page) => {
  const todoClickable = page.getByText('Another Playwright', { exact: true })
  await todoClickable.click()

  expect(
    page.getByRole('button', {
      name: 'Save Changes',
      exact: true,
    }),
  ).toBeVisible()

  await page
    .getByPlaceholder('Title', {
      exact: true,
    })
    .fill('New Playwright')
  await page.getByRole('button', { name: 'Save Changes', exact: true }).click()
}
