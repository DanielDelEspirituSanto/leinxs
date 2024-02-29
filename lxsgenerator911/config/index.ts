import { Contract, ContractRunner } from "ethers";
import abi from "./abi.json";

export function getContract(signer: ContractRunner) {
    return new Contract(
        "0x66f189Bf75034ca691f9d8e93e0741585cd7923a",
        abi as any,
        signer
    );
}