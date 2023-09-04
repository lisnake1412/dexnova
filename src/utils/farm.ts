import { BigNumber } from "ethers"

const BLOCKS_PER_YEAR = 60000

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @param isStakePool true if this is staking pool
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
    stakingTokenPrice: number,
    rewardTokenPrice: number,
    totalStaked: number,
    tokenPerBlock: number,
    isStakePool: boolean | undefined
): number => {
    if(isStakePool) {
        const totalRewardPerYear = rewardTokenPrice * tokenPerBlock * BLOCKS_PER_YEAR
        const apr = totalRewardPerYear / totalStaked
        return apr * 100 
    }
    else {
        const totalRewardPricePerYear = rewardTokenPrice * tokenPerBlock * BLOCKS_PER_YEAR
        const totalStakingTokenInPool = stakingTokenPrice * totalStaked
        const apr = totalRewardPricePerYear / totalStakingTokenInPool * 100
        return apr
    }
}

/**
 * Calculate pending reward
 * @param multiplier amount of current diff block reward
 * @param tokenPerBlock reward token per block 
 * @param amount current user's staked amount
 * @param accTokenPerShare current token per share
 * @param rewardDebt current user's reward debt
 * @param totalLpSupply total lp supply
 */
export const getPendingReward = (
    multiplier: number | string,
    tokenPerBlock: number | string,
    amount: number | string,
    accTokenPerShare: number | string,
    rewardDebt: number | string,
    totalLpSupply: number | string,
): number | string => {
    const reward = Number(multiplier) * Number(tokenPerBlock)
    const newAccCakePerShare = Number(accTokenPerShare) + Number(reward) / Number(totalLpSupply);
    const pendingReward = Number(amount) * Number(newAccCakePerShare) - Number(rewardDebt)
    return pendingReward ? pendingReward.toFixed(4) : 0
}