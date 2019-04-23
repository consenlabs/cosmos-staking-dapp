import React, { Component } from 'react'
import { addLocaleData, IntlProvider } from 'react-intl'
import { connect } from 'react-redux'
import zh_CN from './locale/zh_CN'
import en_US from './locale/en_US'
import zh from 'react-intl/locale-data/zh'
import en from 'react-intl/locale-data/en'

addLocaleData([...zh,...en])

interface Props {
  locale: string
  localeMessage: any
  children: any
}


class Inter extends Component<Props, any> {
  render() {
    let { locale, localeMessage, children } = this.props
    return (
      <IntlProvider key={locale} locale={locale} messages={localeMessage}>
        {children}
      </IntlProvider>
    )
  }
}

function chooseLocale(val) {
  let _val = val || navigator.language.split('_')[0]
  switch (_val) {
    case 'en':
      return en_US
    case 'zh':
      return zh_CN
    default:
      return en_US
  }
}

const mapStateToProps = (state) => {
  return {
    locale: state.language,
    localeMessage: chooseLocale(state.language)
  } 
}

let Intl = connect(mapStateToProps)(Inter)

export default Intl