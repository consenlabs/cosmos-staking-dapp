import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'
import configureStore from './lib/redux/configureStore'

import App from './pages/home'
import './index.scss'
import launch from './lib/launch'

launch()

const store = configureStore(undefined)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
