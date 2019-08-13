import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './lib/redux/configureStore'
import App from './pages/app'
import './index.scss'

if (process.env.NODE_ENV !== 'development') {
  console.log = console.warn = console.error = console.dir = console.group = console.info = () => { }
}

const store = configureStore(undefined)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
