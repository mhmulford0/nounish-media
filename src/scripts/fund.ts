import { arweave } from "../core.js";

try {
    const fundTx = await arweave.fund(arweave.utils.toAtomic(0.01));
    console.log(
        `Successfully funded ${arweave.utils.fromAtomic(fundTx.quantity)} ${arweave.token}`
    );
} catch (e) {
    console.log("Error funding node ", e);
}
