import { Metadata } from "next";

import { CollectionArchivePlayers } from "@/components/CollectionArchive/collectionArchivePlayers";
import { PageRange } from "@/components/PageRange/pageRangePlayers";
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
// import { Posts } from "@/collections/Posts";

export const revalidate = 600
export const dynamic = "force-dynamic"
type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const players = await payload.find({
    collection: 'players',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
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
          // collection="players"
          currentPage={players.page}
          limit={12}
          totalDocs={players.totalDocs}
        />
      </div>

      <div className="container">
        <CollectionArchivePlayers players={players.docs} />
      </div>

      <div className="container">
        {players?.page && players.totalDocs> 1 && (
          <Pagination page= {players.page} totalPages={ players.totalPages} />
        )}
      </div>
    </div> 
  )}


export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Payload Website Template Posts Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  // Skip DB calls if secrets are missing (e.g. Railway build step)
  if (!process.env.PAYLOAD_SECRET || !process.env.DATABASE_URI) {
    console.warn("⚠️ Skipping generateStaticParams at build (no DB connection).");
    return [];
  }
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'players',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 10)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
