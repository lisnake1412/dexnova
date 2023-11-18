import React from 'react'
import styled from 'styled-components'

interface PrimaryButtonProps {
    img?: string
    height?: string
    width?: string
    name: string
    onClick?: any
    disabled?: boolean
    type?: string
    color?: string
    isLoading?: boolean
    size?: string
}

const PrimaryButton = ({
    img,
    height,
    width,
    name,
    onClick,
    disabled,
    type,
    color,
    isLoading,
    size,
    ...allprops
}: PrimaryButtonProps) => {
    return (
        <Button
            height={height}
            width={width}
            onClick={() => onClick()}
            disabled={disabled}
            className={type}
            color={color}
            isLoading={isLoading}
            size={size}
            {...allprops}
        >
            {img && <img src={img} alt="button image" />} <span>{name}</span>
        </Button>
    )
}

export default PrimaryButton

export const Button = styled.button<{
    height?: any
    width?: any
    color?: any
    disabled?: boolean
    isLoading?: boolean
    size?: string
}>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${({width}) => width ? width : '100%'};
    height: 46px;
    border-radius: 4px;
    border: none;
    outline: none;
    background: ${({color}) => color ? color : 'var(--btn1)'};
    font-size: 1rem;

    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    letter-spacing: 0.3;
    cursor: ${({ disabled }) =>
        disabled ? 'not-allowed !important' : 'pointer'};
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
    color: var(--text3);
    span {
        font-weight: 400;
    }

    :hover {
        box-shadow: 3px 3px 4px 0px rgba(0, 0, 0, 0.6) inset;
    }

    @media(max-width: 576px) {
        font-size: 12px;
        height: 30px;
    }

    ${({ isLoading }) =>
        isLoading &&
        `
        :after {
            content: '.';
            animation: loading linear 3s infinite;
            @keyframes loading {
                0% {
                    content: '.';
                }
                50% {
                    content: '..';
                }
                100% {
                    content: '...';
                }
            }
        }
    `}
`
