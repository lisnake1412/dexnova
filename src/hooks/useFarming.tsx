import { useEffect, useMemo, useState } from "react"
import { useFarmingContract, useTokenContract } from "./useContract"
import { useSingleCallResult, useSingleContractMultipleData } from "states/multicall/hooks"
import { Field, IFarmingPool } from "interfaces"
import { useActiveWeb3React } from "hooks"
import { getPoolApr } from "utils/farm"
import { useToken } from "./useToken"
import { usePair, usePairByAddresses } from "./useAllPairs"
import { PRICE_TOKEN } from "constants/index"
import { divNumberWithDecimal, mulNumberWithDecimal } from "utils/math"

export const useAllFarmingPools = () : IFarmingPool[] => {
    const contract = useFarmingContract()
    const { account } = useActiveWeb3React()

    const poolLength = useSingleCallResult(
        contract,
        'poolLength',
        []
    )

    const mockArrayIds = poolLength?.result?.[0] 
        ? new Array(Number(poolLength.result[0])) 
        : []

    const poolIds = mockArrayIds.length > 0 
        ? mockArrayIds.fill(undefined).map((i, index: number) => [index]) 
        : []

    const userInfoArgs = mockArrayIds.length > 0 
    ? mockArrayIds.fill(undefined).map((i, index: number) => [index, account]) 
    : []

    const allPools = useSingleContractMultipleData(
        contract,
        'poolInfo',
        poolIds
    )

    const userInfos = useSingleContractMultipleData(
        contract,
        'userInfo',
        userInfoArgs
    )

    const currentBlock = useSingleCallResult(
        contract,
        'block',
        []
    )

    const totalAllocPoint = useSingleCallResult(
        contract,
        'totalAllocPoint',
        []
    )

    const tokenPerBlock = useSingleCallResult(
        contract,
        'zksPerBlock',
        []
    )

    return useMemo(() => {
        if(allPools.length == 0 || userInfos.length == 0 || !totalAllocPoint?.result?.[0]  || !tokenPerBlock?.result?.[0]) return []
        const block = currentBlock.result?.[0]
        const formatedPools = allPools.map((p, index) => {
            const multipler = block ? Number(block) - Number(p.result?.lastRewardBlock) || 0 : 0

            return {
                pid: poolIds[index][0],
                lpToken: p.result?.lpToken,
                allocPoint: Number(p.result?.allocPoint) || 0,
                accCakePerShare: Number(p.result?.accCakePerShare) || 0,
                lastRewardBlock: Number(p.result?.lastRewardBlock) || 0,
                amount: userInfos[index].result?.amount || 0,
                rewardDebt: Number(userInfos[index].result?.rewardDebt) || 0,
                multiplier: multipler,
                totalStaked: Number(p.result?.totalStaked) || 0,
                tokenPerBlock: Number(p.result?.allocPoint) / Number(totalAllocPoint.result?.[0]) * Number(tokenPerBlock?.result?.[0]) / 1e18,
                isStakePool: index === 0
            }
        })
        return formatedPools
    },[
        allPools, totalAllocPoint, tokenPerBlock, totalAllocPoint
    ])
}

export const useIsFarmAdmin = () : boolean => {
    const { account, chainId } = useActiveWeb3React()
    const contract = useFarmingContract()
    const result = useSingleCallResult(
        contract,
        'owner',
        []
    )

    return useMemo(() => {
        if(!result?.result || !account) return false
        if(result.result[0]?.toLocaleLowerCase() === account.toLocaleLowerCase()) return true
        return false
    }, [result, account, chainId])
}

export const usePoolApr = (
    lpToken: string | undefined, 
    rewardToken: string | undefined, 
    totalStaked: number | undefined, 
    tokenPerBlock: number | undefined,
    isStakePool: boolean | undefined
) : number => {
    const { chainId } = useActiveWeb3React()
    const pairAddress = isStakePool ? undefined : lpToken
    const pair = usePairByAddresses([pairAddress])
    const lpTokenContract = useTokenContract(lpToken)
    const [ethPrice, setEthPrice] = useState(1850)
    const rwToken = useToken(rewardToken)

    useEffect(() => {
        fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD")
        .then(res => res.json())
        .then(res => res?.USD && setEthPrice(res.USD))
    }, [])

    const token0 = useMemo(() => {
        if(lpToken)
            if(pair?.[lpToken]) return pair[lpToken]?.token0
    }, [pair])
    const token1 = useMemo(() => {
        if(lpToken)
            if(pair?.[lpToken]) return pair[lpToken]?.token1
    }, [pair])
    const eth = useToken(PRICE_TOKEN[chainId]?.address)
    const pairPrice0 = usePair(chainId, token0, eth)
    const pairPrice1 = usePair(chainId, token1, eth)
    const pairRw = usePair(chainId, rwToken, eth)

    const token0Price = useMemo(() => {
        if(pairPrice0 && lpToken && pair[lpToken] && token0 && eth && lpToken && pair) {
            const price = pairPrice0.calcSwapRate(
                mulNumberWithDecimal(0.001, token0.decimals),
                token0,
                eth,
                Field.INPUT
            )
            return Number(price) * ethPrice * Number(pair[lpToken]?.getReserve(token0)) * 1000
        } else {
            return 1
        }
    }, [pairPrice0, token0, eth])

    const token1Price = useMemo(() => {
        if(pairPrice1 && token1 && eth && lpToken && pair[lpToken] ) {
            const price = pairPrice1.calcSwapRate(
                mulNumberWithDecimal(0.001, token1.decimals),
                token1,
                eth,
                Field.INPUT
            )
            return Number(price) * ethPrice * Number(pair[lpToken]?.getReserve(token1)) * 1000
        } else {
            return 1
        }
    }, [pairPrice1, token1, eth])

    const rwTokenPrice = useMemo(() => {
        if(pairRw && rwToken && eth) {
            const price = pairRw.calcSwapRate(
                mulNumberWithDecimal(0.001, rwToken.decimals),
                rwToken,
                eth,
                Field.INPUT
            )

            return Number(price) * ethPrice * 1000
        } else {
            return 1
        }
    }, [rwToken, pairRw, eth])

    const totalSupplyLp = useSingleCallResult(
        lpTokenContract,
        'totalSupply',
        []
    )

    const lpTokenPrice = useMemo(() => {
        if(!token0Price || !token1Price) return 1
        if(totalSupplyLp?.result?.[0]) {
            return (token0Price + token1Price)/Number(divNumberWithDecimal(totalSupplyLp.result[0], 18)) 
        } return 1
    }, [token0Price, token1Price, totalSupplyLp])

    return useMemo(() => {
        if(!tokenPerBlock) return 50
        if(totalStaked && totalStaked < 1) totalStaked = 1
        return getPoolApr(lpTokenPrice, rwTokenPrice, totalStaked || 1, tokenPerBlock, isStakePool)
    }, [rwTokenPrice, lpTokenPrice, totalStaked, totalSupplyLp])
}