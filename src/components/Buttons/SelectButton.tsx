import React from 'react';
import styled from 'styled-components';
import { Token } from 'interfaces';
import LogoToken from 'components/LogoToken';

interface SelectTokenButtonProps {
    token: Token | undefined;
    onClick: () => void;
    name?: string;
    disabled?: boolean;
}

const SelectTokenButton = ({ disabled, token, name, onClick }: SelectTokenButtonProps) => {
    return (
        <Button disabled={disabled} onClick={() => onClick()}>
            <div>
                {token ? (
                    <>
                        <LogoToken size={'21px'} token={token} />
                        <span>{token.symbol}</span>
                    </>
                ) : (
                    <span>{name || 'SELECT A TOKEN'}</span>
                )}
            </div>
            {
                <div className="chevron-down" alt="arrow down">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" fill="none">
                        <path
                            d="M7.46353 1.16394L4.04231 4.58516L0.621094 1.16394"
                            stroke="white"
                            stroke-width="1.19537"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div>
            }
        </Button>
    );
};

export default SelectTokenButton;

const Button = styled.button`
    display: flex;
    align-items: center;

    padding: 4px 8px;
    height: 35px;
    gap: 10px;
    /* box-shadow: rgb(0 0 0 / 25%) 0px 4px 4px 0px; */
    box-shadow: unset;
    color: #fff;
    // border: 1.5px solid var(--border1);
    /* border: 1.5px solid rgba(255, 255, 255, 0.6); */
    width: fit-content;
    background: none;
    font-size: 18px;
    font-weight: 600;
    width: 100%;
    font-family: Inter, sans-serif;
    cursor: pointer;
    > div {
        display: flex;
        width: fit-content;
        align-items: center;
        gap: 10px;
    }

    .logo-token {
        width: 16px;
        aspect-ratio: 1/1;
        border-radius: 50%;
    }

    :hover {
        background: var(--);
    }
    .chevron-down {
        filter: brightness(200);
        width: 14px;
        > svg {
            width: 100%;
            
        }
        path {
            width: 18px;
        }
    }
`;
