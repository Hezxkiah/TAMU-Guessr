import Image from "next/image";
import Card from "../components/Card";
import styles from "./Page.module.css"

export default function Home() {
  return (
    <div id="header">
        <div className="contain">
            {/* Header */}
            <nav className="sono-regular">
                {/* Logo */}
                <Image src="/texasA&MLogo.png"
                        width={200}             
                        height={200}            
                        alt="Texas A&M Logo"
                />
                {/* Navigation */}
                <ul id="sidemenu" className = "sono-regular">
                    <li><a href="#header"></a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="/login">Login</a></li>
                </ul>
            </nav>
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

            <div className={styles.Container}>
                <Card title="Play" description="A match of 5 rounds around campus"/>
                <Card title="Play" description="A match of 3 rounds around campus"/>
                <Card title="Play" description="A match of 1 rounds around campus"/>
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
        </div>
    </div>
  );
}
