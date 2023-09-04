import React from 'react'
import styled from 'styled-components'

interface Loader {
    size?: string
}

const CustomLoader = ({ size }: Loader) => {
    return (
        <Container size={size}>
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </Container>
    )
}

const Container = styled.div<{ size?: string }>`
    .lds-ring {
        display: inline-block;
        position: relative;
        width: 45px;
        height: 45px;
    }
    .lds-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 45px;
        height: 45px;
        margin: 4px;
        border: 4px solid var(--text1);
        border-radius: 50%;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: var(--text1) transparent transparent transparent;
    }
    .lds-ring div:nth-child(1) {
        animation-delay: -0.45s;
    }
    .lds-ring div:nth-child(2) {
        animation-delay: -0.3s;
    }
    .lds-ring div:nth-child(3) {
        animation-delay: -0.15s;
    }
    @keyframes lds-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`

export default CustomLoader
