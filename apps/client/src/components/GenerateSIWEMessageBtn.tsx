import { useEffect, useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useSignMessage } from "wagmi";
import { fetcher } from "../utils";

type Props = {
  setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function GenerateMessageBtn({ setIsVerified }: Props) {
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
        onClick={async () => {
          if (!address) return;
          const res = await fetcher({ route: "/nonce" });
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

            const res = await fetcher({
              route: "/verify",
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ message, signature }),
            });

            if (!res.ok) {
              console.log("failed");
            }

            if (res.ok) {
              setIsVerified(true);
              console.log("ok");
            }
          } catch (e: unknown) {
            console.log(e);
          }
        }}
      >
        Verify
      </button>
    </>
  );
}
