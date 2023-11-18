import styles from './footer.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import logoImg from 'assets/image/logo/starNovaLogo.png';
const cx = classNames.bind(styles);

function Footer( {isTransparentBackground,styles} ) {
    const moreClassName = {
       isTransparentBackground:isTransparentBackground

    }
    return (
        <footer className={cx('wrapper', moreClassName)} style={styles}>
            <div className={cx('top-container')}>
                <a href="logo" className={cx('logo-wrapper')}>
                    <img alt="logo" src={logoImg}></img>
                </a>
                <div className={cx('content')}>
                    <div className={cx('page-lists')}>
                        <Link className={cx('list')} to="/trade">
                            Trade
                        </Link>
                        <Link className={cx('list')} to="/home">
                            Home
                        </Link>
                        <Link className={cx('list')} to="/pools">
                            Pools
                        </Link>
                        <Link className={cx('list')} to="/docs">
                            Docs
                        </Link>
                    </div>
                </div>
                <div className={cx('text-wrapper')}>
                    <a href="#policy">PRIVACY POLICY</a>
                    <a href="#policy" style={{ marginLeft: 15 }}>
                        TERMS OF SERVICE
                    </a>
                </div>
            </div>
            <div className={cx('white-line')}></div>
            <div className={cx('bottom-container')}>
                <p>© 2023 Alien Base. All rights reserved</p>
                <p>Alien Base is developed and managedinde <br/> pendently of the Coinbase / Base team </p>
            </div>
        </footer>
    );
}

export default Footer;
