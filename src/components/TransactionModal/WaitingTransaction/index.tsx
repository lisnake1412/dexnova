import Blur from 'components/Blur'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import imgClose from 'assets/icons/x.svg'
import CustomLoader from 'components/CustomLoader'
import { Container } from '../styled'

interface WaitingTransactionModalProps {
    setModalRemove?: any
    payloadTxn?: any
}

const WaitingTransactionModal = ({
    setModalRemove,
    payloadTxn,
}: WaitingTransactionModalProps) => {
    const [message, setMessage] = useState<string>('')
    const ref = useRef()

    useEffect(() => {
        if (payloadTxn && payloadTxn?.method) {
            switch (payloadTxn.method) {
                case 'Add':
                    setMessage(
                        `Supplying ${
                            payloadTxn.amountInNoDecimals +
                            ' ' +
                            payloadTxn.tokenIn
                        } and ${
                            payloadTxn.amountOutNoDecimals +
                            ' ' +
                            payloadTxn.tokenOut
                        }`,
                    )
                    break
                case 'Swap':
                    setMessage(
                        `Swap ${
                            payloadTxn?.amountIn + ' ' + payloadTxn.tokenIn
                        } for ${
                            payloadTxn?.amountOut + ' ' + payloadTxn.tokenOut
                        }`,
                    )
                    break
                case 'Remove':
                    {
                        setMessage(
                            `Remove ${
                                payloadTxn.amountIn + ' ' + payloadTxn.tokenIn
                            } for ${
                                payloadTxn.amountOut.coinX +
                                ' ' +
                                payloadTxn.tokenOut.coinX
                            } and ${
                                payloadTxn.amountOut.coinY +
                                ' ' +
                                payloadTxn.tokenOut.coinY
                            }`,
                        )
                    }
                    break
                case 'Faucet':
                    {
                        setMessage('')
                    }
                    break
                default:
                    setMessage('')
                    break
            }
        }
    }, [payloadTxn])

    useOnClickOutside(ref, () => {
        setModalRemove(false)
    })

    return (
        <>
            <Container>
                <Header>
                    <ImgClose
                        onClick={() => setModalRemove(false)}
                        src={imgClose}
                        alt=""
                    />
                </Header>
                <WrapContent>
                    <WrapInfoLoad>
                        <div>Waiting For Confirmation</div>
                        <WrapLoader>
                            <CustomLoader size="4em" />
                        </WrapLoader>
                        <div>{message}</div>
                        <div>Confirm this transaction in your wallet</div>
                    </WrapInfoLoad>
                </WrapContent>
            </Container>
            <Blur />
        </>
    )
}

export default WaitingTransactionModal

const Header = styled.div`
    display: flex;
    justify-content: flex-end;
`
const WrapContent = styled.div``
const WrapLoader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 25px 0;
`
const WrapInfoLoad = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    div {
        text-align: center;
    }

    div:first-child {
        font-size: 24px;
    }

    div:last-child {
        font-size: 14px;
    }
    @media screen and (max-width: 390px) {
        text-align: center;
    }
`
const ImgClose = styled.img`
    width: 16px;
    /* height: 20px; */
    cursor: pointer;
`
