import type { Metadata } from 'next'

// import { RelatedPlayers } from '@/blocks/RelatedPlayers/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Player } from '@/payload-types'

import { PlayerHero } from '@/heros/PlayerHero/heroPlayer'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
    const payload = await getPayload({ config: configPromise })
    const players = await payload.find({
        collection: 'players',
        draft: false,
        limit: 1000,
        overrideAccess: false,
        pagination: false,
        select: {
            slug: true,
        },
    })

    const params = players.docs.map(({ slug }) => {
        return { slug }
    })

    return params
}

export default async function Player({ params }: { params: Promise<{ slug?: string }> }) {
    const resolvedParams = await params; // Await params before using
    const slug = resolvedParams?.slug ?? ''; // Now params is resolved
    const { isEnabled: draft } = await draftMode()
    const url = '/players/' + slug
    const player = await queryPlayerBySlug({ slug })

    if (!player) return <PayloadRedirects url={url} />

    return (
        <article className="pt-16 pb-16">
            <PageClient />
            <PayloadRedirects disableNotFound url={url} />
            {draft && <LivePreviewListener />}
            <PlayerHero player={player} />

            <div className="flex flex-col items-center gap-4 pt-8">
                <div className="container">
                    <RichText className="max-w-[48rem] mx-auto" 
                        content={typeof player.bio === 'string' ? JSON.parse(player.bio) : player.bio} 
                        enableGutter={false} 
                    />
                </div>
            </div>
        </article>
    )
}


export async function generateMetadata({ params }: { params: Promise<{ slug?: string }> }): Promise<Metadata> {
    const resolvedParams = await params; // Await params
    const slug = resolvedParams?.slug ?? ''; // Access slug safely
    const player = await queryPlayerBySlug({ slug });

    console.log("Fetched player data:", player);


    return generateMeta({ doc: player });
}


const queryPlayerBySlug = cache(async ({ slug }: { slug: string }) => {
    const { isEnabled: draft } = await draftMode()
    const formattedSlug = slug.replace(/\s+/g, '-').toLowerCase()

    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
        collection: 'players',
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
    
    return result.docs?.[0] || null

})