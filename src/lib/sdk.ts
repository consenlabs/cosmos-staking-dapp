const imToken = (window as any).imToken
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
  return imToken.callPromisifyAPI('private.getProvider')
}

export function sendTransaction(payload) {
  return imToken.callPromisifyAPI('cosmos.sendTransaction', payload)
}