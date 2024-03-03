import { Contract, ContractRunner } from "ethers";
import abi from "./abi.json";

export function getContract(signer: ContractRunner) {
    return new Contract(
        "0xA3a6F0025b0007657Ab5d63F9B6bA3c5d7882DC4",
        abi as any,
        signer
    );
}