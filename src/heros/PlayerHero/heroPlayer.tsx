import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Player } from '@/payload-types'
// import type { Club } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'

export const PlayerHero: React.FC<{
    player: Player
}> = ({ player }) => {
    const { populatedAuthors, name, image, position, publishedAt, weight, country, date_of_birth, height } = player

    const hasAuthors =
        populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

    return (
        <div className="relative bg-gradient-to-r from-gray-200 via-black to-black text-black py-16">
            <div className="container mx-auto z-10 relative lg:grid lg:grid-cols-2 gap-16 items-center px-6">
                {/* Left Information Section */}
                <div className="space-y-8 md:space-y-12 text-center md:text-left">
                    {/* Authors */}
                    {hasAuthors && (
                        <div className="uppercase text-sm font-semibold mb-6 opacity-80 text-gray-400">
                            {formatAuthors(populatedAuthors)}
                        </div>
                    )}

                    {/* Player Name */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900">{name}</h1>

                    {/* Team and Position */}
                    {/* <div className="text-lg font-light mb-6 text-gray-700">
                        {team && <span>{ (team as Club)?.slug?? 'No team'}</span>}
                        {position && <span className="text-opacity-80">, {position}</span>}
                    </div> */}

                    {/* Published Date */}
                    {publishedAt && (
                        <div className="flex flex-col gap-3 mb-6">
                            <p className="text-sm font-medium text-gray-600">Date Published</p>
                            <time dateTime={publishedAt} className="text-lg text-gray-800">{formatDateTime(publishedAt)}</time>
                        </div>
                    )}

                    {/* Additional Info: Weight, Country, Date of Birth, Height */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                        {/* Weight */}
                        {weight && (
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-gray-600">Weight</p>
                                <p className="text-lg text-gray-800">{weight} kg</p>
                            </div>
                        )}

                        {/* Country */}
                        {country && (
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-gray-600">Country</p>
                                <p className="text-lg text-gray-800">{country}</p>
                            </div>
                        )}

                        {/* Date of Birth */}
                        {date_of_birth && (
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                                <p className="text-lg text-gray-800">{formatDateTime(date_of_birth)}</p>
                            </div>
                        )}

                        {/* Height */}
                        {height && (
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-gray-600">Height</p>
                                <p className="text-lg text-gray-800">{height} cm</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Image Section */}
                <div className="flex justify-center md:justify-start mt-8 md:mt-0">
                    <div className="w-72 md:w-96 lg:w-[25rem] h-[25rem] rounded-full overflow-hidden shadow-2xl">
                        <Media
                            className="w-full h-full object-cover"
                            resource={image}
                            size="33vw"
                            alt={name}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
