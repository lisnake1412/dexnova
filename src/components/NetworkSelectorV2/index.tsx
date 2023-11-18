import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import imgDownArrowWhite from 'assets/icons/chevron-white.svg';
import { useOnClickOutside } from 'hooks/useOnClickOutSide';
import { useActiveWeb3React } from 'hooks';
import imgCircleWhite from '../../assets/icons/circleWhite.png';
import imgCircleGreen from '../../assets/icons/circleGreen.png';
import { InfoNetwork, ListNetwork } from 'constants/networks/index';
import { OpacityModal } from 'components/Web3Status';
const NetworkSelector = () => {
    const [networkModal, setNetworkModal] = useState(false);
    const { chainId, account, connector, isWrongNetwork } = useActiveWeb3React();
    const currentYpos = useRef(window.scrollY)
    const [buttonYPos,setButtonYPos] = useState("translateY(0%)")
    const networkRef = useRef<any>();
    useOnClickOutside(networkRef, () => {
        setNetworkModal(false);
    });
    window.onscroll = ()=> {
        if(window.scrollY > currentYpos.current) {
            setButtonYPos("translateY(110%)")
            
        }
        else {
            setButtonYPos("translateY(0%)")
            
        }
        currentYpos.current = window.scrollY
    }
    
    const showNameNetworkCurrent = (chainId: any) => {
        if (chainId && !InfoNetwork[chainId]) {
            return (
                <>
                    <div>
                        <TextUnknownNetwork>Linea network</TextUnknownNetwork>
                    </div>
                    <DownArrow src={imgDownArrowWhite} alt="arrow-down" />
                </>
            );
        }
        return (
            <>
                <div>
                    <img src={InfoNetwork[chainId]?.logo} alt={InfoNetwork[chainId]?.name} />
                    <p>{InfoNetwork[chainId]?.name}</p>
                </div>
                <DownArrow src={imgDownArrowWhite} alt="arrow-down" />
            </>
        );
    };
    return (
        <NetworkSelectorWrapper>
            <NetworkButton style={{transform:buttonYPos}}
                onClick={async () => {
                    setNetworkModal((i) => !i);
                }}
            >
                {chainId == 0
                    ? 'Ethereum Mainnet'
                    : !isWrongNetwork
                    ? showNameNetworkCurrent(chainId)
                    : 'Switch Network'}
            </NetworkButton>
            <DropdownModal networkModal={networkModal} ref={networkRef}>
                <ul>
                    {ListNetwork.map((item, index) => {
                        return (
                            <li
                                key={index}
                                onClick={async () => {
                                    if (account) {
                                        await connector.activate(item.switchNetwork[0]);
                                    } else {
                                        await connector.activate(item.switchNetwork[0].chainId);
                                    }
                                }}
                            >
                                <span>
                                    {item.logo && <img src={item.logo} alt="" className="network-logo" />}
                                    <TextNetwork>{item.name}</TextNetwork>
                                </span>
                                {/* <img src={item.chainId === chainId ? imgCircleGreen : imgCircleWhite} alt="" /> */}
                                <div className={item.chainId === chainId ? 'CircleGreen' : 'CircleWhite'}></div>
                            </li>
                        );
                    })}
                </ul>
            </DropdownModal>
            {networkModal ? <OpacityModal></OpacityModal> : ''}
        </NetworkSelectorWrapper>
    );
};

const TextUnknownNetwork = styled.span`
    font-size: 13px;
`;

const TextNetwork = styled.span`
    font-size: 14px;
`;
const DownArrow = styled.img`
    height: 12px;
    width: 12px;
    transform: rotate(180deg);
`;

const NetworkSelectorWrapper = styled.div`
    position: fixed;
    display: flex;
    justify-content: flex-end;
    bottom: 0px;
    right: 0px;
    z-index: 999;
    @media screen and (max-width: 1100px) {
    }
`;

const NetworkButton = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    background-image: var(--btn1);
    padding: 0 10px;
    border: none;
    color: white;
    justify-content: space-between;
    cursor: pointer;
    align-items: center;
    height: 36px;
    padding: 0px 8px;
    transform: translateY(0%);
    transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    @media (max-width: 576px) {
        font-size: 12px;
        height: 35px;
    }
    > div {
        display: flex;
        gap: 5px;
        align-items: center;
        > img {
            width: 25px;
            aspect-ratio: 1/1;
            border-radius: 50%;
            margin-right: 10px;
            background-color: white;
        }
    }
    ::after {
        content: '';
        width: 8px;
        aspect-ratio: 1/1;
        background-color: #00ff00;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 50%;
        border: 1px solid white;
        transform: translate(-20%, -20%);
    }
`;
const DropdownModal = styled.div<{ networkModal: boolean }>`
    z-index: 3;
    border: 1px solid #ffffff;
    width: 200px;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    position: absolute;
    background: var(--bgViolet);
    border-radius: var(--borderRadius2);
    bottom: 54px;
    top: unset;
    right: 10px;
    cursor: pointer;
    color: var(--text3);
    transform-origin: 0 100%;
    overflow: hidden;
    @media screen and (max-width: 1100px) {
        bottom: 54px;
        top: unset;
        right: 10px;
    }
    li.select_options{
        position: relative;
        padding: 5px 0;
    }
    li.select_options:before {
        content: "";
        position: absolute;
        left: 2px;
        bottom: -5px;
        width: 95%;
        height: 2px;
        background: rgb(7 99 128);
}


    
    ul {
        padding: 0px;
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
        color:var(--text3);
        padding: 8px 10px;
        transition: 0.5s;
        &:hover{
            background: var(--btn1);
            transition: 0.5s;

        }

        span {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            img {
                height: 20px;
                width: 20px;
                background-color: #fff;
                border-radius: 100%;
                padding: -4px;
            }
        }
        span:nth-child(3) {
            width: 40px;
        }
        img {
            height: 20px;
            width: 20px;
        }
    }

    .CircleGreen, .CircleWhite {
        width: 15px;
        aspect-ratio: 1/1;
        background-color: #00ff00;
        border: 2px solid #fff;
        border-radius: 100%;
    }
    .CircleWhite {
        background-color: #888888;
    }

    animation: ${({ networkModal }) =>
        networkModal
            ? `dropdown 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) both`
            : `fadeOut 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) both`};

    @keyframes dropdown {
        0% {
            opacity: 0;
            transform: scaleY(0);
            
        }
        100% {
            opacity: 1;
            transform: scaleY(1);

            
        }
    }
    @keyframes fadeOut {
        0% {
            opacity: 1;
            transform: scaleY(1);
        }
        100% {
            transform: scaleY(0);
            opacity: 0;
            
        }
    }
`;
export default NetworkSelector;
