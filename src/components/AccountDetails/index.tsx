import React, { useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { useActiveWeb3React } from 'hooks'
import imgCheckMark from 'assets/icons/check-mark.svg'
import imgPower from 'assets/icons/power.svg'
import imgCopy from 'assets/icons/copy.svg'
import { useETHBalances } from 'hooks/useCurrencyBalance'
import { NATIVE_COIN } from 'constants/index'
import { Row } from 'components/Layouts'
import LogoETH from 'assets/token-logos/eth.svg'
import { shortenAddress } from 'utils'

const AccountDetails = () => {
    const { account, chainId, disconnect } = useActiveWeb3React()
    const [isCopied, setIsCopied] = useState<boolean>(false)

    const balance = useETHBalances([account])?.[account || '']

    const handleCopyAddress = () => {
        if (account) {
            navigator.clipboard.writeText(account.toString()).then(() => {
                setIsCopied(true)
                setTimeout(() => {
                    setIsCopied(false)
                }, 1000)
            })
        }
    }

    return (
        <>
            <WrapConnectModal isConnected={true}>
                <Header>
                    <Row jus="space-between" gap="5px">
                        <Row al="center" gap="10px">
                            <WrapAccountInfo>
                                <ImgAccount src="https://picsum.photos/50/50" />
                                <IdAccount>
                                    {account && shortenAddress(account)}
                                </IdAccount>
                            </WrapAccountInfo>
                        </Row>
                        <WrapBtnHeader>
                            {isCopied ? (
                                <CopyBtn>
                                    <CopyAccountAddress src={imgCheckMark} />
                                    <Tooltip className="tooltip">
                                        Copied
                                    </Tooltip>
                                </CopyBtn>
                            ) : (
                                <CopyBtn>
                                    <CopyAccountAddress
                                        onClick={handleCopyAddress}
                                        src={imgCopy}
                                    />
                                    <Tooltip className="tooltip">
                                        Click to copy address
                                    </Tooltip>
                                </CopyBtn>
                            )}
                            <button
                                onClick={() => {
                                    disconnect()
                                }}
                            >
                                <img src={imgPower} alt="#" />
                            </button>
                        </WrapBtnHeader>
                    </Row>
                </Header>
                <WrapContent>
                    <NameBalance>
                        <img src={LogoETH} alt="logo-eth" />
                    </NameBalance>
                    <Balance className={'to'}>
                        {balance ? Number(balance).toFixed(6) : 0}
                    </Balance>
                    <Balance>
                        {(chainId && NATIVE_COIN[chainId]?.symbol) || 'ETH'}
                    </Balance>
                </WrapContent>
            </WrapConnectModal>
            <GlobalStyle />
        </>
    )
}

const NameBalance = styled.div`
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #d9d9d9;
    text-align: center;
    img {
        width: 34px;
        height: 34px;
        border-radius: 50%;
    }
`
const Balance = styled.div`
    font-weight: 600;
    font-size: 32px;
    line-height: 44px;
    text-align: center;
    @media screen and (max-width: 391px) {
        font-size: 16px;
        line-height: 30px;
    }
`
const CopyBtn = styled.div`
    position: relative;
    :hover .tooltip {
        transition: all 0.1s ease-in-out;
        opacity: 1;
        visibility: visible;
    }
`
const Tooltip = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    position: absolute;
    width: 100px;
    height: 30px;
    font-size: 12px;
    right: -45px;
    text-align: center;
    border: 1px solid;
    border-radius: 6px;
    background: rgba(157, 195, 230, 0.1);
    backdrop-filter: blur(3px);
`
const WrapBtnHeader = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
    img {
        height: 17px;
        width: 17px;
    }
    button {
        background: none;
        border: none;
        cursor: pointer;
    }

    @media screen and (max-width: 399px) {
        gap: 4px;

        img {
            width: 12px;
            height: 12px;
        }
    }
`
const WrapFooterBtn = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 5px 0px;
`
const Container = styled.div<{ isConnected: boolean }>`
    position: fixed;
    background: var(--bg1);
    border-radius: 10px;
    border: 1px solid var(--border1);
    backdrop-filter: blur(40px);
    box-shadow: rgb(0 0 0 / 5%) 0px 4px 8px 0px;
    overflow: hidden;
    max-width: 500px;
    width: 100%;
    left: 0;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    margin: auto;
    transition: all 0.1s ease-in-out;
    z-index: 10;
    opacity: ${({ isConnected }) => (isConnected ? 1 : 0)};
    scale: ${({ isConnected }) => (isConnected ? 1 : 0.95)};
    color: ${({ theme }) => theme.text1};

    @media screen and (max-width: 576px) {
        max-width: 410px;
    }
    @media screen and (max-width: 390px) {
        max-width: 365px;
    }
`
const WrapBlur = styled.div`
    div {
        opacity: 0;
    }
    &.active {
        div {
            opacity: 1;
            z-index: 2;
        }
    }
`
const BtnClose = styled.img`
    height: 20px;
    cursor: pointer;
`

const Header = styled.div`
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #918f8f;

    span {
        cursor: pointer;
        color: ${({ theme }) => theme.text1};
    }
    /* ::before {
        content: '';
        position: absolute;
        right: -10px;
        width: 50%;
        height: 35px;
        top: -62px;
    } */
    @media screen and (max-width: 390px) {
        padding: 0.5rem 0.5rem;
    }
`
const WrapContent = styled.div`
    padding: 0.5rem 1.5rem 1rem;

    > div {
        margin: 10px 0px;
    }
    @media screen and (max-width: 390px) {
        padding: 0.5rem 0.5rem;
        > div {
            margin: 0;
        }
    }
`
const Title = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
    color: ${({ theme }) => theme.text1};

    div:first-child {
        letter-spacing: 0.5px;
        display: flex;
        flex-wrap: wrap;
    }
    div:last-child {
        display: flex;
        gap: 10px;
    }

    a {
        color: #fff;
        text-decoration: none;
        font-weight: 600;
    }
    @media screen and (max-width: 576px) {
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-size: 12px;
        div:first-child {
            display: block;
        }
    }
    @media screen and (max-width: 390px) {
        padding: 0.5rem 0.2rem 0.5rem 0;
        div:first-child {
            display: inline-flex;
        }
    }
`
const WrapItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap-reverse;
    padding: 2rem 0;
    cursor: pointer;
    opacity: 0.3;
    gap: 20px;
    &.active {
        opacity: 1;
    }
    @media screen and (max-width: 576px) {
        padding: 1rem;
        div:nth-child(4) {
            order: 1;
        }
    }
    @media screen and (max-width: 375px) {
    }
`
const Item = styled.div<{ isChecked: boolean }>`
    width: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    width: 100px;
    height: 100px;
    transition: all ease-in-out 0.1s;

    :hover {
        background: ${({ isChecked, theme }) => (isChecked ? theme.hv0 : '')};
    }
    @media screen and (max-width: 576px) {
        width: 45%;
    }
`

const Footer = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 355px;
    padding: 1rem 1.5rem;
    gap: 10px;
    /* border-top: 1px solid #918f8f; */

    &.isLogged {
        padding: 0;
        gap: 0;
    }

    a {
        text-align: center;
        text-decoration: none;
        color: ${({ theme }) => theme.text1};
        /* cursor: pointer; */
        pointer-events: none;
    }
    @media screen and (max-width: 576px) {
        flex-direction: column;
        align-items: center;
        font-size: var(--font-size-sub);
    }
    @media screen and (max-width: 390px) {
        padding: 0.7rem 1.5rem;
    }
`

const WrapButton = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    cursor: no-drop;

    a {
        pointer-events: none;
    }

    @media screen and (max-width: 390px) {
        /* gap: 0px; */
        button:first-child {
            margin-right: 5px;
        }
    }
    a {
        text-decoration: none;
        button {
            gap: 5px;
            img {
                height: 25px;
                width: 25px;
            }
        }
    }
`
const WrapAccountInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`
const ImgAccount = styled.img`
    height: 20px;
    border-radius: 50%;
    width: 20px;
`
const IdAccount = styled.div``
const CopyAccountAddress = styled.img`
    height: 12px;
    cursor: pointer;
`

const RowTransaction = styled.div`
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1.5rem 0.2rem 1.5rem;

    &:hover {
        background-color: #9dc3e699;
        cursor: pointer;
        border-bottom: 1px solid rgba(157, 195, 230, 0.6);
    }

    div {
        text-align: end;
    }

    @media screen and (max-width: 576px) {
        width: 100%;
    }
`

const WrapConnectModal = styled(Container)`
    position: absolute;
    max-width: 300px;
    left: unset;
    right: 20px;
    top: 90px;
    transform: unset;
    margin: unset;
    overflow: unset;

    // @media screen and (max-width: 1100px) {
    //     right: 10px;
    //     top: unset;
    //     bottom: 60px;
    // }
    // @media screen and (max-width: 492px) {
    //     width: 90%;
    //     margin: auto;
    //     font-size: 12px;
    //     right: 10px;
    //     max-width: 300px;
    // }
`

const GlobalStyle = createGlobalStyle`
    body {
        overflow: hidden;
    }
`

export default AccountDetails
