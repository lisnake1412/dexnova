import PrimaryButton from 'components/Buttons/PrimaryButton'
import styled from 'styled-components'
import imgSuccess from 'assets/icons/success.svg'
import imgError from 'assets/icons/error.svg'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { useCallback, useRef } from 'react'
import Blur from 'components/Blur'
import { WatchAssetParameters } from '@web3-react/types'
import { useActiveWeb3React } from 'hooks'
import { useToken } from 'hooks/useToken'
import { Container } from '../styled'

interface ResultModal {
    isSuccess: boolean
    setOpenModal: any
    txnHash: string | undefined
    error?: any
    addErc20: WatchAssetParameters | undefined
}
const ResultTransactionModal = ({
    isSuccess,
    setOpenModal,
    error,
    addErc20,
}: ResultModal) => {
    const { connector } = useActiveWeb3React()
    const token = addErc20
    const ref = useRef<any>()
    const tokenType = useToken(token?.address)

    useOnClickOutside(ref, () => {
        setOpenModal(false)
    })

    const onAddToken = useCallback(() => {
        if (!token || !token.address || !token.symbol || !connector.watchAsset)
            return
        else connector.watchAsset(token)
    }, [connector, tokenType, token])

    return (
        <>
            <Container ref={ref}>
                <WrapContent>
                    <WrapInfoLoad>
                        <div className={isSuccess ? '' : 'error'}>
                            {isSuccess
                                ? 'Transaction Submitted'
                                : error?.data
                                ? error?.data
                                : error}
                        </div>
                    </WrapInfoLoad>
                    <WrapImgResult>
                        <img
                            src={`${isSuccess ? imgSuccess : imgError}`}
                            alt=""
                        />
                    </WrapImgResult>
                    {token && token.address && token.symbol && isSuccess ? (
                        <WrapAddErc20>
                            <AddErc20 onClick={() => onAddToken()}>
                                Add {token && token.symbol} to wallet
                            </AddErc20>
                        </WrapAddErc20>
                    ) : (
                        ''
                    )}
                </WrapContent>
                <PrimaryButton
                    name="Close"
                    onClick={() => setOpenModal(false)}
                />
            </Container>
            <Blur />
        </>
    )
}

export default ResultTransactionModal

const WrapAddErc20 = styled.div`
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
`
const AddErc20 = styled.button`
    color: #fff;
    outline: none;
    border: none;
    font-size: 16px;
    border-radius: 8px;
    padding: 8px 12px;
    cursor: pointer;
`

const WrapContent = styled.div`
`
const WrapImgResult = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 0;
    img {
        height: 80px;
        width: 80px;
    }
`
const WrapInfoLoad = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-style: normal;
    div {
        color: #34dc81;
        font-size: 18px;
    }

    .error {
        color: #cd3535;
    }

    a {
        text-decoration: none;
        color: rgb(1, 104, 255);
    }
`