import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

export default function UploadsPage() {
  const { address } = useAccount();
  const navigate = useNavigate();

  if (!address) {
    return navigate("/");
  }
  return (
    <>
      <h1 className="pt-12">My Uploads</h1>
    </>
  );
}
