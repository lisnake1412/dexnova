import React, { useEffect, useRef, useState } from 'react'
import AccountDetails from 'components/AccountDetails'
import OptionsWallet from 'components/OptionsWallet'
import { useActiveWeb3React } from 'hooks'

interface connectModalWallet {
    setToggleWalletModal: React.Dispatch<React.SetStateAction<boolean>>
}

const WALLET_VIEWS = {
    OPTIONS: 'options',
    ACCOUNT: 'account',
    PENDING: 'pending',
}

const WalletModal = ({ setToggleWalletModal }: connectModalWallet) => {
    const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
    const { account } = useActiveWeb3React()
    const [pendingError, setPendingError] = useState<boolean>(false)
    const [pendingWallet, setPendingWallet] = useState<string | undefined>()

    useEffect(() => {
        if (account && walletView == WALLET_VIEWS.PENDING) {
            setToggleWalletModal(false)
        }
    }, [account])

    const getModalContent = () => {
        if (account && walletView === WALLET_VIEWS.ACCOUNT) {
            return <AccountDetails />
        }
        return (
            <OptionsWallet
                walletView={walletView}
                setWalletView={setWalletView}
                pendingWallet={pendingWallet}
                setPendingWallet={setPendingWallet}
                setToggleWalletModal={setToggleWalletModal}
            />
        )
    }

    return <>{getModalContent()}</>
}

export default WalletModal
