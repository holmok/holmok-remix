import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  redirect
} from '@remix-run/node'
import { Form, useFetcher, useLoaderData } from '@remix-run/react'
import { P } from 'pino'
import { useState } from 'react'
import z from 'zod'

interface LoaderData {
  post: string
}

const FormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  stub: z
    .string()
    .regex(/^[a-z0-9-]+$/, {
      message: 'Stub must be lowercase, alphanumeric, and hyphenated'
    })
    .min(3, { message: 'Stub must be at least 3 characters' })
    .max(12, { message: 'Stub must be at most 50 characters' }),
  content: z.string().min(1, { message: 'Content is required' }),
  categories: z.string().min(1, { message: 'Categories are required' }),
  published: z.string().date().optional(),
  live: z.string().optional(),
  archived: z.string().optional()
})

type FormValues = z.infer<typeof FormSchema>

interface PostData {
  [key: string]: string | string[] | Date | boolean
  title: string
  stub: string
  content: string
  categories: string[]
  published: Date
  live: boolean
  archived: boolean
}

type Warnings = {
  [key: string]: string[]
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
  const { db } = context
  const body = await request.formData()
  const form = Object.fromEntries(body.entries())
  const post: PostData = {
    title: form.title as string,
    stub: form.stub as string,
    content: form.content as string,
    categories: (form.categories as string)
      .split(',')
      .map((c) => c.trim().toLocaleLowerCase()),
    published: new Date(form.published as string),
    live: form.live === 'true',
    archived: form.archived === 'true'
  }
  await db('posts').insert(post)
  return redirect('/posts')
}

export default function PostEdit() {
  const { post } = useLoaderData<typeof loader>()
  const fetcher = useFetcher()
  const [errors, setErrors] = useState<Warnings>({})

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = Object.fromEntries(new FormData(form).entries())
    const data = FormSchema.safeParse(formData)
    if (!data.success) {
      const warnings: Warnings = {}
      data.error.errors.forEach((error) => {
        const key = error.path[0] as string
        if (warnings[key] == null) {
          warnings[key] = []
        }
        warnings[key].push(error.message)
      })
      console.log('Warnings', warnings)
      setErrors(warnings)
      return
    } else {
      const values = data.data as FormValues
      const postData = new FormData()
      postData.append('title', values.title)
      postData.append('stub', values.stub)
      postData.append('content', values.content)
      console.log('Categories', values.categories)
      postData.append('categories', values.categories)
      postData.append(
        'published',
        values.published != null
          ? new Date(values.published).toISOString()
          : new Date().toISOString()
      )
      postData.append('live', values.live === 'true' ? 'true' : 'false')
      postData.append('archived', values.archived === 'true' ? 'true' : 'false')
      console.log('Post Data', Object.fromEntries(postData.entries()))
      fetcher.submit(postData, { method: 'post' })
    }
  }

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
        onSubmit={handleFormSubmit}
      >
        <label>
          Title:
          <input
            type='text'
            name='title'
            className={errors.title ? 'warn' : ''}
            placeholder='A descriptive title of the post...'
          />
          {errors.title && (
            <span className='warn'>{errors.title.join(', ')}</span>
          )}
        </label>
        <label>
          Stub:
          <input
            type='text'
            name='stub'
            className={errors.stub ? 'warn' : ''}
            placeholder='A url stub for a unique url for post...'
          />
          {errors.stub && (
            <span className='warn'>{errors.stub.join(', ')}</span>
          )}
        </label>

        <label>
          Content:
          <textarea
            className={errors.content ? 'warn' : ''}
            name='content'
            placeholder='Markdown content of post...'
          />
          {errors.content && (
            <span className='warn'>{errors.content.join(', ')}</span>
          )}
        </label>

        <label>
          Categories:
          <input
            type='text'
            name='categories'
            className={errors.categories ? 'warn' : ''}
            placeholder='A comma delimited list of related post categories...'
          />
          {errors.categories && (
            <span className='warn'>{errors.categories.join(', ')}</span>
          )}
        </label>

        <label>
          Publish:
          <input
            type='date'
            name='published'
            className={errors.published ? 'warn' : ''}
          />
          {errors.published && (
            <span className='warn'>{errors.published.join(', ')}</span>
          )}
        </label>

        <div className='across'>
          <label>
            Live:
            <input type='checkbox' name='live' value='true' />
          </label>
          <label>
            Archived:
            <input type='checkbox' name='archived' value='true' />
          </label>
        </div>
        <button type='submit'>Save</button>
      </Form>
    </>
  )
}
