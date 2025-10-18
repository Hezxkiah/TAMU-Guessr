import Image from "next/image";
import React from 'react'
import styles from "./Card.module.css"

interface Props {
    title: string;
    description: string;
}

export default function Card({ title, description }: Props) {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <figure className="relative w-full h-64">
        <Image
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Shoes"
          fill
          className="object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Card Title</h2>
        <p>
          A card component has a figure, a body part, and inside body there are
          title and actions parts
        </p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
}