import type { Metadata } from 'next/types'
import { CollectionArchivePlayers } from '@/components/CollectionArchive/collectionArchivePlayers'
import { PageRange } from '@/components/PageRange/pageRangePlayers'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const players = await payload.find({
    collection: 'players',
    depth: 1,
    limit: 20,
    overrideAccess: false,
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      date_of_birth: true,
      position: true,
      team: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Players</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="players"
          currentPage={players.page}
          limit={20}
          totalDocs={players.totalDocs}
        />
      </div>

      <CollectionArchivePlayers players={players.docs} />

      <div className="container">
        {players.totalPages > 1 && players.page && (
          <Pagination page={players.page} totalPages={players.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Posts`,
  }
}