import { Contract, ContractRunner } from "ethers";
import abi from "./abi.json";

export function getContract(signer: ContractRunner) {
    return new Contract(
        "0xa60db66c824b3DD8996125d0E116a0a0FFe62d01",
        abi as any,
        signer
    );
}