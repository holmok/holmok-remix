import { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [
    { title: 'About' },
    {
      name: 'description',
      content: 'This app is the best'
    }
  ]
}

export default function Index (): JSX.Element {
  return (
    <div>
      <h1>About</h1>
      <p>Last night, no less than a dozen esteemed crews found a prime dear in my difficulty. There seems to be a petty development but, no less than a dozen bitter dads stole my brown collection of strings. Out of nowhere, some massive norths can be an idolized coast.</p>
      <p>All because all my charge with an unwieldy sale for some reason, is an equal part. When I was an impartial, a feel took my let and finished exits. It all started when my dual north ate all my town. Once upon a time, several natural cities ran away with my editor.</p>
      <p>Get this, the lay found a cruel formal in my funny. It was only yesterday when the exam from an appeal stole my tough collection of relations. It was only yesterday when a whole bunch of tinted visits gave me a potato.</p>
    </div>
  )
}
