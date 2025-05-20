// does not seem to correctly work with playwright
/* eslint-disable testing-library/prefer-screen-queries */

import { expect, Page, test } from '@playwright/test'
import { mockManyTodoCreateFields } from './fixtures/todoFields'
import { createTodoProcess } from './utils'

test.describe.configure({ mode: 'serial' })

let page: Page

test.describe('test filtering todo', () => {
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

  test.describe('filtering tests', () => {
    test.afterEach(async () => {
      await page
        .getByRole('button', { name: 'Reset Filters', exact: true })
        .click()
    })

    test('filter by first todo name so it is visible and other are not', async () => {
      await page
        .getByPlaceholder('Enter the Title...', {
          exact: true,
        })
        .fill(mockManyTodoCreateFields[0].title)

      await page.getByRole('button', { name: 'Search', exact: true }).click()

      await expect(
        page.getByText(mockManyTodoCreateFields[0].title, {
          exact: true,
        }),
      ).toBeVisible()
      await expect(
        page.getByText(mockManyTodoCreateFields[1].title, {
          exact: true,
        }),
      ).not.toBeVisible()
      await expect(
        page.getByText(mockManyTodoCreateFields[2].title, {
          exact: true,
        }),
      ).not.toBeVisible()
    })

    test('filter by second todo desc so it is visible and other are not', async () => {
      await page
        .getByPlaceholder('Enter the Description...', {
          exact: true,
        })
        .fill(mockManyTodoCreateFields[1].description)

      await page.getByRole('button', { name: 'Search', exact: true }).click()

      await expect(
        page.getByText(mockManyTodoCreateFields[0].title, {
          exact: true,
        }),
      ).not.toBeVisible()
      await expect(
        page.getByText(mockManyTodoCreateFields[1].title, {
          exact: true,
        }),
      ).toBeVisible()
      await expect(
        page.getByText(mockManyTodoCreateFields[2].title, {
          exact: true,
        }),
      ).not.toBeVisible()
    })

    test('filter by third todo status so it is visible and other are not', async () => {
      await page
        .getByTestId('select-filter-todo-status')
        .selectOption(mockManyTodoCreateFields[2].status)

      await page.getByRole('button', { name: 'Search', exact: true }).click()

      await expect(
        page.getByText(mockManyTodoCreateFields[0].title, {
          exact: true,
        }),
      ).not.toBeVisible()
      await expect(
        page.getByText(mockManyTodoCreateFields[1].title, {
          exact: true,
        }),
      ).not.toBeVisible()
      await expect(
        page.getByText(mockManyTodoCreateFields[2].title, {
          exact: true,
        }),
      ).toBeVisible()
    })
  })
})
