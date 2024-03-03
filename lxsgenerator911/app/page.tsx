"use client";
import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import { getContract } from "@/config";
import { BrowserProvider } from "ethers";

export default function Home() {
  const [walletKey, setWalletKey] = useState("");
  const [currentData, setCurrentData] = useState("");
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [done, setDone] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const [sLXS, setsLXS] = useState<number>(0);
  const [LXScoin, setLXScoin] = useState<number>(0);
  const [mintAmount, setMintAmount] = useState(0);
  const [withdrawLXS, setWithdrawLXS] = useState<number>(0);
  const [ESS, setESS] = useState<number>(0);
  const [countdown, setCountdown] = useState(9);
  const [transactionSubmitted, setTransactionSubmitted] = useState(false);
  

  useEffect(() => {
    checkMetaMaskConnection();
  }, []);

  const checkMetaMaskConnection = async () => {
    const { ethereum } = window as any;
    if (ethereum && ethereum.isConnected()) {
      const accounts = await ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        setWalletKey(accounts[0]);
        setIsMetaMaskConnected(true);
      }
    }
  };

  const connectWallet = async () => {
    const { ethereum } = window as any;
    if (ethereum) {
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletKey(accounts[0]);
        setIsMetaMaskConnected(true);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask extension.");
    }
  };


  const handleTransactionError = (e: any, contract: any) => {
    if (e.data) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Transaction failed: ${decodedError?.args}`);
    } else {
      alert("Transaction failed: Unknown error");
    }
  }; //if any at any point has error, this will pop out

  const mintTokens = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.mint(signer, mintAmount);
      await tx.wait();
      setDone(true);
      setTxHash(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Minting failed: ${decodedError?.args}`);
    }
  };

  const LXSstake = async () => {
    // Check if the stake amount is greater than 0
    if (sLXS <= 0) {
      alert("Please enter a valid amount to stake.");
      return;
    }
  
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.stake(sLXS);
      await tx.wait();
      setSubmitted(true);
      setTransactionSubmitted(true);
      setTxHash(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Staking failed: ${decodedError?.args}`);
    }
  };

  useEffect(() => {
    if (transactionSubmitted) {
      // Start the countdown when a transaction is submitted
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          // Stop the countdown at 0
          if (prevCountdown === 0) {
            clearInterval(timer);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
  
      return () => clearInterval(timer);
    }
  }, [transactionSubmitted]);

  const withdrawCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.WLXS();
      await tx.wait();
      setSubmitted(true);
      setTxHash(tx.hash);
      // Reset the countdown to 60 seconds after successful withdrawal
      setCountdown(9);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Withdraw Failed: ${decodedError?.args}`);
    }
  }

  const amountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!isNaN(Number(inputValue))) {
      setLXScoin(Number(inputValue));
      console.log(inputValue);
    } else {
      setLXScoin(0);
    }
  };


return (
<main style={{
      color:"Black",display: 'flex',flexDirection: 'column',
      justifyContent: 'left',
      minHeight: '100vh',
      backgroundImage: `url('https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/392e0b174958175.64abdca37a344.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',}}
      className="flex flex-col md:flex-row justify-center items-start" >
        
      {/* Connect Wallet section */}
      <div className="mb-4 md:mb-0">
        <button
          onClick={connectWallet}
          className="p-3 bg-slate-800 text-white rounded"
        >
          {walletKey !== "" ? walletKey : "Connect wallet"}
        </button>
       
      </div>
  
      {/* Mint Tokens section */}
      {isMetaMaskConnected && (
        <div className="md:ml-4 mb-4 md:mb-0 flex items-center">
          <input
            type="text"
            value={mintAmount}
            onChange={(e) => setMintAmount(parseInt(e.target.value))}
            className="border rounded-md p-2 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:border-transparent mr-2"
          />
          <button
            onClick={mintTokens}
            className="p-3 bg-slate-800 text-white rounded"
          >
            MintLXS
          </button>
        </div>
      )}
  
      {/* Stake section */}
      {isMetaMaskConnected && (
        <div className="md:ml-4 mb-4 md:mb-0 flex items-center">
          <input
            type="text"
            value={sLXS}
            onChange={(e) => setsLXS(parseInt(e.target.value))}
            className="border rounded-md p-2 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:border-transparent mr-2"
          />
          <button
            onClick={LXSstake}
            className="p-3 bg-slate-800 text-white rounded"
          >
            StakeLXS
          </button>
          {sLXS <= 0 && (
            <p className="text-blue-400">Please enter a valid amount to stake.</p>
          )}
        </div>
      )}

      {/* WithdrawLXS section */}
      <div className="md:ml-auto">
        <p className="text-blue-400">{countdown} seconds to WithdrawLXS *Counts Intensely*</p>
        <button
          className="p-3 bg-slate-800 text-white rounded"
          onClick={withdrawCoin}
          disabled={countdown > 0} // Disable the button when countdown is active
        >
          WithdrawLXS
        </button>
      </div>
      <div className="info-box" style={{ color: 'lightblue', }}>
      <h2>Add LXS Coin to your wallet</h2>
      <p>Wallet Address: <span>0xa60db66c824b3DD8996125d0E116a0a0FFe62d01</span></p>
      </div>
    </main>
  );
}