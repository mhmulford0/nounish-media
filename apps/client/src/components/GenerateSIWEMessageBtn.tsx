import { useEffect, useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useSignMessage } from "wagmi";

export default function GenerateMessageBtn() {
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const [domain, setDomain] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setDomain(window.location.host);
    setOrigin(window.location.origin);
  }, []);

  return (
    <>
      <button
        className="btn btn-accent"
        type="submit"
        onClick={async () => {
          if (!address) return;
          const res = await fetch(`http://localhost:3001/nonce`);
          const nonce = await res.text();
          try {
            const message = new SiweMessage({
              domain,
              address,
              statement: "Sign in with Ethereum to the app.",
              uri: origin,
              version: "1",
              chainId: 1,
              nonce: nonce,
            });
            const signature = await signMessageAsync({
              message: message.prepareMessage(),
            });

            console.log(message, signature);

            const res = await fetch("http://localhost:3001/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ message, signature }),
            });

            if (!res.ok) {
              console.log("failed");
            }
          } catch (e: unknown) {
            console.log(e);
          }
        }}
      >
        Upload
      </button>
    </>
  );
}
