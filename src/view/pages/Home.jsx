import React, { useEffect } from 'react';
import '../../styles/home/home.css';
import HeroSectionHome from '../components/home/HeroSectionHome.jsx';
import MainSectionHome from '../components/home/MainSectionHome.jsx';
import Footer from '../components/others/Footer.jsx';

function Home(){
    useEffect(() => {
        const contenedor = document.getElementById("top");
        if (contenedor) {
        contenedor.scrollIntoView({ behavior: "instant" });
        }
    }, []);
    
    return(
        <>  
            <div id='top'></div>
            <header className='header-home'>
                <HeroSectionHome />
            </header>
            <main className='main-home'>
                <MainSectionHome />
            </main>
            <footer className='footer-home'>
                <Footer />
            </footer>
        </>
    );
}

export default Home;