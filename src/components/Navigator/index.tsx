import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import BurgerNav from './BugerNav'
import { Columns } from 'react-feather'

interface NavigationProps {
    burgerNav: boolean
    setBurgerNav: React.Dispatch<React.SetStateAction<boolean>>
}

export const navs = [
    {
        name: "Trade",
        paths: [
            {
                path: "/swap",
                name: "Swap",
                isExternal: false
            },
            {
                path: "/position",
                name: "Liquidity",
                isExternal: false
            }
        ],
    },
    {
        name: "Bridge",
        paths: [
            {
                path: "https://portal.zksync.io/",
                name: "Mainnet",
                isExternal: true
            },
            {
                path: "https://portal.zksync.io/?network=era-goerli",
                name: "Testnet",
                isExternal: true
            }
        ],
    },
    {
        name: "Earn",
        paths: [
            {
                path: "/farms",
                name: "Farm",
                isExternal: false
            },
            {
                path: "/pools",
                name: "Pool",
                isExternal: false
            }
        ],
    },
    {
        name: "NFT",
        paths: [
            {
                path: "/",
                name: "Marketplace",
                isExternal: false
            },
            {
                path: "/",
                name: "Mint",
                isExternal: false
            },
            {
                path: "/",
                name: "NFTfi",
                isExternal: false
            }
        ],
    },
    
    {
        name: "Launchpad",
        paths: [
            {
                path: "/private_sale",
                name: "Private Sale",
                isExternal: false
            },
            {
                path: "/public_sale",
                name: "PubLic Sale",
                isExternal: false
            }
        ]
    },
    {
        name: "Info",
        paths: [
            {
                path: "http://localhost:3000",
                name: "Analytics",
                isExternal: true
            }
        ]
    }
]

const Navigator = ({ burgerNav, setBurgerNav }: NavigationProps) => {
    const [currentOpen, setCurrentOpen] = useState(-1)

    const NavItem = (nav: typeof navs[0], index: number) => {
        return (


            <WrapperNavItem key={index + 1} onMouseEnter={() => setCurrentOpen(index)}  onMouseLeave={() => setCurrentOpen(-1)}>
                <Lable style={{color: index === navs.length - 1 ? 'var(--text2)' : ''}}>
                   
                    { 
                     nav.name
                    }
                </Lable>
                {
                    currentOpen === index && (
                        <NavModal>
                            {
                                nav.paths.map(path => {
                                    return (
                                        <>
                                            {
                                                path.isExternal ?
                                                    <a href={path.path} target={'_blank'}>{path.name}</a>
                                                :
                                                    <Link to={path.path}>{path.name}</Link>
                                            }
                                        </>
                                    )
                                })
                            }
                        </NavModal>
                    )
                }
            </WrapperNavItem>
        )
    }

    return (
        <>
            <NavigatorWrapper>
                {navs.map((item, index) => {
                    return NavItem(item, index)
                })}
            </NavigatorWrapper>
            <BurgerNav burgerNav={burgerNav} setBurgerNav={setBurgerNav} />
        </>
    )
}

const Lable = styled.div`
    padding: 15px;
    
`

const WrapperNavItem = styled.div`
    position: relative;
    cursor: pointer;
`

const NavModal = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    border: 1px solid #fff;
    top: 48px;
    left: -20px;
    padding: 10px;
    min-width: 200px;
    border-radius: 12px;
    background-color: rgb(255 255 255 );
    

    a {
        height: 30px;
        display: flex;
        align-items: center;
        padding: 20px;
        color: #000;
        :hover {
            background-image: linear-gradient(#0dccea,#0d70ea);
            color: #fff;
            text-decoration: none;
        }
    }
`

const NavigatorWrapper = styled.div`
    display: flex;
    align-items: center;
    // justify-content: center;
    gap: 20px;

    @media screen and (max-width: 1000px) {
        display: none;
    }
`

export default Navigator
