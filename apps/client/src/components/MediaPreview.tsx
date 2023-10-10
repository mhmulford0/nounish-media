type Props = {
  isVideo: boolean;
  fileURL: string;
};

export function MediaPreview({ fileURL, isVideo }: Props) {
  return (
    <section className="text-center">
      {fileURL && isVideo && (
        <>
          <h2>Media Preview</h2>
          <video
            className="w-96 mx-auto mt-8 rounded-md shadow-xl max-h-[480px]"
            controls
          >
            <source src={fileURL} type="video/mp4" />
          </video>
        </>
      )}

      {fileURL && !isVideo && (
        <>
          <h2>Media Preview</h2>
          <img
            src={fileURL}
            className="w-96 mx-auto mt-8 rounded-md shadow-xl"
            alt=""
          />
        </>
      )}
    </section>
  );
}
