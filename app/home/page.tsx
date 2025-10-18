import Image from "next/image";
import Card from "../components/Card";
import styles from "./Page.module.css"
import NavBar from "../components/NavBar";

export default function Home() {
  return (
    <div id="header">
        <div className="contain">
            {/* Header */}
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
                    <li><a href="#about">Play</a></li>
                    <li><a href="/login">Login</a></li>
                </ul>
            </nav>
            <NavBar withoutLogin={true} />
            
            {/* Revellie Image */}
            <div className="revellie-image">
                <Image src="/revellie-removebg-preview.png"
                        width={200}             
                        height={200}            
                        alt="Revellie"
                />
            </div>
            {/* Main Text */}
            <div className="header-text">
                <p className="sono-regular">TAMU Guessr</p>
                <h1 className="sono-regular">This weeks theme is <span>SKATING!</span></h1>
            </div>
             {/* Game Description */}
            <div id="about" className="about-text">
                <h2 className="sono-regular">About TAMU Guessr</h2>
                <p className="sono-regular">
                    TAMU Guessr is a geography guessing game themed around Texas A&M University. 
                    Players are placed in a random location on the Texas A&M campus using Google Street View and must navigate their surroundings to guess their exact location. 
                    The closer the guess, the more points earned! Compete with friends and see who knows the campus best!
                </p>
            </div>
            {/* Play Cards */}
            <a href="/round">
                <div className={styles.Container}>
                    <Card title="Play" description="A match of 5 rounds around campus"/>
                    <Card title="Play" description="A match of 3 rounds around campus"/>
                    <Card title="Play" description="A match of 1 rounds around campus"/>
                </div>
            </a>
            
           
            {/* Footer */}
            <div className="footer">
                <p className="sono-regular">© 2024 TAMU Guessr. All rights reserved.</p>
            </div>
        </div>
    </div>
  );
}
