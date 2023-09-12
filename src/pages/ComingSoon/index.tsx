import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { Row, Columns } from 'components/Layouts'
import LogoAco from 'assets/icons/logoaco.png'


const getUrl = window.location;

export default function Launchpad() {
const [isOpenPopup, setIsOpenPopup] = useState(false);
  return (
      <section className='launchpad'>
        <div className="container">
            <div className="main-content">
                <div className="box-2 box-wp-content coming">
                    <div className="box-1">
                        <a href=""><img src={LogoAco} alt="logo" /></a>
                    </div>
                    <div className="item">
                        <div className="item_title">
                            <h2>We Are Launching Soon</h2>
                        </div>
                        <div className="link_comingsoon">
                        <Link to='/swap' className='btn button'>Trade Now</Link>
                        {/* <Link to='/farms' className='button btn' >Farming</Link> */}
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </section>
      
  );
}
