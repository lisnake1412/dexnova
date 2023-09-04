import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import imgDownArrowWhite from 'assets/icons/chevron-white.svg'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { useActiveWeb3React } from 'hooks'
import imgCircleWhite from '../../assets/icons/circleWhite.png'
import imgCircleGreen from '../../assets/icons/circleGreen.png'
import { InfoNetwork, ListNetwork } from 'constants/networks/index'
import { OpacityModal } from 'components/Web3Status'

const NetworkSelector = () => {
    const [networkModal, setNetworkModal] = useState(false)
    const { chainId, account, connector } = useActiveWeb3React()

    const networkRef = useRef<any>()
    useOnClickOutside(networkRef, () => {
        setNetworkModal(false)
    })

    const showNameNetworkCurrent = (chainId: any) => {
        if (chainId && !InfoNetwork[chainId]) {
            return (
                <>
                    <div>
                        <TextUnknownNetwork>Unknown network</TextUnknownNetwork>
                    </div>
                    <DownArrow src={imgDownArrowWhite} alt="arrow-down" />
                </>
            )
        }
        return (
            <>
                <div>
                    <img
                        src={InfoNetwork[chainId]?.logo}
                        alt={InfoNetwork[chainId]?.name}
                    />
                    <p>{InfoNetwork[chainId]?.name}</p>
                </div>
                <DownArrow src={imgDownArrowWhite} alt="arrow-down" />
            </>
        )
    }
    return (
        <NetworkSelectorWrapper>
            <NetworkButton
                onClick={() => {
                    setNetworkModal((i) => !i)
                }}
            >
                {showNameNetworkCurrent(chainId)}
            </NetworkButton>
            <DropdownModal networkModal={networkModal} ref={networkRef}>
                <ul>
                    {ListNetwork.map((item, index) => {
                        return (
                            <li
                                key={index}
                                onClick={async () => {
                                    if (account) {
                                        await connector.activate(
                                            item.switchNetwork[0],
                                        )
                                    } else {
                                        await connector.activate(
                                            item.switchNetwork[0].chainId,
                                        )
                                    }
                                }}
                            >
                                <span>
                                    {item.logo && (
                                        <img
                                            src={item.logo}
                                            alt=""
                                            className="network-logo"
                                        />
                                    )}
                                    <TextNetwork>{item.name}</TextNetwork>
                                </span>
                                <img
                                    src={
                                        item.chainId === chainId
                                            ? imgCircleGreen
                                            : imgCircleWhite
                                    }
                                    alt=""
                                />
                            </li>
                        )
                    })}
                </ul>
            </DropdownModal>
            {networkModal ? <OpacityModal></OpacityModal> : ''}
        </NetworkSelectorWrapper>
    )
}

const TextUnknownNetwork = styled.span`
    font-size: 13px;
`

const TextNetwork = styled.span`
    font-size: 14px;
`
const DownArrow = styled.img`
    height: 12px;
    width: 12px;
`

const NetworkSelectorWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: flex-end;

    @media screen and (max-width: 576px) {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: var(--bg2);
        backdrop-filter: blur(3px);
        padding: 8px;
        z-index: 999999;
    }
`

const NetworkButton = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    background: var(--btn1);
    padding: 0 10px;
    border: none;
    border-radius: 16px;
    color: white;
    justify-content: space-between;
    cursor: pointer;
    align-items: center;
    height: 30px;
    padding: 0px 8px;
    @media(max-width: 576px) {
        font-size: 12px;
        height: 30px;
    }
    > div {
        display: flex;
        gap: 5px;
        align-items: center;
        > img {
            width: 30px;
            height: 27px;
            border-radius: 50%;
        }
    }
`
const DropdownModal = styled.div<{ networkModal: boolean }>`
    position: absolute;
    z-index: 3;
    height: fit-content;
    border: 1px solid var(--border1);
    width: 160px;
    backdrop-filter: blur(10px);
    background: var(--bg1);
    border-radius: 6px;
    top: 40px;
    right: 0;
    cursor: pointer;
    @media screen and (max-width: 576px) {
        bottom: 54px;
        top: unset;
        right: 10px;
    }
    ul {
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        .button-sui {
            cursor: no-drop;
            opacity: 0.8;
        }
    }
    a {
        text-decoration: none;
        color: #fff;
        :hover {
            opacity: 0.8;
        }
    }
    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 5px;
            img {
                height: 24px;
                width: 36px;
            }
        }
        span:nth-child(3) {
            width: 40px;
        }
        img {
            height: 12px;
            width: 12px;
        }
    }

    animation: ${({ networkModal }) =>
        networkModal
            ? `dropdown 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) both`
            : `fadeOut 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) both`};

    @keyframes dropdown {
        0% {
            opacity: 0;
            height: 0;
            overflow: hidden;
        }
        100% {
            opacity: 1;
            height: 76px;
            overflow: hidden;
        }
    }
    @keyframes fadeOut {
        0% {
            opacity: 1;
        }
        40% {
            opacity: 0.4;
            height: 60px;
            overflow: hidden;
        }
        80% {
            opacity: 0.1;
            height: 20px;
            overflow: hidden;
        }
        100% {
            height: 0px;
            opacity: 0;
            overflow: hidden;
        }
    }
`
export default NetworkSelector
