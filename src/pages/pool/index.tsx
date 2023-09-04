import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import styled from 'styled-components'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import { useNavigate } from 'react-router-dom'
import Positions from './Components/Positions'
import { useMyPosition } from 'hooks/useAllPairs'

function EnhancedTableToolbar() {
    const navigate = useNavigate()
    return (
        <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
        >
            <HeadTitle>
                <div>
                    <div className="title">Your positions</div>
                    <div className="details">
                        Provide liquidity and earn fees now
                    </div>
                </div>
                <div className="new-position">
                    <PrimaryButton
                        name="+ New Position"
                        onClick={() => {
                            navigate('/add')
                        }}
                    />
                </div>
            </HeadTitle>
        </Typography>
    )
}

export default function Pools() {
    const { position, tokenList } = useMyPosition()

    return (
        <Container>
            <CustomizeBox
                sx={{
                    backgroundColor: 'transparent',
                    paddingTop: '15px',
                }}
            >
                <div className="black-bg">
                    <EnhancedTableToolbar />
                </div>
                <Positions position={position} tokenList={tokenList} />
            </CustomizeBox>
        </Container>
    )
}

const Container = styled.div`
    max-width: 920px;
    width: 90%;
    height: fit-content;
    font-weight: 300;
    margin: 0 auto 50px;

    .black-bg {
        background: var(--bg1);
        background-repeat: no-repeat;
        background-size: cover;
        min-width: 84px;
        border-radius: 16px;
        border: 1px solid var(--border1);
    }

    .black-bg2 {
        background: rgba(255, 255, 255, 0.3) !important;
        min-width: 84px;
    }

    @media screen and (max-width: 772px) {
        width: 90%;
        .black-bg {
            border-radius: 18px 18px 0px 0px;
        }
    }
`

const CustomizeBox = styled(Box)`
    @media screen and (max-width: 576px) {
        padding: 0 !important;
    }
`

const HeadTitle = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px;
    font-family: Inter;

    @media screen and (max-width: 576px) {
        flex-direction: column;
        padding: 10px 20px;
    }

    .title {
        font-weight: 600;
        font-size: 35px;
        @media screen and (max-width: 576px) {
            font-size: 20px;
        }
    }

    .details {
        font-weight: 500;
        font-size: 20px;
        line-height: 24px;
        color: rgba(136, 136, 136, 1);
        @media screen and (max-width: 576px) {
            font-size: 12px;
        }
    }

    .new-position {
        min-width: 160px;
        padding-top: 15px;
    }
`

const HeadLabel = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 35px 20px 21px;
    gap: 25px;

    @media screen and (max-width: 600px) {
        flex-direction: column;
        gap: 10px;
        div:nth-child(2) {
            justify-content: space-between;
        }
    }
`

const RowTable = styled(TableRow)`
    /* background: rgba(0, 0, 0, 0.3) !important; */
    .visible-mobile {
        text-align: center;
    }

    :hover {
        background: rgba(0, 124, 192, 0.3);
    }
`

const HeadLabelLeft = styled.div`
    display: flex;
    gap: 15px;
    align-items: center;

    div:nth-child(2) {
        min-width: 120px;
    }

    .title-pool {
        width: 100px;
    }

    .circle {
        width: auto;
        min-width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: rgba(0, 178, 255, 0.3);
        text-align: center;
        font-style: normal;
        color: rgba(0, 178, 255, 1);
        padding: 5px;
    }
`

const HeadLabelRight = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;

    @media screen and (max-width: 576px) {
        display: block;
        div {
            width: 50%;
        }
        /* flex-direction: column;
        div {
            width: 100%;
        } */
    }
`

const HeadTable = styled(TableCell)`
    font-size: 16px !important;
    padding-left: 15px !important;
    display: flex;
    font-family: Inter !important;

    justify-content: center;
    align-items: center;
    div {
        display: inline;
    }

    img {
        width: 12px;
    }

    @media screen and (max-width: 576px) {
        /* font-size: 14px !important; */
    }
`


const InputSearchModal = styled.div`
    min-width: 150px;
    display: flex;
    justify-content: flex-start;
    gap: 5px;
    align-items: center;
    position: sticky;
    top: 0;
    left: 0;
    background: rgba(217, 217, 217, 0.1);
    z-index: 1;
    padding: 5px 10px;
    border: 0.45px solid rgba(201, 201, 201, 0.6);
    border-radius: 6px;

    input {
        max-width: 100% !important;
        width: 100%;
        background: rgba(0, 0, 0, 0);
        border: none;
        outline: none;
        color: #c9c9c9;

        font-weight: 500;
        font-size: 18px;
        line-height: 100%;
    }

    img {
        width: 14px;
        height: 14px;
        opacity: 0.4;
    }

    @media screen and (max-width: 576px) {
        /* padding: 2px 10px; */

        input {
            font-size: 12px;
        }
    }
`

const BtnSort = styled.div`
    cursor: pointer;

    .isSorted {
        img {
            transform: rotate(180deg);
        }
    }
`
