import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Navbar() {
  const { address } = useAccount();
  return (
    <div className="navbar bg-neutral text-neutral-content">
      <div className="navbar-start">
        <Link to="/">
          <span className="normal-case text-xl px-2 no-underline hover:underline">
            Nounish Media
          </span>
        </Link>
      </div>
      <div className="navbar-end">
        <div className="flex gap-x-3 items-center">
          {address && (
            <Link to="/uploads">
              <span>Uploads</span>
            </Link>
          )}
          <ConnectButton
            label="Sign in"
            chainStatus="name"
            showBalance={false}
            accountStatus="address"
          />
        </div>
      </div>
    </div>
  );
}
