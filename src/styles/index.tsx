import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
@import 'normalize.css';
@import url("https://fonts.googleapis.com/css?family=Inter:700,400|DM+Sans:500|Poppins:500");

    html {
       margin: 0;
       padding: 0;
    }
    body {
        background-color: #060B27;
        margin: 0;
        padding: 0;
        font-family:  var(--primaryFont);
        font-size: var(--primaryFontSize);
        color: #fff;
        line-height: inherit;
    }

    :root{
        --primaryColor: #250942;
        //default layout
        --contentMaxWidth: 1200px;
        --textOpacity: 1;
        --tw-bg-opacity: 1;
        --primaryFont: DM Sans, Inter, Verdana, Geneva, Tahoma, sans-serif;
        --primaryFontSize: 1rem;
        --primaryTextFontSize:20px;
        --primaryGradientColor:linear-gradient(to left, #7451FE, #D15EF0, #FF00E3);
        --primaryTextOpacity: 1;
        --h2FontSize: 2rem;
        --containerMargin: 3rem 0;
        --contentMargin: 50px 0 50px 0;
        --headerHeight: 100px;
        --color-text: rgb(18, 101, 171);
        --color-border-button: linear-gradient(44.7deg, #00FF00 14.53%, #00F322 20.2%, #00D378 33.65%, #00A5F7 51.36%, #171AFE 80.39%, #1B00FF 85.35%);
        --bg1: #fff;
        --bg2: #f5f6fc;
        --bg3: #f5f6fc;
        --bg4: #fff;
        --bg5: #fff;
        --bg6: #000;
        --bgViolet:#15003F;
        --bgdark:rgba(9,0,61,0.4);
        --bgmiddle:rgba(255,255,255,0.1);
        --btn1: linear-gradient(270deg,#7451fe 0%,#d15ef0 48.96%,#ff00e3 98.44%);
        --btn2: #ffffff1c;
        --border1: #d2d9ee;
        --border2: #adccdd;
        --border3: #04161d;
        --borderV2:1px solid #fff;
        --borderRadiusV2: 5px;
        --borderRadius2:10px;
        --hover1: #c9c9c9;
        --hover2: #c9c9c921;
        --text1: #000;
        --text2: #000;
        --text3: #fff;
        --text4: #ff0085;
        --text5: #D7D7D7;
        --text6: #979797;
        --primaryColorV2: #ff00e3;
    }

    .t1 {
        color: var(--text1);
    }

    .t2 {
        color: var(--text2);
    }

    .to {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }


    a {
        color: #000;
        text-decoration: none;
    }

    img {
        width:100%;
    }

    .b {
        font-weight: 600;
    }
    
    
    
    button {
        outline:none;
        border:none;
    }
    
    a {
        color: inherit;
        text-decoration: none;
        cursor: pointer;
    }
    
    li {
        list-style-type: none;
    }
    @media screen and (max-width:1281px) { //tablet
    :root {
        --containerMargin: 2.5rem 2rem;
        --contentMargin: 30px 30px;
    }
    }

    @media screen and (max-width:481px) {
        :root {
            --containerMargin: 2rem 1rem;
            --primaryTextFontSize: 1.1rem;
            --h2FontSize: 1.7rem;
        }
    }
`;
