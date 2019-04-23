import React, { Component } from 'react'
import './index.scss'

interface Props {
  url: string
}

class CMP extends Component<Props> {

  componentDidMount() { }

  render() {
    const { url } = this.props
    const placeholder = 'https://aws-v2-cdn.token.im/cosmos/atom.png'

    return <div className="logo">
      <img alt="logo" src={url || placeholder} title="logo" />
    </div>
  }
}

export default CMP
