// does not seem to correctly work with playwright
/* eslint-disable testing-library/prefer-screen-queries */

import { expect, Page, test } from '@playwright/test'
import { mockTodoCreateFields } from './fixtures/todoFields'
import { createTodoProcess } from './utils'

test.describe.configure({ mode: 'serial' })

let page: Page

test.describe('test deleting todo', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('ensure playwright works', async () => {
    await page.goto('/')

    await expect(page).toHaveTitle('Forsta - Forsta Do List')
  })

  test('creating new todo in To Do', async () => {
    await createTodoProcess(page, mockTodoCreateFields)
  })

  test('delete todo', async () => {
    await page.getByText(mockTodoCreateFields.title, { exact: true }).click()

    await page.getByRole('button', { name: 'Delete', exact: true }).click()
  })

  test('check todo is not in any column', async () => {
    const todoColumn = page.locator('h4:has-text("To Do") + div')
    const inProgressColumn = page.locator('h4:has-text("In Progress") + div')
    const doneColumn = page.locator('h4:has-text("Done") + div')

    await expect(
      todoColumn.getByText(mockTodoCreateFields.title!),
    ).not.toBeVisible()
    await expect(
      inProgressColumn.getByText(mockTodoCreateFields.title!),
    ).not.toBeVisible()
    await expect(
      doneColumn.getByText(mockTodoCreateFields.title!),
    ).not.toBeVisible()
  })
})
