import React, {
    ReactElement,
    JSXElementConstructor,
} from 'react'
import MuiModal from '@mui/material/Modal'
import styled from 'styled-components'

interface ModalProps {
    children: (
        onClose: () => void,
    ) => ReactElement<any, string | JSXElementConstructor<any>>
    isOpen: boolean,
    setIsOpen: (bool: boolean) => void
    width?: string
}

const SingleModal = (props: ModalProps) => {

    return (
        <>
            <ModalWrapper>
                <MuiModal
                    open={props.isOpen}
                    onClose={() => props.setIsOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <MiddleBox width={props.width}>{props.children(() => props.setIsOpen(false))}</MiddleBox>
                </MuiModal>
            </ModalWrapper>
        </>
    )
}

const ModalWrapper = styled.div``

const WrapBox = styled.div`
    position: fixed;
    right: 0;
    top: 90.49px;
    height: 100vh;
    width: 450px;
    background: white;
    background-size: 450px;
    background-repeat: no-repeat;
    padding: 20px;
    border-top: 1px solid #003b5c;
    border-left: 1px solid #003b5c;

    @media screen and (max-width: 1100px) {
        animation: fadeUp 0.3s linear;
        height: 600px;
        bottom: 0;
        top: unset;
    }

    @media screen and (max-width: 476px) {
        width: 90%;
        height: auto;
        top: 90px;
    }

    @keyframes fadeIn {
        from {
            transform: translateX(100%);
            opacity: 1;
        }
        to {
            transform: translateX(0px);
            opacity: 1;
        }
    }

    @keyframes fadeUp {
        from {
            transform: translateY(100%);
            opacity: 1;
        }
        to {
            transform: translateY(0px);
            opacity: 1;
        }
    }
`

const Box = styled.div`
    background: var(--bg2);
    backdrop-filter: blur(4px);
    max-width: 450px;
    height: fit-content;
    border: 12px solid #99999978;

    border-radius: 8px;
    padding: 10px;

    @media (max-width: 576px) {
        /* width: 90%; */
    }
`

const MiddleBox = styled.div<{width?: string}>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: var(--bg2);
    backdrop-filter: blur(4px);
    max-width: ${({width}) => width ? width : "400px"};
    height: fit-content;
    border: 1px solid var(--border2);
    border-radius: 20px;
    color: #000;
    &:focus-visible {
        outline: none;
    }

    @media (max-width: 476px) {
        width: 90%;
    }
`

export default SingleModal
