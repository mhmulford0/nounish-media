import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Navbar } from "./components/Navbar";
import { MediaPreview } from "./components/MediaPreview";
import { fetcher } from "./utils";
import Alert from "./components/Alert";
import { useAccount } from "wagmi";
import { type AlertInfo } from "./types";
import GenerateMessageBtn from "./components/GenerateSIWEMessageBtn";

function App() {
  const [fileURL, setFileURL] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [alertInfo, setAlertInfo] = useState<AlertInfo>({
    type: null,
    message: null,
    fileURI: null,
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
    if (!isVerified || !address) return;

    const formData = new FormData(event.currentTarget);

    formData.append("address", address);

    try {
      const response = await fetcher({
        route: "/upload",
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setAlertInfo({ type: "error", message: "could not upload" });
      }
      const data = await response.json();

      if (data.fileURI) {
        setFileURL(data.fileURI);
        setAlertInfo({
          type: "success",
          message: "File uploaded success",
          fileURI: data.fileUri,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container py-8 px-4 w-full">
        <section className="flex items-center justify-center flex-col">
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
            <GenerateMessageBtn setIsVerified={setIsVerified} />
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
        </section>
      </div>

      <Alert
        message={alertInfo.message}
        type={alertInfo.type}
        fileURI={fileURL}
      />
    </>
  );
}

export default App;
