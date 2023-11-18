import Button from 'components/Button';
import styles from './HowItWork.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function HowItWork() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <h2 className={cx('title')}>How It Work?</h2>
                <div className={cx('content')}>
                    <div className={cx('detail')}>
                        <div className={cx('number')}>
                            <h3>1</h3>
                        </div>
                        <h3>Deposit Liquidity</h3>
                        <p>
                            Deposit two tokens to create liquidity in a pool, and receive a LP tokens to signify
                            ownership in that pool.
                        </p>
                    </div>
                    <div className={cx('detail')}>
                        <div className={cx('number')}>
                            <h3>2</h3>
                        </div>
                        <h3>Earn Fees</h3>
                        <p>
                            Fees for LPs are accumulated into a vault that allows you to claim fees seperately from your
                            LP tokens.
                        </p>
                    </div>
                    <div className={cx('detail')}>
                        <div className={cx('number')}>
                            <h3>3</h3>
                        </div>
                        <h3>Delegate & Change Pool Fees</h3>
                        <p>
                            An account with at at least 50% of the LP vote weight delegated to it is able to change pool
                            fees at any time.{' '}
                        </p>
                    </div>
                </div>
                <div className={cx('button')}>
                    <Button type="solid">Read Docs</Button>
                </div>
            </div>
        </div>
    );
}

export default HowItWork;
