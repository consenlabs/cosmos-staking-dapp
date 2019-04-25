import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import './index.scss'

interface Props {
  options: any[]
  onSelect: any
  title?: string
  close?: any
}

class ActionSheet extends Component<Props, any> {
  render() {
    const { options, title, close } = this.props
    return (
      <div className="actionsheet" onClick={close}>
        <div className="wrap" onClick={(e) => e.stopPropagation()}>
          <div className="options">
            {title && (
              <div className="item">
                <p className="title">{title}</p>
              </div>
            )}
            {(options || []).map((option) => {
              return (
                <div key={option.key} className="item" onClick={() => this.onSelect(option)}>
                  <p>{option.locale}</p>
                </div>
              )
            })}
          </div>
          <div className="item cancel" onClick={close}>
            <p>
              <FormattedMessage
                id='cancel'
              />
            </p>
          </div>
        </div>
      </div>
    )
  }

  onSelect = (option) => {
    console.log(option)
    this.props.onSelect(option.key)
    this.props.close()
  }
}

export default ActionSheet