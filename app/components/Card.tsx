import Image from "next/image";
import React from 'react'
import styles from "./Card.module.css"

interface Props {
    title: string;
    description: string;
}

export default function Card({ title, description }: Props) {
  return (
    <div className={styles.Card + " relative"}>
      <figure className="relative w-full h-64">
        <Image
          src="/zachary.jpg"
          alt="Shoes"
          fill
          className={styles.Card + " object-cover"}
        />
      </figure>
      <div className={"absolute card-body top-10"}>
        <h2 className="card-title sono-regular text-white z-10 text-[34px]">{ title }</h2>
        <p className={styles.TextShadow + " sono-regular text-white z-10"}>{ description }</p>
        {/* <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div> */}
      </div>
    </div>
  );
}