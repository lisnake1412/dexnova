import { Columns, Row } from 'components/Layouts';
import styled from 'styled-components';
import { Fragment, useEffect, useState } from 'react';
import { useActiveWeb3React } from 'hooks';
import { useAllFarmingPools, useIsFarmAdmin } from 'hooks/useFarming';
import { OpacityModal } from 'components/Web3Status';
import WalletModal from 'components/WalletModal';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import Pool from './components/Pool';
import TextInput from 'components/Input/TextInput';
import { useFarmingContract } from 'hooks/useContract';
import { useTransactionHandler } from 'states/transactions/hooks';
import DepositModal from './components/DepositModal';
import { IFarmingPool } from 'interfaces';
import ComponentsTransaction, { InitCompTransaction } from 'components/TransactionModal';
import { mulNumberWithDecimal } from 'utils/math';
import Blur from 'components/Blur';
import { Link, useLocation } from 'react-router-dom';
import WithdrawModal from './components/WithdrawModal';
import { Switch } from '@mui/material';
import ListRowDark from 'assets/icons/list-row-dark.svg';
import ListRowWhite from 'assets/icons/list-row-white.svg';
import ListColumnDark from 'assets/icons/list-column-dark.svg';
import ListColumnWhite from 'assets/icons/list-column-white.svg';
import { useFarmState, useSetIsListColumnView, useSetStakedOnly } from 'states/farm/hooks';
import Calculator from './components/Calculator';
import Header from 'components/HeaderV2';
import Button from 'components/Button';
import { FilterBackground } from 'pages/swap';
import HowItWork from 'components/HowItWork';
import Footer from 'components/FooterV2';
import backgroundImage from 'assets/image/BackgroundImage/galaxy-second-background.jfif';

const FarmPages = {
    FARM: 'FARM',
    ADMIN: 'ADMIN',
};

const CreateNewPool = () => {
    const [state, setState] = useState({
        allocPoint: '',
        lpToken: '',
    });
    const contract = useFarmingContract();
    const [loading, setLoading] = useState(false);
    const { addTxn } = useTransactionHandler();

    const onCreate = async () => {
        try {
            if (!contract || !state.allocPoint || !state.lpToken || Number(state.allocPoint) <= 0) return;
            setLoading(true);
            const callResult = await contract.add(Number(state.allocPoint).toFixed(0), state.lpToken, true);
            const txn = await callResult.wait();
            setLoading(false);
            addTxn({
                hash: txn.hash,
                msg: 'Create pool succeed',
                status: true,
            });
        } catch (err) {
            setLoading(false);
        }
    };

    return (
        <AdminWrapper gap="10px">
            <Row al="center" gap="10px" jus="space-between">
                <div>Allocation Point:</div>
                <TextInput
                    value={state.allocPoint}
                    onChange={(e) => setState({ ...state, allocPoint: e.target.value })}
                    placeholder="0"
                />
            </Row>
            <Row al="center" gap="10px" jus="space-between">
                <div>Lp token:</div>
                <TextInput
                    value={state.lpToken}
                    onChange={(e) => setState({ ...state, lpToken: e.target.value })}
                    placeholder="0x00...000"
                />
            </Row>
            <Row>
                <PrimaryButton
                    onClick={onCreate}
                    name="Create pool"
                    disabled={!state.allocPoint || !state.lpToken || isNaN(Number(state.allocPoint))}
                    isLoading={loading}
                />
            </Row>
        </AdminWrapper>
    );
};

const Farm = () => {
    const { account } = useActiveWeb3React();
    const allPools = useAllFarmingPools();
    const [isOpenWalletModal, setIsOpenWalletModal] = useState(false);
    const isAdmin = useIsFarmAdmin();
    const [page, setPage] = useState(FarmPages.FARM);
    const [poolOpen, setPoolOpen] = useState(-1);
    const [isColumnViewDetails, setIsColumnViewDetails] = useState(-1);
    const [currentPool, setCurrentPool] = useState<IFarmingPool>();
    const [currentUnstakePool, setCurrentUnstakePool] = useState<IFarmingPool>();
    const [currentCalcPool, setCurrentCalcPool] = useState<{ pool: IFarmingPool; pairName: string }>();
    const [value, setValue] = useState('');
    const contract = useFarmingContract();
    const initDataTransaction = InitCompTransaction();
    const { addTxn } = useTransactionHandler();
    const location = useLocation();
    const isFarm = location.pathname === '/farms';
    const [tvl, SetTVL] = useState('');

    const getMoviesFromApi = async () => {
        try {
            let response = await fetch('https://api.llama.fi/protocol/ancora-finance');
            let responseJson = await response.json().then((json) => {
                // 2
                SetTVL(json.currentChainTvls.Linea.toString());
                // console.log(1);
            });
            //   console.log(responseJson);
            //   return responseJson.currentChainTvls.Linea;
        } catch (error) {
            console.error(error);
        }
    };
    getMoviesFromApi();
    //   const a = getMoviesFromApi();
    //   console.log(a);
    // SetTVL( (await getMoviesFromApi()).toString());
    const onDeposit = async () => {
        try {
            if (!contract || !currentPool?.lpToken) return;
            initDataTransaction.setIsOpenWaitingModal(true);
            setCurrentPool(undefined);
            const callResult = currentPool.isStakePool
                ? await contract.enterStaking(mulNumberWithDecimal(value, 18))
                : await contract.deposit(currentPool.pid, mulNumberWithDecimal(value, 18));
            initDataTransaction.setIsOpenWaitingModal(false);
            initDataTransaction.setIsOpenResultModal(true);
            const txn = await callResult.wait();
            initDataTransaction.setIsOpenResultModal(false);
            addTxn({
                hash: callResult.hash,
                status: txn.status === 1 ? true : false,
                msg: `Deposit successfully`,
            });
        } catch (error) {
            setCurrentPool(undefined);
            console.log('failed to add', error);
        }
    };

    const onWithdraw = async () => {
        try {
            if (!contract || !currentUnstakePool) return;
            initDataTransaction.setIsOpenWaitingModal(true);
            setCurrentUnstakePool(undefined);
            const callResult = currentUnstakePool.isStakePool
                ? await contract.leaveStaking(currentUnstakePool.amount)
                : await contract.withdraw(currentUnstakePool.pid, currentUnstakePool.amount);
            initDataTransaction.setIsOpenWaitingModal(false);
            initDataTransaction.setIsOpenResultModal(true);

            const txn = await callResult.wait();
            initDataTransaction.setIsOpenResultModal(false);

            addTxn({
                hash: callResult.hash,
                status: txn.status === 1 ? true : false,
                msg: `Withdraw successfully`,
            });
        } catch (error) {
            console.log('failed to add', error);
        }
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [headerIndex, setHeaderIndex] = useState(5);
    const { stakedOnly, isListColumnView } = useFarmState();
    const setStakedOnly = useSetStakedOnly();
    const setIsListColumnView = useSetIsListColumnView();
    useEffect(() => {
        if (isOpenWalletModal) {
            setHeaderIndex(1);
        } else {
            setHeaderIndex(5);
        }
        if (account) {
            setHeaderIndex(5);
        }
    }, [isOpenWalletModal, account]);

    return (
        <>
            {!isFarm && <BackgroundImage src={backgroundImage} />}
            <FilterBackground />
            <Header styles={{ position: 'relative', zIndex: headerIndex }} />
            <Container>
                <ComponentsTransaction data={initDataTransaction} onConfirm={() => {}} />
                {(initDataTransaction.isOpenConfirmModal ||
                    initDataTransaction.isOpenResultModal ||
                    initDataTransaction.isOpenWaitingModal) && <Blur />}
                <FarmHero>
                    <HeaderInfo al="center" jus="space-between" width="100%" gap="20px">
                        <div>
                            <div className="title">{isFarm ? 'Farms' : 'Liquidity Pools '}</div>
                            <div className="sub-title">{isFarm ? 'Active Farm' : 'Your Liquidity'}</div>
                        </div>
                        <Button type="outline" to="/add">
                            Add liquidity
                        </Button>
                    </HeaderInfo>
                </FarmHero>
                <InfoWrapper jus="space-between" al="center" className="wp-top-farm">
                    <Columns gap="10px" al="center">
                        <span className="label">TVL</span>
                        <span className="num">${tvl}</span>
                    </Columns>
                    <Columns className="mobile-hidden" gap="10px" al="center">
                        <span className="label">Circulating Supply</span>
                        <span className="num">$18,000,000</span>
                    </Columns>
                    <Columns className="mobile-hidden" gap="10px" al="center">
                        <span className="label">Burned to date</span>
                        <span className="num">$1,552,921</span>
                    </Columns>
                </InfoWrapper>
                <div className="wp-farm">
                    <ToolWrapper>
                        <Row al="center" gap="10px">
                            <Row gap="10px" al="center">
                                <Row al="center" className="list list-column" onClick={() => setIsListColumnView(true)}>
                                    {isListColumnView ? (
                                        <img src={ListColumnDark} alt="list view icon" />
                                    ) : (
                                        <img src={ListColumnWhite} alt="list view icon" />
                                    )}
                                </Row>
                                <Row al="center" className="list list-row" onClick={() => setIsListColumnView(false)}>
                                    {isListColumnView ? (
                                        <img src={ListRowWhite} alt="list view icon" />
                                    ) : (
                                        <img src={ListRowDark} alt="list view icon" />
                                    )}
                                </Row>
                            </Row>
                            <Row al="center">
                                <Switch
                                    color="secondary"
                                    onChange={() => setStakedOnly(!stakedOnly)}
                                    value={stakedOnly}
                                    defaultChecked={stakedOnly}
                                />
                                <span>Staked only</span>
                            </Row>
                        </Row>
                        <Columns gap="10px">
                            <input
                                className="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search Farms"
                            />
                        </Columns>
                    </ToolWrapper>
                    {account ? (
                        <>
                            {isAdmin && page === FarmPages.FARM && (
                                <Row className="add-btn" jus="flex-end">
                                    <PrimaryButton
                                        name="Add new pool +"
                                        width="200px"
                                        onClick={() => setPage(FarmPages.ADMIN)}
                                    />
                                </Row>
                            )}
                            {page === FarmPages.ADMIN && (
                                <Row className="add-btn" jus="flex-end">
                                    <PrimaryButton
                                        color="grey"
                                        name="Back <-"
                                        width="100px"
                                        onClick={() => setPage(FarmPages.FARM)}
                                    />
                                </Row>
                            )}
                            {page === FarmPages.FARM ? (
                                <>
                                    {allPools.length > 0 && (
                                        <ListPoolWrapper isColumnView={isListColumnView}>
                                            {allPools.map((pool, index) => {
                                                const farmCond =
                                                    stakedOnly === true
                                                        ? isFarm && index !== 0 && Number(pool.amount) > 0
                                                        : isFarm && index !== 0;

                                                const poolCond =
                                                    stakedOnly === true
                                                        ? !isFarm && index === 0 && Number(pool.amount) > 0
                                                        : !isFarm && index === 0;

                                                return (
                                                    <Fragment key={JSON.stringify(pool) + index}>
                                                        {farmCond && (
                                                            <Pool
                                                                key={JSON.stringify(pool) + index}
                                                                pool={pool}
                                                                isOpenDetail={poolOpen === pool.pid}
                                                                setIsOpenDetail={setPoolOpen}
                                                                isColumnViewDetails={isColumnViewDetails === pool.pid}
                                                                setIsColumnViewDetails={setIsColumnViewDetails}
                                                                onStake={setCurrentPool}
                                                                onUnstake={setCurrentUnstakePool}
                                                                index={index}
                                                                isPair={true}
                                                                searchQuery={searchQuery}
                                                                isColumnView={isListColumnView}
                                                                setCalculator={setCurrentCalcPool}
                                                            />
                                                        )}
                                                        {poolCond && (
                                                            <Pool
                                                                key={JSON.stringify(pool) + index}
                                                                pool={pool}
                                                                isOpenDetail={poolOpen === pool.pid}
                                                                setIsOpenDetail={setPoolOpen}
                                                                isColumnViewDetails={isColumnViewDetails === pool.pid}
                                                                setIsColumnViewDetails={setIsColumnViewDetails}
                                                                onStake={setCurrentPool}
                                                                onUnstake={setCurrentUnstakePool}
                                                                index={index}
                                                                searchQuery={searchQuery}
                                                                isColumnView={isListColumnView}
                                                                setCalculator={setCurrentCalcPool}
                                                            />
                                                        )}
                                                    </Fragment>
                                                );
                                            })}
                                        </ListPoolWrapper>
                                    )}
                                </>
                            ) : (
                                <CreateNewPool />
                            )}
                        </>
                    ) : (
                        <ConnectWrapper className="havest-section">
                            <div>Please connect wallet to see farming pools</div>
                            <PrimaryButton name="Connect wallet" onClick={() => setIsOpenWalletModal(true)} />
                            {!account && isOpenWalletModal && (
                                <>
                                    <WalletModal setToggleWalletModal={setIsOpenWalletModal} />
                                    <OpacityModal onClick={() => setIsOpenWalletModal(false)} />
                                </>
                            )}
                        </ConnectWrapper>
                    )}
                    {currentPool && (
                        <DepositModal
                            isOpen={currentPool !== undefined}
                            setIsOpen={(bool: boolean) => !bool && setCurrentPool(undefined)}
                            onDeposit={onDeposit}
                            lp={currentPool.lpToken}
                            value={value}
                            setValue={setValue}
                        />
                    )}
                    {currentUnstakePool && (
                        <WithdrawModal
                            isOpen={currentUnstakePool !== undefined}
                            setIsOpen={(bool: boolean) => !bool && setCurrentUnstakePool(undefined)}
                            onDeposit={onWithdraw}
                            lp={currentUnstakePool.lpToken}
                            value={value}
                            setValue={setValue}
                            pool={currentUnstakePool}
                        />
                    )}
                    {currentCalcPool && (
                        <Calculator
                            isOpen={currentCalcPool !== undefined}
                            setIsOpen={(bool: boolean) => !bool && setCurrentCalcPool(undefined)}
                            pool={currentCalcPool?.pool}
                            pairName={currentCalcPool?.pairName}
                        />
                    )}
                </div>
                <HowItWork />
            </Container>
            <Footer isTransparentBackground />
        </>
    );
};

const HeaderInfo = styled(Row)`
    @media screen and (max-width: 780px) {
        flex-wrap: wrap;
    }
`

const BackgroundImage = styled.img`
    position: fixed;
    width: 100%;
    height: auto;
    @media screen and (max-width: 900px) {
        width: auto;
        height: 100vh;
    }
`;
const InfoWrapper = styled(Row)`
    background-color: transparent;
    border: var(--borderV2);
    width: 100%;
    border-radius: 12px;
    padding: 10px 40px;
    > div {
        position: relative;
        padding-top: 20px;
        padding-left: 0px;
        padding-bottom: 20px;
        text-align: center;
    }

    .label {
        width: 100%;
        font-size: 16px;
        background-image: var(--btn1);
        border-radius: 10px;
        padding: 3px 10px;
        color: var(--text3);
    }

    .num {
        font-size: 25px;
        font-weight: 900;
        color: var(--text3);
    }

    @media (max-width: 650px) {
        justify-content: center;
        .mobile-hidden {
            display: none;
        }
    }
`;

const ToolWrapper = styled.div`
    display: flex;
    margin: 15px 0;
    align-items: center;
    justify-content: space-between;
    .sc-dcJsrY.XFyXO {
        color: #000;
    }

    .list {
        cursor: pointer;
        transition: all ease-in-out 0.1s;
        :hover {
            transform: scale(1.2);
        }

        :focus {
            transform: scale(1);
        }
    }

    .list-column {
        img {
            height: 20px;
        }
    }
    .list-row {
        img {
            height: 12px;
        }
    }

    .label {
        font-size: 14px;
        color: #000;
    }

    .search {
        border: var(--borderV2);
        border-radius: 5px;
        outline: none;
        padding: 8px;
        font-size: 16px;
        color: var(--text3);
        min-width: 138px;
        margin: 5px 0px;
        height: 40px;
        background: transparent;
        border-radius: 5px;

        ::placeholder {
            color: var(--text6);
        }
    }
    @media (max-width: 576px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const AdminWrapper = styled(Columns)`
    border: 1px solid var(--border3);
    border-radius: 12px;
    padding: 20px;
    width: 100%;
    margin: 0 auto;
`;

const ConnectWrapper = styled(Columns)`
    max-width: 600px;
    width: 100%;
    gap: 20px;
    margin: 0 auto;
    align-items: center;
`;

const ListPoolWrapper = styled(Columns)<{ isColumnView: boolean }>`
    margin: 0 auto;
    color: var(--text3);
    border: none;
    border: none;
    ${({ isColumnView }) =>
        isColumnView &&
        `
            flex-direction: row;
            gap: 20px;
            border-top: none;
            justify-content: space-around;
            flex-wrap: wrap;
        `}
`;

const Container = styled.div`
    position: relative;
    z-index: 1;
    width: 90%;
    height: fit-content;
    font-weight: 300;
    margin: 0 auto 50px;
    max-width: 1200px;
    overflow: hidden;
    .add-btn {
        margin-bottom: 20px;
    }

    @media screen and (max-width: 772px) {
        width: 90%;
        .black-bg {
            border-radius: 18px 18px 0px 0px;
        }
    }
`;

const FarmTabs = styled(Row)`
    gap: 20px;
    font-size: 18px;
    width: 100%;
    justify-content: center;

    .active {
        color: var(--text2);
    }
`;

const FarmHero = styled(Columns)`
    height: 140px;
    justify-content: center;
    margin-bottom: 20px;
    text-align: center;

    div {
        width: 100%;
    }

    .title {
        text-align: center;
        font-size: 48px;
        font-weight: 600;
        letter-spacing: 0.5px;
        font-family: 'DM sans', sans-serif;
        text-transform: uppercase;
        text-align: left;
    }

    .sub-title {
        font-size: 18px;
        font-weight: 500;
        color: var(--text6);
        text-align: left;
    }
`;

export default Farm;
