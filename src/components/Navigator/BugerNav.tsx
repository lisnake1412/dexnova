import React, { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import BrandLogo from 'assets/brand/logo.png'
import { navs } from '.'
import { ChevronDown } from 'react-feather'
import { Row } from 'components/Layouts'

interface BurgerNavProps {
    burgerNav: boolean
    setBurgerNav: React.Dispatch<React.SetStateAction<boolean>>
}
const BurgerNav = ({ burgerNav, setBurgerNav }: BurgerNavProps) => {
    const loca = useLocation()
    const [currentOpen, setCurrentOpen] = useState(-1)

    const NavItem = (nav: typeof navs[0], index: number) => {
        return (
            <WrapperNavItem key={index + 1} onClick={() => {
                if(currentOpen === index) {
                    setCurrentOpen(-1)
                } else {
                    setCurrentOpen(index)
                }
            }}>
                <Lable>
                    <span>{nav.name}</span>
                    <ChevronDown />
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
                                                    <Link onClick={() => setBurgerNav(false)} to={path.path}>{path.name}</Link>
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
            <Container burgerNav={burgerNav}>
                <Logo>
                    <img className="logo" src={BrandLogo} alt="swap logo" />
                </Logo>
                {navs.map((item, index) => {
                    return NavItem(item, index)
                })}
            </Container>
            {burgerNav ? <Blur onClick={() => setBurgerNav(false)} /> : <></>}
        </>
    )
}

export default BurgerNav
const Container = styled.div<{ burgerNav: boolean }>`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(0deg,rgb(61,122,190) 0%,rgb(40,175,229) 100%);
    backdrop-filter: blur(10px);
    width: 300px;
    height: 100vh;
    z-index: 16;
    list-style: none;
    padding: 0px;
    display: flex;
    flex-direction: column;
    text-align: start;
    transition: transform 0.2s ease-in;
    transform: ${({ burgerNav }) =>
        burgerNav ? 'translateX(0px)' : 'translateX(-300px)'};

    a {
        padding: 10px 10px;
        color: ${({ theme }) => theme.text1};
    }
    @media screen and (max-width: 390px) {
        width: 220px;
    }
`

const Logo = styled.div`
    img {
        height: 50px;
        width: unset;
    }
    @media screen and (max-width: 390px) {
        padding: 25px 25px;
        text-align: center;
        img {
            height: 30px;
        }
        
    }
`

const Blur = styled.div`
    position: fixed;
    width: 100%;
    top: 0;
    height: 100vh;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.424);
    z-index: 4;
    transition: all 0.2s linear;
`

const Lable = styled(Row)`
    padding: 15px;
    justify-content: space-between;
    line-height: 24px;
    padding: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    border-top: 1px solid rgb(255 255 255 / 6%);
`

const WrapperNavItem = styled.div`
    position: relative;
    cursor: pointer;
`

const NavModal = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 200px;

    a {
        height: 30px;
        display: flex;
        align-items: center;
        padding-top: 10px;
        padding-left: 30px;       
        color: #fff;
        font-size: 14px;
    }
`