import styled from "styled-components"
import { ZKS_TOKEN } from "constants/index"
import { useTokenBalance } from "hooks/useCurrencyBalance"
import { useWeb3React } from "@web3-react/core"
import Logo from "assets/brand/logo.png"
import { Columns, Row } from "components/Layouts"
import imgIconDiscord from "assets/icons/imgIconDiscord.png";
import imgIconTele from "assets/icons/imgIconTele.png";
import imgIconTw from "assets/icons/imgIconTw.png";
import imgIconWeb from "assets/icons/imgIconWeb.png";
import imgIconYt from "assets/icons/imgIconYt.png";
import PrimaryButton from "components/Buttons/PrimaryButton"
import { useNavigate } from "react-router-dom"
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const links = [
    {
        img: imgIconDiscord,
        url: "https://discord.gg/7QMjDAgqNF",
    },
    {
        img: imgIconTele,
        url: "https://t.me/Ancora_Finance",
    },
    {
        img: imgIconTw,
        url: "https://twitter.com/AncoraFinance",
    },
]

const Footer = () => {
    const { account, chainId } = useWeb3React()
    const balance = useTokenBalance(account, ZKS_TOKEN?.[chainId || 324])
    const navigate = useNavigate()

    return(
        <FooterWrapper>
            <div className="container">
                <div className="wp-footer">
                    <Top>
                        <div className="logo">
                            <img src={Logo} alt="logo footer" />
                        </div>
                        <ul>
                            <li><Link to='/swap' >Trade</Link></li>
                            <li><Link to='/farms' >Farm</Link></li>
                            <li><Link to='/private_sale' >Launchpad</Link></li>
                            <li><Link to='/comingsoon' >NFT</Link></li>
                        </ul>
                       
                    </Top>
                    <Bottom>
                        <div className="wp-left-icon">
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
                        </div>
                        <div className="wp-right-footer">
                            <span>${balance ? Number(balance).toFixed(4) : '0.0000'}</span>
                            <PrimaryButton onClick={() => navigate("/swap")} name="Buy ACR" width="200px" />
                        </div>
                    </Bottom>
                </div>
            </div>
        </FooterWrapper>
    )
}

const Bottom = styled(Row)`
    align-items: center;
    gap: 20px;
    display: flex;
    justify-content: space-between;
    padding: 15px 0;
    .wp-right-footer {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .wp-right-footer{
        button{
            margin-right:0;
            margin-left:10px;
        }
    }
    .icon {
        width: 30px;
        transition: all ease-in-out .1s;
        cursor: pointer;

        :hover {
            transform: scale(1.2);
        }
    }
    @media screen and (max-width: 767px) {
        display: block;
        .wp-left-icon {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .wp-right-footer {
            align-items: center;
            justify-content: space-between;
            padding: 10px 10px 40px;
        }
    }
`

const Top = styled(Columns)`
    padding: 20px 0px 20px 0;
    gap: 20px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    flex-direction: inherit;
    align-items: center;
    border-bottom: 1px solid #f9f9f91f;
    ul{
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: flex-end;
        list-style: none;
        li{
            list-style: none;
            a{
                text-decoration: none;
                outline: 0 !important;
                position: relative;
                color: var(--whiteColor);
                transition: var(--transition);
                font-weight: 400;
                font-size: 16px;
                padding-left: 20px;
                padding-right: 20px;
                padding-top: 15px;
                padding-bottom: 15px;
                display: block;
                
            }
            &:last-child{
                a{
                    padding-right: 0px;
                }
            }
        }
    }
    @media screen and (max-width: 767px) {
        justify-content: center;
        ul{
            display:none;
        }
    }
    .logo {
        max-width: 150px;
        img {
            width: 100%;
        }
    }
    
`

const FooterWrapper = styled.div`
    background-color: #2A9BD6;
    padding: 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .container {
        padding: 0;
        margin: 0 auto;
        max-width: 1200px;
        width: 100%;
    }
`

export default Footer