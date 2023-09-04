import { BigNumber } from "ethers"

export enum Field {
    INPUT = 'INPUT',
    OUTPUT = 'OUTPUT',
}

export interface Token {
    address: string
    symbol: string
    decimals: number
    name: string
    chainId: number
    logoURI: string
    external?: boolean
}

export type TokenList = Token[]

export enum ChainId {
    ZKMAINNET = 324,
    ZKTESTNET = 280,
    GOERLI = 5,
    MUMBAI = 80001,
}

export interface IFarmingPool {
    pid: number,
    lpToken: string,
    allocPoint: number | BigNumber,
    accCakePerShare: number | BigNumber,
    lastRewardBlock: number | BigNumber,
    amount: number | BigNumber,
    rewardDebt: number | BigNumber,
    multiplier: number | BigNumber | undefined,
    tokenPerBlock: number | BigNumber | undefined,
    totalStaked: number,
    isStakePool: boolean
}


