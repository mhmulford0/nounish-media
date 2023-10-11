import { useEffect, useState } from "react";
import { AlertInfo } from "../types";

export default function Alert({ type, message, fileURI }: AlertInfo) {
  const [isVisible, setisVisible] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setisVisible(false);
    }, 8000);

    return () => clearTimeout(timeout);
  }, [type, message, fileURI]);

  if (isVisible) {
    switch (type) {
      case "error": {
        return (
          <div className="alert alert-error fixed bottom-12 left-8 w-fit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{message}</span>
          </div>
        );
      }

      case "success": {
        return (
          <div className="alert alert-success fixed bottom-12 left-8 w-fit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <section>
              {fileURI && (
                <>
                  Upload Sucessful, view it{" "}
                  <a
                    className="link link-neutral text-black no-underline hover:underline"
                    href={fileURI}
                  >
                    here
                  </a>
                </>
              )}
            </section>
          </div>
        );
      }
    }
  }
}
