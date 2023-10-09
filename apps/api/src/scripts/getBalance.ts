import { arweave } from "../core.js";

const atomicBalance = await arweave.getLoadedBalance();
console.log(`Node balance (atomic units) = ${atomicBalance}`);

// Convert balance to standard
const convertedBalance = arweave.utils.fromAtomic(atomicBalance);
console.log(`Node balance (converted) = ${convertedBalance}`);
