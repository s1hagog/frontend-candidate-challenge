// does not seem to correctly work with playwright
/* eslint-disable testing-library/prefer-screen-queries */

import { expect, Page, test } from '@playwright/test'
import { mockManyTodoCreateFields } from './fixtures/todoFields'
import { createTodoProcess } from './utils'

test.describe.configure({ mode: 'serial' })

let page: Page

test.describe('test flushing todos', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('ensure playwright works', async () => {
    await page.goto('/')

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle('Forsta - Forsta Do List')
  })

  test('creating new todo in all columns', async () => {
    for (const todoFields of mockManyTodoCreateFields) {
      await createTodoProcess(page, todoFields)
    }
  })

  test('flush todos', async () => {
    await page
      .getByRole('button', {
        name: 'Flush todos',
        exact: true,
      })
      .click()
  })

  test('created todos are deleted and there are no other todos as well', async () => {
    const todoColumn = page.locator('h4:has-text("To Do") + div')
    const inProgressColumn = page.locator('h4:has-text("In Progress") + div')
    const doneColumn = page.locator('h4:has-text("Done") + div')

    await expect(
      page.getByText(mockManyTodoCreateFields[0].title!),
    ).not.toBeVisible()
    await expect(
      page.getByText(mockManyTodoCreateFields[1].title!),
    ).not.toBeVisible()
    await expect(
      page.getByText(mockManyTodoCreateFields[2].title!),
    ).not.toBeVisible()

    await expect(
      todoColumn.getByText('No todos', {
        exact: true,
      }),
    ).toBeVisible()
    await expect(
      inProgressColumn.getByText('No todos', {
        exact: true,
      }),
    ).toBeVisible()
    await expect(
      doneColumn.getByText('No todos', {
        exact: true,
      }),
    ).toBeVisible()
  })
})
