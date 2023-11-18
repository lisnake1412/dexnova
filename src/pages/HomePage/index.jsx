import "./homepage.module.scss"
import Header from 'components/HeaderV2'
import FirstPage from './FirstPage';
import SecondPage from './SeconPage';
import ThirdPage from './ThirdPage';
import FourthPage from './FourthPage';
import FifthPage from './FifthPage';
import SixthPage from './SixthPage';
import Footer from 'components/FooterV2';
import style from './homepage.module.scss'
function HomePage() {
    return (
        <section className={style['wrapper']}>
            <Header/>
            <FirstPage />
            <SecondPage />
            <ThirdPage />
            <FourthPage />
            <FifthPage />
            <SixthPage />
            <Footer />
        </section>
    );
}

export default HomePage;
