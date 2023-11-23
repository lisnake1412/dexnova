import styles from './FourthPage.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';

import checkBoxSVG from 'assets/icon/checkBox.svg';
import Button from 'components/Button';
const cx = classNames.bind(styles);

let NUMBER_DATAs = {
    volume: 80,
    curVolume: 0,
    total: 180,
    curTotal: 0,
    integration: 500,
    curIntegration: 0,
    delegates: 5600,
    curDelegates: 0,
};
let NUMBER_DATAs_copy = NUMBER_DATAs

const timeDuration = 0.8;
const FPS = 200;
const totalFrame = timeDuration * FPS;
const timePerFrame = (timeDuration * 1000) / FPS;
let isAnimationStart = 0;

function FourthPage() {
    const [curFrame, setFrame] = useState(-1);
    const ElementWrapper = useRef(null);
    function nextFrame() {
        setTimeout(() => {
            setFrame((prev) => prev + 1);
        }, timePerFrame);
    }
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    isAnimationStart = 1;
                    setFrame((prev) => prev + 1);
                }
            },
            {
                threshold: 0.2,
            },
        );
        observer.observe(ElementWrapper.current);
    }, []);

    useEffect(() => {
        if (curFrame <= totalFrame && isAnimationStart) {
            NUMBER_DATAs.curVolume += (NUMBER_DATAs.volume / totalFrame)%NUMBER_DATAs.volume;
            NUMBER_DATAs.curTotal += NUMBER_DATAs.total / totalFrame%NUMBER_DATAs.total;
            NUMBER_DATAs.curIntegration += NUMBER_DATAs.integration / totalFrame%NUMBER_DATAs.integration;
            NUMBER_DATAs.curDelegates += NUMBER_DATAs.delegates / totalFrame%NUMBER_DATAs.delegates;
            nextFrame();
        }
        else if (curFrame > totalFrame) {
            NUMBER_DATAs = {...NUMBER_DATAs_copy}
        }
    }, [curFrame]);
    
    return (
        <>
            <div ref={ElementWrapper} id="fourthPage" className={cx('wrapper')}>
                <div className={cx('container')}>
                    <h2>PROTOCOL</h2>
                    <div className={cx('content-wrapper')}>
                        <div className={cx('left-content')}>
                            <p>
                                Mute is a zkRollup based DEX, farming platform, and Bond platform built on Ethereum and
                                zkSync
                            </p>
                            <div className={cx('check-boxes', { isAnimationStart })}>
                                <div className={cx('check-box')}>
                                    <img src={checkBoxSVG} alt="check"></img>
                                    <p>No account required</p>
                                </div>
                                <div className={cx('check-box')}>
                                    <img src={checkBoxSVG} alt="check"></img>
                                    <p>Professional market maker</p>
                                </div>
                                <div className={cx('check-box')}>
                                    <img src={checkBoxSVG} alt="check"></img>
                                    <p>No disposit or withdrawal fees</p>
                                </div>
                                <div className={cx('check-box')}>
                                    <img src={checkBoxSVG} alt="check"></img>
                                    <p>Creat a limit order</p>
                                </div>
                            </div>
                            <div className={cx('button-wrapper')}>
                                <Button type="solid">Connect Wallet</Button>
                                <Button type="outline">Learn More</Button>
                            </div>
                        </div>
                        <div className={cx('right-content')}>
                            <div className={cx('show-boxes')}>
                                <div className={cx('show-box')}>
                                    <p>trade volume 24h</p>
                                    <h2>{`${NUMBER_DATAs.curVolume.toFixed(0)}M`}</h2>
                                </div>
                                <div className={cx('show-box')}>
                                    <p>Total Value Locked</p>
                                    <h2>{`$${NUMBER_DATAs.curTotal.toFixed(0)}M`}</h2>
                                </div>
                                <div className={cx('show-box')}>
                                    <p>Integrations</p>
                                    <h2>{NUMBER_DATAs.curIntegration.toFixed(0)}</h2>
                                </div>
                                <div className={cx('show-box')}>
                                    <p>Community Delegates </p>
                                    <h2>{`${NUMBER_DATAs.curDelegates.toFixed(0)}+`}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FourthPage;
