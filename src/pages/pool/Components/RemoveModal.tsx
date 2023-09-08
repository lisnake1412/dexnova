import React, { useCallback, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import imgClose from 'assets/icons/icon-close.svg'
import { useActiveWeb3React } from 'hooks'
import { ROUTERS } from 'constants/addresses'
import { useTokenApproval } from 'hooks/useToken'
import { useTokensUrl } from 'hooks/useAllPairs'
import UnknowToken from 'assets/icons/question-mark-button-dark.svg'
import { CompTransaction } from 'components/TransactionModal'
import { div, mul, mulNumberWithDecimal } from 'utils/math'
import {
    calcSlippageAmount,
    calcTransactionDeadline,
    isNativeCoin,
} from 'utils'
import { useTransactionHandler } from 'states/transactions/hooks'
import {
    useAppState,
    useUpdateApplicationState,
} from 'states/application/hooks'
import { useRouterContract } from 'hooks/useContract'
import { sendEvent } from 'utils/analytics'
import { ZERO_ADDRESS } from '../../../constants'
import LabelButton from 'components/Buttons/LabelButton'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'

const RemoveModal = ({
    poolRemove,
    tokenList,
    setModalRemovePool,
    initDataTransaction,
}: {
    poolRemove:
        | {
              value: string
              valueWithDec: string
              tokenLp: any
              token0: any
              token1: any
              percent: number
              totalLp: any
              totalReserve0: any
              totalReserve1: any
          }
        | undefined
    tokenList: string[]
    setModalRemovePool: React.Dispatch<React.SetStateAction<boolean>>
    initDataTransaction: CompTransaction
}) => {
    const [percentValue, setPercentValue] = useState(0)
    const { account, chainId } = useActiveWeb3React()
    const routerAddress = chainId ? ROUTERS[chainId] : undefined
    const urlTokens = useTokensUrl(tokenList)
    const { addTxn } = useTransactionHandler()
    const { slippage, deadline } = useAppState()
    const routerContract = useRouterContract()
    const updateAppication = useUpdateApplicationState()
    const arrPrecent = [0, 25, 50, 75, 100]
    const removeRef = useRef(null)

    useOnClickOutside(removeRef, () => setModalRemovePool(false))

    const handleChangeInput = (value: any) => {
        setPercentValue(value)
    }

    const handleDataUser = ({
        hash,
        status,
        msg,
    }: {
        hash: string
        status: boolean
        msg: string
    }) => {
        addTxn({
            hash,
            msg: msg,
            status,
        })

        const date =
            new Date().toDateString().split(' ')?.slice(1, 3).join(' ') +
            ' ' +
            new Date().toLocaleTimeString('vi')
    }

    const tokenApproval = useTokenApproval(
        account,
        routerAddress,
        poolRemove?.tokenLp,
    )

    const isInsufficientAllowance = useMemo(
        () =>
            Number(tokenApproval?.allowance) <
            Number(div(mul(poolRemove?.value, percentValue), 100)),
        [percentValue, tokenApproval, poolRemove],
    )

    const handleOnApprove = async () => {
        try {
            initDataTransaction.setError('')
            const inputAmount =
                Number(poolRemove?.valueWithDec) * Number(percentValue)
            if (routerAddress && inputAmount && chainId) {
                initDataTransaction.setIsOpenWaitingModal(true)
                const callResult: any = await tokenApproval?.approve(
                    routerAddress,
                    mulNumberWithDecimal(
                        inputAmount,
                        poolRemove?.tokenLp.decimals,
                    ),
                )

                setModalRemovePool(false)
                initDataTransaction.setIsOpenWaitingModal(false)
                initDataTransaction.setIsOpenResultModal(true)

                const txn = await callResult.wait()
                initDataTransaction.setIsOpenResultModal(false)
                handleDataUser({
                    hash: callResult.hash,
                    status: txn.status === 1 ? true : false,
                    msg: `Approved ${poolRemove?.tokenLp?.symbol}`,
                })
            }
        } catch (err) {
            console.log('Failed to approve token: ', err)
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)
        }
    }
    const handleRemove = () => {
        try {
            if (!isInsufficientAllowance && poolRemove) {
                setModalRemovePool(false)
                console.log('removing...')
                console.log({ percentValue, poolRemove })

                initDataTransaction.setError('')
                initDataTransaction.setPayload({
                    method: 'remove',
                    tokenIn: poolRemove?.token0,
                    tokenOut: poolRemove?.token1,
                    percent: percentValue,
                    input: (
                        (poolRemove?.token0?.value * percentValue) /
                        100
                    ).toFixed(4),
                    output: (
                        (poolRemove?.token1?.value * percentValue) /
                        100
                    ).toFixed(4),
                    onConfirm,
                })

                initDataTransaction.setIsOpenConfirmModal(true)
            }
        } catch (error) {
            console.log('failed to swap', error)
        }
    }

    const onConfirm = useCallback(async () => {
        try {
            if (poolRemove && chainId) {
                initDataTransaction.setError('')
                initDataTransaction.setIsOpenConfirmModal(false)
                initDataTransaction.setIsOpenWaitingModal(true)

                const isEthTxn =
                    isNativeCoin(poolRemove.token0) ||
                    isNativeCoin(poolRemove.token1) // is Pool contain native coin ?

                const method = isEthTxn
                    ? 'removeLiquidityETH'
                    : 'removeLiquidity'
                // const token = isNativeCoin(tokenIn)? tokenOut : tokenIn

                const balanceToRemove = div(
                    mul(poolRemove.value, percentValue),
                    100,
                )

                const args = isEthTxn
                    ? [
                          poolRemove.tokenLp.address,
                          mulNumberWithDecimal(
                              poolRemove.value,
                              poolRemove.tokenLp.decimals,
                          ), // amount of L token to remove
                          // mulNumberWithDecimal(amountToken,token.decimals), // minimum amount of token must received
                          mulNumberWithDecimal(
                              calcSlippageAmount(
                                  mul(
                                      poolRemove?.token0?.value,
                                      Number(percentValue) / 100,
                                  ),
                                  slippage,
                              )[0],
                              poolRemove.token0?.decimals,
                          ),
                          mulNumberWithDecimal(
                              calcSlippageAmount(
                                  mul(
                                      poolRemove?.token1?.value,
                                      Number(percentValue) / 100,
                                  ),
                                  slippage,
                              )[0],
                              poolRemove.token1?.decimals,
                          ),
                          account,
                          calcTransactionDeadline(deadline),
                          ZERO_ADDRESS,
                      ]
                    : [
                          poolRemove.token0.address,
                          poolRemove.token1.address,
                          mulNumberWithDecimal(
                              balanceToRemove,
                              poolRemove.tokenLp.decimals,
                          ), // liquidity amount
                          mulNumberWithDecimal(
                              calcSlippageAmount(
                                  mul(
                                      poolRemove?.token0?.value,
                                      Number(percentValue) / 100,
                                  ),
                                  slippage,
                              )[0],
                              poolRemove.token0?.decimals,
                          ),
                          mulNumberWithDecimal(
                              calcSlippageAmount(
                                  mul(
                                      poolRemove?.token1?.value,
                                      Number(percentValue) / 100,
                                  ),
                                  slippage,
                              )[0],
                              poolRemove.token1?.decimals,
                          ),
                          account,
                          calcTransactionDeadline(deadline),
                          ZERO_ADDRESS,
                      ]
                const gasLimit = await routerContract?.estimateGas?.[method]?.(
                    ...args,
                )
                const callResult = await routerContract?.[method]?.(...args, {
                    gasLimit: gasLimit && gasLimit.add(1000),
                })

                sendEvent({
                    category: 'Defi',
                    action: 'Remove liquidity',
                    label: [
                        poolRemove.token0?.symbol,
                        poolRemove.token0?.address,
                        poolRemove.token1?.symbol,
                        poolRemove.token1?.address,
                    ].join('/'),
                })

                initDataTransaction.setIsOpenWaitingModal(false)
                initDataTransaction.setIsOpenResultModal(true)

                const txn = await callResult.wait()

                initDataTransaction.setIsOpenResultModal(false)

                handleDataUser({
                    hash: callResult.hash,
                    status: txn.status === 1 ? true : false,
                    msg: `Remove ${poolRemove.token0?.symbol}/${poolRemove.token1?.symbol}`,
                })

                updateAppication()
            }
        } catch (error) {
            console.log(error)
            initDataTransaction.setError('Failed')
            initDataTransaction.setIsOpenResultModal(true)
        }
    }, [initDataTransaction, percentValue, poolRemove])

    return (
        <ModalRemovePool>
            <WrapRemovePool ref={removeRef}>
                <WrapTitle>
                    <Title>Remove</Title>
                    <BtnClose
                        src={imgClose}
                        onClick={() => setModalRemovePool(false)}
                    ></BtnClose>
                </WrapTitle>
                <WrapRemoveAmount>
                    <WrapAmount>
                        <TitleRemove>Percent Remove</TitleRemove>
                        <WrapPercent>
                            <Percent>{percentValue}%</Percent>
                        </WrapPercent>
                    </WrapAmount>
                    <WrapInputRange>
                        <Input
                            onChange={(e) => handleChangeInput(e.target.value)}
                            type="range"
                            min="0"
                            max="100"
                            value={percentValue}
                            disabled={false}
                        />
                        <DotPercent>
                            {arrPrecent.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <span>
                                            {item == 100 ? 'Max' : item}
                                        </span>
                                    </div>
                                )
                            })}
                        </DotPercent>
                    </WrapInputRange>
                </WrapRemoveAmount>
                <WrapContentRemove>
                    <RowContentRemove>
                        <WrapText>
                            <Logo
                                src={
                                    urlTokens?.[poolRemove?.token0?.address] ||
                                    UnknowToken
                                }
                            ></Logo>
                            <div>{poolRemove?.token0?.symbol}</div>
                        </WrapText>
                        <Value>
                            {(
                                (poolRemove?.token0?.value * percentValue) /
                                100
                            ).toFixed(4)}
                        </Value>
                    </RowContentRemove>
                    <RowContentRemove>
                        <WrapText>
                            <Logo
                                src={
                                    urlTokens?.[poolRemove?.token1?.address] ||
                                    UnknowToken
                                }
                            ></Logo>
                            <div>{poolRemove?.token1?.symbol}</div>
                        </WrapText>
                        <Value>
                            {(
                                (poolRemove?.token1?.value * percentValue) /
                                100
                            ).toFixed(4)}
                        </Value>
                    </RowContentRemove>
                </WrapContentRemove>
                {Number(percentValue) === 0 ? (
                    <LabelButton name="Select your percent" />
                ) : isInsufficientAllowance ? (
                    <PrimaryButton name="Approve Lp token" onClick={() => handleOnApprove()} />
                ) : (
                    <PrimaryButton name="Remove" onClick={() => handleRemove()} />
                )}
            </WrapRemovePool>
        </ModalRemovePool>
    )
}

export default RemoveModal

const BtnClose = styled.img`
    width: unset;
    height: 20px;
    cursor: pointer;
    :hover {
        opacity: 70%;
    }
`
const WrapTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const WrapInputRange = styled.div`
    position: relative;
    height: 5px;
    width: 92%;
    margin: auto;
`

const DotPercent = styled.div`
    position: absolute;
    top: 0px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 3px;
    > div {
        height: 10px;
        width: 10px;
        background: #ffffff;
        border-radius: 50%;
        z-index: -1;
        > span {
            position: relative;
            left: -7px;
            top: 15px;
        }
    }
`
const WrapPercent = styled.div`
    width: 60%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    text-align: right;
    padding: 0px 10px;
`
const WrapAmount = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`

const Input = styled.input`
    position: absolute;
    top: 3px;
    height: 3px;
    -webkit-appearance: none;
    background: #00c4f4;
    width: 100%;
    ::-webkit-slider-thumb {
        appearance: none;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: var(--btn1);
        cursor: pointer;
        z-index: 999999;
    }
`

const Percent = styled.div`
    font-size: 50px;
    font-weight: 400;
`
const TitleRemove = styled.div`
    font-weight: 500;
    font-size: 18px;
    width: 40%;
`
const WrapRemoveAmount = styled.div`
    padding: 15px 15px;
    height: 155px;
    margin-top: 20px;
    background: var(--bg2);;
    border-radius: 8px;
    box-shadow: rgba(100,100,111,0.2) 0px 7px 29px 0px;
    color: #000;
`

const RowContentRemove = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0px;
`
const WrapContentRemove = styled.div`
    margin: 20px 0;
    border-radius: 6px;
    padding: 15px;
    background: var(--bg3);
    color: #000;
`

const BtnConfirm = styled.div<{ isDisabled?: boolean }>`
    margin-top: 20px;
    background: #00b2ff;
    border-radius: 12px;
    padding: 10px;
    width: 100%;
    text-align: center;
    font-size: 20px;
    font-weight: 400;
    color: #ffffff;
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
`
const Title = styled.div`
    font-weight: 700;
    font-size: 20px;
    display: flex;
    justify-content: center;
    color:#000;
`

const WrapRemovePool = styled.div`
    background-color: rgb(255 255 255 / 80%);
    border: 1px solid #ffffff;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    backdrop-filter: blur(25px);
    border-radius: 12px;
    padding: 20px;
    max-width: 500px;
    height: fit-content;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;

    @media screen and (max-width: 550px) {
        min-width: 300px;
        font-size: 12px;
        scale: 0.9;
    }
`
const ModalRemovePool = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    height: fit-content;
    z-index: 1;
    margin: auto;
    display: flex;
    justify-content: center;
    background: #00000055;
    height: 100%;
`
const Logo = styled.img`
    width: 25px;
    height: 25px;
    border-radius: 50%;
`

const BtnRemove = styled.div`
    border: 0.475851px solid #00b2ff;
    border-radius: 6px;
    text-align: center;
    padding: 5px 0px;
    cursor: pointer;
    transition: all ease-in-out 0.3s;

    &:hover {
        background: var(--bg6);
    }
`
const Value = styled.div``
const WrapText = styled.div`
    gap: 5px;
    display: flex;
    align-items: center;
`
