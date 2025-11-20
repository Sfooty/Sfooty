'use client'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'
import type { Player } from '@/payload-types'
import { Media } from '@/components/Media'

export type CardPlayerData = Pick<
  Player,
  'id' | 'name' | 'image' | 'position' | 'country' | 'height' | 'slug' | 'weight' | 'date_of_birth' 
>

export const PlayerGrid: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPlayerData
  relationTo?: 'players'
  showBio?: boolean
  name?: string
}> = (props) => {
  const { link } = useClickableCard({})
  const { doc } = props

  const { country, image, position, name, slug, date_of_birth } = doc || {}
  console.log(`this is my slug motherfucker ` +slug)

  return (
    <Link href={`/players/${slug}`} ref={link.ref as React.Ref<HTMLAnchorElement>}>
      <div className="flex flex-row items-center space-x-4 p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer">
        {/* Player Image */}
        <div className= "flex flex-row basis-2/5 gap-2 items-center">
        <div className=" flex flex-row w-12 h-12 ">
          {!image ? (
            <div className="flex justify-center items-center text-gray-400">No image</div>
          ) : (
            <Media resource={image} size="10vw" />
          )}
          
        </div>
        
        <h3 className="text-sm font-semibold text-gray-900 truncate ">{name}</h3>
        </div>
        {/* Player Information */}
       
          <div className="text-xs text-gray-600 basis-1/5">{position}</div>
          <div className="text-xs text-gray-600 basis-1/5">{country} c</div>
          <div className="text-xs text-gray-600 basis-1/5">{date_of_birth}</div>

        
      </div>
    </Link>
  )
}
