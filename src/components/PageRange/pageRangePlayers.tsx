import React from 'react'

const defaultLabelPlayers = {
    players: {
        plural: 'Players',
        singular: 'Player',
    },
}

const defaultCollectionLabelPlayers = {
  players: {
    plural: 'Playerss',
    singular: 'Player',
  },
}

export const PageRange: React.FC<{
    className?: string
    collection?: keyof typeof defaultCollectionLabelPlayers
    collectionLabelPlayers?: {
      plural?: string
      singular?: string
    }
    currentPage?: number
    limit?: number
    totalDocs?: number
}> = (props) => {
    const {
        className,
        collection,
        collectionLabelPlayers: collectionLabelsFromProps,
        currentPage,
        limit,
        totalDocs,
    } = props

    let indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1
    if (totalDocs && indexStart > totalDocs) indexStart = 0

    let indexEnd = (currentPage || 1) * (limit || 1)
    if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs

    const { plural = 'Players', singular = 'Player' } =
    collectionLabelsFromProps ||
    (collection ? defaultCollectionLabelPlayers[collection] : undefined) ||
    defaultLabelPlayers.players; // Ensure 'players' is accessed explicitly


    return (
        <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
        {(typeof totalDocs === 'undefined' || totalDocs === 0) && 'Search produced no results.'}
        {typeof totalDocs !== 'undefined' &&
          totalDocs > 0 &&
          `Showing ${indexStart}${indexStart > 0 ? ` - ${indexEnd}` : ''} of ${totalDocs} ${
            totalDocs > 1 ? plural : singular
          }`}
      </div>
    )

}