import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'
import configureStore from './lib/redux/configureStore'
import Intl from './Intl'
import App from './pages/app'
import './index.scss'

const store = configureStore(undefined)

ReactDOM.render(
  <Provider store={store}>
    <Intl>
      <App />
    </Intl>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
