# API Routes Documentation

## `GET /`

-   **Description:** A route to check if the server is running.
-   **Input:** None
-   **Output:** A JSON message indicating the server is running.

```json
{
    "message": "running"
}
```

## `GET /nonce`

-   **Description:** Generates a nonce for SIWE (Sign In With Ethereum) authentication.
-   **Input:** None
-   **Output:** A nonce string.

## `POST /upload`

-   **Description:** Uploads a media file to the server and Arweave network.
-   **Input:** A multipart/form-data POST request containing the media file, a signed SIWE message, and the signature.
-   **File Constraints**
    -   **_File Size: Up to 5MB_**
        Accepted File Types: `jpg, png, gif, mp4.`
-   **Output** Success: A JSON object containing a success message and a URI to the uploaded file.
