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
  const [countdown, setCountdown] = useState(60);
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
  
  const getWithdrawAmount = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const withdrawAmount = await contract.getWithdraw(signer);

      setWithdrawLXS(withdrawAmount);
    } catch (e: any) {
      console.log("Error data:", e.data);
      if (e.data) {
        const decodedError = contract.interface.parseError(e.data);
        console.log(`Fetching stake failed: ${decodedError?.args}`);
      } else {
        console.log("An unknown error occurred.");
      }
    }
  };

  const withdrawCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.withdraw();
      await tx.wait();
      setSubmitted(true);
      setTxHash(tx.hash);
      // Reset the countdown to 60 seconds after successful withdrawal
      setCountdown(60);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Minting failed: ${decodedError?.args}`);
    }
  }

  const getElapsedStakeTime = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const elapsedStakeTime = await contract.getElapsedStakeTime(signer);

      setESS(elapsedStakeTime);
    } catch (e: any) {
      console.log("Error data:", e.data);
      if (e.data) {
        const decodedError = contract.interface.parseError(e.data);
        console.log(`Fetching stake failed: ${decodedError?.args}`);
      } else {
        console.log("An unknown error occurred.");
      }
    }
  };

  const addTokenToMetaMask = async () => {
    const { ethereum } = window as any;
    const tokenAddress = "0x66f189Bf75034ca691f9d8e93e0741585cd7923a";
    const tokenSymbol = "LXS";
    const tokenDecimals = 18;

    try {
      const wasAdded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
          },
        },
      });
      if (wasAdded) {
        alert("Token added to MetaMask successfully!");
      } else {
        alert("Failed to add token to MetaMask.");
      }
    } catch (error) {
      console.error("Error adding token to MetaMask:", error);
      alert("Failed to add token to MetaMask.");
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

  const setData = async (data: any) => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.setData(data);
      await tx.wait();
    } catch (e: any) {
      handleTransactionError(e, contract); 
    }
  };

  const handleTransactionError = (e: any, contract: any) => {
    if (e.data) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Transaction failed: ${decodedError?.args}`);
    } else {
      alert("Transaction failed: Unknown error");
    }
  };

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
  
  const getStake = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const stakedInEth = await contract.getStake(signer);
      setLXScoin(stakedInEth);
    } catch (e: any) {
      console.log("Error data:", e.data);
      if (e.data) {
        const decodedError = contract.interface.parseError(e.data);
        console.log(`Fetching stake failed: ${decodedError?.args}`);
      } else {
        console.log("An unknown error occurred.");
      }
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
      setTransactionSubmitted(true); // Set transactionSubmitted to true after successful stake transaction
      setTxHash(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Staking failed: ${decodedError?.args}`);
    }
  };

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
      color:"Black",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
      justifyContent: 'left',
      minHeight: '100vh',
      backgroundImage: `url('https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/392e0b174958175.64abdca37a344.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',}}
      className="flex flex-col md:flex-row justify-center items-start" >
        
      {/* Connect Wallet button */}
      <div className="mb-4 md:mb-0">
        <button
          onClick={connectWallet}
          className="p-3 bg-slate-800 text-white rounded"
        >
          {walletKey !== "" ? walletKey : "Connect wallet"}
        </button>
      </div>

      {/* Add LXS Coin to your Wallet button */}
      <div className="mb-4 md:ml-4">
        <div>{currentData}</div>
        <div className="minting-container flex items-center">
          <button
            onClick={addTokenToMetaMask}
            className="p-3 bg-slate-800 text-white rounded"
          >
            Add LXS Coin to your Wallet
          </button>
        </div>
      </div>
  
      {/* Mint Tokens section */}
      {isMetaMaskConnected && (
        <div className="md:ml-4 mb-4 md:mb-0 flex items-center">
          <input
            type="number"
            value={mintAmount}
            onChange={(e) => setMintAmount(parseInt(e.target.value))}
            className="border rounded-md p-2 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:border-transparent mr-2"
          />
          <button
            onClick={mintTokens}
            className="p-3 bg-slate-800 text-white rounded"
          >
            Mint Tokens
          </button>
        </div>
      )}
  
      {/* STAKE section */}
      {isMetaMaskConnected && (
        <div className="md:ml-4 mb-4 md:mb-0 flex items-center">
          <input
            type="number"
            value={sLXS}
            onChange={(e) => setsLXS(parseInt(e.target.value))}
            className="border rounded-md p-2 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:border-transparent mr-2"
          />
          <button
            onClick={LXSstake}
            className="p-3 bg-slate-800 text-white rounded"
          >
            STAKE
          </button>
          {sLXS <= 0 && (
            <p className="text-blue-400">Please enter a valid amount to stake.</p>
          )}
        </div>
      )}

      {/* WithdrawLXS button */}
      <div className="md:ml-auto">
        <p className="text-blue-400">{countdown} seconds to WithdrawLXS *Counts Intensely*</p>
        <button
          className="p-3 bg-slate-800 text-white rounded"
          onClick={withdrawCoin}
        >
          WithdrawLXS
        </button>
      </div>
    </main>
  );
}