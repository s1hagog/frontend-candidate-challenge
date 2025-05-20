// does not seem to correctly work with playwright
/* eslint-disable testing-library/prefer-screen-queries */

import { expect, Page, test } from '@playwright/test'
import {
  mockManyTodoCreateFields,
  mockTodoCreateFields,
} from './fixtures/todoFields'
import { createTodoProcess } from './utils'

test.describe.configure({ mode: 'serial' })

let page: Page

test.describe('test changing storage', () => {
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

  test('todos are in the correct columns', async () => {
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

  test('changing storage', async () => {
    await page.getByTestId('select-change-storage').selectOption('cookies')
  })

  test('no todos are in the new storage', async () => {
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

  test('create new todo in cookie storage', async () => {
    await createTodoProcess(page, mockTodoCreateFields)
  })

  test('todo is in the correct column', async () => {
    const todoColumn = page.locator('h4:has-text("To Do") + div')

    await expect(
      todoColumn.getByText(mockManyTodoCreateFields[0].title!),
    ).toBeVisible()
  })

  test('change back to local storage', async () => {
    await page
      .getByTestId('select-change-storage')
      .selectOption('local-storage')
  })

  test('first todos are in the correct columns', async () => {
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
