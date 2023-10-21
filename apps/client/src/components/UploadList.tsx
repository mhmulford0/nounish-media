import useGetUploads from "../hooks/useGetUploads";

export default function UploadList() {
  const { uploads, isLoading } = useGetUploads();

  console.log(uploads, isLoading);

  const images = uploads.filter((item) => item.mime_type.startsWith("image"));
  const videos = uploads.filter((item) => item.mime_type.startsWith("video"));

  return (
    <div className="text-white flex gap-8 flex-wrap">
      <h3 className="block w-full">Images</h3>
      {images.map((item) => (
        <div className="w-64 shadow-lg ">
          <div className="overflow-hidden rounded-t-lg">
            <img
              className="rounded-t-lg not-prose object-cover transition-transform duration-350 ease-in-out transform hover:scale-105 "
              src={`https://gateway.irys.xyz/${item.uri}`}
            />
          </div>
          <div className="flex flex-col gap-y-1 p-3 rounded-b-lg bg-base-200">
            <span>Uploaded On: {item.date}</span>
            <a href={`https://gateway.irys.xyz/${item.uri}`}>file</a>
          </div>
        </div>
      ))}

      <h3 className="block w-full">Videos</h3>
      {videos.map((item) => (
        <video className="w-96 mx-auto mt-8 rounded-md shadow-xl" controls>
          <source
            src={`https://gateway.irys.xyz/${item.uri}`}
            type="video/mp4"
          />
        </video>
      ))}
    </div>
  );
}
