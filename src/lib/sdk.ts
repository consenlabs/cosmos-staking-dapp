window['imToken'] = window['imToken'] || {
  callPromisifyAPI: (apiName: string, payload: any): Promise<any> => {
    console.log(apiName, payload)
    switch (apiName) {
      case 'cosmos.getAccounts':
        return Promise.resolve(['cosmos16gdxm24ht2mxtpz9cma6tr6a6d47x63hlq4pxt'])
      case 'cosmos.getProvider':
        return Promise.resolve('https://stargate.cosmos.network')
      case 'private.getHeaders':
        return Promise.resolve(`{"Authorization":"Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VUb2tlbiI6IkVBQjZBRTJELThFNEYtNEFDMS1CODM4LTA5MkQwMzE2NjlGQSIsImp0aSI6ImltMTR4NUxZck11Q1lxaXdTRzVBeFhaOXlGRDlIdml2VmJKdDVMRiJ9.rkJ2jziqRKwHvUKX2xkrkA2CDppGegElgVuZ2syHf5Y","X-IDENTIFIER":"im14x5LYrMuCYqiwSG5AxXZ9yFD9HvivVbJt5LF","X-CLIENT-VERSION":"ios:2.3.1.515:14","X-DEVICE-TOKEN":"EAB6AE2D-8E4F-4AC1-B838-092D031669FA","X-LOCALE":"en-US","X-CURRENCY":"USD","X-DEVICE-LOCALE":"en","X-APP-ID":"im.token.app","X-API-KEY":"3bdc0a49ba634a8e8f3333f8e66e0b84","Content-Type":"application/json"}`)
      default:
        return Promise.resolve()
    }
  }
}

const imToken = window['imToken']
/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ rn api requests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

export function getAccounts() {
  return imToken.callPromisifyAPI('cosmos.getAccounts')
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
        // 'Access-Control-Allow-Origin': 'http://localhost:3000',
        // 'Access-Control-Allow-Credentials': 'true',
        // ...headers,
      }
    })
}

export function sendTransaction(payload) {
  return imToken.callPromisifyAPI('cosmos.sendTransaction', payload)
}