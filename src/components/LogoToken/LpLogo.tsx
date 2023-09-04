import { usePair, usePairByAddresses } from "hooks/useAllPairs"
import PairTokens from "./PairTokens"

const LpLogo = ({address} : {address: string})  => {
    const pair = usePairByAddresses([address])[address]

    return(
        <PairTokens tokenA={pair?.token0.symbol} tokenB={pair?.token1.symbol} />
    )
}

export default LpLogo