import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  redirect
} from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import z from 'zod'

interface LoaderData {
  post: string
}

const FormSchema = z.object({
  title: z.string(),
  stub: z.string().regex(/^[a-z0-9-]+$/),
  body: z.string(),
  categories: z.string().optional(),
  published: z.string().date().optional(),
  live: z.boolean(),
  archived: z.boolean()
})

type FormValues = z.infer<typeof FormSchema>

interface FormData {
  title: string
  stub: string
  body: string
  categories?: string[]
  published?: Date
  live: boolean
  archived: boolean
}

export const meta: MetaFunction = () => {
  return [
    { title: 'Posts' },
    {
      name: 'description',
      content: 'This app is the best'
    }
  ]
}

export async function loader(args: LoaderFunctionArgs): Promise<LoaderData> {
  const { params, context } = args
  const { logger } = context
  logger.info({ params }, 'Edit Post Loader')
  return {
    post: params.post ?? 'new'
  }
}

export async function action(
  args: ActionFunctionArgs
): Promise<Response | null> {
  const { request, context } = args
  const { logger } = context
  const body = await request.formData()
  const data = Object.fromEntries(body.entries()) as unknown as FormValues

  console.log('form values', data)
  try {
    FormSchema.parse(data)
  } catch (error) {
    console.error('FormSchema Error', error)
    return null
  }

  const formData: FormData = {
    ...data,
    categories: data.categories?.split(',').map((category) => category.trim()),
    published: data.published != null ? new Date(data.published) : undefined
  }
  console.log('form data', formData)

  logger.info({ body, data }, 'Edit Post Action')

  return redirect('/posts')
}

export default function PostEdit(): JSX.Element {
  const { post } = useLoaderData<typeof loader>()

  return (
    <>
      <h1 className='padded'>
        {post === 'new' && <>New Post</>}
        {post !== 'new' && <>Edit Post</>}
      </h1>

      <Form
        className='form'
        method='post'
        navigate={false}
        fetcherKey={post}
        preventScrollReset
      >
        <label>
          Title:
          <input
            type='text'
            name='title'
            placeholder='A descriptive title of the post...'
          />
        </label>
        <label>
          Stub:
          <input
            type='text'
            name='stub'
            placeholder='A url stub for a unique url for post...'
          />
        </label>
        <label>
          Body:
          <textarea name='body' placeholder='Markdown content of post...' />
        </label>
        <label>
          Categories:
          <input
            type='text'
            name='categories'
            placeholder='A comma delimited list of related post categories...'
          />
        </label>
        <label>
          Publish:
          <input type='date' name='published' />
        </label>
        <div className='across'>
          <label>
            Live:
            <input type='checkbox' name='live' />
          </label>
          <label>
            Archived:
            <input type='checkbox' name='archived' />
          </label>
        </div>
        <button type='submit'>Save</button>
      </Form>
    </>
  )
}
