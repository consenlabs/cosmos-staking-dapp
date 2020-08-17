import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './lib/redux/configureStore'
import { PersistGate } from 'redux-persist/integration/react'
import App from './pages/app'
import './index.scss'

if (process.env.NODE_ENV !== 'development') {
  console.log = console.warn = console.error = console.dir = console.group = console.info = () => { }
}

const { store, persistor } = configureStore(undefined)

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor} >
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)
