import React from 'react'
import Modal from 'react-modal'
import './index.scss'
import { isiPhoneX } from 'lib/utils'

const customStyles = {
  content: {
    top: 'auto',
    left: '0',
    right: '0',
    bottom: '0',
    background: '#F7F8F9',
    borderRadius: '4px 4px 0 0',
    border: 'none',
    margin: '0',
    padding: isiPhoneX() ? '0 0 16px 0' : '0',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
}

export default (props: any) => {
  const style = { ...customStyles }
  style.content = { ...style.content, ...props.styles }
  return <Modal {...props} style={style} />
}
