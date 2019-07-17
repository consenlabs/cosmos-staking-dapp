import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import { selectValidators, selectPool, selectDelegations } from '../../lib/redux/selectors'
import ValidatorCard from '../../components/validatorCard'
import Loading from '../../components/loading'
import { t, isiPhoneX } from '../../lib/utils'
import SORT from '../../assets/sort.svg'
import SEARCH from '../../assets/search.svg'
import NO_DATA from '../../assets/no-data.svg'
import ActionSheet from '../../components/actionsheet'
import { updateSortby } from '../../lib/redux/actions'
import { selectSortby } from '../../lib/redux/selectors'
import './index.scss'

interface Props {
  validators: any[]
  delegations: any[]
  pool: any
  sortBy: string
  updateSortby: any

  isSelect?: boolean
  currentValidator?: string
  history?: any
}

class Page extends Component<Props, any> {

  constructor(props) {
    super(props)
    const { history, validators } = props

    let selectedValidator = null
    if (history.location) {
      const params = new URLSearchParams(history.location.search) as any
      const distAddress = params.get('dist')
      if (distAddress) {
        selectedValidator = validators.find(v => v.operator_address === distAddress)
      }
    }

    this.state = {
      keyword: '',
      actionsheetVisible: false,
      selectedValidator,
    }
  }

  componentDidMount() {

  }


  render() {
    const { actionsheetVisible } = this.state
    return (
      <div className="validators-wrap">
        {this.renderBar()}
        {this.renderList()}
        {this.renderToolbar()}
        {actionsheetVisible && (
          <ActionSheet
            options={['delegators', 'bonded_tokens', 'yield'].map(o => ({ locale: t(o), key: o }))}
            title={t('sort')}
            close={() => this.setState({ actionsheetVisible: false })}
            onSelect={(option) => this.props.updateSortby(option)}
          />
        )}
      </div>
    )
  }

  renderBar() {
    return (
      <div className="search-bar">
        {this.renderSearch()}
        {this.renderSort()}
      </div>
    )
  }

  renderSearch() {
    const { keyword } = this.state
    return (
      <div className="search-wrap">
        <img className="search-icon" src={SEARCH} alt="search" />
        <input
          type="text"
          placeholder={t('search_validator')}
          value={keyword}
          onChange={this.onChange}
        />
      </div>
    )
  }

  renderSort = () => {
    return (
      <div className="sort-bar" onClick={() => this.setState({ actionsheetVisible: true })}>
        <img src={SORT} alt="sort" />
      </div>
    )
  }

  renderList() {
    const { validators, pool, sortBy, isSelect, currentValidator } = this.props
    const { keyword, selectedValidator } = this.state

    if (!validators || !validators.length) return <Loading />

    /**
     * only display the unjail validator
     * only display the bonded validator (status === 2)
     */
    const bondedValidators = validators.filter(v => {
      // filter current validator
      if (isSelect) {
        return !v.jailed && v.status === 2 && v.operator_address !== currentValidator
      }

      return !v.jailed && v.status === 2
    })

    const sortKey = {
      yield: 'annualized_returns',
      bonded_tokens: 'tokens',
      delegators: 'delegators',
    }[sortBy]

    let sortedList = bondedValidators.sort((a, b) => {

      // if annualized_returns is same, sort by delegators
      if (sortBy === 'yield' && a[sortKey] === b[sortKey]) {
        return b['delegators'] - a['delegators'] > 0 ? 1 : -1
      }
      return b[sortKey] - a[sortKey] > 0 ? 1 : -1
    })

    // filter search validator
    if (keyword) {
      sortedList = sortedList.filter(v => {
        const kw = keyword.replace(/[\?\*\[\]\(\)\{\}\\\^\$]/g, '\\$&')
        return (new RegExp(kw, 'ig')).test(v.description.moniker)
      })
    }

    if (keyword && sortedList.length === 0) {
      return this.renderEmpty()
    }

    return (
      <div className="validator-list">
        {
          sortedList.map((v, i) => <ValidatorCard
            validator={v}
            key={v.operator_address}
            pool={pool}
            index={i}
            selectedValidator={selectedValidator}
            onSelect={isSelect ? this.onSelect : null }
          />)
        }
      </div>
    )
  }

  renderEmpty() {
    const height = window.innerHeight - 66 - 46 - (isiPhoneX() ? 20 : 0)
    return (
      <div className="empty" style={{ height }}>
        <img src={NO_DATA} alt="no data"/>
        <span>{t('search_for_nothing')}</span>
      </div>
    )
  }

  renderToolbar() {
    const { isSelect } = this.props
    if (!isSelect) return null

    const disabled = !this.state.selectedValidator

    const xStyle = { marginBottom: isiPhoneX() ? 20 : 0 }

    return (
      <div className="toolbar">
        <button disabled={disabled} className="form-button" onClick={this.onSubmit} style={xStyle}>
          <span>{t('confirm')}</span>
        </button>
      </div>
    )
  }

  onChange = (event) => {
    this.setState({ keyword: event.target.value, selectedValidator: null })
  }

  onSelect = (validator) => {
    const { selectedValidator } = this.state
    if (selectedValidator &&
      selectedValidator.operator_address === validator.operator_address) {
      this.setState({ selectedValidator: null })
    } else {
      this.setState({ selectedValidator: validator })
    }
  }

  onSubmit = () => {
    const { history, currentValidator } = this.props
    const { selectedValidator } = this.state
    const location = history.location

    history.goBack()
    history.replace(`/redelegate/${currentValidator}${location.search}&selected=${selectedValidator.operator_address}`)
  }
}

const mapStateToProps = state => {
  return {
    validators: selectValidators(state),
    delegations: selectDelegations(state),
    pool: selectPool(state),
    sortBy: selectSortby(state),
  }
}

const mapDispatchToProps = {
  updateSortby,
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Page))
