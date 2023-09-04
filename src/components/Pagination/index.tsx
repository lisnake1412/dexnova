import styled from 'styled-components'
import ArrowLeft from 'assets/icons/pagination-arrow-left.svg'
import ArrowRight from 'assets/icons/pagination-arrow-right.svg'

export interface Paginations {
    page: number
    setPage: any
    setLoadingChangePage: any
    totalPage: number
}

const Pagination = ({
    page,
    setPage,
    setLoadingChangePage,
    totalPage,
}: Paginations) => {
    const handleLoading = () => {}

    const handleOnClick = (currentPage: number, action: 'next' | 'back') => {
        if (action === 'next') {
            if (currentPage > 1) {
                setPage(currentPage - 1)
                handleLoading()
            }
        } else {
            if (currentPage < totalPage) {
                setPage(currentPage + 1)
                handleLoading()
            }
        }
    }

    return (
        <Container>
            <div onClick={() => handleOnClick(page, 'next')}>
                <img src={ArrowLeft} alt="" />
            </div>
            <p>
                Page {page} of {totalPage}
            </p>
            <div onClick={() => handleOnClick(page, 'back')}>
                <img src={ArrowRight} alt="" />
            </div>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    padding-top: 16px;

    div {
        cursor: pointer;
    }
`

export default Pagination
