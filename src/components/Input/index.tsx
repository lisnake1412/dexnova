import React from 'react'
import { Field } from 'interfaces'
import styled from 'styled-components'

interface InputProps {
    value: string | undefined
    onUserInput?: (field: Field, value: string) => void
    field?: Field
    setValue?: (value: string) => void
    fontSize?: string
    textAlign?: string
    disabled?: boolean
}

const Input = ({ value, onUserInput, field, setValue, fontSize, textAlign, disabled }: InputProps) => {
    const validateInputNumber = (e: string) => {
        const value = e
            .replace(/[^0-9.,]/g, '')
            .replace(' ', '')
            .replace(',', '.')
            .replace(/(\..*?)\..*/g, '$1')
        if(field) {
            if(onUserInput)
                onUserInput(field, value)
        } else {
            if(setValue)
                setValue(value)
        }
    }

    return (
        <InputWrapper
            type="text"
            placeholder="0.0"
            onChange={(e) => validateInputNumber(e.target.value)}
            value={value}
            fontSize={fontSize}
            textAlign={textAlign}
            disabled={disabled}
        />
    )
}

const InputWrapper = styled.input<{fontSize?: string, textAlign?: string}>`
    width: 100%;
    font-size: ${({fontSize}) => fontSize ? fontSize : "30px"};
    font-weight: 500;
    background: none;
    border: none;
    outline: none;
    color: var(--text1);
    text-align: ${({textAlign}) => textAlign};


    &::placeholder {
        opacity: 0.7;
    }
`

export default Input
