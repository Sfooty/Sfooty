'use client'

import { cn } from '@/utilities/cn'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'
import type { Club } from '@/payload-types'
import { Media } from '@/components/Media'
import { ArrowRight } from 'lucide-react'

export type CardClubData = Pick<
  Club,
  'slug' | 'club_name' | 'logo' | 'founded_year' | 'address' | 'meta'
>

export const CardClub: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardClubData
  relationTo?: 'clubs'
  title?: string
}> = (props) => {
  const { card } = useClickableCard({}) // only keep article ref
  const { className, doc, relationTo, title: titleFromProps } = props

  const { slug, club_name, logo, founded_year, address, meta } = doc || {}
  const { description, image: metaImage } = meta || {}

  const href = `/${relationTo}/${slug}`
  const titleToUse = titleFromProps || club_name
  const sanitizedDescription = description?.replace(/\s/g, ' ')

  return (
    <Link href={href} className={cn('group block w-full h-full', className)}>
      <article
        ref={card.ref as React.Ref<HTMLElement>}
        className="flex border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full"
      >
        {/* Image - 1/3 */}
        <div className="w-1/3 flex-shrink-0 h-auto">
          {!logo && !metaImage && <div className="p-4 text-sm text-muted-foreground">No image</div>}
          {logo && typeof logo !== 'string' && (
            <Media resource={logo} size="100vw" className="object-cover h-full w-full" />
          )}
          {!logo && metaImage && typeof metaImage !== 'string' && (
            <Media resource={metaImage} size="100vw" className="object-cover h-full w-full" />
          )}
        </div>

        {/* Content - 2/3 */}
        <div className="w-2/3 p-4 flex flex-col justify-between">
          <div>
            {titleToUse && (
              <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                {titleToUse}
              </h3>
            )}
            {founded_year && (
              <p className="text-sm text-muted-foreground">Founded: {founded_year}</p>
            )}
            {address && <p className="text-sm text-muted-foreground">Address: {address}</p>}
            {description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {sanitizedDescription}
              </p>
            )}
          </div>

          {/* Arrow icon */}
          <div className="flex justify-end mt-4">
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </article>
    </Link>
  )
}