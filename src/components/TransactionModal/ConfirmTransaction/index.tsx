import Blur from 'components/Blur'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import React, { useRef } from 'react'
import { useAppState } from 'states/application/hooks'
import styled from 'styled-components'
import imgClose from 'assets/icons/x.svg'
import { handleTime } from 'utils/convertTime'
import { Container } from '../styled'

interface ConfirmTransactionModalProps {
    setConfirmTransaction: React.Dispatch<React.SetStateAction<boolean>>
    payload?: any
    onConfirm?: any
}

const ConfirmTransactionModal = ({
    setConfirmTransaction,
    payload,
    onConfirm,
}: ConfirmTransactionModalProps) => {
    const ref = useRef<any>()
    const { slippage } = useAppState()

    useOnClickOutside(ref, () => {
        setConfirmTransaction(false)
    })

    const DetailsLaunchpad = () => {
        return (
            <ContainerItem>
                <Header>
                    <div className={'title'}>Confirm {payload?.method}</div>
                    <div>
                        <ImgClose
                            onClick={() => setConfirmTransaction(false)}
                            src={imgClose}
                            alt="X"
                        />
                    </div>
                </Header>
                <EstimatedNotice>
                    <TitleEstimate style={{ gap: '5px' }}>
                        <p>Total token sale:</p>
                        <p className="to">{payload?.launchpad?.totalToken}</p>
                        <p>{payload?.tokenSale?.symbol || 'Undefined token'}</p>
                    </TitleEstimate>
                    <TitleEstimate style={{ gap: '5px' }}>
                        <p>Payment currency:</p>
                        {/* <p className="to">{payload?.output || 9999}</p> */}
                        <p>
                            {payload?.tokenPayment?.symbol || 'Undefined token'}
                        </p>
                    </TitleEstimate>
                    <TitleEstimate style={{ gap: '5px' }}>
                        <p>Hard cap:</p>
                        <p className="to">
                            {payload?.launchpad?.hardCap || '9999'}
                        </p>
                    </TitleEstimate>
                    <TitleEstimate style={{ gap: '5px' }}>
                        <p>Soft cap:</p>
                        <p className="to">
                            {payload?.launchpad?.softCap || '9999'}
                        </p>
                    </TitleEstimate>
                    <TitleEstimate style={{ gap: '5px' }}>
                        <p>Overflow token reward:</p>
                        <p className="to">
                            {payload?.launchpad?.overflowTokenReward || '1'}
                        </p>
                    </TitleEstimate>
                    <TitleEstimate style={{ gap: '5px' }}>
                        <p>Price token sale:</p>
                        <p className="to">
                            {payload?.launchpad?.tokenSalePrice || '9'}
                        </p>
                    </TitleEstimate>
                    <TitleEstimate style={{ gap: '5px' }}>
                        <p>Individual cap:</p>
                        <p className="to">
                            {payload?.launchpad?.individualCap || '1'}
                        </p>
                    </TitleEstimate>
                    <TitleEstimate style={{ gap: '5px' }}>
                        <p>Start time:</p>
                        <p className="to">
                            {payload?.startTime
                                ? handleTime(payload?.startTime, true)
                                : 'dd-mm-yy'}
                        </p>
                    </TitleEstimate>
                    <TitleEstimate style={{ gap: '5px' }}>
                        <p>End time:</p>
                        <p className="to">
                            {payload?.endTime
                                ? handleTime(payload?.endTime, true)
                                : 'dd-mm-yy'}
                        </p>
                    </TitleEstimate>
                </EstimatedNotice>
                <ContentBottom>
                    <WrapButton>
                        <PrimaryButton
                            onClick={() => {
                                onConfirm()
                                // setConfirmTransaction(false)
                            }}
                            type="light-blue"
                            name="Confirm Supply"
                        />
                    </WrapButton>
                </ContentBottom>
            </ContainerItem>
        )
    }
    const Details = () => {
        const detail = payload?.method === 'swap' ? 'to' : 'x'
        return (
            <ContainerItem>
                <Header>
                    <div className={'title'}>Confirm {payload?.method}</div>
                    <div>
                        <ImgClose
                            onClick={() => setConfirmTransaction(false)}
                            src={imgClose}
                            alt="X"
                        />
                    </div>
                </Header>
                {payload?.method === 'swap' ||
                payload?.method === 'remove' ||
                payload?.method === 'add liquidity' ? (
                    <EstimatedNotice>
                        <TitleEstimate style={{ gap: '5px' }}>
                            <h2 className="to">{payload?.input || 999}</h2>
                            <h2>{payload?.tokenIn?.symbol || 'X'}</h2>
                        </TitleEstimate>
                        <h3>{detail}</h3>
                        <TitleEstimate style={{ gap: '5px' }}>
                            <h2 className="to">{payload?.output || 9999}</h2>
                            <h2>{payload?.tokenOut?.symbol || 'Y'}</h2>
                        </TitleEstimate>
                        {/* <h2>{payload.tokenIn + "/" + payload.tokenOut} Pool Tokens</h2> */}
                        <span>
                            Output is estimated. If the price changes by more
                            than {slippage || 0}% your transaction will revert.
                        </span>
                    </EstimatedNotice>
                ) : (
                    <EstimatedNotice>
                        <TitleEstimate style={{ gap: '5px' }}>
                            <h2 className="to">{payload?.input || 999}</h2>
                            <h2>{payload?.tokenIn?.symbol || 'X'}</h2>
                        </TitleEstimate>

                        {/* <h2>{payload.tokenIn + "/" + payload.tokenOut} Pool Tokens</h2> */}
                        <span>
                            Output is estimated. If the price changes by more
                            than {slippage || 0}% your transaction will revert.
                        </span>
                    </EstimatedNotice>
                )}
                <ContentBottom>
                    <WrapButton>
                        <PrimaryButton
                            onClick={
                                () =>
                                    payload?.onConfirm
                                        ? payload?.onConfirm()
                                        : onConfirm()
                                // setConfirmTransaction(false)
                            }
                            type="light-blue"
                            name="Confirm Supply"
                        />
                    </WrapButton>
                </ContentBottom>
            </ContainerItem>
        )
    }
    return (
        <>
            <Container ref={ref}>
                {payload && payload?.method === 'create launchpad' ? (
                    <DetailsLaunchpad />
                ) : (
                    <Details />
                )}
            </Container>
            <Blur />
        </>
    )
}

export default ConfirmTransactionModal

const ContainerItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    .title {
        font-size: 30px;
        font-weight: bold;
    }
`
const WrapImg = styled.div`
    position: relative;
    margin-top: 15px;
    display: flex;

    img {
        height: 25px;
        width: 25px;
        border-radius: 50%;
    }
    img:first-child {
        z-index: 1;
    }
    img:nth-child(2) {
        position: absolute;
        left: -10px;
    }
`
const EstimatedNotice = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    h2 {
        font-weight: 400;
    }
    span {
        font-size: 12px;
    }
    .details {
        font-size: 16px;

        padding-bottom: 5px;
    }
`

const ImgClose = styled.img`
    width: 16px;
    /* height: 20px; */
    cursor: pointer;
`
const ContentBottom = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;

    img {
        height: 20px;
        width: 20px;
        border-radius: 50%;
    }
    div {
        display: flex;
        justify-content: space-between;
    }
`
const WrapButton = styled.div`
    /* margin-top: 1rem; */
`
const TitleEstimate = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    h1 {
        font-size: 48px;
        margin-right: 10px;
    }
`
