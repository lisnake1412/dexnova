import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { Row, Columns } from 'components/Layouts';
import CurrencyInputPanel from 'components/CurrencyInputPanel';
import { Field, Token } from 'interfaces';
import { useSwapActionHandlers, useSwapState } from 'states/swap/hooks';
import PoolPriceBar from './PoolPriceBar';
import Header from 'components/HeaderV2';
import Footer from 'components/FooterV2';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import LabelButton from 'components/Buttons/LabelButton';
import SwapIcon from 'assets/icons/swap-icon.png';
import { useActiveWeb3React } from 'hooks';
import { usePair } from 'hooks/useAllPairs';
import Setting from 'components/HeaderLiquidity';
import { useTokenApproval } from 'hooks/useToken';
import { useCurrencyBalance } from 'hooks/useCurrencyBalance';
import WalletModal from 'components/WalletModal';

import { ALL_SUPPORTED_CHAIN_IDS, WRAPPED_NATIVE_COIN } from 'constants/index';
import { ROUTERS, SYNCSWAP_ROUTERS, WRAPPED_NATIVE_ADDRESSES } from 'constants/addresses';
import { divNumberWithDecimal, mulNumberWithDecimal } from 'utils/math';
import { useRouterContract, useSyncSwapRouterContract, useTokenContract } from 'hooks/useContract';
import { calcSlippageAmount, calcTransactionDeadline, computeGasLimit, isNativeCoin } from 'utils';
import { ZERO_ADDRESS } from 'constants/index';
import { useAppState, useSlippageTolerance, useTransactionDeadline } from 'states/application/hooks';
import { useTransactionHandler } from 'states/transactions/hooks';
import ComponentsTransaction, { InitCompTransaction } from 'components/TransactionModal';
import { sendEvent } from 'utils/analytics';
import Blur from 'components/Blur';
import { useOnClickOutside } from 'hooks/useOnClickOutSide';
import { OpacityModal } from 'components/Web3Status';
import { useEstimateGas } from 'hooks/useEstimateGas';
import { useSyncSwapPair } from 'hooks/useSyncSwapPair';
import { defaultAbiCoder } from 'ethers/lib/utils';
import STABLE_ABI from 'constants/jsons/stablePool.json';
import { ethers } from 'ethers';
import useDebounce from 'hooks/useDebounce';

const Swap = () => {
    const swapState = useSwapState();
    const [poolPriceBarOpen, setPoolPriceBarOpen] = useState(true);
    const { inputAmount, outputAmount, swapType, tokenIn, tokenOut } = swapState;
    const { onUserInput, onSwitchTokens, onTokenSelection, onChangeSwapState } = useSwapActionHandlers();
    const { chainId, account, provider } = useActiveWeb3React();
    const [isOpenWalletModal, setIsOpenWalletModal] = useState(false);
    let pair = usePair(chainId, tokenIn, tokenOut);
    let isStable = false;
    let routerContract = useRouterContract();
    let routerAddress = chainId ? ROUTERS[chainId] : undefined;
    const [isLoading, setIsLoading] = useState(false);
    const syncPair = useSyncSwapPair(chainId, tokenIn, tokenOut);
    const syncSwapRouterContract = useSyncSwapRouterContract();
    const amountInStable = useDebounce(inputAmount, 600);
    const amountOutStable = useDebounce(outputAmount, 600);

    if (syncPair !== undefined) {
        pair = syncPair;
        isStable = syncPair.isStable;
        routerAddress = chainId ? SYNCSWAP_ROUTERS[chainId] : undefined;
        routerContract = syncSwapRouterContract;
    }

    const contractApprove = useTokenContract(tokenIn?.address);
    const tokenApproval = useTokenApproval(account, routerAddress, tokenIn);
    const balanceIn = useCurrencyBalance(account, tokenIn);
    const { deadline } = useTransactionDeadline();
    const { addTxn } = useTransactionHandler();
    const initDataTransaction = InitCompTransaction();
    const { slippage } = useSlippageTolerance();
    const ref = useRef<any>();

    const isInsufficientAllowance = Number(tokenApproval?.allowance) < Number(inputAmount) && !isNativeCoin(tokenIn);

    useOnClickOutside(ref, () => {
        setIsOpenWalletModal(false);
    });

    const handleOnUserInput = useCallback(
        (field: Field, value: string) => {
            onUserInput(field, value);
        },
        [onUserInput, swapState],
    );

    const handleOnTokenSelection = useCallback(
        (field: Field, token: Token) => {
            onTokenSelection(field, token);
        },
        [onTokenSelection, swapState],
    );

    const getSyncSwapMethod = useCallback(() => {
        return 'swap';
    }, []);

    const getSwapMethod = useCallback(() => {
        if (swapType === Field.INPUT) {
            if (isNativeCoin(tokenIn)) return 'swapExactETHForTokens';
            else if (isNativeCoin(tokenOut)) return 'swapExactTokensForETH';
            else return 'swapExactTokensForTokens';
        } else {
            if (isNativeCoin(tokenOut)) return 'swapTokensForExactETH';
            else if (isNativeCoin(tokenIn)) return 'swapETHForExactTokens';
            else return 'swapTokensForExactTokens';
        }
    }, [swapType, tokenIn, tokenOut]);

    const getSyncSwapArguments = useCallback(() => {
        if (!inputAmount || !outputAmount || !tokenIn || !tokenOut || !chainId || !syncPair) return;
        const token0 = isNativeCoin(tokenIn) ? ZERO_ADDRESS : tokenIn.address;
        const amountIn = mulNumberWithDecimal(inputAmount, tokenIn.decimals);
        const token = isNativeCoin(tokenIn) ? WRAPPED_NATIVE_COIN[chainId] : tokenIn;
        const swapData: string = defaultAbiCoder.encode(
            ['address', 'address', 'uint8'],
            [token.address, account, 1], // tokenIn, to, withdraw mode
        );

        const steps = [
            {
                pool: syncPair.tokenLp.address,
                data: swapData,
                callback: ZERO_ADDRESS,
                callbackData: '0x',
            },
        ];
        const paths = [
            {
                steps,
                tokenIn: token0,
                amountIn,
            },
        ];

        return {
            args: [
                paths,
                '0', //amountOutMin
                calcTransactionDeadline(deadline),
            ],
            value: isNativeCoin(tokenIn) ? amountIn : '0', //amountIn
        };
    }, [inputAmount, outputAmount, tokenIn, tokenOut, chainId]);

    const getSwapArguments = useCallback(() => {
        if (!inputAmount || !outputAmount || !tokenIn || !tokenOut || !chainId) return;
        const amountIn = mulNumberWithDecimal(inputAmount, tokenIn.decimals);
        const amountOut = mulNumberWithDecimal(outputAmount, tokenOut.decimals);
        const amountOutMin = mulNumberWithDecimal(calcSlippageAmount(outputAmount, slippage)[0], tokenOut.decimals);
        const amountInMax = mulNumberWithDecimal(calcSlippageAmount(inputAmount, slippage)[1], tokenIn.decimals);
        if (swapType === Field.INPUT) {
            if (isNativeCoin(tokenIn))
                return {
                    args: [
                        amountOutMin, //amountOutMin
                        [WRAPPED_NATIVE_ADDRESSES[chainId], tokenOut.address],
                        account,
                        calcTransactionDeadline(deadline),
                        ZERO_ADDRESS,
                    ],
                    value: amountIn, //amountIn
                };
            else if (isNativeCoin(tokenOut))
                return {
                    args: [
                        amountIn, //amountIn
                        amountOutMin, //amountOutMin
                        [tokenIn.address, WRAPPED_NATIVE_ADDRESSES[chainId]],
                        account,
                        calcTransactionDeadline(deadline),
                        ZERO_ADDRESS,
                    ],
                    value: '0x00',
                };
            else
                return {
                    args: [
                        amountIn, //amountIn
                        amountOutMin, //amountOutMin
                        [tokenIn.address, tokenOut.address],
                        account,
                        calcTransactionDeadline(deadline),
                        ZERO_ADDRESS,
                    ],
                    value: '0x00',
                };
        } else {
            if (isNativeCoin(tokenOut))
                return {
                    args: [
                        amountOut, //amountOut
                        amountInMax, //amountInMax
                        [tokenIn.address, WRAPPED_NATIVE_ADDRESSES[chainId]],
                        account,
                        calcTransactionDeadline(deadline),
                        ZERO_ADDRESS,
                    ],
                    value: '0x00',
                };
            else if (isNativeCoin(tokenIn))
                return {
                    args: [
                        amountOut, //amountOut
                        [WRAPPED_NATIVE_ADDRESSES[chainId], tokenOut.address],
                        account,
                        calcTransactionDeadline(deadline),
                        ZERO_ADDRESS,
                    ],
                    value: amountInMax, //amountInMax
                };
            else
                return {
                    args: [
                        amountOut, //amountOut
                        amountInMax, //amountInMax
                        [tokenIn.address, tokenOut.address],
                        account,
                        calcTransactionDeadline(deadline),
                        ZERO_ADDRESS,
                    ],
                    value: '0x00',
                };
        }
    }, [inputAmount, outputAmount, tokenIn, tokenOut, chainId]);

    const argsEstimate = useMemo(() => {
        if (isInsufficientAllowance) {
            return {
                contract: contractApprove,
                method: () => {
                    return 'approve';
                },
                args: () => {
                    return {
                        args: [routerAddress, mulNumberWithDecimal(inputAmount || '0', tokenIn?.decimals || 18)],
                        value: '0x',
                    };
                },
            };
        }

        return {
            contract: routerContract,
            method: getSwapMethod,
            args: getSwapArguments,
        };
    }, [isInsufficientAllowance, swapType, inputAmount, outputAmount, tokenIn, tokenOut, chainId, contractApprove]);

    const gasEstimate = useEstimateGas(argsEstimate.contract, argsEstimate.method, argsEstimate.args);
    const handleDataUser = ({ hash, status, method }: { hash: string; status: boolean; method: string }) => {
        addTxn({
            hash,
            msg: method,
            status,
        });

        const date =
            new Date().toDateString().split(' ')?.slice(1, 3).join(' ') + ' ' + new Date().toLocaleTimeString('vi');
    };

    const handleOnSwap = async () => {
        try {
            if (inputAmount && outputAmount && tokenIn && tokenOut) {
                initDataTransaction.setError('');
                initDataTransaction.setPayload({
                    method: 'swap',
                    input: inputAmount,
                    output: outputAmount,
                    tokenIn,
                    tokenOut,
                });
                initDataTransaction.setAddErc20({
                    address: tokenOut.address,
                    symbol: tokenOut.symbol,
                    decimals: tokenOut.decimals,
                    image: tokenOut.logoURI,
                });
                initDataTransaction.setIsOpenConfirmModal(true);
            }
        } catch (error) {
            console.log('failed to swap', error);
        }
    };

    const handleOnApprove = async () => {
        try {
            initDataTransaction.setError('');

            if (tokenIn && inputAmount && routerAddress) {
                initDataTransaction.setIsOpenWaitingModal(true);
                const callResult: any = await tokenApproval?.approve(
                    routerAddress,
                    mulNumberWithDecimal(inputAmount, tokenIn.decimals),
                );
                initDataTransaction.setIsOpenWaitingModal(false);
                initDataTransaction.setIsOpenResultModal(true);

                const txn = await callResult.wait();
                initDataTransaction.setIsOpenResultModal(false);

                handleDataUser({
                    hash: callResult.hash,
                    status: txn.status === 1 ? true : false,
                    method: `Approve ${tokenIn.symbol}`,
                });
            }
        } catch (err) {
            initDataTransaction.setError('Failed');
            initDataTransaction.setIsOpenWaitingModal(false);
            initDataTransaction.setIsOpenResultModal(true);
        }
    };

    const onConfirm = useCallback(async () => {
        try {
            initDataTransaction.setIsOpenConfirmModal(false);
            initDataTransaction.setIsOpenWaitingModal(true);

            const method = syncPair ? getSyncSwapMethod() : getSwapMethod();
            const swapArguments = syncPair ? getSyncSwapArguments() : getSwapArguments();

            if (!swapArguments) {
                initDataTransaction.setError('Failed');
                initDataTransaction.setIsOpenWaitingModal(false);
                return initDataTransaction.setIsOpenResultModal(true);
            }
            const { args, value } = swapArguments;
            console.log({ swapArguments, method });
            console.log(routerContract);
            const gasLimit = await routerContract?.estimateGas[method](...args, {
                value,
            });
            const callResult = await routerContract?.[method](...args, {
                value,
                gasLimit: computeGasLimit(gasLimit),
            });

            initDataTransaction.setIsOpenWaitingModal(false);
            initDataTransaction.setIsOpenResultModal(true);

            sendEvent({
                category: 'Defi',
                action: 'Swap',
                label: [tokenIn?.symbol, tokenIn?.address, tokenOut?.symbol, tokenOut?.address].join('/'),
            });

            const txn = await callResult?.wait?.();
            // initDataTransaction.setIsOpenResultModal(false)
            if (!txn) return;

            handleDataUser({
                hash: txn.transactionHash || callResult.hash,
                status: txn.status === 1 ? true : false,
                method: tokenIn && tokenOut ? `Swap ${tokenIn.symbol}/${tokenOut.symbol}` : 'Swap',
            });
            /**
             * @dev reset input && output state when transaction success
             */
            onUserInput(Field.INPUT, '');
            onUserInput(Field.OUTPUT, '');
        } catch (error) {
            initDataTransaction.setError('Failed');
            initDataTransaction.setIsOpenResultModal(true);
            console.log('error', error);
        }
    }, [initDataTransaction, isInsufficientAllowance]);

    const openWalletModal = () => {
        setIsOpenWalletModal(!isOpenWalletModal);
    };

    useEffect(() => {
        if (amountInStable && pair && tokenIn && tokenOut && swapType === Field.INPUT && chainId && isStable) {
            const amountInWithDel = mulNumberWithDecimal(amountInStable, tokenIn.decimals);
            const poolContract = new ethers.Contract(pair.tokenLp.address, STABLE_ABI, provider);
            setIsLoading(true);
            poolContract
                .getAmountOut(tokenIn.address, amountInWithDel, account || ZERO_ADDRESS)
                .then((res: any) => {
                    const amountOut = divNumberWithDecimal(res, tokenOut.decimals);
                    onChangeSwapState({
                        ...swapState,
                        outputAmount: amountOut,
                    });
                    setIsLoading(false);
                })
                .catch((err: any) => {
                    onChangeSwapState({
                        ...swapState,
                        outputAmount: '',
                    });
                    setIsLoading(false);
                    console.log('failed to fetch amount out of syncswap stable pool', err);
                });
        }
    }, [amountInStable, chainId, pair?.reserve0, pair?.reserve1, pair?.reserveLp, pair?.tokenLp.address, isStable]);

    useEffect(() => {
        if (inputAmount && pair && tokenIn && tokenOut && swapType === Field.INPUT && chainId && !isStable) {
            const amountInWithDel = mulNumberWithDecimal(inputAmount, tokenIn.decimals);
            const tI = isNativeCoin(tokenIn) ? WRAPPED_NATIVE_COIN[chainId] : tokenIn;
            const tO = isNativeCoin(tokenOut) ? WRAPPED_NATIVE_COIN[chainId] : tokenOut;
            const swapRate = pair?.calcSwapRate(amountInWithDel, tI, tO, Field.INPUT);
            if (isNaN(Number(swapRate))) {
                onChangeSwapState({
                    ...swapState,
                    outputAmount: '',
                });
            } else {
                onChangeSwapState({
                    ...swapState,
                    outputAmount: swapRate,
                });
            }
            return;
        }
        return () => {};
    }, [inputAmount, chainId, pair?.reserve0, pair?.reserve1, pair?.reserveLp, pair?.tokenLp.address, isStable]);

    useEffect(() => {
        if (amountOutStable && pair && tokenIn && tokenOut && swapType === Field.OUTPUT && chainId && isStable) {
            const amountOutWithDel = mulNumberWithDecimal(amountOutStable, tokenOut.decimals);
            const poolContract = new ethers.Contract(pair.tokenLp.address, STABLE_ABI, provider);
            setIsLoading(true);
            poolContract
                .getAmountIn(tokenOut.address, amountOutWithDel, account || ZERO_ADDRESS)
                .then((res: any) => {
                    const amountIn = divNumberWithDecimal(res, tokenIn.decimals);
                    onChangeSwapState({
                        ...swapState,
                        inputAmount: amountIn,
                    });
                    setIsLoading(false);
                })
                .catch((err: any) => {
                    onChangeSwapState({
                        ...swapState,
                        inputAmount: '',
                    });
                    setIsLoading(false);
                    console.log('failed to fetch amount in of syncswap stable pool', err);
                });
        }
    }, [amountOutStable, chainId, pair?.reserve0, pair?.reserve1, pair?.reserveLp, pair?.tokenLp.address, isStable]);

    useEffect(() => {
        if (outputAmount && pair && tokenIn && tokenOut && swapType === Field.OUTPUT && chainId && !isStable) {
            const amountOutWithDel = mulNumberWithDecimal(outputAmount, tokenOut.decimals);
            const tI = isNativeCoin(tokenIn) ? WRAPPED_NATIVE_COIN[chainId] : tokenIn;
            const tO = isNativeCoin(tokenOut) ? WRAPPED_NATIVE_COIN[chainId] : tokenOut;
            const swapRate = pair?.calcSwapRate(amountOutWithDel, tI, tO, Field.OUTPUT);

            if (isNaN(Number(swapRate))) {
                onChangeSwapState({
                    ...swapState,
                    inputAmount: '',
                });
            } else {
                onChangeSwapState({
                    ...swapState,
                    inputAmount: swapRate,
                });
            }
        }
        return () => {};
    }, [outputAmount, chainId, pair?.reserve0, pair?.reserve1, pair?.reserveLp, pair?.tokenLp.address, isStable]);

    const SwapButton = () => {
        const isNotConnected = !account;
        const unSupportedNetwork = chainId && !ALL_SUPPORTED_CHAIN_IDS.includes(chainId);
        const isUndefinedAmount = !inputAmount && !outputAmount;
        const isInffuficientLiquidity = !pair || Number(inputAmount) < 0;
        const isUndefinedCurrencies = !tokenIn || !tokenOut;
        const isInsufficientBalance = inputAmount && balanceIn && Number(balanceIn) < Number(inputAmount);

        return (
            <Row>
                {isNotConnected ? (
                    <PrimaryButton name="Connect Wallet" onClick={openWalletModal} isLoading={isLoading} />
                ) : unSupportedNetwork ? (
                    <LabelButton name="Unsupported network" />
                ) : isUndefinedCurrencies ? (
                    <LabelButton name="Select a token" />
                ) : isUndefinedAmount ? (
                    <LabelButton name="Enter an amount" />
                ) : isLoading ? (
                    <PrimaryButton disabled isLoading={true} name="Getting Price" />
                ) : isInsufficientBalance ? (
                    <LabelButton name="Insufficient Balance" />
                ) : isInffuficientLiquidity ? (
                    <LabelButton name="Insufficient Liquidity" />
                ) : isInsufficientAllowance ? (
                    <PrimaryButton name={`Approve ${tokenIn?.symbol}`} onClick={handleOnApprove} />
                ) : (
                    <PrimaryButton onClick={() => handleOnSwap()} name={'Swap'} />
                )}
            </Row>
        );
    };

    return (
        <>
            <Wrapper>
                <FilterBackground />
                <>
                    <ComponentsTransaction
                        data={initDataTransaction}
                        onConfirm={
                            Number(tokenApproval?.allowance) < Number(inputAmount) && !isNativeCoin(tokenIn)
                                ? handleOnApprove
                                : onConfirm
                        }
                    />
                    {(initDataTransaction.isOpenConfirmModal ||
                        initDataTransaction.isOpenResultModal ||
                        initDataTransaction.isOpenWaitingModal) && <Blur />}
                </>
                <Header styles={{ position: 'relative' }} />
                <div className="wp-container">
                    <SwapContainer ref={ref}>
                        {!account && isOpenWalletModal && (
                            <>
                                <WalletModal setToggleWalletModal={setIsOpenWalletModal} />
                                <OpacityModal onClick={() => setIsOpenWalletModal(false)} />
                                {/* <Blur /> */}
                            </>
                        )}
                        <Row jus="space-between">
                            <Nav gap="20px">
                                <Link to="/swap">Swap</Link>
                            </Nav>
                            <Setting />
                        </Row>
                        <Columns>
                            <CurrencyInputPanel
                                token={tokenIn}
                                value={inputAmount}
                                onUserInput={handleOnUserInput}
                                onUserSelect={handleOnTokenSelection}
                                field={Field.INPUT}
                                // disabledInput={isLoading}
                            />
                            <Icon>
                                <svg
                                    onClick={onSwitchTokens}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 14 12"
                                    fill="none"
                                >
                                    <path
                                        d="M7.13553 4.45792L4.2045 1.52689L1.27399 4.45533"
                                        stroke="#2A2E3B"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M4.20605 1.52686V10.3197"
                                        stroke="#2A2E3B"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M7.1344 7.38897L10.0654 10.3977L12.9965 7.38897"
                                        stroke="#2A2E3B"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M10.0674 1.52686V10.3197"
                                        stroke="#2A2E3B"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </Icon>
                            <CurrencyInputPanel
                                token={tokenOut}
                                value={outputAmount}
                                onUserInput={handleOnUserInput}
                                onUserSelect={handleOnTokenSelection}
                                field={Field.OUTPUT}
                                hideMaxButton={true}
                                // disabledInput={isLoading}
                            />
                        </Columns>
                        {pair && (
                            <PoolPriceBar
                                pair={pair}
                                dropDown={poolPriceBarOpen}
                                setDropDown={setPoolPriceBarOpen}
                                gasFee={gasEstimate ? Number(gasEstimate)?.toFixed(5) : gasEstimate}
                            />
                        )}
                        <SwapButton />
                    </SwapContainer>
                </div>
                <Footer isTransparentBackground />
            </Wrapper>
        </>
    );
};

const Wrapper = styled.section``;
export const FilterBackground = styled.div`
    position: absolute;
    background-color: #060B27;
    opacity: 0.6;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    z-index: 0;
`;
const SwapContainer = styled(Columns)`
    margin: 50px auto 40px;
    height: fit-content;
    width: 520px;
    background-color: rgb(255 255 255 / 80%);
    border: 1.5px solid var(--border2);
    border-radius: 12px;
    padding: 30px 30px;
    gap: 30px;
    position: relative;
    z-index: 0;

    border-radius: 5px;
    border: 1px solid #fff;
    background: rgba(9, 0, 61, 0.4);
    backdrop-filter: blur(2px);
    .wp-left {
        text-align: right;
    }

    @media (max-width: 576px) {
        width: 96%;
        overflow: hidden;
        padding: 20px 10px;
    }
`;

const Nav = styled(Row)`
    a {
        padding: 5px 8px;
        border-radius: 4px;
        -webkit-text-decoration: none !important;
        text-decoration: none !important;
        font-size: 24px;
        font-weight: 500;
        :hover {
            text-decoration: none !important;
        }
    }

    .active-link {
        background: var(--bg6);
    }
`;

const Icon = styled.div`
    width: 50px;
    aspect-ratio: 1/1;
    margin: -16px auto;
    cursor: pointer;
    border-radius: 50%;
    -webkit-transition: all ease-in-out 0.3s;
    transition: all ease-in-out 0.3s;
    /* background: var(--bg4); */
    border: none;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    background-color: #fff;
    z-index: 1;
    background-size: contain;
    background-position: center center;

    :hover {
        transform: rotate(180deg);
    }
    svg {
        width: 25px;
    }
`;

export default Swap;
