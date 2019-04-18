window['imToken'] = window['imToken'] || {
  callPromisifyAPI: (apiName: string, payload: any): Promise<any> => {
    console.log(apiName, payload)
    switch (apiName) {
      case 'getAccounts':
        return Promise.resolve(['cosmos167w96tdvmazakdwkw2u57227eduula2cy572lf'])
      case 'getProvider':
        return Promise.resolve('https://api.dev.tokenlon.im/v1/cosmos')
      case 'getHeaders':
        return Promise.resolve({})
      default:
        return Promise.resolve()
    }
  }
}

export default {}