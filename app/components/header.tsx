import { useState } from 'react'
import Menu from './menu'
import { useNavigate } from '@remix-run/react'

export default function Header(props: { hideNav?: boolean }): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  function homeClick(event: React.MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault()
    navigate('/')
  }

  function toggleMenu(event: React.MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault()
    setMenuOpen(!menuOpen)
  }

  function closeMenu(): void {
    setMenuOpen(false)
  }

  return (
    <div className='header'>
      <div className='container flex-row'>
        <div className='logo'>
          <a href='/' onClick={homeClick}>
            HOLMOK
          </a>
        </div>
        {(props.hideNav == null || !props.hideNav) && (
          <>
            <div className='nav'>
              <a
                href='#'
                className={menuOpen ? 'close' : 'open'}
                onClick={toggleMenu}
              >
                {menuOpen ? '✕' : '☰'}
              </a>
            </div>
            {menuOpen && <Menu closeMenu={closeMenu} />}
          </>
        )}
        {props.hideNav != null && props.hideNav && (
          <div className='nav'>
            <a href='/'>Return Home</a>
          </div>
        )}
      </div>
    </div>
  )
}
