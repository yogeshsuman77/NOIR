import ImageKit from "imagekit-javascript";
import api from "./axios";

/**
 * Uploads image/video file to ImageKit
 * @param {File} file - image or video file
 * @returns {Promise<string>} - public URL of uploaded file
 */
export const uploadToImageKit = async (file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  // Geting auth params from backend
  const authRes = await api.get("/uploads/auth");

  const { token, expire, signature } = authRes.data;

  // Initializing ImageKit SDK
  const imagekit = new ImageKit({
    publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
    authenticationEndpoint: "",
  });

  // Uploading file directly to ImageKit
  const uploadResponse = await imagekit.upload({
    file,
    fileName: `${Date.now()}-${file.name}`,
    token,
    expire,
    signature,
  });

  // Return public URL
  return uploadResponse.url;
};
