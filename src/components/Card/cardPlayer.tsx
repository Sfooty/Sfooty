'use client'
import { cn } from '@/utilities/cn'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Player } from '@/payload-types'
import { Media } from '@/components/Media'

// Define the Lexical Rich Text structure
type LexicalNode = {
  type: string
  text?: string
  children?: LexicalNode[]
}

type LexicalDocument = {
  root: {
    type: string
    children: LexicalNode[]
    direction: 'ltr' | 'rtl' | null
    format: '' | 'center' | 'left' | 'start' | 'right' | 'end' | 'justify'
    indent: number
    version: number
  }
}

export type CardPlayerData = Pick<Player, 'id' | 'name' | 'image' | 'bio'>

// Extract text content from a Lexical Rich Text object
const extractTextFromLexical = (lexicalBio: LexicalDocument | null | undefined): string => {
  if (!lexicalBio?.root?.children) return ''

  const extractText = (nodes: LexicalNode[]): string => {
    return nodes
      .map(node => (node.text ? node.text : node.children ? extractText(node.children) : ''))
      .join(' ')
  }

  return extractText(lexicalBio.root.children)
}

export const CardPlayer: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPlayerData
  relationTo?: 'players'
  showBio?: boolean
  name?: string
}> = ({  className, doc, relationTo = 'players', showBio, name: nameFromProps }) => {
  const { card, link } = useClickableCard({})

  if (!doc) return null

  const { name, bio, image } = doc
  const nameToUse = nameFromProps || name
  const href = `/${relationTo}/${nameToUse}`

  return (
    <article
      className={cn('border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer', className)}
      ref={card.ref as React.Ref<HTMLElement>}
    >
      <div className="relative w-full">
        {!image ? <div className="">No image</div> : <Media resource={image} size="33vw" />}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold leading-none tracking-tight">{nameToUse}</h3>
        {showBio && <p className="text-sm text-muted-foreground">{bio ? extractTextFromLexical(bio as LexicalDocument) : 'No bio available'}</p>}
      </div>
      {nameToUse && (
        <div className="prose">
          <h3>
            <Link className="not-prose" href={href} ref={link.ref as React.Ref<HTMLAnchorElement>}>
              {nameToUse}
            </Link>
          </h3>
        </div>
      )}
    </article>
  )
}
