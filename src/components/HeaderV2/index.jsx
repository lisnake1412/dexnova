import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Link,useLocation } from 'react-router-dom';

import { publicRoutes } from 'Routes';
import logoImg from 'assetsV2/image/logo/starNovaLogo.png';
import rightArrow from 'assetsV2/icon/rightArrow.svg';
import Button from 'components/Button';
import Web3Status from 'components/Web3Status';
const cx = classNames.bind(styles);

function Header({styles}) {
    const [isMenuButton, setMenuButton] = useState(1);
    const location = useLocation()
    useEffect(() => {
        !isMenuButton ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = 'unset');
    }, [isMenuButton]);
    return (
        <header className={cx('wrapper', { blackBackground: !isMenuButton })} style={styles}>
            <div className={cx('container')}>
                <a href="logo" className={cx('logo-wrapper')}>
                    <img alt="logo" src={logoImg}></img>
                </a>
                <div className={cx('content')}>
                    <div className={cx('page-lists', { isMenuButton: !isMenuButton })}>
                        {publicRoutes.map((route, index) => {
                            let className = {
                                list: true,
                                isUnderline: 0,
                            };
                            if (location.pathname === `${route.path}`) className.isUnderline = 1;
                            // console.log(location.pathname)
                            // console.log(`/#${route.path}`)
                            return (
                                <Link key={index} className={cx(className)} to={route.url || route.path}>
                                    {route.path.slice(1) || 'home'}
                                </Link>
                            );
                        })}
                    </div>
                    { location.pathname === '/home' &&
                    (<div className={cx('button-wrapper')}>
                        <Button type="solid">
                            ENTER APP
                            <img alt="arrow" src={rightArrow} style={{ marginLeft: 10,width:20 }}></img>
                        </Button>
                    </div>)}
                    <Web3Status style={{margin:"0 auto"}}/>
                    {
                        <div className={cx('menu-button')} onClick={() => setMenuButton((prev) => (prev + 1) % 2)}>
                        {isMenuButton ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="100"
                                height="100"
                                viewBox="0 0 50 50"
                            >
                                <path d="M 5 9 L 5 11 L 45 11 L 45 9 L 5 9 z M 5 24 L 5 26 L 45 26 L 45 24 L 5 24 z M 5 39 L 5 41 L 45 41 L 45 39 L 5 39 z"></path>
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="100"
                                height="100"
                                viewBox="0 0 50 50"
                            >
                                <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
                            </svg>
                        )}
                    </div>}
                    
                </div>
            </div>
        </header>
    );
}

export default Header;
