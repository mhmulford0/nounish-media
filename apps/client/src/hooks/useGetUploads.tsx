import { useSuspenseQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { fetcher } from "../utils";

type Upload = {
  id: string;
  uri: string;
  date: string;
};

export default function useGetUploads() {
  const { address } = useAccount();

  async function fetchUploads(): Promise<Upload[]> {
    const res = await fetcher({
      route: "/uploads",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wallet: address }),
    });

    return res.json();
  }

  const { data, isLoading, isError } = useSuspenseQuery({
    queryKey: ["uploads"],
    queryFn: fetchUploads,
  });

  return { uploads: data, isLoading, isError };
}
