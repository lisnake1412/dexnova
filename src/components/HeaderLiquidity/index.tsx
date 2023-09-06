import Transaction from 'components/Setting'
import { useState } from 'react'

import { useAppState } from 'states/application/hooks'
import styled from 'styled-components'
// import imgSetting from "../../assets/svg/setting.svg";
// import imgSettingLight from "../../assets/svg/setting-light.svg";
import SettingIcon from 'assets/icons/setting.png'
import ChartIcon from 'assets/icons/chart.png'
import { Link, useLocation } from 'react-router-dom'


const HeaderLiquidity = () => {
    const [setting, setSetting] = useState(false)
    const { userDarkMode } = useAppState()
    return (
        <>
            <HeaderTitle>
                <WrapNav className='wp-icon-head'>
                <Link to="/add">
                    <img src={ChartIcon}  />
                        </Link>
                    <img
                        onClick={() => {
                            setSetting(true)
                        }}
                        src={userDarkMode ? SettingIcon : SettingIcon}
                        alt=""
                    />
                    
                </WrapNav>
                {setting && (
                    <Transaction setting={setting} setSetting={setSetting} />
                )}
            </HeaderTitle>
        </>
    )
}

export default HeaderLiquidity

const HeaderTitle = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .wp-icon-head {
        display: flex;
        justify-content: center;
        align-items: center;
        gap:15px;
    }
    img {
        cursor: pointer;
        position: relative;
        width:30px;
    }
    span {
        :last-child {
            position: absolute;
            right: 0px;
            bottom: 20px;
            font-size: 14px;
        }
    }
`
const WrapNav = styled.div`
    display: flex;
    gap: 10px;
    justify-content: space-between;
    width: 100%;
    label {
        font-weight: 600;
        color: ${({ theme }) => theme.text1};
    }
`
