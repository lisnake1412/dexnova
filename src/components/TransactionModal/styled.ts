import styled from 'styled-components'

export const Container = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1.5px solid var(--border2);
    border-radius: 12px;
    padding: 20px 25px;
    background: var(--bg1);
    box-shadow: rgb(0 0 0 / 5%) 0px 4px 8px 0px;
    max-width: 500px;
    width: 100%;
    padding: 20px 30px;
    backdrop-filter: blur(40px);
    z-index: 999;

    @media screen and (max-width: 576px) {
        width: 90%;
    }
`
