import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTokensUrl } from 'hooks/useAllPairs'
import UnknowToken from 'assets/icons/question-mark-button-dark.svg'

import { useActiveWeb3React } from 'hooks'

import { useNavigate } from 'react-router-dom'
import { Field } from 'interfaces'

import ComponentsTransaction, {
    InitCompTransaction,
} from 'components/TransactionModal'

import { Row } from 'components/Layouts'

import Pagination from 'components/Pagination'
import { useMintActionHandlers } from 'states/mint/hooks'
import RemoveModal from './RemoveModal'
import PrimaryButton from 'components/Buttons/PrimaryButton'

interface IPositions {
    position: (
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
    )[]
    tokenList: string[]
}

const Positions = ({ position, tokenList }: IPositions) => {
    const [modalRemovePool, setModalRemovePool] = useState<boolean>(false)

    const currentPoolInPage = 6

    const totalPage =
        position?.length > 0
            ? Math.ceil(position?.length / currentPoolInPage)
            : 1
    const [page, setPage] = useState(1)

    const [positionInCurrentPage, setPositionInCurrentPage] = useState<
        typeof position
    >(position?.slice(0, currentPoolInPage))

    const [poolRemove, setPoolRemove] = useState<(typeof position)[0]>()
    const navigate = useNavigate()
    const urlTokens = useTokensUrl(tokenList)
    const { onTokenSelection } = useMintActionHandlers()
    const { account } = useActiveWeb3React()

    const initDataTransaction = InitCompTransaction()

    useEffect(() => {
        setPositionInCurrentPage(position?.slice(0, currentPoolInPage) || [])
    }, [position])

    const handleOnAdd = (item: (typeof position)[0]) => {
        onTokenSelection(Field.INPUT, item?.token0)
        onTokenSelection(Field.OUTPUT, item?.token1)

        navigate('/add')
    }

    useEffect(() => {
        const filterData = position.filter(
            (d, index) =>
                index >= (page - 1) * currentPoolInPage &&
                index < page * currentPoolInPage,
        )
        setPositionInCurrentPage(filterData)
    }, [page])

    /*
     * Update position when account change
     */
    useEffect(() => {
        setPositionInCurrentPage(position?.slice(0, currentPoolInPage))
    }, [account])

    return (
        <>
            <ComponentsTransaction
                data={initDataTransaction}
                onConfirm={() => {}}
            />
            <WrapMyPools>
                <RowMyPools>
                    {positionInCurrentPage &&
                        positionInCurrentPage?.length > 0 &&
                        positionInCurrentPage.map((item, index) => {
                            return (
                                <ColMyPools key={index}>
                                    <WrapContent>
                                        <WrapText>
                                            <WrapLogo>
                                                <Logo
                                                    src={
                                                        urlTokens?.[
                                                            item?.token0
                                                                ?.address
                                                        ] || UnknowToken
                                                    }
                                                ></Logo>
                                                <LogoTwo
                                                    src={
                                                        urlTokens?.[
                                                            item?.token1
                                                                ?.address
                                                        ] || UnknowToken
                                                    }
                                                ></LogoTwo>
                                            </WrapLogo>
                                            <div>
                                                {' '}
                                                {item?.token0?.symbol}/
                                                {item?.token1?.symbol}
                                            </div>
                                        </WrapText>
                                        <Value>
                                            {Number(item?.value).toFixed(4)}
                                        </Value>
                                    </WrapContent>

                                    <WrapContent>
                                        <WrapText>Your pool share:</WrapText>
                                        <Value>
                                            {Number(item?.percent).toFixed(4)} %
                                        </Value>
                                    </WrapContent>
                                    <HrTag></HrTag>
                                    <WrapContent>
                                        <WrapText>
                                            <Logo
                                                src={
                                                    urlTokens?.[
                                                        item?.token0?.address
                                                    ] || UnknowToken
                                                }
                                            ></Logo>
                                            <div>{item?.token0?.symbol}</div>
                                        </WrapText>
                                        <Value>
                                            {Number(
                                                item?.token0?.value,
                                            ).toFixed(4)}
                                        </Value>
                                    </WrapContent>
                                    <WrapContent>
                                        <WrapText>
                                            <Logo
                                                src={
                                                    urlTokens?.[
                                                        item?.token1?.address
                                                    ] || UnknowToken
                                                }
                                            ></Logo>
                                            <div>{item?.token1?.symbol}</div>
                                        </WrapText>
                                        <Value>
                                            {Number(
                                                item?.token1?.value,
                                            ).toFixed(4)}
                                        </Value>
                                    </WrapContent>
                                    <WrapAddAndRemove>
                                        <PrimaryButton
                                            onClick={() => {
                                                handleOnAdd(item)
                                            }}
                                            name="Add"
                                        />
                                        <BtnRemove
                                            onClick={() => {
                                                setPoolRemove(item)
                                                setModalRemovePool(
                                                    !modalRemovePool,
                                                )
                                            }}
                                        >
                                            Remove
                                        </BtnRemove>
                                    </WrapAddAndRemove>
                                </ColMyPools>
                            )
                        })}
                </RowMyPools>
                {positionInCurrentPage.length <= 0 ? (
                    <Row jus="center">
                        You have no position. Try to add new liquidity for yourself and earn fees.
                    </Row>
                ) : (
                    <Pagination
                        page={page}
                        setPage={setPage}
                        setLoadingChangePage={undefined}
                        totalPage={totalPage}
                    />
                )}
                {modalRemovePool && (
                    <RemoveModal
                        poolRemove={poolRemove}
                        tokenList={tokenList}
                        setModalRemovePool={setModalRemovePool}
                        initDataTransaction={initDataTransaction}
                    />
                )}
            </WrapMyPools>
        </>
    )
}

const WrapLogo = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    width: 40px;
`
const Logo = styled.img`
    width: 25px;
    height: 25px;
    border-radius: 50%;
`
const LogoTwo = styled(Logo)`
    position: absolute;
    left: 15px;
    top: 0px;
    border-radius: 50%;
`
const HrTag = styled.div`
    height: 1px;
    background-color: #888888;
`
const BtnRemove = styled.div`
    cursor: pointer;
    transition: all ease-in-out 0.3s;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    border: 1px solid var(--border2);

    &:hover {
        background: var(--bg6);
        color: var(--text3);
    }
`

const WrapAddAndRemove = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    padding: 0px 15px;
    margin-bottom: 20px;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    >div {
        border-radius: 4px;
        font-size: 1em;
        height: 40px;
    }
    @media(max-width: 576px) {
        margin-bottom: 10px;
    >div {
        height: 30px;
    }
    }
`
const Value = styled.div``

const WrapText = styled.div`
    gap: 5px;
    display: flex;
    align-items: center;
`
const WrapContent = styled.div`
    margin: 20px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 15px;


    @media(max-width: 576px) {
        margin: 10px 0;
    }
`
const ColMyPools = styled.div`
    background: var(--bg1);
    border: 1px solid #888888;
    backdrop-filter: blur(15px);
    border-radius: 12px;
    width: 100%;
    color: #000;

    @media screen and (max-width: 840px) {
        max-width: 100%;
    }
    @media screen and (max-width: 390px) {
        font-size: 12px;
    }
`
const RowMyPools = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    @media screen and (max-width: 770px) {
        grid-template-columns: minmax(100px, 1fr);
    }
`
const WrapMyPools = styled.div`
    margin-top: 10px;
`

export default Positions
