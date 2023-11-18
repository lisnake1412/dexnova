import styles from './SixthPage.module.scss';
import classNames from 'classnames/bind';

import Button from 'components/Button';
import rightArrow from 'assets/icon/rightArrow.svg';

const cx = classNames.bind(styles);

function SixthPage() {
    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('earth-bg')}></div>
                <div className={cx('faded')}></div>
                <div className={cx('container')}>
                    <h2>JOIN US! YOU’LL NEVER LOOK BACK!</h2>
                    <p>
                        The purpose of the community treasury is not enforced, and STN holders are in control of what to
                        do with the funds. The suggested usage, however, is the funding of projects that benefit the 0x
                    </p>
                    <div className={cx('content-wrapper')}>
                        <div className={cx('show-box')}>
                            <div className={cx('box-content')}>
                                <div className={cx('icon-wrapper')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512">
                                        <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
                                    </svg>
                                </div>
                                <div className={cx('text-wrapper')}>
                                    <p>Official discord</p>
                                    <p>@Etherscan</p>
                                </div>
                            </div>
                            <p className={cx('box-title')}>Get involved</p>
                        </div>

                        <div className={cx('show-box')}>
                            <div className={cx('box-content')}>
                                <div className={cx('icon-wrapper')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                                    </svg>
                                </div>
                                <div className={cx('text-wrapper')}>
                                    <p>Official twitter</p>
                                    <p>@Etherscan</p>
                                </div>
                            </div>
                            <p className={cx('box-title')}>follow the latest news</p>
                        </div>

                        <div className={cx('show-box')}>
                            <div className={cx('box-content')}>
                                <div className={cx('icon-wrapper')}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/></svg>
                                </div>
                                <div className={cx('text-wrapper')}>
                                    <p>Official telegram</p>
                                    <p>@Etherscan</p>
                                </div>
                            </div>
                            <p className={cx('box-title')}>join the community</p>
                        </div>

                        <div className={cx('show-box')}>
                            <div className={cx('box-content')}>
                                <div className={cx('icon-wrapper')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                        <path d="M440.3 203.5c-15 0-28.2 6.2-37.9 15.9-35.7-24.7-83.8-40.6-137.1-42.3L293 52.3l88.2 19.8c0 21.6 17.6 39.2 39.2 39.2 22 0 39.7-18.1 39.7-39.7s-17.6-39.7-39.7-39.7c-15.4 0-28.7 9.3-35.3 22l-97.4-21.6c-4.9-1.3-9.7 2.2-11 7.1L246.3 177c-52.9 2.2-100.5 18.1-136.3 42.8-9.7-10.1-23.4-16.3-38.4-16.3-55.6 0-73.8 74.6-22.9 100.1-1.8 7.9-2.6 16.3-2.6 24.7 0 83.8 94.4 151.7 210.3 151.7 116.4 0 210.8-67.9 210.8-151.7 0-8.4-.9-17.2-3.1-25.1 49.9-25.6 31.5-99.7-23.8-99.7zM129.4 308.9c0-22 17.6-39.7 39.7-39.7 21.6 0 39.2 17.6 39.2 39.7 0 21.6-17.6 39.2-39.2 39.2-22 .1-39.7-17.6-39.7-39.2zm214.3 93.5c-36.4 36.4-139.1 36.4-175.5 0-4-3.5-4-9.7 0-13.7 3.5-3.5 9.7-3.5 13.2 0 27.8 28.5 120 29 149 0 3.5-3.5 9.7-3.5 13.2 0 4.1 4 4.1 10.2.1 13.7zm-.8-54.2c-21.6 0-39.2-17.6-39.2-39.2 0-22 17.6-39.7 39.2-39.7 22 0 39.7 17.6 39.7 39.7-.1 21.5-17.7 39.2-39.7 39.2z" />
                                    </svg>
                                </div>
                                <div className={cx('text-wrapper')}>
                                    <p>Official reddit</p>
                                    <p>@Etherscan</p>
                                </div>
                            </div>
                            <p className={cx('box-title')}>Check the progress</p>
                        </div>
                    </div>
                    <div className={cx('button-wrapper')}>
                        <Button type="solid">
                            ENTER APP
                            <img alt="arrow" src={rightArrow} style={{ marginLeft: 10 }}></img>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SixthPage;
