import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { Row, Columns } from 'components/Layouts'
import CountDownOne from "components/CountDown/privatesale";
import Popup from "components/popuplaunch/private";
import Timeline from "components/Timeline";
import Faq from "components/faq";
import LogoAco from 'assets/icons/logoaco.png'
import imgDownArrowDark from 'assets/icons/icondown.png'
import iconToken from 'assets/icons/imgIconDiscord.png'

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
                                <p>30 / 50 ETH (70%)</p>
                                <h4 className="title_ico">
                               5546 participated 
                                </h4>
                            </div>
                            {/* <div className="title">
                                <div className="banner-countdown-wrap text-center">
                                    <h3 className="title_coundown">Launchpad Will Start in..</h3>
                                    <CountDownOne />
                                </div>
                            </div> */}
                            <div className="desponsi">
                                <div className="desponsi-item">
                                    <div className="desponsi-img">
                                        <img width={20} src={iconToken} alt="logo token" />
                                    </div>
                                    <div className="desponsi-text">
                                        <h4>your ETH Committed</h4>
                                        <p className='number'>172.497913</p>
                                        <p className='total'>0,0032 % off total</p>
                                    </div>
                                </div>
                                <div className="desponsi-item">
                                    <div className="desponsi-img">
                                    <img width={20} src={iconToken} alt="logo token" />
                                    </div>
                                    <div className="desponsi-text">
                                        <h4>ANC To Receive</h4>
                                        <p className='number'>697.55</p>
                                    </div>
                                </div>
            
                                <input type="text" value="123" placeholder="Insert the amount" />
                               
                                <button type="submit">
                                    Buy Now
                                </button>
                                <ul className='total_raise'>
                                    <li><span>Min token entry</span><span>~0 ETH (0.000000000%)</span></li>
                                    <li><span>Input amount</span><span>150 ETH</span></li>
                                    <li><span>Price per ANC:</span><span>~0 ETH</span></li>
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
                    <Faq/>
                </div>
            </div>
        </div>
      </section>
      
  );
}
