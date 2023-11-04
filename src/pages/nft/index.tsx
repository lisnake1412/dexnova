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
import iconToken from 'assets/icons/eth-logo.png'
import iconAcora from 'assets/icons/icon-acora.png'

import { useActiveWeb3React } from 'hooks';
import { ethers } from 'ethers';
import { useETHBalances } from 'hooks/useCurrencyBalance';
// const getUrl = window.location;
// console.log(getUrl);
// let getTeam = getUrl.toString().replace("https://app.ancora.finance/#/public_sale?",'');
export default function Launchpad() {
const [isOpenPopup, setIsOpenPopup] = useState(false);
const { account, chainId, disconnect } = useActiveWeb3React()
// if̣̣(chainId != 1){
//   alert("Hello! I am an alert box!!");
// }
// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const signer =  provider.getSigner();
const publicSale_abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "addAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "accounts",
				"type": "address[]"
			}
		],
		"name": "addAddresses",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "investors",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "amounts",
				"type": "uint256[]"
			}
		],
		"name": "addInvestors",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"inputs": [
			{
				"internalType": "uint128",
				"name": "minprice",
				"type": "uint128"
			}
		],
		"name": "changeMin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "AddressAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "AddressRemoved",
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
		"name": "CancelPublicSale",
		"type": "event"
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
		"inputs": [],
		"name": "depositETH",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
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
		"inputs": [],
		"name": "getFund",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
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
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "removeAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
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
				"internalType": "struct AncoraPublic.ListToVesting[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRateToken",
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
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "isWhitelisted",
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
		"name": "maxDeposit",
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
				"name": "",
				"type": "address"
			}
		],
		"name": "whitelist",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = "0xBcEbe2DE1321c8f3eA5E6999afB6c1b8cfF0D56D";//
const [amount, setAmount] = useState("");
const [totalraise, setTotalRaise] = useState("");
const [totalraisepercent, setTotalRaisepercent] = useState("");
// const tokenContract = new ethers.Contract(contractAddress, privateSale_abi, signer);
async function callContract() {
  // if(chainId != 1){
  //   console.log(chainId)
  //   alert("Please change and bridge to Ethereum Mainnet");
  //   return;
  // }
  if(account){
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const publicSaleContract = new ethers.Contract(contractAddress, publicSale_abi, signer);
    try {
      const a = await publicSaleContract.depositETH({ value: ethers.utils.parseEther(amount) })
    }
    catch(e){
        const a = await publicSaleContract.depositETH({ value: ethers.utils.parseEther(amount) })
    }
    
  // console.log("done")
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
      try{
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const publicSaleContract = new ethers.Contract(contractAddress, publicSale_abi, signer);
  
        const a = await publicSaleContract.getContractBalance();
        setTotalRaise((Number(ethers.utils.formatEther(a))).toString());
        setTotalRaisepercent(((Number(ethers.utils.formatEther(a)))*100/20).toFixed(2).toString());
      }
      catch(e){
        return;
    }
      
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
                    <h3>Introducing Mind NFT</h3>
                    <p>Mind NFT, a groundbreaking feature that combines blockchain technology with cognitive science to create unique and collectible digital assets representing individual thoughts and memories.</p>
                </div>

            </div>
            <div className="main-content">
			<div className="box-2 box-wp-content box-nft">
                    <div className="box-1">
                        <a href=""><img src={LogoAco} alt="logo" /></a>
                    </div>
                    <h3>Exploring the World of Digital Collectibles</h3>
                    
                    <section className="cards">
						<div className="item-nnt">
							<div className='card charizard animated'>
							</div>
							<button type="submit" className='button-nfts'>
								Mind Now
                                </button>
						</div>
						<div className="item-nnt">
						<div className='card pika animated'>

						</div>
						<button type="submit" className='button-nfts'>
								Mind Now
                                </button>
						</div>
						<div className="item-nnt">
						<div className='card eevee animated'>
	
						</div>
						<button type="submit" className='button-nfts'>
								Mind Now
                                </button>
						</div>

					</section>
                </div>
                
				

                <div className="section-2">
					<div className="timeline">
						<div className="row">
							<div className="col-lg-12">
							<h3 className="title_timeline">How It's Mind NFT</h3>
							<div className="timeline-container">
								<div className="timeline-continue">
								<div className="row timeline-right">
									<div className="col-md-6">
									<p className="timeline-date">
										1
									</p>
									</div>
									<div className="col-md-6">
									<div className="timeline-box">
										<div className="timeline-icon">
										<i className="fa fa-gift" />
										</div>
										<div className="timeline-text">
										<h3>Activate your Profile</h3>
										<p>You’ll need connect to AncoraFinance to take part in an IFO!
				</p>
										</div>
									</div>
									</div>
								</div>
								<div className="row timeline-left">
									<div className="col-md-6">
									<div className="timeline-box">
										<div className="timeline-icon d-md-none d-block">
										<i className="fa fa-business-time" />
										</div>
										<div className="timeline-text">
										<h3>The Ethereum</h3>
										<p>You have sufficient ETH token is your wallet</p>
										</div>
										<div className="timeline-icon d-md-block d-none">
										<i className="fa fa-business-time" />
										</div>
									</div>
									</div>
									<div className="col-md-6 d-md-block d-none">
									<p className="timeline-date">
										2
									</p>
									</div>
								</div>
								<div className="row timeline-right">
									<div className="col-md-6">
									<p className="timeline-date">
									3
									</p>
									</div>
									<div className="col-md-6">
									<div className="timeline-box">
										<div className="timeline-icon">
										<i className="fa fa-briefcase" />
										</div>
										<div className="timeline-text">
										<h3>Join and Moon!</h3>
										<p>Before the end of IDO, put in ETH token</p>
										</div>
									</div>
									</div>
								</div>
								<div className="row timeline-left">
									<div className="col-md-6">
									<div className="timeline-box">
										<div className="timeline-icon d-md-none d-block">
										<i className="fa fa-cogs" />
										</div>
										<div className="timeline-text">
										<h3>Moon With AncoraFinance</h3>
										<p>Launchpad will be fully released according to the super
				fundraising model, and the tokens will be returned </p>
										</div>
										<div className="timeline-icon d-md-block d-none">
										<i className="fa fa-cogs" />
										</div>
									</div>
									</div>
									<div className="col-md-6 d-md-block d-none">
									<p className="timeline-date">
										4
									</p>
									</div>
								</div>
								</div>
							</div>
							</div>
						</div>
					</div>
                </div>
            </div>
        </div>
      </section>
      
  );
}
