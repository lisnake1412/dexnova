import { createReducer } from '@reduxjs/toolkit'
import { Token } from 'interfaces'
import {
    updateBlockNumber,
    toggleAgreement,
    updateSlippageTolerance,
    updateTransactionDeadline,
    updateApplicationState,
    toggleDarkMode,
} from './actions'

export interface ApplicationState {
    blockNumber: { [chainId: number]: number }
    setting: {
        slippagePercent: number
    }
    isAgreePolicy: boolean
    slippage: string
    deadline: number
    isUpdateApplication: boolean
    userDarkMode: boolean
}

const initialState: ApplicationState = {
    blockNumber: {},
    setting: {
        slippagePercent: 5,
    },
    isAgreePolicy: false,
    slippage: '0.3', //%
    deadline: 1200, //default 20m,
    isUpdateApplication: false,
    userDarkMode: false,
}

export default createReducer(initialState, (builder) => {
    builder
        .addCase(updateBlockNumber, (state, action) => {
            const { chainId, blockNumber } = action.payload
            state.blockNumber[chainId] = blockNumber
        })
        .addCase(toggleAgreement, (state, action) => {
            state.isAgreePolicy = action.payload
        })
        .addCase(updateSlippageTolerance, (state, action) => {
            state.slippage = action.payload
        })
        .addCase(updateTransactionDeadline, (state, action) => {
            state.deadline = action.payload
        })
        .addCase(updateApplicationState, (state, action) => {
            state.isUpdateApplication = action.payload
        })
        .addCase(toggleDarkMode, (state, action) => {
            state.userDarkMode = action.payload
        })
})
