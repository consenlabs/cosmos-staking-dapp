const logger = (): {
  track_links: Function,
  track: Function,
} => (window as any).mixpanel || {
  track_links: () => console.warn('track_links'),
  track: () => console.warn('track'),
}

export default logger
