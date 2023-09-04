import { Columns, Row } from "components/Layouts"
import styled from "styled-components"
import HeroImage from "assets/home/IFO.webp"
import { AlignLeft } from "react-feather"
import PrimaryButton from "components/Buttons/PrimaryButton"
import SkateBoard from "assets/home/skateboard.webp"
import { useNavigate } from "react-router-dom"

const HomePage = () => {
    const navigate = useNavigate()
    return(
        <HomeWrapper>
            <Hero>
                <Columns className='left'>
                    <span className="live">Live</span>
                    <span className="go">GO BEYOND</span>
                    <a href="" className="link">Go {'->'}</a>
                </Columns>
                <Right>
                    <img src={HeroImage} alt="hero image" />
                </Right>
            </Hero>
            <Trade>
                <TradeLeft>
                    <span className="big"><span>L</span>ET'S <span>F</span>UCKING <span>G</span>O</span>
                    <span className="big"><span>L</span>ET'S <span>F</span>ORM <span>G</span>ROUP</span>
                    <span className="big"><span>L</span>ET'S <span>F</span>OR <span>G</span>ROUP</span>
                    <span className="small">Trade, earn, and win crypto on the most popular decentralized platform in the galaxy.</span>
                    <PrimaryButton name="Trade Now" width="150px" height="50px" onClick={() => navigate("/swap")} />
                </TradeLeft>
                <TradeRight>
                    <img src={SkateBoard} alt="skateboard" />
                </TradeRight>
            </Trade>
        </HomeWrapper>
    )
}

const TradeLeft = styled(Columns)`
    max-width: 500px;
    max-height: 400px;
    width: 100%;
    justify-content: center;
    gap: 20px;
    .big {
        font-size: 40px;
        font-weight: 900;
        span {
            color: var(--text2);
        }
    }

    @media(max-width: 768px) {
        .big {
            font-size: 30px;
        }
    }
`

const TradeRight = styled.div`
    width: 100%;
    img {
        max-width: 500px;
    }
`

const Trade = styled(Row)`
    justify-content: space-between;
    width: 100%;
    margin-top: 60px;
    position: relative;

    @media(max-width: 650px) {
        flex-direction: column-reverse;
    }
`

const HomeWrapper = styled.div`
    padding: 20px;
    max-width: 1100px;
    margin: 0 auto;
`

const Hero = styled.div`
    width: 100%;
    height: 180px;
    background: linear-gradient(91.37deg, rgb(76, 103, 181) 1.19%, rgb(255, 205, 29) 99.65%);
    border-radius: 20px;
    display: flex;
    padding: 20px;
    align-items: center;
    justify-content: space-between;
    position: relative;
    margin-top: 60px;
    z-index: 0;
    
    .left {
        gap: 20px;
        position: relative;
        z-index: 1;
        .live {
            color: var(--text2);
            font-size: 22px;
            font-weight: bold;
        }

        .go {
            font-size: 26px;
            font-weight: bold;
        }

        .link {
            width: 80px;
            height: 40px;
            background: #c7a221;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
`

const Right = styled.div`
    position: absolute;
    right: 80px;
    bottom: -4px;
    max-width: 500px;
    img {
        width: 100%;
        height: 280px;

    }

    @media(max-width: 576px) {
        right: 0;
        img {
            width: 150px;
            height: unset;
        }
    }
`

export default HomePage