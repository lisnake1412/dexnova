import { useDispatch, useSelector } from 'react-redux'
import { AppState } from "../index"
import {
    updateFarming
} from './actions'
import { FarmState } from './reducer'

export function useFarmState(): FarmState {
    return useSelector((state: AppState) => state.farm)
}

export const useSetStakedOnly = () => {
    const dispatch = useDispatch()
    const { isListColumnView } = useFarmState()
    return (stakedOnly: boolean) => dispatch(updateFarming({stakedOnly, isListColumnView}))
}

export const useSetIsListColumnView = () => {
    const dispatch = useDispatch()
    const { stakedOnly } = useFarmState()
    return (isListColumnView: boolean) => dispatch(updateFarming({stakedOnly, isListColumnView}))
}
