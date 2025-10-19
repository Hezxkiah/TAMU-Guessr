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
                <Image src="/revglobalLogo.png"
                        width={220}             
                        height={220}            
                        alt="Revellie"
                />
            </div>
            {/* Main Text */}
            <div className="header-text">
                <h1 className="special-elite-regular">This weeks theme is..</h1>
                <h1 className="special-elite-regular text-50" ><span>SKATING!</span></h1>
            </div>
             {/* Game Description */}
            <div id="about" className={"about-text"}>
                <h2 className="special-elite-regular">About TAMU Guessr</h2>
                <div className="h-1 my-5 mx-6 bg-white"></div>
                <p className="special-elite-regular">
                    TAMU Guessr is a geography guessing game themed around Texas A&M University. 
                    Players are placed in a random location on the Texas A&M campus using Google Street View and must navigate their surroundings to guess their exact location. 
                    The closer the guess, the more points earned! Compete with friends and see who knows the campus best!
                </p>
            </div >
            {/* Play Cards */}
            <div id = "cards">
                <a href="/round">
                    <div className={styles.Container}>
                        <Card title="Quick Round" description="A streetview game seen through the roads of campus!" images={["/academicBuilding.jpg", "/zachary.jpg"]} reverseZ={false}/>
                        <Card title="Challenge Round" description="No moving around, lower time, higher stakes!" images={["/msc.JPG", "/zachary.jpg"]} reverseZ={true}/>
                        <Card title="Multiplayer" description="Play with friends through join codes, 5 rounds!" images={["/kyleField.jpg", "/rudderTower.jpg"]} reverseZ={false}/>
                    </div>
                </a>
            </div>
            {/* Linkedins */}
             <div className="contact">
                <div className="contact">
                    {/* Hezekiah */}
                    <div className="contact-item">
                        <p><i className="fa-solid fa-paper-plane"></i> hezekiahgitenyi24@gmail.com</p>
                        <div className="social-icons">
                            <a href="http://www.linkedin.com/in/hezekiah-gitenyi-927282280" target="_blank"><i className="fa-brands fa-linkedin"></i></a>
                            <a href="https://github.com/Hezxkiah" target="_blank"><i className="fa-brands fa-github"></i></a>
                        </div>
                    </div>
                    {/* Axel */}
                    <div className="contact-item">
                        <p><i className="fa-solid fa-paper-plane"></i> gaaxel30@gmail.com</p>
                        <div className="social-icons">
                            <a href="https://www.linkedin.com/in/axel-garcia-07b842352/" target="_blank"><i className="fa-brands fa-linkedin"></i></a>
                            <a href="https://github.com/itsoporo" target="_blank"><i className="fa-brands fa-github"></i></a>
                        </div>
                    </div>
                    {/* Andrew */}
                    <div className="contact-item">
                        <p><i className="fa-solid fa-paper-plane"></i> andrewblair800@gmail.com</p>
                        <div className="social-icons">
                            <a href="https://www.linkedin.com/in/andrew-blair-43344438b/" target="_blank"><i className="fa-brands fa-linkedin"></i></a>
                            <a href="https://github.com/andrewblair390" target="_blank"><i className="fa-brands fa-github"></i></a>
                        </div>
                    </div>

                </div>
             </div>
            {/* Footer */}
            <div className="footer">
                <p className="special-elite-regular">© 2025 TAMU Guessr. All rights reserved.</p>
            </div>
        </div>
    </div>
  );
}
