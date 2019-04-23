const networkConfig = {
  dev: {
    denom: 'muon',
    chainAPI: 'https://api.dev.tokenlon.im/v1/cosmos'
  },
  prod: {
    denom: 'uatom',
    chainAPI: 'https://api.tokenlon.im/v1/cosmos'
  },
}

export default () => {
  const isDev = window.location.host.indexOf('.dev.') !== -1
  const env = isDev ? 'dev' : 'prod'
  return networkConfig[env]
}