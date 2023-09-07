import React, { ChangeEvent, useState, useEffect, useCallback, useRef } from 'react'
import styled from 'styled-components'
import Modal from 'components/Modal'
import { Columns, Row } from 'components/Layouts'
import SearchInput from 'components/Input/SearchInput'
import {
    ALL_SUPPORTED_CHAIN_IDS,
    CommonBaseTokens,
    NATIVE_COIN,
} from 'constants/index'
import { ChainId, Field, Token, TokenList } from 'interfaces'
import CommonBase from './CommonBase'
import { useTokenList, useAddTokenToCurrentList } from 'states/lists/hooks'
import TokenSelection from './TokenSelection'
import SelectTokenButton from 'components/Buttons/SelectButton'
import CloseIcon from 'assets/icons/x.svg'
import { useAllTokenBalances } from 'hooks/useCurrencyBalance'
import { useActiveWeb3React } from 'hooks'
import { useToken } from 'hooks/useToken'
import { isNativeCoin } from 'utils'

interface TokenListModalProps {
    token: Token | undefined
    field: Field
    onUserSelect: (field: Field, token: Token) => void
    onSelectToken?: (
        token: Token,
        balance: string,
        allTokenBalances: {
            [tokenAddress: string]: string | undefined
        },
    ) => void,
    disabledSelect?: boolean
}

const TokenListModal = ({
    token,
    field,
    onUserSelect,
    onSelectToken,
    disabledSelect
}: TokenListModalProps) => {
    const [searchQuery, setSearchQuery] = useState<string | undefined>('')
    const addTokenToCurrentList = useAddTokenToCurrentList()
    const allTokenBalances : { [s in string] : string } = useAllTokenBalances()
    const renderedTokenList = useRef<Token[]>([])
    const tokens = useTokenList()
    const { chainId, account } = useActiveWeb3React()
    const queriedToken = useToken(searchQuery)

    const handleSearchToken = async (
        e: ChangeEvent<HTMLInputElement>,
    ): Promise<void> => {
        const searchQuery = e.target.value
        setSearchQuery(searchQuery)
        const tokenHasAlreadyInList =
            searchQuery && tokens.length > 0
                ? tokens.filter(
                      (token: Token) =>
                          token.name.includes(searchQuery) ||
                          token.address.includes(searchQuery) ||
                          token.symbol.includes(searchQuery),
                  )
                : []
        if (tokenHasAlreadyInList.length > 0) {
            renderedTokenList.current = tokenHasAlreadyInList
            return
        }
        if (searchQuery && tokenHasAlreadyInList.length === 0) {
            renderedTokenList.current = []
            return
        }
        if (!searchQuery) {
            renderedTokenList.current = tokens
            return
        }
    }

    const handleAddToken = (token: Token) => {
        addTokenToCurrentList(token)
        setSearchQuery('')
    }

    const sortTokenList = useCallback(() => {
        if(searchQuery || !allTokenBalances) return
        if(!account) {
            renderedTokenList.current = tokens
            return
        }
        let sortedTokenList: TokenList = []
        for(const token of tokens) {
            if(isNativeCoin(token)) continue
            if(
                Number(allTokenBalances[token.address]) < 1
            ) {
                sortedTokenList.push(token)
            } else {
                sortedTokenList.unshift(token)
            }
        }
        renderedTokenList.current = [ NATIVE_COIN[chainId], ...sortedTokenList]
    }, [tokens, allTokenBalances, account, searchQuery, chainId])

    useEffect(() => {
            sortTokenList()
    }, [tokens, allTokenBalances, account, searchQuery, chainId])

    const ModalButton = (onOpen: () => void) => {
        return (
            <SelectTokenButton
                token={token}
                name={token?.symbol || 'Select a token'}
                onClick={ ()=> !disabledSelect && onOpen() }
            />
        )
    }
    const ModalContent = (onClose: () => void) => {
        return (
            <ModalContentWrapper gap={'16px'}>
                <Row jus="space-between">
                    <div className="title">Select a token</div>
                    <div className="close-btn" onClick={onClose}>
                        <img src={CloseIcon} alt="close icon" />
                    </div>
                </Row>
                <SearchInput
                    value={searchQuery}
                    onChange={handleSearchToken}
                    placeholder="Search name or paste address"
                />
                <Row gap="10px" wrap="wrap">
                    {chainId &&
                        ALL_SUPPORTED_CHAIN_IDS.includes(chainId as ChainId) &&
                        CommonBaseTokens[chainId].map(
                            (token: Token, index: number) => {
                                return (
                                    <CommonBase
                                        key={index + 1}
                                        token={token}
                                        onUserSelect={(e) => {
                                            onUserSelect(field, token)
                                            onClose()
                                            onSelectToken &&
                                                onSelectToken(
                                                    token,
                                                    '0',
                                                    allTokenBalances,
                                                )
                                        }}
                                    />
                                )
                            },
                        )}
                </Row>
                <Hr />
                <WrapList>
                    {renderedTokenList.current.length > 0 ? (
                        renderedTokenList.current.map((token: Token, index: number) => {
                            return (
                                <TokenSelection
                                    key={index + 1}
                                    token={token}
                                    hideAddButton={true}
                                    onUserSelect={() => {
                                        onUserSelect(field, token)
                                        onClose()
                                        onSelectToken &&
                                            onSelectToken(
                                                token,
                                                '0',
                                                allTokenBalances,
                                            )
                                    }}
                                />
                            )
                        })
                    ) : queriedToken ? (
                        <TokenSelection
                            token={queriedToken}
                            onUserSelect={(e) => {
                                onUserSelect(field, queriedToken)
                                onClose()
                                onSelectToken &&
                                    onSelectToken(
                                        queriedToken,
                                        '0',
                                        allTokenBalances,
                                    )
                            }}
                            hideAddButton={false}
                            onAdd={() => handleAddToken({...queriedToken, external: true})}
                        />
                    ) : (
                        <></>
                    )}
                </WrapList>
            </ModalContentWrapper>
        )
    }

    return (
        <Wrapper>
            <Modal
                children={(onClose) => ModalContent(onClose)}
                button={(onOpen) => ModalButton(onOpen)}
            />
        </Wrapper>
    )
}

const Wrapper = styled.div``
const Hr = styled.div`
    width: 100%;
    border-top: 1px solid var(--border1);
`

const ModalContentWrapper = styled(Columns)`
    .title {
        font-size: 18px;
        font-weight: 700;
        color:#000;
    }

    .close-btn {
        cursor: pointer;
        font-size: 18px;
        font-weight: 600;
        font-style: normal;
    }
`

const WrapList = styled.div`
    max-height: 305px;
    height: 100%;
    overflow: hidden auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    ::-webkit-scrollbar {
        border-radius: 20px;
        width: 4px;
        background: #ffffff81;
        display: none;
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 20px;
        width: 8px;
    }
    @media screen and (max-width: 375px) {
        max-height: 225px;
    }
`

export default TokenListModal
