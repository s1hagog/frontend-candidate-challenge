// does not seem to correctly work with playwright
/* eslint-disable testing-library/prefer-screen-queries */

import { expect, test } from '@playwright/test'
import { createTodoProcess, updateTodoProcess } from './utils/utils'

test.describe.configure({ mode: 'serial' })

test.describe('test creating new todo', () => {
  test('ensure playwright works', async ({ page }) => {
    await page.goto('/')

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle('Forsta - Forsta Do List')
  })

  test('creating new todo in To Do', async ({ page }) => {
    await page.goto('/')

    await createTodoProcess(page)
  })

  test('creating new todo in all columns', async ({ page }) => {
    await page.goto('/')
    await createTodoProcess(page)
    await createTodoProcess(page, 'In Progress')
    await createTodoProcess(page, 'Done')
  })

  test('update newly created todo', async ({ page }) => {
    await page.goto('/')

    await createTodoProcess(page)
    await updateTodoProcess(page)
  })
})
