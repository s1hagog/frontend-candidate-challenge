import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import type { AppStore, RootState } from '../store'
import todosReducer from '../reducers/todos'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: AppStore
}

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    // need to use combineReducers because of preloaded state, otherwise types dont work
    reducer: combineReducers({
      todos: todosReducer
    }),
    preloadedState,
  })
}

export function renderWithProviders(
  ui: React.ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {}
) {
  const {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  )

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  }
}