import React from 'react'
import Image from "next/image";
import styles from "./NavBar.module.css"

interface Props {
    withoutLogin?: boolean;
}

const NavBar = ({ withoutLogin }: Props) => {
  return (            
    <nav className={styles.Nav + " sono-regular relative"}>
        <div className="absolute h-full w-70 bg-white left-0"></div>
        {/* Logo */}
        <Image src="/texasA&MLogo.png"
                width={200}             
                height={200}            
                alt="Texas A&M Logo"
                className="z-100"
        />
        {/* Navigation */}
        <ul id="sidemenu" className = "sono-regular">
            <li><a href="#header"></a></li>
            <li><a href="#about">About</a></li>
            <li><a href="/login">Login</a></li>
        </ul>
    </nav>
  )
}

export default NavBar
