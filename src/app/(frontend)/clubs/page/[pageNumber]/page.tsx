import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'
import PageClient from './page.client'
import { CollectionArchiveClubs } from '@/components/CollectionArchive/collectionArchiveClubs'
import { PageRangeClubs } from '@/components/PageRange/pageRangeClubs'
import { Pagination } from '@/components/Pagination'
import { notFound } from 'next/navigation'

export const revalidate = 600
export const dynamic = 'force-dynamic'

// ✅ Use `any` for params so Next.js type system is satisfied
export default async function ClubsPage({ params }: any) {
  const pageNumber = Number(params.pageNumber)
  if (!Number.isInteger(pageNumber) || pageNumber < 1) notFound()

  const payload = await getPayload({ config: configPromise })
  const clubs = await payload.find({
    collection: 'clubs',
    depth: 1,
    limit: 12,
    page: pageNumber,
    overrideAccess: false,
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <h1 className="prose dark:prose-invert max-w-none">Clubs</h1>
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
        {clubs.page && clubs.totalPages > 1 && (
          <Pagination page={clubs.page} totalPages={clubs.totalPages} />
        )}
      </div>
    </div>
  )
}

// ✅ Use `any` for params here too
export async function generateMetadata({ params }: any): Promise<Metadata> {
  return {
    title: `Payload Website Template Clubs Page ${params.pageNumber}`,
  }
}

// ✅ This one can stay strongly typed
export async function generateStaticParams(): Promise<{ pageNumber: string }[]> {
    // Skip DB calls if secrets are missing (e.g. Railway build step)
  if (!process.env.PAYLOAD_SECRET || !process.env.DATABASE_URI) {
    console.warn("⚠️ Skipping generateStaticParams at build (no DB connection).");
    return [];
  }
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({ collection: 'clubs', overrideAccess: false })
  const totalPages = Math.ceil(totalDocs / 12)

  return Array.from({ length: totalPages }, (_, i) => ({ pageNumber: String(i + 1) }))
}
