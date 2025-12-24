import { cn } from '@/utilities/cn'
import React from 'react'

import { CardClub, CardClubData } from '@/components/Card/cardClub'

export type Props = {
  clubs: CardClubData[]
}

export const CollectionArchiveClubs: React.FC<Props> = (props) => {
  const { clubs } = props

  return (
    <div className={cn('container')}>
      <div>
        <div className="flex flex-wrap gap-6">
          {clubs?.map((club, i) => (
            <div key={i} className="w-full sm:w-1/2 lg:w-1/3">
              <CardClub doc={club} relationTo="clubs" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
