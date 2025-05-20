// does not seem to correctly work with playwright
/* eslint-disable testing-library/prefer-screen-queries */

import { expect, Page, test } from '@playwright/test'
import {
  mockTodoCreateFields,
  mockTodoUpdateFields,
} from './fixtures/todoFields'
import { createTodoProcess, updateTodoProcess } from './utils'

test.describe.configure({ mode: 'serial' })

let page: Page

test.describe('test updating todo', () => {
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

  test('update todo with new fields', async () => {
    await updateTodoProcess(page, mockTodoCreateFields, mockTodoUpdateFields)
  })

  test('check todo is in the correct column', async () => {
    const todoColumn = page.locator('h4:has-text("To Do") + div')
    const doneColumn = page.locator('h4:has-text("Done") + div')

    await expect(
      todoColumn.getByText(mockTodoUpdateFields.title!),
    ).not.toBeVisible()
    await expect(
      doneColumn.getByText(mockTodoUpdateFields.title!),
    ).toBeVisible()
  })
})
