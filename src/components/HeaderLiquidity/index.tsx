import Transaction from 'components/Setting';
import { useState } from 'react';

import { useAppState } from 'states/application/hooks';
import styled from 'styled-components';
// import imgSetting from "../../assets/svg/setting.svg";
// import imgSettingLight from "../../assets/svg/setting-light.svg";
import SettingIcon from 'assets/icons/setting.png';
import ChartIcon from 'assets/icons/chart.png';
import { Link, useLocation } from 'react-router-dom';

const HeaderLiquidity = () => {
    const [setting, setSetting] = useState(false);
    const { userDarkMode } = useAppState();
    return (
        <>
            <HeaderTitle>
                <WrapNav className="wp-icon-head">
                    <div
                        onClick={() => {
                            window.location.reload();
                        }}
                        className="wp-setting-icon"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="none">
                            <path
                                d="M11.9915 4.48285C11.006 2.75571 9.11375 1.62079 6.9829 1.62079C3.82156 1.62079 1.25878 4.18357 1.25878 7.34491C1.25878 10.5063 3.82156 13.069 6.9829 13.069C10.1443 13.069 12.707 10.5063 12.707 7.34491"
                                stroke="white"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M8.41406 4.48285L11.9916 4.48285L11.9916 0.905273"
                                stroke="white"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </div>
                    <Link to="/add">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="none">
                            <path
                                d="M0.880859 6.98767H13.0434"
                                stroke="white"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M6.96191 13.069V0.905212"
                                stroke="white"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </Link>
                    <div
                        onClick={() => {
                            setSetting(true);
                        }}
                        className="wp-setting-icon"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 13" fill="none">
                            <path
                                d="M5.08008 1.83716H14.8111"
                                stroke="white"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M5.08008 6.70026H11.162"
                                stroke="white"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M5.08008 11.5681H14.8111"
                                stroke="white"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M1.42981 3.05349C2.038 3.05349 2.64619 2.4453 2.64619 1.83711C2.64619 1.22892 2.038 0.620728 1.42981 0.620728C0.821623 0.620728 0.214844 1.22892 0.214844 1.83711C0.214844 2.4453 0.821623 3.05349 1.42981 3.05349ZM1.42981 7.919C2.038 7.919 2.64619 7.31081 2.64619 6.70262C2.64619 6.09443 2.038 5.48624 1.42981 5.48624C0.821623 5.48624 0.214844 6.09443 0.214844 6.70262C0.214844 7.31081 0.821623 7.919 1.42981 7.919ZM1.42981 12.7845C2.038 12.7845 2.64619 12.1763 2.64619 11.5681C2.64619 10.96 2.038 10.3518 1.42981 10.3518C0.821623 10.3518 0.214844 10.96 0.214844 11.5681C0.214844 12.1763 0.821623 12.7845 1.42981 12.7845Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                </WrapNav>
                {setting && <Transaction setting={setting} setSetting={setSetting} />}
            </HeaderTitle>
        </>
    );
};

export default HeaderLiquidity;

const HeaderTitle = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .wp-icon-head {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
    }
    svg {
        width: 18px;
        aspect-ratio: 1/1;
        cursor: pointer;
    }
    .wp-setting-icon {
    }
    span {
        :last-child {
            position: absolute;
            right: 0px;
            bottom: 20px;
            font-size: 14px;
        }
    }
`;
const WrapNav = styled.div`
    display: flex;
    gap: 10px;
    justify-content: space-between;
    width: 100%;
    label {
        font-weight: 600;
        color: ${({ theme }) => theme.text1};
    }
`;
