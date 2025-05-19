import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { RenderOptions } from '@testing-library/react'
import { render } from '@testing-library/react'
import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

import todosReducer from '../reducers/todos'
import type { AppStore, RootState } from '../store'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: AppStore
}

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    // this should ve worked, but `preloadedState` messes up TS type infers, so we need `combineReducers` for the correct type
    // reducer: {
    //   todos: todosReducer
    // }
    reducer: combineReducers({
      todos: todosReducer,
    }),
    preloadedState,
  })
}

export function renderWithProviders(
  ui: React.ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {},
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
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}
