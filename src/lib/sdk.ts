window['imToken'] = window['imToken'] || {
  callPromisifyAPI: (apiName: string, _payload: any): Promise<any> => {
    switch (apiName) {
      case 'cosmos.getAccounts':
        return Promise.resolve([])
      // return Promise.resolve(['cosmos1zt57jwmlfl77k9urjha2xupgpk2j90axd9pxss'])
      // return Promise.resolve(['cosmos1y0a8sc5ayv52f2fm5t7hr2g88qgljzk4jcz78f'])
      case 'cosmos.getProvider':
        // return Promise.resolve('https://stargate.cosmos.network')
        // return Promise.resolve('https://cosmosapi-testnet.tokenlon.im')
        return Promise.resolve('https://cosmosapi-mainnet.tokenlon.im')
      case 'private.getHeaders':
        return Promise.resolve(`{"Authorization":"Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VUb2tlbiI6IkVBQjZBRTJELThFNEYtNEFDMS1CODM4LTA5MkQwMzE2NjlGQSIsImp0aSI6ImltMTR4NUxZck11Q1lxaXdTRzVBeFhaOXlGRDlIdml2VmJKdDVMRiJ9.rkJ2jziqRKwHvUKX2xkrkA2CDppGegElgVuZ2syHf5Y","X-IDENTIFIER":"im14x5LYrMuCYqiwSG5AxXZ9yFD9HvivVbJt5LF","X-CLIENT-VERSION":"ios:2.3.1.515:14","X-DEVICE-TOKEN":"EAB6AE2D-8E4F-4AC1-B838-092D031669FA","X-LOCALE":"en-US","X-CURRENCY":"CNY","X-DEVICE-LOCALE":"en","X-APP-ID":"im.token.app","X-API-KEY":"3bdc0a49ba634a8e8f3333f8e66e0b84","Content-Type":"application/json"}`)
      default:
        return Promise.reject(new Error('当前不是 imToken 环境'))
    }
  }
}

const imToken = window['imToken']
/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ rn api requests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

export function getAccounts() {
  // return Promise.resolve(['cosmos1zt57jwmlfl77k9urjha2xupgpk2j90axd9pxss'])
  return imToken.callPromisifyAPI('cosmos.getAccounts').catch(err => console.warn(err))
}

export function getProvider() {
  return imToken.callPromisifyAPI('cosmos.getProvider')
}

export function getHeaders() {
  return imToken.callPromisifyAPI('private.getHeaders')
    .then(headers => JSON.parse(headers))
    .then(headers => {
      delete headers['X-LOCALE']
      return {
        ...headers,
        // 'Access-Control-Allow-Origin': 'http://localhost:3000',
        // 'Access-Control-Allow-Credentials': 'true',
        // ...headers,
      }
    })
}

export function sendTransaction(payload) {
  return imToken.callPromisifyAPI('cosmos.sendTransaction', payload)
}
