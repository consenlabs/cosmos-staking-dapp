import React, { Component } from 'react'
import { addLocaleData, IntlProvider } from 'react-intl'
import { connect } from 'react-redux'
import zh_CN from './locale/zh_CN'
import en_US from './locale/en_US'
import zh from 'react-intl/locale-data/zh'
import en from 'react-intl/locale-data/en'
import { getLocale } from 'lib/utils'

addLocaleData([...zh, ...en])

interface Props {
  children: any
}


class Inter extends Component<Props, any> {
  render() {
    let { children } = this.props
    const locale = getLocale()
    const localeMessage = chooseLocale(locale)
    return (
      <IntlProvider key={locale} locale={locale} messages={localeMessage}>
        {children}
      </IntlProvider>
    )
  }
}

function chooseLocale(locale) {
  switch (locale) {
    case 'en':
      return en_US
    case 'zh':
      return zh_CN
    default:
      return zh_CN
  }
}

const mapStateToProps = (_state) => {
  return {

  }
}

let Intl = connect(mapStateToProps)(Inter)

export default Intl