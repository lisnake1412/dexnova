import styles from './ThirdPage.module.scss';
import classNames from 'classnames/bind';

import Button from 'components/Button';
import planetImg from 'assets/image/BackgroundImage/mars.png'
const cx = classNames.bind(styles);

function ThirdPage() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('planet-wrapper')}>
                    <img src={planetImg} alt="mars"></img>
                    <div className={cx('faded')}></div>
                </div>
                <div className={cx('content')}>
                    <div className={cx('text-wrapper')}>
                        <h1>Mute Token</h1>
                        <p>
                            Mute is the gas that powers growth of the entire ecosystem via the Mute DAO & revenue based
                            funding proposals.The Mute ecosystem benefits directly through a revenue based buy back and make
                            initiative used to fuel ecosystem growth.
                        </p>
                    </div>
                    <div className={cx('button-wrapper')}>
                        <Button type="solid">Buy Mute</Button>
                        <Button type="outline">Tokenomics</Button>
                        <Button type="outline">Add Liquidity</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ThirdPage;
