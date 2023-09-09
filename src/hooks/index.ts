import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { ChainId } from 'interfaces'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { updateSelectedWallet } from 'states/user/reducer'

export function useActiveWeb3React() {
    const { account, chainId, provider, connector } =
        useWeb3ReactCore<Web3Provider>()
    const dispatch = useDispatch()

    const disconnect = () => {
        if (connector && connector.deactivate) {
            connector.deactivate()
        }
        connector.resetState()
        dispatch(updateSelectedWallet({ wallet: undefined }))
    }

    const isWrongNetwork = useMemo(() => {
        const result = chainId ? !Object.keys(ChainId).includes(chainId.toString()) : false
        return result
    }, [chainId]) 

    return {
        account: account,
        chainId:
            chainId && Object.keys(ChainId).includes(chainId.toString())
                ? chainId
                : 0,
        provider: provider,
        disconnect,
        connector,
        isWrongNetwork
    }
}