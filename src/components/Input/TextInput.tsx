import { ChangeEventHandler } from 'react'
import styled from 'styled-components'

interface TextInputProps {
    value: string | number | undefined
    placeholder: string
    onChange: ChangeEventHandler<HTMLInputElement>
}

const TextInput = ({ value, onChange, placeholder }: TextInputProps) => {
    return (
        <WrapInput>
            <Input
                type="text"
                placeholder={placeholder}
                onChange={onChange}
                value={value}
            />
        </WrapInput>
    )
}

export default TextInput

const WrapInput = styled.div`
    border: 0.3px solid var(--border3);
    position: relative;
    border-radius: 8px;
`
const Input = styled.input`
    width: 100%;
    padding: 0 1rem;
    height: 40px;
    border: none;
    background: none;
    outline: none;

    border-radius: 8px;
    color: var(--text1);
    font-size: 16px;
    font-weight: 200;

    ::placeholder {
        color: var(--border3);
    }
`
