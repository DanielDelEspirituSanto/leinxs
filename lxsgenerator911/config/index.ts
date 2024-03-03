import { Contract, ContractRunner } from "ethers";
import abi from "./abi.json";

export function getContract(signer: ContractRunner) {
    return new Contract(
        "0x9817c7685c30A57fE449519eCc8F3EE0e7638da5",
        abi as any,
        signer
    );
}