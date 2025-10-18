import Image from "next/image";
import Card from "../components/Card";
import styles from "./Page.module.css"
import NavBar from "../components/NavBar";

export default function Home() {
  return (
    <div id="header">
        <div className="contain">
            {/* Header */}
            <NavBar inLoginPage={false} />

            {/* Revellie Image */}
            <div className="revellie-image">
                <Image src="/rev_12thman.png"
                        width={300}             
                        height={300}            
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
                    <Card title="Quick Round" description="A streetview game seen through the roads of campus!"/>
                    <Card title="Challenge Round" description="Restricted to a static image for one second!"/>
                    <Card title="Multiplayer" description="Play with friends through join codes, 5 rounds!"/>
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
