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
            <div className="revellie-image m-15">
                <Image src="/guessrLogo.png"
                        width={220}             
                        height={220}            
                        alt="Tamu Guessr Logo"
                />
            </div>
            {/* Main Text */}
            <div className="header-text">
                <h1 className="special-elite-regular fade-in" style={{ animationDelay: '0.3s' }}>This weeks theme is..</h1>
                <h1 className="special-elite-regular text-50 fade-in" style={{ animationDelay: '0.7s' }}><span>AGGIE LANDMARKS!</span></h1>
            </div>

             {/* Game Description */}
            <div id="about" className="about-text fade-in" style={{ animationDelay: '1.3s' }}>
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
                    <div className={styles.Container}>
                        <Card href="/round" title="Casual Round" description="A streetview game seen through the roads of campus!" images={["/academicBuilding.jpg", "/zachary.jpg"]} reverseZ={false}/>
                        <Card href="/challenge" title="Challenge Round" description="Fixed position, 30 second time limit, higher stakes!" images={["/msc.JPG", "/zachary.jpg"]} reverseZ={true}/>
                        <Card href="/weekly" title="Weekly themed game" description="Our Weekly theme! A fun new challenge every single week." images={["/kyleField.jpg", "/rudderTower.jpg"]} reverseZ={false}/>
                    </div>
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
                        <p><i className="fa-solid fa-paper-plane"></i> gaaxel38@gmail.com</p>
                        <div className="social-icons">
                            <a href="https://www.linkedin.com/in/axel-garcia-07b842352/" target="_blank"><i className="fa-brands fa-linkedin"></i></a>
                            <a href="https://github.com/itsoporo" target="_blank"><i className="fa-brands fa-github"></i></a>
                        </div>
                    </div>
                    {/* Andrew */}
                    <div className="contact-item">
                        <p><i className="fa-solid fa-paper-plane"></i> andrewblair390@gmail.com</p>
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
