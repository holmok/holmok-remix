export default function Footer(): JSX.Element {
  function backToTop(event: React.MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <div className='footer'>
      <div className='container flex-row'>
        <div className='copyright'>
          &copy; {new Date().getFullYear()} HOLMOK
        </div>
        <div className='back-to-top'>
          {' '}
          ⇡{' '}
          <a onClick={backToTop} href='#top'>
            Back to top
          </a>{' '}
          ⇡
        </div>
      </div>
    </div>
  )
}
