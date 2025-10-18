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
                    <li><a href="#login">Login</a></li>
                </ul>
            </nav>
            {/* Main Text */}
            <div className="header-text">
                <p className="sono-regular">TAMU Guessr</p>
                <h1 className="sono-regular">This weeks theme is <span>SKATING!</span></h1>
            </div>

            <div>
                <Card title="Play" description=""/>
            </div>
        </div>
    </div>
  );
}
