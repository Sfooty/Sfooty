import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Club } from '../../../payload-types'

export const revalidateClub: CollectionAfterChangeHook<Club> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/clubs/${doc.slug}`

      payload.logger.info(`Revalidating club at path: ${path}`)

      revalidatePath(path)
      revalidateTag('clubs-sitemap')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/clubs/${previousDoc.slug}`

      payload.logger.info(`Revalidating old club path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('clubs-sitemap')
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Club> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/clubs/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('clubs-sitemap')
  }

  return doc
}
