import { Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import UploadList from "../components/UploadList";

export default function UploadsPage() {
  const { address } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (!address) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1 className="pt-12">My Uploads</h1>

      <Suspense fallback={<Loading />}>
        <UploadList />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
