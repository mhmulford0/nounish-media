import toast from "react-hot-toast";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { MediaPreview } from "../components/MediaPreview";
import { fetcher } from "../utils";
import { useAccount } from "wagmi";
import GenerateMessageBtn from "../components/GenerateSIWEMessageBtn";
import { type SiweMessage } from "siwe";

export default function HomePage() {
  const [fileURL, setFileURL] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [walletMessage, setWalletMessage] = useState<{
    message: null | SiweMessage;
    signature: string;
  }>({
    message: null,
    signature: "",
  });

  const { address } = useAccount();

  const handleChange = ({
    target: { files },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!files) return;
    const file = files[0];
    const objectURL = URL.createObjectURL(file);
    const isVideoFile = file.type.startsWith("video");
    setIsVideo(isVideoFile);
    setFileURL(objectURL);
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !isVerified ||
      !address ||
      !walletMessage.message ||
      !fileInputRef.current
    )
      return;

    const formData = new FormData(event.currentTarget);

    formData.append("message", JSON.stringify(walletMessage.message));
    formData.append("signature", walletMessage.signature);

    try {
      const response = await fetcher({
        route: "/upload",
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      console.log(data.error);

      if (!response.ok) {
        toast.error("Could not upload file");
      }

      if (data.fileURI) {
        toast.success("file uploaded, view it here");
      }

      setFileURL("");
      fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <h1 className="pt-12">Media Uploader</h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="flex flex-wrap flex-col w-fit sm:w-96"
      >
        <input
          onChange={handleChange}
          type="file"
          name="prop-media"
          className="file-input file-input-bordered file-input-info w-full mb-1"
          ref={fileInputRef}
        />
        <p className="text-xs leading-5 text-gray-400">
          PNG, JPG, GIF or MP4 up to 5MB
        </p>

        <MediaPreview isVideo={isVideo} fileURL={fileURL} />
        {isVerified && (
          <button type="submit" className="btn btn-primary">
            Upload
          </button>
        )}
      </form>
      {fileURL && !isVerified && (
        <GenerateMessageBtn
          setIsVerified={setIsVerified}
          setWalletMessage={setWalletMessage}
        />
      )}

      {fileURL && (
        <button
          onClick={() => {
            if (!fileInputRef.current) return;
            setFileURL("");
            fileInputRef.current.value = "";
          }}
          className="btn btn-error w-96 mt-4"
        >
          Clear
        </button>
      )}
    </>
  );
}
