import { Field, IFarmingPool } from "interfaces"
import styled from "styled-components"
import { Columns, Row } from "components/Layouts"
import CloseIcon from "assets/icons/closes.png"
import { useEffect, useMemo, useState } from "react"
import Input from "components/Input"
import SingleModal from "components/Modal/SingleModal"
import SwapIcon from "assets/icons/swap-icon-white.svg"
import ArrowDownIcon from "assets/icons/arrow-down.svg"
import { ZKS_TOKEN } from "constants/index"
import { useActiveWeb3React } from "hooks"
import { useTokenBalance } from "hooks/useCurrencyBalance"
import { useToken } from "hooks/useToken"
import { usePoolApr } from "hooks/useFarming"
import { div, divNumberWithDecimal, mul, sub } from "utils/math"

const one_day = 1
const one_year = 1 * 365
const days = [
    {
        name: "1D",
        time: one_day
    },
    {
        name: "7D",
        time: 7 * one_day
    },
    {
        name: "30D",
        time: 30 * one_day
    },
    {
        name: "1Y",
        time: one_year
    },
    {
        name: "5Y",
        time: 5 * one_year
    },
]

const compoundDays = [
    {
        name: "1D",
        time: one_day
    },
    {
        name: "7D",
        time: 7 * one_day
    },
    {
        name: "14D",
        time: 14 * one_day
    },
    {
        name: "30D",
        time: 30 * one_day
    }
]

const Calculator = ({pool, pairName, isOpen, setIsOpen} : {
    pool?: IFarmingPool, 
    pairName: string | undefined,
    isOpen: boolean,
    setIsOpen: (bool: boolean) => void
}) => {
    const { chainId, account } = useActiveWeb3React()
    const lpToken = useToken(pool?.lpToken)
    const balance = useTokenBalance(account, lpToken)
    const { lpTokenPrice, rwTokenPrice, apr } = usePoolApr(
        pool?.lpToken, 
        ZKS_TOKEN[chainId]?.address, 
        Number(divNumberWithDecimal(pool?.totalStaked?.toString() || '1', 18)), 
        Number(pool?.tokenPerBlock),
        pool?.isStakePool
    )
    const aprPerDay = useMemo(() => {
        if(apr > 12123141)
            return div(div(apr, 12123141), 100) //APR per year / 365 days / 100%
        return div(div(apr, 365), 100) //APR per year / 365 days / 100%
    }, [apr])

    const ModalContent = (onClose: () => void) => {
        const [value, setValue] = useState<string>("")
        const [roiValue, setRoiValue] = useState<string>("")
        const [rwToken, setRwToken] = useState<string>("0")
        const [stakeFor, setStakeFor] = useState<typeof days[0]>(days[0])
        const [compound, setCompound] = useState<typeof compoundDays[0]>(compoundDays[0])
        const [isCompound, setIsCompound] = useState<boolean>(true)
        const [isUsdInput, setIsUsdInput] = useState<boolean>(true)

        const labelValue = useMemo(() => {
            if(value) {
                if(isUsdInput) {
                    const val = div(value, lpTokenPrice)
                    return val
                } else {
                    const val = mul(value, lpTokenPrice)
                    return val
                }
            } else {
                return "0"
            }
        }, [value, isUsdInput, lpTokenPrice])

        useEffect(() => {
            if(!aprPerDay || !value || !stakeFor) return
            let newValue = ''
            if(isCompound) {
                const numberOfCompound = stakeFor.time / compound.time
                const aprPerCompound = mul(compound.time, aprPerDay)
                const totalValueAndROI = mul(value, (1 + Number(aprPerCompound)) ** numberOfCompound)
                newValue = sub(totalValueAndROI, value)
            } else {
                const totalApr = stakeFor.time * aprPerDay
                newValue = mul(value, totalApr)
            }
            if(!isUsdInput) newValue = mul(newValue, lpTokenPrice)
            setRoiValue(newValue)
            const newRwToken = div(newValue, rwTokenPrice)
            setRwToken(newRwToken)
        }, [aprPerDay, value, compound, isCompound, isUsdInput, stakeFor])

        return(
            <CalcWrapper>
                <CalcHeader>
                    <div>ROI Calculator</div>
                    <div className="close-btn" onClick={onClose}>
                        <img src={CloseIcon} alt="close icon" />
                    </div>                
                </CalcHeader>
                <CalcBody>
                    <InputLp>
                        <div className="title">
                            {pairName} STAKED
                        </div>
                        <Columns gap="5px">
                            <Row className="input-panel" al="center" gap="10px">
                                <Columns className="left" gap="5px">
                                    <Row gap="5px">
                                        <Input value={value} setValue={setValue} fontSize="14px" textAlign="right" />
                                        <div style={{ whiteSpace: 'nowrap'}}>{isUsdInput ? 'USD' : pairName + " LP"}</div>
                                    </Row>
                                    <Row jus="flex-end" className="label to">{labelValue} {isUsdInput ? pairName + " LP" : 'USD'}</Row>
                                </Columns>
                                <Row className="swap-icon" al="center" onClick={() => setIsUsdInput(!isUsdInput)}>
                                    <img src={SwapIcon} alt="swap icon" />
                                </Row>
                            </Row>
                            <Selection>
                                <button onClick={() => setValue("100")}>$100</button>
                                <button onClick={() => setValue("1000")}>$1000</button>
                                <button onClick={() => {
                                    if(balance) {
                                        setValue(balance.toString())
                                    } else {
                                        setValue("0")
                                    }
                                }}>My balance</button>
                            </Selection>
                        </Columns>
                    </InputLp>
                    <Columns>
                        <div className="title">STAKED FOR</div>
                        <SelectionWrapper>
                            {
                                days.map((item) => {
                                    return (
                                        <div onClick={() => setStakeFor(item)} key={item.name} className={`selection-item ${stakeFor.name === item.name && 'active'}`} >
                                            {item.name}
                                        </div>
                                    )
                                })
                            }
                        </SelectionWrapper>
                    </Columns>
                    <Columns>
                        <div className="title">COMPOUNDING EVERY</div>
                        <Row gap="10px" al="center">
                            <CheckBox className={`${isCompound ? 'active' : ''}`} onClick={() => setIsCompound(!isCompound)} />
                            <SelectionWrapper isDisable={!isCompound}>
                                {
                                    compoundDays.map((item) => {
                                        return (
                                            <div onClick={() => isCompound && setCompound(item)} key={item.name} className={`selection-item ${compound.name === item.name && isCompound && 'active'}`} >
                                                {item.name}
                                            </div>
                                        )
                                    })
                                }
                            </SelectionWrapper>
                        </Row>
                    </Columns>
                    <ArrowDown>
                        <img src={ArrowDownIcon} alt="arrow down" />
                    </ArrowDown>
                    <ROI gap="10px">
                        <div className="title">ROI AT CURRENT RATES</div>
                        <Row gap="5px">
                            <span>$</span>
                            <Input value={roiValue} setValue={setRoiValue} fontSize="16px" textAlign="left" disabled={true} />
                        </Row>
                        <div className="label to">~ {rwToken} {ZKS_TOKEN[chainId || 324].symbol}</div>
                    </ROI>
                </CalcBody>
            </CalcWrapper>
        )
    }

    return(
        <SingleModal
            children={ModalContent}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            width="350px"
        />
    )
}

const ROI = styled(Columns)`
    background: var(--bg2);
    border-top: 1px solid #61aad3;
    border-radius: 16px;
    padding: 15px;
`

const ArrowDown = styled(Row)`
    justify-content: center;
    align-item: center;
    padding: 20px;

    img {
        width: 15px;
    }
`

const CheckBox = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 4px;
    cursor: pointer;
    background: #30406b;
    border: 1px solid var(--border1);

    &.active {
        background: #30d0aa;
    }
`

const SelectionWrapper = styled(Row)<{isDisable?: boolean}>`
    background: var(--bg5);
    border: 0.5px solid var(--border1);
    border-radius: 20px;
    width: 100%;

    .selection-item {
        padding: 6px 20px;
        max-width: 100px;
        width: 100%;
        border-radius: 20px;
        font-weight: bold;
        color: var(--text5);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        ${({isDisable}) => isDisable && `
            opacity: 0.7;
            cursor: not-allowed;
        `}
    }

    .selection-item.active {
        background: var(--btn1);
        color: white;
    }
`

const CalcWrapper = styled.div`
    font-size: 14px;

    .title {
        color: var(--text2);
        font-size: 10px;
        font-weight: bold;
        margin-bottom: 5px;
    }
    
`

const CalcHeader = styled(Row)`
    justify-content: space-between;
    padding:20px;
    background: #F2F4F3;
    border-bottom: 1px solid #adccdd;
    border-radius: 20px 20px 0 0;
    font-size: 16px;
    font-weight: 600;
    color: #000;
`

const CalcBody = styled(Columns)`
    padding: 10px;
    gap: 15px;
`

const InputLp = styled(Columns)`    
    .input-panel {
        background: #fff;
        border-radius: 12px;
        padding: 15px;
        border: 1px solid var(--border1);
    }

    .swap-icon {
        max-width: 15px;
        cursor: pointer;
        img {
            width: 100%;
        }
        :hover {
            transform: scale(1.2);
        }
    }

    .left {
        max-width: 400px;
        width: 100%;
    }

    .label {
        font-size: 10px;
    }
`

const Selection = styled(Row)`
    gap: 20px;
    
    button {
        border: none;
        outline: none;
        background: var(--btn3);
        color: #4b67b5;
        font-weight: bold;
        padding: 2px 5px;
        border-radius: 12px;
        cursor: pointer;

        :hover {
            opacity: 0.8;
            transform: scale(1.05);
        }
    }
`



export default Calculator