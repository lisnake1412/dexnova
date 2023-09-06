import styled from 'styled-components'
import { Field, Token } from 'interfaces'
import Input from 'components/Input'
import TokenListModal from 'components/TokenListModal'
import { Columns } from 'components/Layouts'
import { useCurrencyBalance } from 'hooks/useCurrencyBalance'
import { useActiveWeb3React } from 'hooks'

interface CurrencyInputPanelProps {
    token: Token | undefined
    value: string | undefined
    field: Field
    onUserSelect: (field: Field, token: Token) => void
    onUserInput: (field: Field, value: string) => void
    hideMaxButton?: boolean
    disabledSelect?: boolean
}

const CurrencyInputPanel = ({
    token,
    value,
    field,
    onUserInput,
    onUserSelect,
    hideMaxButton,
    disabledSelect
}: CurrencyInputPanelProps) => {
    const { account, chainId } = useActiveWeb3React()
    const balance = useCurrencyBalance(account, token)

    const handleOnMax = () => {
        if (balance) onUserInput(field, balance)
    }

    return (
        <Wrapper>
            <Row>
               
                {chainId && (
                    <TokenListModal
                        onUserSelect={onUserSelect}
                        field={field}
                        token={token}
                        disabledSelect={disabledSelect}
                    />
                )}
                <div className="wp-left">
                <Input value={value} field={field} onUserInput={onUserInput} />
               
                </div>
                
            </Row>
        </Wrapper>
    )
}

const Wrapper = styled(Columns)`
    background: var(--bg2);
    padding: 20px 15px;
    gap: 10px;
    border-radius: 8px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`

const Row = styled.div`
    display: grid;
    grid-template-columns: 1.5fr 2fr;
    grid-gap: 12px;
    justify-content: center;
    align-items: center;
    .sc-fvtFIe {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .wp-left{
        .dYHHkK {
            width: 100%;
            font-size: 30px;
            font-weight: 500;
            background: none;
            border: none;
            outline: none;
            text-align: right;
            color: #606261;
            margin-bottom: 5px;
            margin-top: 5px;
            height: 40px;
            text-align: right;
        }
    }


    .t2 {
        font-size: 14px;
    }
    .balance {
        display: flex;
        align-items: center;
        gap: 5px;
        justify-content: flex-end;
    }

    .to {
        padding: 0 2px;
    }
    .max-btn {
        background-image: linear-gradient(#0dccea, #0d70ea);
        border: 0;
        border-radius: 4px;
        box-shadow: rgba(0, 0, 0, 0.3) 0 5px 15px;
        box-sizing: border-box;
        color: #fff;
        cursor: pointer;
        font-family: Montserrat, sans-serif;
        font-size: 10px;
        padding: 4px 10px;
        text-align: center;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        :hover {
            opacity: 0.7;
        }
    }
`

export default CurrencyInputPanel
