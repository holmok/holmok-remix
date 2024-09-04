import { MetaFunction, useNavigate } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [
    { title: 'Posts' },
    {
      name: 'description',
      content: 'This app is the best'
    }
  ]
}

export default function Posts(): JSX.Element {
  const navigate = useNavigate()
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault()
    navigate(event.currentTarget.getAttribute('href') as string)
  }
  return (
    <>
      <div className='action-bar'>
        <div className='title'>
          <h1>Posts</h1>
        </div>
        <div className='actions'>
          <a href='/posts/new' onClick={handleClick}>
            New Post
          </a>
        </div>
      </div>
    </>
  )
}
