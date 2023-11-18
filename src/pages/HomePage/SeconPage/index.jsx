import styles from './secondPage.module.scss';
import classNames from 'classnames/bind';

import tool from 'assets/image/transactions/tools.png';
import adjusts from 'assets/image/transactions/adjusts.png';
import fixed from 'assets/image/transactions/fixed.png';
import arrow from 'assets/icon/ArrayBox.svg';


const cx = classNames.bind(styles);

function SecondPage() {
    return (
        <>
            
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    <h2>Manage Your Transactions In One Place</h2>
    
                    <div className={cx('content-wrapper')}>
                        <div className={cx('content-box')}>
                            <div className={cx('left-content')}>
                                <div className={cx('image-wrapper')}>
                                    <img src={tool} alt="tool"></img>
                                </div>
                                <p className={cx('title')}>Swap</p>
                            </div>
                            <div className={cx('right-content')}>
                                <p className={cx('description')}>
                                    Discover how to swap your tokens and save 50 to 65% on each trade.
                                </p>
    
                                <img src={arrow} alt="arrow"></img>
                            </div>
                        </div>
                        <div className={cx('content-box')}>
                            <div className={cx('left-content')}>
                                <div className={cx('image-wrapper')}>
                                    <img src={adjusts} alt=""></img>
                                </div>
                                <p className={cx('title')}>Protocol earnings</p>
                            </div>
                            <div className={cx('right-content')}>
                                <p className={cx('description')}>
                                    As soon as it is fully operational, SyncDex will collect a wide range of fees from its
                                    ecosystem, spacing from the DEX to the Launchpad ones.
                                </p>
    
                                <img src={arrow} alt="arrow"></img>
                            </div>
                        </div>
                        <div className={cx('content-box')}>
                            <div className={cx('left-content')}>
                                <div className={cx('image-wrapper')}>
                                    <img src={fixed} alt=""></img>
                                </div>
                                <p className={cx('title')}>Dividends</p>
                            </div>
                            <div className={cx('right-content')}>
                                <p className={cx('description')}>
                                    Dividends will account for 25% of total protocol earnings. They will be distributed to
                                    users which allocate xSND in the dividend feature.
                                </p>
    
                                <img src={arrow} alt="arrow"></img>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SecondPage;
