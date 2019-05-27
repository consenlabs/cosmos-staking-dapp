export default ({ content }) => {
  const center = typeof content === 'string' ? (
    <span>{content}</span>
  ) : content
  
  return (
    <div className="divider">
      <div className="line"></div>
      {center}
      <div className="line"></div>
    </div>
  )
}