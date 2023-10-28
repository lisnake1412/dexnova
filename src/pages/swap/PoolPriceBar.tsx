import { Field } from 'interfaces'
import React from 'react'
import styled from 'styled-components'
import imgDownArrowDark from 'assets/icons/chevron-grey.svg'
import { useSwapState } from 'states/swap/hooks'
import { Row } from 'components/Layouts'
import { div, mulNumberWithDecimal } from 'utils/math'
import NotiIcon from 'assets/icons/notification.svg'
import { useAppState } from 'states/application/hooks'
import { Pair } from 'utils/pair'
import { convertNativeToWrappedToken } from 'utils'
import imageGas from 'assets/icons/gas.svg'
import { useActiveWeb3React } from 'hooks'

const PoolPriceBar = ({
    pair,
    dropDown,
    setDropDown,
    gasFee,
}: {
    pair: Pair | undefined
    dropDown: boolean
    setDropDown: React.Dispatch<React.SetStateAction<boolean>>
    gasFee?: string
}) => {
    const { chainId } = useActiveWeb3React()
    const { inputAmount, outputAmount, tokenIn, tokenOut, swapType } =
        useSwapState()
    const { slippage } = useAppState()
    const maximumSent =
        Number(inputAmount) && slippage
            ? Number(inputAmount) * (1 + Number(slippage) / 100)
            : 0
    const minimumReceived = outputAmount
        ? Number(outputAmount) * (1 - Number(slippage) / 100)
        : 0
    const rate =
        Number(inputAmount) && Number(outputAmount)
            ? Number(div(inputAmount, outputAmount)).toFixed(8)
            : 0
    function getPriceImpact(
        fee: number,
        amountTrade: number,
        reservesA: number,
    ) {
        let amount = amountTrade * (1 - fee)
        return (amount / (reservesA + amount)) * 100
    }
    const reserveIn =
        pair &&
        tokenIn &&
        chainId &&
        (convertNativeToWrappedToken(tokenIn, chainId).address ==
        pair.token0.address
            ? pair.reserve0
            : pair.reserve1)
    const priceImpact =
        tokenIn && inputAmount && pair
            ? getPriceImpact(
                  Number(pair.fee),
                  Number(mulNumberWithDecimal(inputAmount, tokenIn.decimals)),
                  Number(reserveIn),
              )
            : 0
      if(tokenIn?.symbol === "ACR" && Number(priceImpact)>2){
                console.log(Number(priceImpact));
        alert("Reload page, decrease ACR to < 2% impact when swapping!")
       }
    return (
        <>
            <PoolPriceWrapper>
                <WrapFee
                    dropDown={dropDown}
                    onClick={() => setDropDown(!dropDown)}
                >
                    <Row al="center" gap="2px">
                        <img src={NotiIcon} alt="notification icon" />
                        <span>
                            1 {tokenOut?.symbol} ≈ {Number(rate).toFixed(6)}{' '}
                            {tokenIn?.symbol} (including fee)
                        </span>
                    </Row>
                    <Row gap="5px">
                        <Row gap="3px">
                            <span>≈${gasFee || '--'} </span>
                            <img src={imageGas} alt="" />
                        </Row>
                        <img
                            className={dropDown ? 'active' : ''}
                            src={imgDownArrowDark}
                            alt="chevron down"
                        />
                    </Row>
                </WrapFee>
                <WrapExpectedOutput
                    className={dropDown ? 'active' : 'chevron down'}
                    dropDown={dropDown}
                >
                    <ContentOutput>

                    <ItemOutput>
                            <div>
                                {swapType === Field.INPUT ? (
                                    <div>Minimum received</div>
                                ) : (
                                    <div>Maximum sent</div>
                                )}
                            </div>
                            <div>
                                {swapType === Field.INPUT ? (
                                    <Row>
                                        <span>
                                            {minimumReceived.toFixed(8)}
                                        </span>
                                        <span>{tokenOut?.symbol}</span>
                                    </Row>
                                ) : (
                                    <Row>
                                        <span>{maximumSent.toFixed(8)}</span>
                                        <span>{tokenIn?.symbol}</span>
                                    </Row>
                                )}
                            </div>
                        </ItemOutput>
                        <ItemOutput>
                            <div>
                                <div>Price impact</div>
                            </div>
                            <div>
                                <div>
                                    {priceImpact
                                        ? Number(priceImpact).toFixed(2)
                                        : 0}{' '}
                                    %
                                </div>
                            </div>
                        </ItemOutput>
                        <ItemOutput>
                            <div>
                                <span>Trading Fee</span>
                            </div>
                            <div>
                                <span>
                                    {pair ? Number(pair.fee) * 100 : 0} %
                                </span>
                            </div>
                        </ItemOutput>
                        <ItemOutput>
                            <div>
                                <div>Expected output</div>
                            </div>
                            <div>
                                <div>
                                    {outputAmount
                                        ? Number(outputAmount).toFixed(8)
                                        : 0}{' '}
                                    {tokenOut?.symbol}
                                </div>
                            </div>
                        </ItemOutput>
                        <ItemOutput>
                             <div>
                                <div>Price</div>
                            </div>
                            <div>
                                <div>
                                    1 {tokenOut?.symbol} ≈ {Number(rate).toFixed(6)}{' '}
                                    {tokenIn?.symbol} (including fee)
                                </div>
                            </div>
                            
                        </ItemOutput>
                       
                        
                       
                        
                    </ContentOutput>
                </WrapExpectedOutput>
            </PoolPriceWrapper>
        </>
    )
}

const PoolPriceWrapper = styled.div``

const WrapFee = styled.div<{ dropDown: boolean }>`
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    gap: 5px;
    font-size: 14px;
    align-items: center;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    display:none;
    @media screen and (max-width: 390px) {
        padding: 5px;
    }
    img {
        height: 15px;
        width: 15px;
        transition: all 0.3s ease-in-out;
        transform: rotate(0deg);
        &.active {
            transform: rotateX(180deg);
        }
    }
`

const WrapExpectedOutput = styled.div<{ dropDown: boolean }>`
    transition: all 0.1s ease-in-out;
    height: 0;
    margin: 10px 0;
    padding-top: 25px;
    border-top: 2px solid #0dcaea;

    &.active {
        height: auto;
        @media (max-width: 576px) {
            height: 130px;
        }
    }
`

const ContentOutput = styled.div`
padding: 0;
border-radius: 0;
display: -webkit-box;
display: -webkit-flex;
display: -ms-flexbox;
display: flex;
-webkit-flex-direction: column;
-ms-flex-direction: column;
flex-direction: column;
gap: 6px;
background: none;
border: none;

    img {
        height: 20px;
    }
    @media screen and (max-width: 390px) {
        padding: 7px;
    }
`

const ItemOutput = styled.div`
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #000;
    padding: 5px 0;
    font-size: 14px;
    div {
        display: flex;
        align-items: center;
        
    }
    div:first-child {
        gap: 5px;
    }
`

const Hr = styled.div`
    border-top: 1px solid var(--border2);
    width: 100%;
`

export default PoolPriceBar
