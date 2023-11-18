import styles from './FifthPage.module.scss';
import classNames from 'classnames/bind';

import showBoxBG from 'assets/image/BackgroundImage/showBoxBG.svg'
import * as img from 'assets/image/partnership'
const cx = classNames.bind(styles);
const BOX_LISTs = new Array(21).fill(0);
function FifthPage() {
    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    <h2>PARTERSHIP</h2>
                    <p>Developing the Base Chain ecosystem is our priority. Meet our early stage partners.</p>
                    <div className={cx('content-wrapper')}>
                        {BOX_LISTs.map( (data, index) => {
                            return (
                            <div key={index} className={cx('show-box')}>
                                <img src={showBoxBG} alt='show-box' className={cx('show-box-bg')}></img>
                                <img src={img[`img${index + 1}`]} alt="box" className={cx('show-box-img')}></img>
                            </div>
                            )
                        } )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default FifthPage;
