export function loader (): Response {
  return new Response('User-agent: *\nallow: /', {
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}
