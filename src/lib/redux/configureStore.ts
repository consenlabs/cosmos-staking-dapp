import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import rootReducer from './reducers'

const persistConfig = {
  key: 'root',
  storage,
}

const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd()
  return result
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


export default function configureStore(preloadedState) {
  const middlewares = (process.env.NODE_ENV !== 'production'
    ? [logger]
    : []
  ).concat(thunkMiddleware)

  const middlewareEnhancer = applyMiddleware(...middlewares)
  const store = createStore(
    persistedReducer,
    preloadedState,
    middlewareEnhancer,
  )
  const persistor = persistStore(store)
  return { store, persistor }
}
