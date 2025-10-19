import Image from "next/image";
import React from 'react'
import styles from "./Card.module.css"

interface Props {
    title: string;
    description: string;
    images: string[];
    reverseZ: boolean;
}

export default function Card({ title, description, images, reverseZ }: Props) {
  // const onMouseOver = (this) => {
  //   // const cardImages = document.querySelectorAll("figure.object-cover")

  //   // cardImages.forEach((img) => {
      
  //   // }

  //   console.log("hovered");
  // }

  return (
    <div className={styles.Card + " relative"}>
      <figure id="image-holder" className="relative w-full h-64">
        <Image
          src={images[0]}
          alt="Building"
          fill
          className={`${styles.ImageCard} ${styles.ObjectCover1} absolute`}
          style={{
            zIndex: reverseZ ? 2 : 0
          }}
        />
        <Image
          src={images[1]}
          alt="Building"
          fill
          className={`${styles.ImageCard} ${styles.ObjectCover2} absolute`}
        />
      </figure>
      <div className={"absolute card-body top-10 z-10"}>
        <h2 className="card-title special-elite-regular text-white z-10 text-[34px] px-2">{ title }</h2>
        <p className={styles.TextShadow + " special-elite-regular text-white z-10 p-2"}>{ description }</p>
        {/* <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div> */}
      </div>
    </div>
  );
}