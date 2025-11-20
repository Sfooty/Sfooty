import { cn } from '@/utilities/cn'
import React from 'react'

import { PlayerGrid, CardPlayerData } from '@/components/List/listPlayers'

export type Props = {
  players: CardPlayerData[]
}

export const CollectionArchivePlayers: React.FC<Props> = ({ players })=> {
  // const { players } = props

  return (
    <div className={cn('container')}>
      <div className="space-y-4">
      <div className="flex flex-row items-center  space-x-4 p-4 border-b-4 border-black-200 cursor-pointer">
          <div className="text-xs text-gray-600 basis-2/5">Player</div>
          <div className="text-xs text-gray-600 basis-1/5">Position</div>
          <div className="text-xs text-gray-600 basis-1/5">Country</div>
          <div className="text-xs text-gray-600 basis-1/5">Date Of Birth</div>
      </div>
        {players.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return <PlayerGrid key={index} doc={result} relationTo="players" />
          }

          return null
        })}
      </div>
    </div>
  )
}
