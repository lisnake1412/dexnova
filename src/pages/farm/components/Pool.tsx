import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Columns, Row } from 'components/Layouts'
import { useToken, useTokenApproval } from 'hooks/useToken'
import { Field, IFarmingPool } from 'interfaces'
import Chevron from 'assets/icons/arrows.png'
import { FARMING_ADDRESSES } from 'constants/addresses'
import { useTokenBalance } from 'hooks/useCurrencyBalance'
import { useActiveWeb3React } from 'hooks'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import ComponentsTransaction, { InitCompTransaction } from 'components/TransactionModal'
import { div, divNumberWithDecimal, mulNumberWithDecimal } from 'utils/math'
import { useTransactionHandler } from 'states/transactions/hooks'
import LpLogo from 'components/LogoToken/LpLogo'
import { useContract, useFarmingContract, useTokenContract } from 'hooks/useContract'
import Blur from 'components/Blur'
import { usePoolApr } from 'hooks/useFarming'
import { ZKS_TOKEN } from 'constants/index'
import { getPendingReward } from 'utils/farm'
import { useSingleCallResult } from 'states/multicall/hooks'
import LogoToken from 'components/LogoToken'
import ArrowLink from 'assets/icons/arrow-link.svg'
import CoreIcon from 'assets/icons/core.svg'
import { getEtherscanLink } from 'utils'
import { usePairByAddresses } from 'hooks/useAllPairs'
import { useMintActionHandlers } from 'states/mint/hooks'
import { Link } from 'react-router-dom'
import Icon from "assets/icons/calculator.png"
import { ChevronDown, ChevronUp } from 'react-feather'

const Pool = ({ pool, isOpenDetail, setIsOpenDetail, onStake, onUnstake, isPair, searchQuery, isColumnView, setCalculator, isColumnViewDetails, setIsColumnViewDetails } : {
    pool: IFarmingPool, 
    isOpenDetail: boolean, 
    setIsOpenDetail: (b: number) => void,
    setIsColumnViewDetails: (b: number) => void,
    onStake: (pool: IFarmingPool) => void,
    onUnstake: (pool: IFarmingPool) => void,
    setCalculator: (a: any) => void,
    index: number,
    isPair?: boolean,
    searchQuery?: string,
    isColumnView?: boolean,
}) => {
    const lpToken = useToken(pool.lpToken)
    const lpTokenContract = useTokenContract(pool.lpToken)
    const { account, chainId } = useActiveWeb3React()
    const balance = useTokenBalance(account, lpToken) 
    const initDataTransaction = InitCompTransaction()
    const { addTxn } = useTransactionHandler()
    const [loading, setLoading] = useState(false)
    const contract = useFarmingContract()
    const { apr } = usePoolApr(
        pool.lpToken, 
        ZKS_TOKEN[chainId]?.address, 
        Number(divNumberWithDecimal(pool.totalStaked.toString(), 18)), 
        Number(pool.tokenPerBlock),
        pool.isStakePool
    )
    // console.log(apr);
    const totalSupplyLp = useSingleCallResult(
        lpTokenContract,
        'totalSupply',
        []
    )

    const pendingReward = useMemo(() => {
        if(!pool.tokenPerBlock || !totalSupplyLp?.result?.[0] || !pool.multiplier) return
        const multiplier = pool.multiplier.toString()
        const tokenPerBlock = pool.tokenPerBlock.toString()
        const amount = divNumberWithDecimal(pool.amount.toString(), 18)
        const accTokenPerShare = divNumberWithDecimal(pool.accCakePerShare.toString(), 18)
        const rewardDebt = divNumberWithDecimal(pool.rewardDebt.toString(), 18)
        const totalSupply = divNumberWithDecimal(totalSupplyLp.result[0], 18)

        return getPendingReward(multiplier, tokenPerBlock, amount, accTokenPerShare, rewardDebt, totalSupply)
    }, [pool, totalSupplyLp])
    
    const onHarvest = async () => {
        try {
            if(!contract) return
            initDataTransaction.setIsOpenWaitingModal(true)
            const callResult = pool.isStakePool
            ? await contract.enterStaking(0)
            : await contract.deposit(pool.pid, 0)
            initDataTransaction.setIsOpenWaitingModal(false)
            initDataTransaction.setIsOpenResultModal(true)

            const txn = await callResult.wait()
            initDataTransaction.setIsOpenResultModal(false)

            addTxn({
                hash: callResult.hash,
                status: txn.status === 1 ? true : false,
                msg: `Harvest all available reward succeed`,
            })
        } catch (error) {
            console.log('failed to add', error)
        }
    }

    const Button = () => {
        const lpApproval = useTokenApproval(account, FARMING_ADDRESSES[chainId], lpToken)
        const isInsufficientAllowance = Number(lpApproval.allowance) < Number(balance)

        const handleOnApprove = async () => {
            try {
                if(!lpToken || !balance) return
                initDataTransaction.setError('')
                setLoading(true)
                initDataTransaction.setIsOpenWaitingModal(true)
                const callResult: any = await lpApproval?.approve(
                    FARMING_ADDRESSES[chainId],
                    mulNumberWithDecimal(balance, lpToken.decimals),
                )
                initDataTransaction.setIsOpenWaitingModal(false)
                initDataTransaction.setIsOpenResultModal(true)

                const txn = await callResult.wait()
                initDataTransaction.setIsOpenResultModal(false)
                setLoading(false)
                addTxn({
                    hash: callResult.hash,
                    status: txn.status === 1 ? true : false,
                    msg: `Approve ${lpToken.symbol}`,
                })
            } catch (err) {
                setLoading(false)
                initDataTransaction.setError('Failed')
                initDataTransaction.setIsOpenWaitingModal(false)
                initDataTransaction.setIsOpenResultModal(true)
            }
        }

        return (
            <ButtonGroup gap="10px">
                {
                    isInsufficientAllowance ?
                    <PrimaryButton name={`Enable`} onClick={handleOnApprove} isLoading={loading} />
                    :
                    <PrimaryButton name="Stake" onClick={() => onStake(pool)} />
                }
                {
                    Number(pool.amount) > 0 && <PrimaryButton name="Unstake" onClick={() => onUnstake(pool)} />
                }
            </ButtonGroup>  
        )
    }

    const HarvestButton = () => {
        return (
            <>
                <PrimaryButton name="Havest" onClick={onHarvest} disabled={!pendingReward} />
            </>
        )
    }
    let pairAddress = isPair ? pool.lpToken : undefined
    const pair = usePairByAddresses([pairAddress])?.[pairAddress || '']
    const { onTokenSelection } = useMintActionHandlers()
    const pairName = isPair ? `${pair?.token0.symbol || '-'}-${pair?.token1.symbol || '-'}` : lpToken?.symbol
    const isHidden = searchQuery ? !pairName?.includes(searchQuery) : false
    // console.log(pool.lpToken);
    return(
        <PoolWrapper isHidden={isHidden} isColumnView={isColumnView}>
            <ComponentsTransaction
                data={initDataTransaction}
                onConfirm={() => {}}
            />
            {(initDataTransaction.isOpenConfirmModal ||
                initDataTransaction.isOpenResultModal ||
                initDataTransaction.isOpenWaitingModal) && <Blur />}
            <PoolHeader onClick={() => {
                if(isColumnView) return
                if(isOpenDetail) {
                    setIsOpenDetail(-1)
                } else {
                    setIsOpenDetail(pool.pid)
                }
            }}
                isColumnView={isColumnView}
            >
                <Row al="center" gap="5px">
                    {
                        pool.isStakePool ? 
                        <LogoToken token={ZKS_TOKEN[chainId]} size={'25px'} /> :
                        <LpLogo address={pool.lpToken} />
                    }
                    {
                        !isColumnView && (
                            <div className="pool-name">
                                {pairName}
                            </div>
                        )
                    }
                </Row>
                {
                    isColumnView && (
                        <Columns al="flex-end" gap="5px">
                            <div className="pool-name">
                                {pairName}
                            </div>
                            <Row gap="5px">
                                <Core>
                                    <img src={CoreIcon} alt="core icon" />
                                    <span>Core</span>
                                </Core>
                                <Multiplier>
                                    {pool.multiplier?.toString() || '0'}X
                                </Multiplier>
                            </Row>
                        </Columns>
                    )
                }
                {
                    !isColumnView && (
                        <>
                         <Columns al="flex-end">
                                <Row gap="5px">
                                    <Core>
                                        <img src={CoreIcon} alt="core icon" />
                                        <span>Core</span>
                                    </Core>
                                    
                                </Row>
                            </Columns>
                            <Columns al="flex-end">
                                <div className='title_lable'>
                                    Earned
                                </div>
                                <div  className='info-f'>
                                    {pendingReward} ACR
                                </div>
                            </Columns>
                           


                            <Columns al="flex-end">
                                <div className='title_lable'>
                                Liquidity
                                </div>
                                <div  className='info-f'>
                                {Number(divNumberWithDecimal(pool.totalStaked.toString(), 18)).toFixed(4)} {pool.isStakePool ? 'ACR' : 'ACR-LP'}
                                </div>
                            </Columns>
                            <Columns al="flex-end">
                                <div className='title_lable'>
                                Multiplier
                                </div>
                                <div  className='info-f'>
                                {pool.multiplier?.toString()}x
                                </div>
                            </Columns>
   

                            <Columns al="flex-end">
                               
                                <div className='title_lable CalcIcon'>
                                    <span>APR</span>
                                    
                                    <CalcIcon onClick={() => setCalculator({pool, pairName})}>
                                        <img src={Icon} alt="calculator icon" />
                                    </CalcIcon>  
                                </div>
                                <Row  className='info-f'>
                                    <span className="to" style={{maxWidth: 90, display: "block"}}>
                                        {(apr*10000).toFixed(0)}
                                    </span>
                                    <span>%</span>
                                    
                                </Row>
                            </Columns>
                            <Columns al="flex-end">
                                <img className={`chevron ${isOpenDetail && 'isOpenDetail'}`} src={Chevron} alt="chevron" />
                            </Columns>
                        </>
                    )
                }
            </PoolHeader>
            {
            (isOpenDetail || isColumnView) && 
                (
                    <PoolBody gap="20px">
                        {
                            isColumnView && (
                                <>
                                    <Row jus="space-between">
                                        
                                        <div className='title_lable CalcIcon '> 
                                        <span>APR</span>
                                        <CalcIcon onClick={() => setCalculator({pool, pairName})}>
                                            <img src={Icon} alt="calculator icon" />
                                        </CalcIcon> 
                                        
                                        </div>
                                        <div className='info-f'>{(apr*1000).toFixed(0) || 0}%
                                        
                                        </div>
                                    </Row>
                                    <Row jus="space-between">
                                        <div className='title_lable' >Earn</div>
                                        <div className='info-f'>{ZKS_TOKEN[chainId || 59144].symbol} + Fees</div>
                                    </Row>    
                                </>
                            )
                        }
                        <WrapperActions isColumnView={isColumnView} className="havest-section">
                            <WrapperAction isColumnView={isColumnView}>
                                <Row gap="8px" className='title-gdLdzk' >
                                    <span style={{fontSize: 12}}>{ZKS_TOKEN[chainId || 59144].symbol}</span>
                                    <span style={{fontSize: 12}}>EARNED</span>
                                </Row>
                                <Row jus="center" al="center">
                                    <span className='earn to'>{pendingReward}</span>
                                    <HarvestButton />
                                </Row>
                            </WrapperAction>
                            <WrapperAction isColumnView={isColumnView}>
                                <span style={{fontSize: 12}} className='title-gdLdzk'>{
                                    pool.amount ? 
                                        <>
                                            <span style={{fontSize: 12}} className='title-gdLdzk'>{pairName}</span>
                                            <span className='title-gdLdzk'> STAKED</span>
                                        </>
                                    : 'START FARMING'
                                }</span>
                                <Row className='stake'>
                                    <span className='earn to'>
                                        {Number(divNumberWithDecimal(pool.amount.toString(), 18)).toFixed(4)}
                                    </span>
                                    <Button />                
                                </Row>
                            </WrapperAction>
                        </WrapperActions>
                        {
                            isColumnView && (
                                <Details onClick={() => {
                                    if(isColumnViewDetails) {
                                        setIsColumnViewDetails(-1)
                                    } else {
                                        setIsColumnViewDetails(pool.pid)
                                    }
                                }}>
                                    <span>
                                        {isColumnViewDetails ? 'Hide' : 'Details'}
                                    </span>
                                    {isColumnViewDetails ? <ChevronUp width={20} /> : <ChevronDown width={20} />}
                                </Details>
                            )
                        }
                        {
                            (!isColumnView || isColumnViewDetails) && (
                                <>
                                    {
                                        isPair && pair && (
                                            <Link 
                                                className="link" 
                                                to={`/add/${pair.token0.address}/${pair.token1.address}`}
                                                onClick={() => {
                                                    onTokenSelection(Field.INPUT, pair.token0)
                                                    onTokenSelection(Field.OUTPUT, pair.token1)
                                                }}
                                            >
                                                <span>
                                                    Get {pair?.token0.symbol || '-'}-{pair?.token1.symbol || '-'}
                                                </span>
                                                <img src={ArrowLink} alt="link icon" />
                                            </Link>
                                        )
                                    }
                                    {
                                        lpToken && (
                                            <a className="link" href={getEtherscanLink(chainId || 59144, lpToken.address, 'address')} target="_blank">
                                                <span>View Contract</span>
                                                <img src={ArrowLink} alt="link icon" />
                                            </a>
                                        )
                                    }
                                </>
                            )
                        }
                        
                    </PoolBody>
                )
            }
        </PoolWrapper>
    )
}

const Details = styled(Row)`
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--border1);
    padding: 20px 20px 0 20px;
    color: #4862ab;
`

const CalcIcon = styled.div`
    max-width: 18px;
    transition: all ease-in-out 0.01s;
    display:flex;

    img {
        width: 100%;
    }

    :hover {
        transform: scale(1.2);
        cursor: pointer;
    }
`

const Core = styled(Row)`
    border: 2px solid #289cd1;
    padding: 4px 10px;
    width: fit-content;
    border-radius: 16px;
    color: var(--text2);
    align-items: center;
    gap: 5px;
    font-size: 14px;

    img {
        width: 16px;
    }
`

const Multiplier = styled(Row)`
    padding: 4px 10px;
    border-radius: 16px;
    width: fit-content;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    background-image: linear-gradient(#0dccea,#0d70ea);
    color: #fff;

`

const WrapperActions = styled(Row)<{isColumnView?: boolean}>`
    gap: 20px;
    font-weight: 900;
    margin-bottom:15px;
    .title-gdLdzk{
        color: #9d9d9d;
    }
   
    .wp-link{
        a{
            margin-right:8px;
        }
    }

    @media(max-width: 700px) {
        flex-direction: column;

        gap: 10px;
    }

    ${({isColumnView}) => isColumnView && (
        `
            flex-direction: column;
            gap: 0;
            >div{
                width: 100%;
                border-radius: 10px;
                background: transparent;
                box-shadow:inherit;
                border: none;
            }
            
        `
    )}
`

const WrapperAction = styled(Columns)<{isColumnView?: boolean}>`
    width: 100%;
    height: 130px;
    background: #1e1d20;
    border-radius: 10px;
    padding: 25px 15px;
    background: #fff;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

    .earn {
        max-width: 360px;
        width: 100%;
        font-size: 22px;
        
    }

    .title {
        font-size: 12;
    }

    ${({isColumnView}) => isColumnView && (
        `
            border: none;
            height: unset;
            padding: 10px 0;
        `
    )}
`

const ButtonGroup = styled(Row)`
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
`

const PoolBody = styled(Columns)`
    height: auto;
    overflow: hidden;
    padding: 20px;
    border: none;
    background: #fff;
    display: grid;
    gap:0;

    .link {
        font-size: 16px;
        font-weight: 600;
        color: #4862ab;
        margin-right: 10px;
        img {
            width: 12px;
            margin-left: 10px;
        }
    }
`

const PoolHeader = styled.div<{isColumnView?: boolean}>`
    display: grid;
    align-items: center;
    grid-template-columns: 200px 150px 150px 200px 200px 200px auto;
    width: 100%;
    padding: 20px;
    .sc-iGgWBj.gNtvMT{
        align-items: flex-start;
    }

    .pool-img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        img {
            width: 100%;
        }
    }
    .pool-name {
        font-weight: 700;
        font-size: 18px;
    }
    .chevron {
        width: 26px;
        transform: rotate(-90deg);
        transition: 0.5s;
        &.isOpenDetail {
            transform: rotate(0deg);
            transition: 0.5s;
        }
    }


    @media(max-width: 576px) {
        font-size: 12px;
        grid-template-columns: auto auto;
        padding: 10px;
    

        .pool-name {
            font-size: 12px;
        }

        .chevron {
            width: 10px;
        }
        .dshdHH{
            align-items: flex-start;
            &:last-child{
                margin-top:15px;
               img{
                width:24px
               }
            }
        }
    }

    ${({isColumnView}) => isColumnView && (
        `
            display: flex;
            justify-content: space-between;
        `
    )}
`

const PoolWrapper = styled.div<{
    isHidden: boolean,
    isColumnView?: boolean,
}>`
    display: ${({isHidden}) => isHidden ? 'none' : 'block'};
    width: 100%;
    border-top: none;
    overflow: hidden;
    border:none;
    background: #F2F4F3;
    margin-bottom: 10px;
    border-radius: 12px;
    @media(max-width: 576px) {
        font-size: 14px;
    }

    ${({isColumnView}) => isColumnView && 
        `
            border-radius: 20px;
            max-width: 340px;
            width: 100%;
        `
    }
`

export default React.memo(Pool)