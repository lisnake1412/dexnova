import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useBlockNumber } from 'states/application/hooks'
import { getEtherscanLink } from 'utils'
import { useActiveWeb3React } from 'hooks'

const PollingWrapper = styled.a`
    position: fixed;
    bottom: 20px;
    right: 20px;
`

const StyledPolling = styled.div`
    justify-content: center;
    display: flex;
    right: 0;
    bottom: 0;
    padding: 1rem;
    padding-bottom: 0;
    color: white;
    transition: opacity 0.25s ease;
    color: green;
    font-size: 12px;
    align-items: center;
    :hover {
        opacity: 1;
    }
`

const StyledPollingDot = styled.div`
    width: 8px;
    height: 8px;
    min-height: 8px;
    min-width: 8px;
    margin-left: 0.5rem;
    margin-top: 3px;
    border-radius: 50%;
    position: relative;
    background-color: green;
`

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div`
    animation: ${rotate360} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite;
    transform: translateZ(0);

    border-top: 1px solid transparent;
    border-right: 1px solid transparent;
    border-bottom: 1px solid transparent;
    border-left: 2px solid ${({ theme }) => theme.green1};
    background: transparent;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    position: relative;

    left: -3px;
    top: -3px;
`

export default function Polling() {
    const { chainId } = useActiveWeb3React()

    const blockNumber = useBlockNumber()

    const [isMounted, setIsMounted] = useState(true)

    useEffect(
        () => {
            const timer1 = setTimeout(() => setIsMounted(true), 1000)

            // this will clear Timeout when component unmount like in willComponentUnmount
            return () => {
                setIsMounted(false)
                clearTimeout(timer1)
            }
        },
        [blockNumber], //useEffect will run only one time
        //if you pass a value to array, like this [data] than clearTimeout will run every time this value changes (useEffect re-run)
    )

    return (
        <PollingWrapper
            href={
                chainId && blockNumber
                    ? getEtherscanLink(chainId, blockNumber.toString(), 'block')
                    : ''
            }
            target="_blank"
        >
            <StyledPolling>
                {blockNumber}
                <StyledPollingDot>{!isMounted && <Spinner />}</StyledPollingDot>
            </StyledPolling>
        </PollingWrapper>
    )
}
