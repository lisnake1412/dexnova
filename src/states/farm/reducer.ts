import { createReducer } from '@reduxjs/toolkit'
import { updateFarming } from './actions'

export interface FarmState {
    stakedOnly: boolean,
    isListColumnView: boolean,
}

const initialState: FarmState = {
    stakedOnly: false,
    isListColumnView: false,
}

export default createReducer(initialState, (builder) => {
    builder
        .addCase(updateFarming, (state, action) => {
            const { stakedOnly, isListColumnView } = action.payload
            state.stakedOnly = stakedOnly
            state.isListColumnView = isListColumnView
        })
        
})
