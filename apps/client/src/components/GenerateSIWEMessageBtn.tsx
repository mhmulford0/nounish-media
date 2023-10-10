import { useEffect, useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useSignMessage } from "wagmi";
import { fetcher } from "../utils";

type Props = {
  setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
  setWalletMessage: React.Dispatch<
    React.SetStateAction<{
      message: null | SiweMessage;
      signature: string;
    }>
  >;
};

export default function GenerateMessageBtn({
  setIsVerified,
  setWalletMessage,
}: Props) {
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
        className="btn btn-accent w-96"
        onClick={async () => {
          if (!address) return;
          const res = await fetcher({ route: "/nonce" });
          const nonce = await res.text();

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

          setIsVerified(true);
          setWalletMessage({ message, signature });
        }}
      >
        Verify
      </button>
    </>
  );
}
