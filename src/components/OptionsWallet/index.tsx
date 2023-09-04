import React, { useState } from 'react'
import styled from 'styled-components'
import {
    getConnections,
    injectedConnection,
    bitkeepConnection,
    okexConnection,
} from 'components/connection'
import { Connection } from 'components/connection/types'
import { useAppDispatch } from 'states/hook'
import { updateSelectedWallet } from 'states/user/reducer'
import Loader from 'components/Loader'

const WALLET_VIEWS = {
    OPTIONS: 'options',
    ACCOUNT: 'account',
    PENDING: 'pending',
}

interface actionWallet {
    setWalletView: React.Dispatch<React.SetStateAction<string>>
    setPendingWallet: React.Dispatch<React.SetStateAction<string | undefined>>
    setToggleWalletModal: React.Dispatch<React.SetStateAction<boolean>>
    walletView: string
    pendingWallet: string | undefined
}

function OptionsWallet({
    walletView,
    pendingWallet,
    setWalletView,
    setPendingWallet,
    setToggleWalletModal,
}: actionWallet) {
    const connections = getConnections()
    const dispatch = useAppDispatch()
    const [typeConnect, setTypeConnect] = useState<'Wallet' | 'Social'>(
        'Wallet',
    )

    const tryActivation = async (connector: Connection | undefined) => {
        try {
            setWalletView(WALLET_VIEWS.PENDING)
            connector?.getName() && setPendingWallet(connector?.getName())
            if (connector?.type == 'ARGENT') {
                dispatch(updateSelectedWallet({ wallet: undefined }))
            } else {
                dispatch(updateSelectedWallet({ wallet: connector?.type }))
            }
            await connector?.connector?.activate()
        } catch (error) {
            console.log('err', error)
            setWalletView(WALLET_VIEWS.OPTIONS)
            setPendingWallet('')
        }
    }

    const installWallet = (option: Connection) => {
        return (
            <Item key={option + option.getName()}>
                <ItemContent
                    onClick={() => {
                        option.href &&
                            option.href !== null &&
                            window.open(option.href)
                    }}
                >
                    <img src={option.getIcon?.(true)}></img>
                    <span>Install {option.getName()}</span>
                </ItemContent>
            </Item>
        )
    }

    const getOptions = () => {
        return connections
            .filter((item) => item.shouldDisplay())
            .map((key, index) => {
                const option = key
                if (option.connector === injectedConnection.connector) {
                    // don't show injected if there's no injected provider
                    if (!(window.web3 || window.ethereum)) {
                        return installWallet(option)
                    }
                }
                if (option.connector == bitkeepConnection.connector) {
                    //don't show injected if there's no injected provider
                    if (!window.bitkeep) {
                        return installWallet(option)
                    }
                }
                if (option.connector == okexConnection.connector) {
                    //don't show injected if there's no injected provider
                    if (!window.okexchain) {
                        return installWallet(option)
                    }
                }
                return (
                    <Item key={key + option.getName()}>
                        <ItemContent
                            onClick={() => {
                                tryActivation(option)
                            }}
                        >
                            <img src={option.getIcon?.(true)}></img>
                            <span>{option.getName()}</span>
                        </ItemContent>
                        {walletView === WALLET_VIEWS.PENDING &&
                        pendingWallet === option.getName() ? (
                            <StyledLoader />
                        ) : (
                            ''
                        )}
                    </Item>
                )
            })
    }

    return (
        <Container>
            <Header>Connect a wallet</Header>
            <WrapContent>
                <WrapItem>{getOptions()}</WrapItem>
            </WrapContent>
        </Container>
    )
}

const Container = styled.div`
    position: fixed;
    background: var(--bg1);
    background-size: cover;
    background-repeat: no-repeat;
    opacity: 1;
    border: 1px solid #003b5c;
    box-shadow: rgb(0 0 0 / 5%) 0px 4px 8px 0px;
    overflow: auto;
    max-width: 380px;
    width: 100%;
    right: 0px;
    bottom: 0px;
    top: 0px;
    height: 100vh;
    margin: auto;
    z-index: 9999;
    color: ${({ theme }) => theme.text1};
    animation: 'fadeUp 0.3s linear';

    @media screen and (max-width: 640px) {
        top: 10rem;
        max-width: unset;
        border-radius: 12px 12px 0px 0px;
        animation: fadeUp 0.3s linear;
        height: calc(100vh - 10rem);
    }
    @keyframes fadeIn {
        from {
            transform: translateX(100%);
            opacity: 1;
        }
        to {
            transform: translateX(0px);
            opacity: 1;
        }
    }
    @keyframes fadeOut {
        from {
            transform: translateX(0px);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 1;
        }
    }
    @keyframes fadeUp {
        from {
            transform: translateY(100%);
            opacity: 1;
        }
        to {
            transform: translateY(0px);
            opacity: 1;
        }
    }
`

const LabelSocialConnect = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    grid-gap: 10px;
    &.inactive {
        div:nth-child(4),
        div:nth-child(5),
        div:nth-child(6),
        div:nth-child(7),
        div:nth-child(8),
        div:nth-child(9),
        div:nth-child(10),
        div:nth-child(11),
        div:nth-child(12) {
            display: none;
        }
    }
    div {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #003b5c;
        background: rgb(255, 255, 255);
        min-height: 48px;
        border-radius: 8px;
        @media screen and (max-width: 767px) {
            min-height: 42px;
        }
        :hover {
            background: rgba(255, 255, 255, 0.8);
        }

        img {
            width: 35px;
            height: 35px;
            @media screen and (max-width: 767px) {
                width: 30px;
                height: 30px;
            }
        }
    }
`

const StyledLoader = styled(Loader)`
    margin-right: 1rem;
`

const Header = styled.div`
    padding: 2rem 0 0 2rem;
    color: var(--text1);
    font-size: 22px;
    font-weight: 500;
`
const WrapContent = styled.div`
    padding: 0.5rem 1.5rem 1.2rem;

    @media screen and (max-width: 390px) {
        padding: 0.5rem 0.5rem;
    }
`

const WrapItem = styled.div`
    display: grid;
    padding: 1.2rem 0;
    cursor: pointer;
    opacity: 1;
    gap: 5px;
`

const Item = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: 8px;
    width: 100%;
    transition: all ease-in-out 0.1s;
    background: var(--bg2);
    padding: 10px;

    :hover {
        background: rgba(146, 129, 129, 0.13);
    }
`
const ItemContent = styled.button`
    width: 100%;
    background: none;
    border: none;
    color: var(--text1);
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-family: Inter;
    padding: 10px;

    img {
        height: 42px;
        width: 42px;
        object-fit: contain;
        border-radius: 50%;
    }
    span {
        font-size: 16px;
        font-weight: bold;
    }
    @media screen and (max-width: 767px) {
        img {
            height: 38px;
            width: 38px;
        }
        span {
            font-size: 14px;
        }
    }
`
export default OptionsWallet
