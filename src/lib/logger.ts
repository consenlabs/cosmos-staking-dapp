const getAgent = () => (window as any).imToken && (window as any).imToken.agent

const logger = (): { track: Function } => {
  if ((window as any).mixpanel) {
    return {
      track: (event, options) => {
        let opt = options || {}
        const agent = getAgent()
        if (agent) {
          const matchs = agent.split(':')
          opt = { ...opt, version: matchs[1] }
        }
        (window as any).mixpanel.track(event, opt)
      }
    }
  }

  return {
    track: () => console.warn('track'),
  }
}


interface Params {
  eventCategory: string
  eventAction: string
  eventLabel: string
}
export const loggerGA = (params: Params) => {
  const ga = (window as any).ga
  ga && ga('send', {
    hitType: 'event',
    eventCategory: params.eventCategory,
    eventAction: params.eventAction,
    eventLabel: params.eventLabel,
  })
}

export default logger
