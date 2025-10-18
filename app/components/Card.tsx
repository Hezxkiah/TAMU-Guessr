import React from 'react'
import styles from "./Card.module.css"

interface Props {
    title: string;
    description: string;
}

const Card = ({title, description}: Props) => {
  return (
    <>
      <button type="button" className={styles.Card + " btn btn-primary"}>
        <h1 className="text-white sono-regular">{title}</h1>
        <p className="text-white sono-regular m-15">{description}</p>
      </button>
    </>
  )
}

export default Card
