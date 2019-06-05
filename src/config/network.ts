const networkConfig = {
  dev: {
    denom: 'muon',
    chainAPI: 'https://api.dev.tokenlon.im/v1/cosmos',
    market: 'https://dexapi.dev.tokenlon.im/rpc',
    campaign: 'https://biz.dev.tokenlon.im/rpc',
    exchange: 'https://exchange.dev.tokenlon.im/rpc',
  },
  prod: {
    denom: 'uatom',
    chainAPI: 'https://api.tokenlon.im/v1/cosmos',
    market: 'https://mainnet-dexapi.token.im/rpc',
    campaign: 'https://mainnet-bizapi.tokenlon.im/rpc',
    exchange: 'https://exchange.tokenlon.im/rpc',
  },
}

export default () => {
  const isDev = window.location.host.indexOf('.dev.') !== -1
  const env = isDev ? 'dev' : 'prod'
  return networkConfig[env]
}
