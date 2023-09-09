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
import { useActiveWeb3React } from 'hooks';
import { ethers } from 'ethers';
import { useETHBalances } from 'hooks/useCurrencyBalance';
const getUrl = window.location;
console.log(getUrl);
let getTeam = getUrl.toString().replace("https://app.ancora.finance/#/public_sale?",'');
export default function Launchpad() {
const [isOpenPopup, setIsOpenPopup] = useState(false);
const { account, chainId, disconnect } = useActiveWeb3React()
// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const signer =  provider.getSigner();
const publicSale_abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "CancelPublicSale",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "ClaimTokens",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "DepositETH",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_tokensForClaiming",
          "type": "uint256"
        }
      ],
      "name": "DepositTokens",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "WithdrawETH",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "Ideposits",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "PublicSaleActive",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "areDepositsActive",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "cancelPublicSale",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "cancelPublicSaleBool",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "claimTokens",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "referal",
          "type": "uint256"
        }
      ],
      "name": "depositETH",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokensForClaiming",
          "type": "uint256"
        }
      ],
      "name": "depositTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "deposits",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getContractBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCurrentTokenShare",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getFund",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getInvestorlist",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "investor",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "percent",
              "type": "uint256"
            }
          ],
          "internalType": "struct SyncDexPublic.ListToVesting[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "hasDepositsFinished",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "listInvetorVesting",
      "outputs": [
        {
          "internalType": "address",
          "name": "investor",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "percent",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minDeposit",
      "outputs": [
        {
          "internalType": "uint128",
          "name": "",
          "type": "uint128"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "softcap",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "startPublicSale",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "stopPublicSale",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokenAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokenPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokensForClaiming",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalEthDeposited",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
const contractAddress = "0x4080198Fc1452cCd2146A6D943aa905CA3E14f67";//
const [amount, setAmount] = useState("");
const [totalraise, setTotalRaise] = useState("");
const [totalraisepercent, setTotalRaisepercent] = useState("");
// const tokenContract = new ethers.Contract(contractAddress, privateSale_abi, signer);
async function callContract() {
  if(account){
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const publicSaleContract = new ethers.Contract(contractAddress, publicSale_abi, signer);
    try {
      const a = await publicSaleContract.depositETH(getTeam,{ value: ethers.utils.parseEther(amount) })
    }
    catch(e){
        const a = await publicSaleContract.depositETH("0",{ value: ethers.utils.parseEther(amount) })
    }
  // console.log(counter.toString())
  }

}
async function claim() {
  if(account){
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const publicSaleContract = new ethers.Contract(contractAddress, publicSale_abi, signer);
    try {
      const a = await publicSaleContract.claimTokens()
    }
    catch(e){
        const a = await publicSaleContract.claimTokens()
    }
  // console.log(counter.toString())
  }

}
async function getContractBalance() {
  // let value;
//   if(account){
      
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const publicSaleContract = new ethers.Contract(contractAddress, publicSale_abi, signer);

      const a = await publicSaleContract.getContractBalance();
      setTotalRaise((Number(ethers.utils.formatEther(a))).toString());
      setTotalRaisepercent(((Number(ethers.utils.formatEther(a)))*100/70).toFixed(2).toString());
//    }
 }
getContractBalance(); 

let ethBalance;
if(account){
    ethBalance = useETHBalances([account]);
}
 else{
    ethBalance = 0;
 }
  return (
      <section className='launchpad'>
        <div className="container">
            <div className="top-content">
                <div className="title">
                    <h3>Launchpad: INITIAL DEX OFFERING</h3>
                    <p>Buy new tokens lauching on Linea</p>
                </div>

            </div>
            <div className="main-content">
                
                <div className="box-2 box-wp-content">
                    <div className="box-1">
                        <a href=""><img src={LogoAco} alt="logo" /></a>
                    </div>
                    <h3>START</h3>
                    
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
                                    style={{ width: totalraisepercent+"%" }}
                                    aria-valuenow={totalraisepercent}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    />
                                </div>
                                <p>{totalraise} / 50 ETH ({totalraisepercent}%)</p>
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
                                        <h4>ACR To Receive</h4>
                                        <p className='number'>697.55</p>
                                    </div>
                                </div>
            
                                <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={ethBalance[account]} />
                               
                                <button type="submit">
                                    Buy Now
                                </button>
                                <ul className='total_raise'>
                                    <li><span>Min token entry</span><span>~0 ETH (0.000000000%)</span></li>
                                    <li><span>Input amount</span><span>150 ETH</span></li>
                                    <li><span>Price per ACR:</span><span>~0 ETH</span></li>
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
