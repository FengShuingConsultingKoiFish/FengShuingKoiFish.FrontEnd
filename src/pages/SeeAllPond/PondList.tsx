import React from "react"

import PondCard from "./PondCard"

interface Pond {
  id: number
  pondName: string
  quantity: number
  description: string
  image: string
  score: number
}

interface PondListProps {
  ponds: Pond[]
  visiblePonds: number
  onDelete: (id: number) => void
  onUpdate: (updatedPond: Pond) => void
  validateName: (name: string, id: number) => boolean
}

const PondList: React.FC<PondListProps> = ({
  ponds,
  visiblePonds,
  onDelete,
  onUpdate,
  validateName
}) => {
  return (
    <div className="w-full">
      {ponds.slice(0, visiblePonds).map((pond) => (
        <div key={pond.id} id={`pond-${pond.id}`}>
          <PondCard
            key={pond.id}
            pond={pond}
            onDelete={onDelete}
            onUpdate={onUpdate}
            validateName={validateName}
          />
        </div>
      ))}
    </div>
  )
}

export default PondList
