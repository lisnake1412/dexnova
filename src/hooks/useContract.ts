import { useActiveWeb3React } from 'hooks'
import { Contract } from '@ethersproject/contracts'
import { useMemo } from 'react'
import { getContract } from 'utils'
import {
    MULTICALL_NETWORKS,
    MULTICALL_ABI,
    FACTORY_ABI,
    FACTORIES,
    ROUTER_ABI,
    ROUTERS,
    FARMING_ADDRESSES,
    SYNCSWAP_FACTORIES,
    SYNCSWAP_ROUTERS
} from 'constants/addresses'
import ERC20 from 'constants/jsons/erc20.json'
import { PAIR_ABI } from 'constants/jsons/pair'
import FARMING_ABI from 'constants/jsons/farm.json'
import SYNCSWAP_FACOTRY_ABI from 'constants/jsons/syncswap-factory.json'
import SYNCSWAP_ROUTER_ABI from 'constants/jsons/syncswap-router.json'

// returns null on errors
export const useContract = (
    address: string | undefined,
    ABI: any,
    withSignerIfPossible = true,
): Contract | null => {
    const { account, provider, chainId } = useActiveWeb3React()

    return useMemo(() => {
        if (!address || !ABI || !provider) return null
        try {
            return getContract(
                address,
                ABI,
                provider,
                withSignerIfPossible && account ? account : undefined,
            )
        } catch (error) {
            return null
        }
    }, [address, ABI, provider, withSignerIfPossible, account])
}

export function useMulticallContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(MULTICALL_NETWORKS[chainId || 280], MULTICALL_ABI, false)
}

export function useFactoryContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(FACTORIES[chainId || 280], FACTORY_ABI)
}

export function useRouterContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(ROUTERS[chainId || 280], ROUTER_ABI)
}

export function useTokenContract(address: string | undefined): Contract | null {
    return useContract(address, ERC20)
}

export function usePairContract(address: string | undefined): Contract | null {
    return useContract(address, PAIR_ABI)
}

export function useFarmingContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(FARMING_ADDRESSES[chainId || 280] , FARMING_ABI)
}

export function useSyncSwapFactoryContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(SYNCSWAP_FACTORIES[chainId || 280] , SYNCSWAP_FACOTRY_ABI)
}

export function useSyncSwapRouterContract(): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(SYNCSWAP_ROUTERS[chainId || 280] , SYNCSWAP_ROUTER_ABI)
}