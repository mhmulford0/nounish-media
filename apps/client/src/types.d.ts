export type AlertInfo = {
  type: "error" | "success" | null;
  message: string | null;
  fileURI?: string | null;
};
