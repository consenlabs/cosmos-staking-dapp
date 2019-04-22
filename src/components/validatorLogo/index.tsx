import React, { Component } from 'react'
import './index.scss'

interface Props {
  url: string
}

class CMP extends Component<Props> {

  componentDidMount() { }

  render() {
    const { url } = this.props
    const placeholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNs75j+HwAF6wKnIaCjVwAAAABJRU5ErkJggg=='

    return <div className="logo">
      <img alt="logo" src={url || placeholder} title="logo" />
    </div>
  }
}

export default CMP
