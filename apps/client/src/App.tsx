import { ChangeEvent, FormEvent, useState } from "react";
import { Navbar } from "./components/Navbar";
import { MediaPreview } from "./components/MediaPreview";
import { fetcher } from "./utils";

function App() {
  const [fileURL, setFileURL] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

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
    if (!isVerified) return;

    const formData = new FormData(event.currentTarget);

    // add wallet to form data instead of json
    formData.append("wallet", "0xSTRING");

    try {
      const response = await fetcher({
        route: "/upload",
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.fileURI) {
        setFileURL(data.fileURI);
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
          <h1>Media Uploader</h1>

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
            />
            <p className="text-xs leading-5 text-gray-400">
              PNG, JPG, GIF or MP4 up to 5MB
            </p>

            <MediaPreview
              isVideo={isVideo}
              fileURL={fileURL}
              isVerified={isVerified}
              setIsVerified={setIsVerified}
            />
            {isVerified && (
              <button type="submit" className="btn btn-warning">
                Upload
              </button>
            )}
          </form>
        </section>
      </div>
    </>
  );
}

export default App;
