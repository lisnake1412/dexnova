import React, { useState } from 'react'
import styled from 'styled-components'
import Navigator from 'components/Navigator'
import NetworkSelector from 'components/NetworkSelector'
import Web3Status from 'components/Web3Status'
import BrandLogo from 'assets/brand/logo.png'
import { Columns } from 'components/Layouts'
import { useNavigate } from 'react-router-dom'
import imgClose from 'assets/icons/x.svg'
import iconMenu from 'assets/icons/menu.png'

const Header = () => {
    const [burgerNav, setBurgerNav] = useState(false)
    const navigate = useNavigate()

    return (
        <HeaderWrapper>
            <Columns>
                <Logo onClick={() => navigate('/')}>
                    <img src={BrandLogo} alt="logo" />
                </Logo>
            </Columns>
            <Columns al="start" jus="center">
                <Navigator burgerNav={burgerNav} setBurgerNav={setBurgerNav} />
            </Columns>
            <Columns al="flex-end">
                <WrapConnect>
                    <Connector>
                        <NetworkSelector />
                        <Web3Status />
                    </Connector>
                    <WrapperNavigator onClick={() => setBurgerNav((i) => !i)}>
                        {!burgerNav ? (
                            <>
                                <MenuIcon>
                                <img src={iconMenu} alt="" className='nav_menu' />
                                </MenuIcon>
                            </>
                        ) : (
                            <MenuIcon>
                                <img src={imgClose} alt="" className='close_menu'  />
                            </MenuIcon>
                        )}
                    </WrapperNavigator>
                </WrapConnect>
            </Columns>
        </HeaderWrapper>
    )
}
const WrapConnect = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`

export const HeaderWrapper = styled.div`
    width: 100%;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1;
    display: grid;
    grid-template-columns: 100px 1fr 1fr;
    grid-gap: 30px;
    align-items: center;
    padding: 0 10px 0 10px;
    min-height: 45px;
    background: linear-gradient(0deg, rgb(61, 122, 190) 0%, rgb(40, 175, 229) 100%);
    padding-top: 0px;
    padding-bottom: 0px;
    @media(max-width: 768px) {
        grid-template-columns: 120px 0 190px;
        padding: 10px;
        z-index:999;
        justify-content: space-between;
    }

    @media(max-width: 375px) {
        grid-template-columns: 1fr 0 150px;
    }
`

const WrapperNavigator = styled.div`
    display: none;
    justify-content: center;
    font-weight: 600;
    font-style: normal;
    @media(max-width: 1000px) {
        display: flex;
    }
    @media(max-width: 576px) {
        width: 35px;
        height: 35px;
        border-radius: 10px;
    }
`

export const Logo = styled.div`
    display: flex;
    width: 100px;
    cursor: pointer;
    @media(max-width: 576px) {
        width: 110px;
    }
    img {
        width: 100%;
    }
`

export const Connector = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: flex-end;
`

const MenuIcon = styled(Columns)`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    .close_menu{
        width: 20px;
        height: 20px;
    }
    .nav_menu{
        max-width: 35px;
        max-height: 35px;
    }
    span {
        height: 3px;
        background: #fff;
        width: 70%;
        margin: 0 auto;
    }
    @media(max-width: 576px) {
        span {
            height: 1.2px;
        }
    }
`

export default Header
