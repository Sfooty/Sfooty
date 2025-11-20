import type { Metadata } from 'next/types'
import { CollectionArchivePlayers } from '@/components/CollectionArchive/collectionArchivePlayers'
import { PageRange } from '@/components/PageRange/pageRangePlayers'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'
export const revalidate = 600
// Use `any` for params to avoid TS build errors
export default async function PlayersPage({ params }: any) {
  const pageNumber = Number(params.pageNumber)
  if (!Number.isInteger(pageNumber) || pageNumber < 1) notFound()

  const payload = await getPayload({ config: configPromise })
  const players = await payload.find({
    collection: 'players',
    depth: 1,
    limit: 12,
    page: pageNumber,
    overrideAccess: false,
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <h1 className="prose dark:prose-invert max-w-none">Players</h1>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="players"
          currentPage={players.page}
          limit={12}
          totalDocs={players.totalDocs}
        />
      </div>

      <CollectionArchivePlayers players={players.docs} />

      <div className="container">
        {players.page && players.totalPages > 1 && (
          <Pagination page={players.page} totalPages={players.totalPages} />
        )}
      </div>
    </div>
  )
}

// ✅ Metadata stays safe
export async function generateMetadata({ params }: any): Promise<Metadata> {
  return {
    title: `Players Page ${params.pageNumber}`,
  }
}

// ✅ Guarded generateStaticParams
export async function generateStaticParams(): Promise<{ pageNumber: string }[]> {
  // Skip DB calls during Railway build
  if (process.env.NODE_ENV === 'production' && process.env.RAILWAY_ENVIRONMENT) {
    console.warn('⚠️ Skipping generateStaticParams at build (no DB connection).')
    return []
  }

  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'players',
    overrideAccess: false,
  })
  const totalPages = Math.ceil(totalDocs / 12)

  return Array.from({ length: totalPages }, (_, i) => ({
    pageNumber: String(i + 1),
  }))
}
