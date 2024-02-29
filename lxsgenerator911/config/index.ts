import { Contract, ContractRunner } from "ethers";
import abi from "./abi.json";

export function getContract(signer: ContractRunner) {
    return new Contract(
        "0x4850396ea9037b25ae1eA3934C7F6C8Ca3C0d8ca",
        abi as any,
        signer
    );
}