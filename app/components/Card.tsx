import React from 'react'

interface Props {
    title: string;
    description: string;
}

const Card = ({title, description}: Props) => {
  return (
    <div>
      <button type="button" className="btn btn-primary">description</button>
    </div>
  )
}

export default Card
