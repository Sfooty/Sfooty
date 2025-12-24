export const dynamic = "force-dynamic";

import { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import { ClubHero } from '@/heros/ClubHero/heroClub'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const clubs = await payload.find({
    collection: 'clubs',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = clubs.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

export default async function Club({ params }: { params: Promise<{ slug?: string }> }) {
  const resolvedParams = await params
  const slug = resolvedParams?.slug ?? ''
  const { isEnabled: draft } = await draftMode()
  const url = '/clubs/' + slug
  const club = await queryClubBySlug({ slug })

  if (!club) return  await PayloadRedirects ({url})

  return (
    <article className="pt-16 pb-16">
      <PageClient />
      {await PayloadRedirects ({ disableNotFound: true,url})}
      {draft && <LivePreviewListener />}
      <ClubHero club={club} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText
            className="max-w-[48rem] mx-auto"
            content={
              typeof club.description === 'string' ? JSON.parse(club.description) : club.description
            }
            enableGutter={false}
          />
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams?.slug ?? ''
  const club = await queryClubBySlug({ slug })

  console.log('Fetched club data:', club)
  // console.log("fetched player data:", playersRes)

  return generateMeta({ doc: club })
}

const queryClubBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const formattedSlug = slug.replace(/\s+/g, '-').toLowerCase()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'clubs',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: formattedSlug,
      },
    },
  })

  const club = result.docs?.[0] || null

  if (!club) return null

  // ✅ Fetch players linked to this club
  const playersRes = await payload.find({
    collection: 'players',
    draft,
    pagination: false,
    overrideAccess: draft,
    where: {
      team: {
        equals: club.id,
      },
    },
    depth: 1,
  })

  console.log(playersRes)

  // Attach players to club object
  return {
    ...club,
    players: playersRes.docs,
  }
})
