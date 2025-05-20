// does not seem to correctly work with playwright
/* eslint-disable testing-library/prefer-screen-queries */

import { expect, Page, test } from '@playwright/test'
import { mockManyTodoCreateFields } from './fixtures/todoFields'
import { createTodoProcess } from './utils'

test.describe.configure({ mode: 'serial' })

let page: Page

test.describe('test creating new todo', () => {
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
    // forEach does not handle async well so it fails
    // mockManyTodoCreateFields.forEach(async (todoFields) => {
    //   await createTodoProcess(page, todoFields)
    // })
    for (const todoFields of mockManyTodoCreateFields) {
      await createTodoProcess(page, todoFields)
    }
  })

  test('check todos are in the correct columns', async () => {
    const todoColumn = page.locator('h4:has-text("To Do") + div')
    const inProgressColumn = page.locator('h4:has-text("In Progress") + div')
    const doneColumn = page.locator('h4:has-text("Done") + div')

    await expect(
      todoColumn.getByText(mockManyTodoCreateFields[0].title!),
    ).toBeVisible()
    await expect(
      inProgressColumn.getByText(mockManyTodoCreateFields[1].title!),
    ).toBeVisible()
    await expect(
      doneColumn.getByText(mockManyTodoCreateFields[2].title!),
    ).toBeVisible()
  })
})
