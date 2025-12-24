import type { Metadata } from 'next/types'

import { CollectionArchiveClubs } from '@/components/CollectionArchive/collectionArchiveClubs'
import { PageRangeClubs } from '@/components/PageRange/pageRangeClubs'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

// ✅ Fetch at runtime, not build time
export const dynamic = 'force-dynamic'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const clubs = await payload.find({
    collection: 'clubs',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      club_name: true,
      slug: true,
      logo: true,
      address: true,
      founded_year: true,
      description: true,
      coach_name: true,
      meta: true,
      id: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Clubs</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRangeClubs
          collection="clubs"
          currentPage={clubs.page}
          limit={12}
          totalDocs={clubs.totalDocs}
        />
      </div>

      <CollectionArchiveClubs clubs={clubs.docs} />

      <div className="container">
        {clubs.totalPages > 1 && clubs.page && (
          <Pagination page={clubs.page} totalPages={clubs.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Clubs`,
  }
}
