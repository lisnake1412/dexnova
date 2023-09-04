import { Token } from 'interfaces'
import { useEffect, useMemo } from 'react'
import {
    useSingleCallResult,
    useMultipleContractSingleData,
} from 'states/multicall/hooks'
import { Pair } from 'utils/pair'
import { useMulticallContract, useSyncSwapFactoryContract } from './useContract'
import { useToken } from './useToken'
import PAIR_INTERFACE from 'constants/jsons/syncswap-pair'
import { SUPPORTED_SYNCSWAP_TOKENS, WRAPPED_NATIVE_COIN } from 'constants/index'
import { ChainId } from 'interfaces'
import { isNativeCoin } from 'utils'

/**
 * Returns a map of the given tokenA, tokenB to their eventually consistent Pair info.
 */
export function useSyncSwapPair(
    chainId: ChainId | undefined,
    tokenA: Token | undefined,
    tokenB: Token | undefined,
): Pair | undefined {
    tokenA =
        chainId && isNativeCoin(tokenA) ? WRAPPED_NATIVE_COIN[chainId] : tokenA
    tokenB =
        chainId && isNativeCoin(tokenB) ? WRAPPED_NATIVE_COIN[chainId] : tokenB
    if(
        !SUPPORTED_SYNCSWAP_TOKENS[chainId || 280].includes(tokenA?.symbol || '') && 
        !SUPPORTED_SYNCSWAP_TOKENS[chainId || 280].includes(tokenB?.symbol || '')
    ) {
        tokenA = undefined
        tokenB = undefined
    }
    const factory = useSyncSwapFactoryContract()
    const lpAddressResult = useSingleCallResult(factory, 'getPool', [
        tokenA?.address,
        tokenB?.address,
    ])
    const lpAddress = lpAddressResult?.result?.[0]
    const tokenLp = useToken(lpAddress)
    const balanceResult = useMultipleContractSingleData(
        [lpAddress],
        PAIR_INTERFACE,
        'totalSupply',
        [],
    )

    const reservesResult = useMultipleContractSingleData(
        [lpAddress],
        PAIR_INTERFACE,
        'getReserves',
        [],
    )

    return useMemo(() => {
        const balance = balanceResult?.[0]?.result?.[0]
        const reserves = reservesResult?.[0]?.result
        const pair =
            tokenA &&
            tokenB &&
            reserves &&
            balance &&
            tokenLp &&
            new Pair({
                token0: tokenA,
                token1: tokenB,
                tokenLp,
                reserve0: Number(reserves[0]._hex),
                reserve1: Number(reserves[1]._hex),
                reserveLp: Number(balance._hex),
                fee: 0.003
            })
        return pair
    }, [lpAddress, balanceResult, reservesResult])
}

