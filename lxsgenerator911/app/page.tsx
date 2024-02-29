"use client"
import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import { getContract } from "@/config";
import { BrowserProvider } from "ethers";

export default function Home() {
  const [walletKey, setWalletKey] = useState("");
  const [currentData, setCurrentData] = useState("");
  const [mintAmount, setMintAmount] = useState(0); // State to store the number of tokens to mint

  const connectWallet = async () => {
    const { ethereum } = window as any;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setWalletKey(accounts[0]);
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

  const getData = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.data();
      setCurrentData(tx);
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
    if (!ethereum) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      // Convert mintAmount to BigNumber or any appropriate type according to your contract's requirements
      await setData(`Minting ${mintAmount} tokens`); 
      alert(`${mintAmount} tokens minted successfully!`);
    } catch (error) {
      console.error("Error minting tokens:", error);
      alert("Failed to mint tokens.");
    }
  };

  return (
    <main className="">
      <button
        onClick={() => {
          connectWallet();
        }}
        className="p-3 bg-slate-800 text-white rounded"
      >
        {walletKey !== "" ? walletKey : "Connect wallet"}
      </button>

      <input
        type="number"
        value={mintAmount}
        onChange={(e) => setMintAmount(parseInt(e.target.value))}
        className="p-3 bg-slate-800 text-white rounded"
      />

      <button
        onClick={() => {
          mintTokens();
        }}
        className="p-3 bg-slate-800 text-white rounded"
      >
        Mint Tokens
      </button>

      <div>{currentData}</div>
    </main>
  );
}