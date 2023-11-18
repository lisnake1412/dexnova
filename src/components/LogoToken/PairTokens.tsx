import React from 'react'
import styled from 'styled-components'
import UNKNOWN from 'assets/icons/question-mark-button-dark.svg'
import tokenList from 'constants/jsons/tokenList.json'
import ETH from 'assets/token-logos/eth.svg'

const PairTokens = ({ tokenA, tokenB }: { tokenA: string | undefined; tokenB: string | undefined }) => {

    const logoA =
        tokenA === 'WETH'
            ? ETH
            : tokenList.find((t) => t.address == tokenA || t.symbol == tokenA)
                  ?.logoURI || UNKNOWN
    const logoB =
        tokenB === 'WETH'
            ? ETH
            : tokenList.find((t) => t.address == tokenB || t.symbol == tokenB)
                  ?.logoURI || UNKNOWN

    return (
        <LabelToken>
            <div className='left'>
                <img src={logoA} alt="token logo" />
            </div>
            <div className="right">
                <img src={logoB} alt="token logo" />
            </div>
        </LabelToken>
    )
}

const LabelToken = styled.div`
    display: flex;

    .right {
        position: relative;
        left: -8px;
        max-width: 25px;
        img {
            width: 100%;
        }
    }

    .left {
        max-width: 25px;
        img {
            width: 100%;
        }
    }

    img {
        border-radius: 50%;
        overflow: hidden;
    }
`

export default PairTokens
