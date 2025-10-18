import Image from "next/image";
import Card from "../components/Card";

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
            {/* Main Text */}
            {/* Revellie Logo */}
            <div className="revellie-image">
                <Image src="/revellie-removebg-preview.png"
                        width={200}             
                        height={200}            
                        alt="Revellie Image"
                />
            </div>
            {/* Text */}
            <div className="header-text">
                <p className="sono-regular">TAMU Guessr</p>
                <h1 className="sono-regular">This weeks theme is <span>SKATING!</span></h1>
            </div>
            {/* Cards */}
            <div>
                <Card title="Play" description=""/>
            </div>
            {/* Actual Game */}
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
