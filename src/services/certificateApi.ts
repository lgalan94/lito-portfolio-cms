import api from "./api";
import type { Certificate } from "../types";

// Get all certificates
export const getAllCertificates = async (): Promise<Certificate[]> => {
  const res = await api.get("/certificates");
  return res.data;
};

// Add new certificate
export const createCertificate = async (
  certificateData: FormData
): Promise<Certificate> => {
  const res = await api.post(
    "/certificates/create",
    certificateData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

// Delete certificate
export const deleteCertificate = async (
  id: string
): Promise<void> => {
  await api.delete(`/certificates/${id}`);
};

// Update certificate
export const updateCertificate = async (
  id: string,
  certificateData: FormData
): Promise<Certificate> => {
  const res = await api.put(
    `/certificates/${id}`,
    certificateData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

// Get single certificate
export const getCertificateById = async (
  id: string
): Promise<Certificate> => {
  const res = await api.get(`/certificates/${id}`);
  return res.data.certificate;
};