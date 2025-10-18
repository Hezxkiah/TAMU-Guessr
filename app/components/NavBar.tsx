import React from 'react'
import Image from "next/image";
import styles from "./NavBar.module.css"

interface Props {
    inLoginPage: boolean;
}

const NavBar = ({ inLoginPage }: Props) => {
    console.log("NavBar - inLoginPage:", inLoginPage);
  return (            
    <nav className={styles.Nav + " sono-regular relative"}>
        <div className="absolute h-full w-70 bg-white left-0"></div>
        {/* Logo */}
        <Image src="/texasA&MLogoCropped.png"
                width={180}             
                height={100}            
                alt="Texas A&M Logo"
                className="z-100"
        />
        {/* Navigation */}
        <ul id="sidemenu" className = "sono-regular">
            <li><a href="#header"></a></li>
            {inLoginPage && <li><a href="/home">Home</a></li>}
            {!inLoginPage && <li><a href="#about">Play</a></li>}
            {!inLoginPage && <li><a href="/login">Login</a></li>}
        </ul>

        <div className="title-text">
          <p>Aggie Guessr</p>
        </div>
    </nav>
  )
}

export default NavBar
