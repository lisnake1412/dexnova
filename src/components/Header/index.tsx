import React, { useState } from 'react'
import styled from 'styled-components'
import Navigator from 'components/Navigator'
import NetworkSelector from 'components/NetworkSelector'
import Web3Status from 'components/Web3Status'
import BrandLogo from 'assets/brand/logo.png'
import { Columns } from 'components/Layouts'
import { useNavigate } from 'react-router-dom'
import imgClose from 'assets/icons/x.svg'

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
                                    <span />
                                    <span />
                                    <span />
                                </MenuIcon>
                            </>
                        ) : (
                            <MenuIcon>
                                <img src={imgClose} alt="" />
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
        grid-template-columns: 1fr 0 250px;
        padding: 10px;
    }

    @media(max-width: 375px) {
        grid-template-columns: 1fr 0 150px;
    }
`

const WrapperNavigator = styled.div`
    display: none;
    width: 30px;
    height: 30px;
    background: var(--bg1);
    justify-content: center;
    font-weight: 600;
    font-style: normal;
    border-radius: 6px;
    border: 1px solid var(--border1);
    @media(max-width: 1000px) {
        display: flex;
    }
    @media(max-width: 576px) {
        width: 30px;
        height: 30px;
        border-radius: 10px;
    }
`

export const Logo = styled.div`
    display: flex;
    width: 100px;
    cursor: pointer;
    @media(max-width: 576px) {
        width: 50px;
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
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;

    img {
        width: 15px;
        height: 15px;
    }
    span {
        height: 2px;
        background: var(--text2);
        width: 50%;
        margin: 0 auto;
    }
    @media(max-width: 576px) {
        span {
            height: 1.2px;
        }
    }
`

export default Header
