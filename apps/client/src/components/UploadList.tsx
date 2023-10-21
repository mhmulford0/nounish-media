import useGetUploads from "../hooks/useGetUploads";

export default function UploadList() {
  const { uploads, isLoading } = useGetUploads();

  console.log(uploads, isLoading);
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table text-xl">
          {/* head */}
          <thead>
            <tr>
              <th className="text-base">Link</th>
              <th className="text-base">Date Uploaded</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {uploads.map((item) => (
                <>
                  <td>
                    <a href={`https://gateway.irys.xyz/${item.uri}`}>file</a>
                  </td>
                  <td>{item.date}</td>
                </>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
