import React, { Component } from 'react'
import './index.scss'

interface Props {
  url: string
}

class CMP extends Component<Props> {

  componentDidMount() { }

  render() {
    const { url } = this.props

    return <div className="logo">
      <img alt="logo" src={'../../../images/default-validator.png' || url} />
    </div>
  }
}

export default CMP
