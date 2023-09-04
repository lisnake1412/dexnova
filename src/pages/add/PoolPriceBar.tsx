import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Row } from 'components/Layouts'
import { Pair } from 'utils/pair'
import { convertNativeToWrappedToken } from 'utils'
import { useActiveWeb3React } from 'hooks'
import imageGas from 'assets/icons/gas.svg'
import { useMintState } from 'states/mint/hooks'

const PoolPriceBar = ({
    dropDown,
    setDropDown,
    pair,
    gasFee,
}: {
    dropDown: boolean
    setDropDown: React.Dispatch<React.SetStateAction<boolean>>
    pair: Pair
    gasFee?: string
}) => {
    const { inputAmount, outputAmount, tokenIn, tokenOut } = useMintState()
    const { chainId } = useActiveWeb3React()
    const [sharePool, setSharePool] = useState(0)

    const calcShareOfPool = () => {
        if(!chainId || !inputAmount || !outputAmount || !tokenIn || !tokenOut) return setSharePool(0)
        const shareOfPool = pair.calcShareOfPool(
                    inputAmount,
                    outputAmount,
                    convertNativeToWrappedToken(tokenIn, chainId),
                    convertNativeToWrappedToken(tokenOut, chainId),
                )
        setSharePool(shareOfPool)
    }
    useEffect(() => {
        calcShareOfPool()
    }, [inputAmount, outputAmount, tokenIn, tokenOut, chainId])
    const rate0 =
        pair.reserve0 && pair.reserve1
            ? Number(pair.reserve0) / Number(pair.reserve1)
            : 0
    const rate1 =
        pair.reserve0 && pair.reserve1
            ? Number(pair.reserve1) / Number(pair.reserve0)
            : 0

    return (
        <>
            <PoolPriceWrapper>
                <Row gap="5px" jus="flex-end">
                    <Row gap="3px">
                        <span>≈${gasFee || '--'} </span>
                        <img src={imageGas} alt="" />
                    </Row>
                </Row>
                <WrapExpectedOutput
                    className={dropDown ? 'active' : 'chevron down'}
                    dropDown={dropDown}
                >
                    <ContentOutput>
                        <Row jus="space-between">
                            <div>Price pool share</div>
                        </Row>
                        <Hr />
                        <ItemOutput>
                            <Row jus="center">
                                <div>{rate0.toFixed(6)}</div>
                            </Row>
                            <Row jus="center">
                                <div>{rate1.toFixed(6)}</div>
                            </Row>
                            <Row jus="center">
                                <div>{sharePool.toFixed(2)} %</div>
                            </Row>
                        </ItemOutput>
                        <ItemOutput className={'nums'}>
                            <Row jus="center">
                                <div>
                                    {pair.token0.symbol} per{' '}
                                    {pair.token1.symbol}
                                </div>
                            </Row>
                            <Row jus="center">
                                <Row>
                                    {pair.token1.symbol} per{' '}
                                    {pair.token0.symbol}
                                </Row>
                            </Row>
                            <Row jus="center">
                                <Row>Share of pool</Row>
                            </Row>
                        </ItemOutput>
                    </ContentOutput>
                </WrapExpectedOutput>
            </PoolPriceWrapper>
        </>
    )
}

const PoolPriceWrapper = styled.div`
    span {
        font-size: 14px;
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

const WrapFee = styled.div<{ dropDown: boolean }>`
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    align-items: center;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
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
    overflow: hidden;
    height: 0;
    margin: 10px 0;

    &.active {
        height: fit-content;
        @media (max-width: 576px) {
            /* height: 130px; */
        }
    }
`

const ContentOutput = styled.div`
    padding: 15px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: none;
    border: 1px solid var(--border2);

    img {
        height: 20px;
    }
    @media screen and (max-width: 390px) {
        padding: 7px;
    }
`

const ItemOutput = styled.div`
    font-size: 14px;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    justify-content: center;
    align-items: center;
    color: var(--text1);

    &.nums {
        color: var(--text2);
        font-size: 12px;
        text-align: center;
    }

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
