import { useMemo } from 'react'
import ERC20_INTERFACE from 'constants/jsons/erc20'
import { Token } from 'interfaces'
import { useMultipleContractSingleData } from 'states/multicall/hooks'
import { useActiveWeb3React } from 'hooks'
import { isAddress } from 'utils'
import { useTokenContract } from './useContract'
import { Contract, FixedNumber } from 'ethers'
import { ETHER_ADDRESS } from 'constants/index'
import { ZERO_ADDRESS } from 'constants/index'
import { NATIVE_COIN } from 'constants/index'
import tokenList from 'constants/jsons/tokenList.json'
import UNKNOWN from 'assets/icons/question-mark-button-dark.svg'

export function useToken(address: string | undefined): Token | undefined {
    const { chainId } = useActiveWeb3React()
    address = isAddress(address) ? address : undefined

    const symbolResult = useMultipleContractSingleData(
        [address],
        ERC20_INTERFACE,
        'symbol',
        [],
    )

    const nameResult = useMultipleContractSingleData(
        [address],
        ERC20_INTERFACE,
        'name',
        [],
    )

    const decimalsResult = useMultipleContractSingleData(
        [address],
        ERC20_INTERFACE,
        'decimals',
        [],
    )

    return useMemo(() => {
        const symbol = symbolResult?.[0]?.result?.[0]
        const name = nameResult?.[0]?.result?.[0]
        const decimals = decimalsResult?.[0]?.result?.[0]

        if (!chainId) return
        if (
            address?.toLocaleLowerCase() == ETHER_ADDRESS.toLocaleLowerCase() ||
            address?.toLocaleLowerCase() == ZERO_ADDRESS.toLocaleLowerCase()
        )
            return NATIVE_COIN[chainId]
        if (!symbol || !name || !decimals || !address) return
        return {
            address,
            name,
            decimals,
            chainId,
            symbol,
            logoURI:
                tokenList
                    .filter((token) => token.chainId === chainId)
                    .find((t) => t.address == address || t.symbol == symbol)
                    ?.logoURI || UNKNOWN,
        }
    }, [address, chainId, symbolResult, nameResult, decimalsResult])
}

export function useTokens(
    addresses: (string | undefined)[],
): (Token | undefined)[] {
    const { chainId } = useActiveWeb3React()
    const symbolResult = useMultipleContractSingleData(
        addresses,
        ERC20_INTERFACE,
        'symbol',
        [],
    )

    const nameResult = useMultipleContractSingleData(
        addresses,
        ERC20_INTERFACE,
        'name',
        [],
    )

    const decimalsResult = useMultipleContractSingleData(
        addresses,
        ERC20_INTERFACE,
        'decimals',
        [],
    )

    return useMemo(() => {
        return addresses?.map((address, index) => {
            const symbol = symbolResult?.[index]?.result?.[0]
            const name = nameResult?.[index]?.result?.[0]
            const decimals = decimalsResult?.[index]?.result?.[0]

            if (!chainId) return
            if (
                address?.toLocaleLowerCase() ==
                    ETHER_ADDRESS.toLocaleLowerCase() ||
                address?.toLocaleLowerCase() == ZERO_ADDRESS.toLocaleLowerCase()
            )
                return NATIVE_COIN[chainId]
            if (!symbol || !name || !decimals || !address) return
            return {
                address,
                name,
                decimals,
                chainId,
                symbol,
                logoURI:
                    tokenList
                        .filter((token) => token.chainId === chainId)
                        .find((t) => t.address == address || t.symbol == symbol)
                        ?.logoURI || UNKNOWN,
            }
        })
    }, [addresses, chainId])
}

export function useTokenApproval(
    from: string | null | undefined,
    to: string | null | undefined,
    token: Token | undefined,
): {
    allowance: FixedNumber | undefined
    approve: (to: string, amount: number | string) => void
    approveEncodeData: (
        to: string,
        amount: number | string,
    ) => string | undefined
} {
    from = from == null ? undefined : from
    to = to == null ? undefined : to
    const tokenContract = useTokenContract(token?.address)
    const approve = async (to: string, amount: number | string) => {
        try {
            if (!isAddress(to)) return
            const gasLimit = await tokenContract?.estimateGas.approve(
                to,
                amount,
            )
            return tokenContract?.approve(to, amount, {
                gasLimit: gasLimit && gasLimit.add(1000),
            })
        } catch (err) {
            console.log({ err })
        }
    }

    const allowance = useMultipleContractSingleData(
        [token?.address],
        ERC20_INTERFACE,
        'allowance',
        [from, to],
    )

    const approveEncodeData = (
        to: string,
        amount: number | string,
    ): string | undefined => {
        if (!tokenContract) return
        return tokenContract.interface.encodeFunctionData('approve', [
            to,
            amount,
        ])
    }

    return useMemo(() => {
        const value = allowance?.[0]?.result?.[0]?._hex || 0

        return {
            allowance: value && FixedNumber.fromValue(value, token?.decimals),
            approve,
            approveEncodeData,
        }
    }, [from, to, token, tokenContract, allowance])
}
