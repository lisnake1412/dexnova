import styled from "styled-components"
import { ZKS_TOKEN } from "constants/index"
import { useTokenBalance } from "hooks/useCurrencyBalance"
import { useWeb3React } from "@web3-react/core"
import Logo from "assets/brand/logo.png"
import { Columns, Row } from "components/Layouts"
import Twitter from "assets/icons/twitter.svg"
import Discord from "assets/icons/discord.svg"
import PrimaryButton from "components/Buttons/PrimaryButton"
import { useNavigate } from "react-router-dom"

const links = [
    {
        img: Twitter,
        url: "/",
    },
    {
        img: Discord,
        url: "/",
    }
]

const Footer = () => {
    const { account, chainId } = useWeb3React()
    const balance = useTokenBalance(account, ZKS_TOKEN?.[chainId || 324])
    const navigate = useNavigate()

    return(
        <FooterWrapper>
            <Top>
                <div className="logo">
                    <img src={Logo} alt="logo footer" />
                </div>
                <Row gap="20px" className="social">
                    {
                        links.map(item => {
                            return (
                                <a href={item.url} className="icon" target="_blank">
                                    <img src={item.img} alt={`social icons`} />
                                </a>
                            )
                        })
                    }
                </Row>
            </Top>
            <Bottom>
                <span>${balance ? Number(balance).toFixed(4) : '0.0000'}</span>
                <PrimaryButton onClick={() => navigate("/swap")} name="Buy ZKS ->" width="200px" />
            </Bottom>
        </FooterWrapper>
    )
}

const Bottom = styled(Row)`
    justify-content: flex-end;
    align-items: center;
    height: 100px;
    gap: 20px;
`

const Top = styled(Columns)`
    border-bottom: 1px solid var(--border1);
    padding: 20px;
    gap: 30px;
    .logo {
        max-width: 120px;
        img {
            width: 100%;
        }
    }
    .icon {
        width: 20px;
        transition: all ease-in-out .1s;
        cursor: pointer;

        :hover {
            transform: scale(1.2);
        }
    }
`

const FooterWrapper = styled.div`
    min-height: 300px;
    background: var(--bg1);
    padding: 20px;
`

export default Footer