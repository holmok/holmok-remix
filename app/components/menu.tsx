import { useNavigate } from '@remix-run/react'

interface MenuProps {
  closeMenu: () => void
}

export default function Menu(props: MenuProps): JSX.Element {
  const { closeMenu } = props
  const navigate = useNavigate()

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault()
    navigate(event.currentTarget.getAttribute('href') ?? '/')
    closeMenu()
  }

  return (
    <ul className='menu'>
      <li>
        <a onClick={handleClick} href='/'>
          Home
        </a>
      </li>
      <li>
        <a onClick={handleClick} href='/about'>
          About
        </a>
      </li>
      <li>
        <a onClick={handleClick} href='/contact'>
          Contact
        </a>
      </li>
    </ul>
  )
}
