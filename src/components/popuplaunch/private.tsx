import styled from 'styled-components'
import imgClose from 'assets/icons/closes.png'

const Popup = ({ setIsOpenPopup }) => {
  return (
    <div className='wp-popup'
      onClick={setIsOpenPopup.bind(this, false)}
      style={{
        position: "fixed",
        background: "rgba(0,0,0,0.6)",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex:9999,

        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {/* Content */}
      <div className='wp-popups'
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          background: "white",
          animation: "dropTop .3s linear"
        }}
      >
        {/* Header */}
        <div
          style={{ borderBottom: "1px solid #03A9F4", paddingBottom: "10px" }}
        >
          <h1 className='title-popup' style={{ margin: 0 }}>Main detail</h1>
          <div
            onClick={setIsOpenPopup.bind(this, false)}
            style={{
              cursor: "pointer",
              position: "absolute",
              top: 15,
              right: 15
            }}
          >
            <img src={imgClose} alt="" />

          </div>
        </div>
        {/* Body */}
            <div className="wp-content-popup">
                <div className="top-item">
                    <div className="item-content">
                        <h4>Start Date</h4>
                        <p>05/06/2023 15:00 UTC</p>
                    </div>
                    <div className="item-content">
                        <h4>Start Date</h4>
                        <p>05/06/2023 15:00 UTC</p>
                    </div>
                    <div className="item-content">
                        <h4>Start Date</h4>
                        <p>05/06/2023 15:00 UTC</p>
                    </div>
                </div>
                <div className="main-item">
                    <ul>
                        <li><span>Token:</span> <span>Ancora Token (ACR) on Linea</span></li>
                        <li><span>Total Supply:</span> <span>10.000.000 $ACR</span></li>
                        <li><span>Address:</span> <span>0xxxx</span></li>
                        <li><span>Vesting:</span> <span>TGE 40%, vesting linear 15% over 6 months</span></li>
                        <li><span>Price per 1 ETH:</span> <span>18.666 $ACR</span></li>

                    </ul>
                </div>
            </div>
      </div>
    </div>
  );
};
export default Popup;
