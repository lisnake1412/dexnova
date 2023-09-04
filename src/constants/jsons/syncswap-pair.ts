import { Interface } from '@ethersproject/abi'
import SYNCSWAP_PAIR_ABI from './syncswap-pair.json'

const PAIR_INTERFACE = new Interface(SYNCSWAP_PAIR_ABI)

export default PAIR_INTERFACE
export { SYNCSWAP_PAIR_ABI }
