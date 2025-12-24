'use client'

import React, { useMemo, useState } from 'react'
import { Media } from '@/components/Media'
import { formatDateTime } from 'src/utilities/formatDateTime'

import type { Club, Player } from '@/payload-types'

export const ClubHero: React.FC<{
  club: Club & { players?: Player[] }
}> = ({ club }) => {
  const {
    club_name,
    description,
    coach_name,
    website,
    trophy_photo,
    publishedAt,
    jerseys,
    players = [],
  } = club

  const [selectedPosition, setSelectedPosition] = useState<string>('All')

  // Generate list of unique positions
  const uniquePositions = useMemo(() => {
    const positions = Array.from(new Set(players.map((p) => p.position)))
    return ['All', ...positions]
  }, [players])

  // Filtered player list
  const filteredPlayers = useMemo(() => {
    if (selectedPosition === 'All') return players
    return players.filter((p) => p.position === selectedPosition)
  }, [players, selectedPosition])

  console.log('this are the players ' + players)

  return (
    <div className="relative -mt-[10.4rem] flex flex-col text-black dark:text-white">
      {/* Club Info */}
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="uppercase text-sm mb-6">{club_name}</div>
          <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{club_name}</h1>

          <div className="flex flex-col md:flex-row gap-4 md:gap-16">
            {coach_name && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Coach</p>
                <p>{coach_name}</p>
              </div>
            )}
            {publishedAt && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Date Established</p>
                <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
              </div>
            )}
            {website && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Website</p>
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 dark:text-blue-400"
                >
                  {website}
                </a>
              </div>
            )}
          </div>

          {description?.root?.children && (
            <div className="mt-4">
              <p className="text-sm">
                {description.root.children
                  .map((child) => (child.type === 'text' ? child.text : ''))
                  .join(' ')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Jerseys */}
      <div className="container mt-8">
        <div className="grid grid-cols-3 gap-8">
          {jerseys.home && (
            <div className="flex flex-col items-center">
              <p className="text-lg">Home Jersey</p>
              {typeof jerseys.home !== 'string' && (
                <Media imgClassName="w-full" resource={jerseys.home} />
              )}
            </div>
          )}
          {jerseys.away && (
            <div className="flex flex-col items-center">
              <p className="text-lg">Away Jersey</p>
              {typeof jerseys.away !== 'string' && (
                <Media imgClassName="w-full" resource={jerseys.away} />
              )}
            </div>
          )}
          {jerseys.third && (
            <div className="flex flex-col items-center">
              <p className="text-lg">Third Jersey</p>
              {typeof jerseys.third !== 'string' && (
                <Media imgClassName="w-full" resource={jerseys.third} />
              )}
            </div>
          )}
        </div>

        {trophy_photo && (
          <div className="mt-8 text-center">
            <p className="text-lg">Trophy Photo</p>
            {typeof trophy_photo !== 'string' && (
              <Media imgClassName="w-48 mx-auto" resource={trophy_photo} />
            )}
          </div>
        )}
      </div>
      {/* ✅ Players with Position Filter */}
      {players.length > 0 && (
        <div className="container mt-16">
          <h2 className="text-2xl font-semibold mb-4">Players</h2>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {uniquePositions.map((pos) => (
              <button
                key={pos}
                onClick={() => setSelectedPosition(pos)}
                className={`px-4 py-2 rounded-full border ${
                  selectedPosition === pos
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-700 text-black dark:text-white border-gray-400 dark:border-gray-500'
                } transition`}
              >
                {pos}
              </button>
            ))}
          </div>

          {/* Player grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredPlayers.map((player) => (
              <div
                key={player.id}
                className="flex flex-col items-center border rounded-md p-4 bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm"
              >
                {player.image && typeof player.image !== 'string' && (
                  <Media
                    imgClassName="w-24 h-24 object-cover rounded-full mb-3"
                    resource={player.image}
                  />
                )}
                <p className="font-semibold text-center">{player.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{player.position}</p>
                {player.shirt_number && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">#{player.shirt_number}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
