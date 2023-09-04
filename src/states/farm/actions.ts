import { createAction } from '@reduxjs/toolkit'

export const updateFarming = createAction<{
    stakedOnly: boolean,
    isListColumnView: boolean
}>('farm/updateFarming')