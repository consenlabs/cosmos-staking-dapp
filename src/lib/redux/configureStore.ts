import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'

import rootReducer from './reducers'

const logger = _store => next => action => {
  // console.group(action.type)
  // console.info('dispatching', action)
  let result = next(action)
  // console.log('next state', store.getState())
  // console.groupEnd()
  return result
}

export default function configureStore(preloadedState) {
  const middlewares = [logger, thunkMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares)


  const store = createStore(rootReducer, preloadedState, middlewareEnhancer)

  return store
}
