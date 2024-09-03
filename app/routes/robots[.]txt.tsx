export function loader (): Response {
  return new Response(
    [
      'User-agent: *',
      'allow: /'
    ].join('\n'),
    {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
}
