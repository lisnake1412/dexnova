import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { Row, Columns } from 'components/Layouts'
import CountDownOne from "components/CountDown/privatesale";
import Popup from "components/popuplaunch/private";
import Timeline from "components/Timeline";
import LogoAco from 'assets/icons/logoaco.png'
import imgDownArrowDark from 'assets/icons/icondown.png'

const getUrl = window.location;
console.log(getUrl);

export default function Launchpad() {
const [isOpenPopup, setIsOpenPopup] = useState(false);
  return (
      <section className='launchpad'>
        <div className="container">
            <div className="top-content">
                <div className="title">
                    <h3>Launchpad: INITIAL ALIEN OFFERING</h3>
                    <p>Buy new tokens lauching on linea</p>
                </div>

            </div>
            <div className="main-content">
                
                <div className="box-2 box-wp-content">
                    <div className="box-1">
                        <a href=""><img src={LogoAco} alt="logo" /></a>
                    </div>
                    <h3>START SELLING</h3>
                    
                    <div className="item">
                        <div className="item_title">
                            <h2>Ancora Private Sale</h2>
                            <p>(Whitelist only)</p>
                        </div>
                        <div className="content">
                            <div className="banner-progress-wrap">
                                <ul>
                                    <li>happening</li>
                                </ul>
                                <div className="progress">
                                    <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: "70%" }}
                                    aria-valuenow="70"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    />
                                </div>
                                <h4 className="title_ico">
                                Have raised 50 ETH 
                                </h4>
                            </div>
                            <div className="title">
                                <div className="banner-countdown-wrap text-center">
                                    <h3 className="title_coundown">Launchpad Will Start in..</h3>
                                    <CountDownOne />
                                </div>
                            </div>
                            <div className="desponsi">
            
                                <input type="text" value="123" placeholder="Insert the amount" />
                               
                                <button type="submit">
                                    Buy Now
                                </button>
                                <ul className='total_raise'>
                                    <li><span>TOTAL COMMITTED:</span><span>~0 ETH (0.000000000%)</span></li>
                                    <li><span>FUNDS TO RAISE:</span><span>150ETH</span></li>
                                </ul>
                            </div>


                        </div>

                        <div className="detail" onClick={setIsOpenPopup.bind(this, true)}>
                            <span>detail <img
                            src={imgDownArrowDark}
                            alt="chevron down"
                        /></span>
                        {isOpenPopup && <Popup setIsOpenPopup={setIsOpenPopup} />}
                        </div>
                    </div>
                </div>

                <div className="section-2">
                    <Timeline/>


                </div>
            </div>
        </div>
      </section>
      
  );
}
