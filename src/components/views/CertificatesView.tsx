import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import Card from '../ui/Card';
import { getAllCertificates, createCertificate, deleteCertificate, updateCertificate } from '../../services/certificateApi';
import type { Certificate } from '../../types';

const MAX_FILE_SIZE_MB = 5;

const CertificatesView: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [modalType, setModalType] = useState<"add" | "edit" | null>(null);

  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<Certificate | null>(null);

  const [form, setForm] = useState({
    title: "",
    issuer: "",
    issueDate: "",
    description: "",
    credentialUrl: "",
    image: null as File | null,
    imagePreview: "",
  });

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const data = await getAllCertificates();

        if (!Array.isArray(data)) {
          throw new Error("Invalid certificate data");
        }

        setCertificates(data);
      } catch (error) {
        console.error("❌ Error fetching certificates:", error);
        toast.error("Failed to load certificates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);

      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        toast.error(
          `❌ File too large! Max size is ${MAX_FILE_SIZE_MB}MB.`
        );
        e.target.value = "";
        return;
      }

      const preview = URL.createObjectURL(file);

      setForm((prev) => ({
        ...prev,
        image: file,
        imagePreview: preview,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        image: null,
        imagePreview: "",
      }));
    }
  };

  const openModal = (
  type: "add" | "edit",
  certificate?: Certificate
) => {
  if (type === "edit" && certificate) {
    setSelectedCertificate(certificate);

    setForm({
      title: certificate.title || "",
      issuer: certificate.issuer || "",
      issueDate: certificate.issueDate
        ? certificate.issueDate.substring(0, 10)
        : "",
      description: certificate.description || "",
      credentialUrl: certificate.credentialUrl || "",
      image: null,
      imagePreview: certificate.imageUrl || "",
    });
  } else {
    setSelectedCertificate(null);

    setForm({
      title: "",
      issuer: "",
      issueDate: "",
      description: "",
      credentialUrl: "",
      image: null,
      imagePreview: "",
    });
  }

  setModalType(type);
};

  const isChanged = useMemo(() => {
    if (!selectedCertificate || modalType !== "edit")
      return true;

    return (
      form.title !== selectedCertificate.title ||
      form.issuer !== selectedCertificate.issuer ||
      form.issueDate.substring(0, 10) !==
        selectedCertificate.issueDate.substring(0, 10) ||
      form.description !==
        selectedCertificate.description ||
      form.credentialUrl !==
        (selectedCertificate.credentialUrl || "") ||
      !!form.image
    );
  }, [form, selectedCertificate, modalType]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (
    !form.title ||
    !form.issuer ||
    !form.issueDate ||
    !form.description
  ) {
    toast.warning("⚠️ Please fill all required fields.");
    return;
  }

  const formData = new FormData();

  formData.append("title", form.title);
  formData.append("issuer", form.issuer);
  formData.append("issueDate", form.issueDate);
  formData.append("description", form.description);
  formData.append("credentialUrl", form.credentialUrl);

  if (form.image) {
    formData.append("image", form.image);
  }

  setIsSubmitting(true);

  try {
    if (modalType === "add") {
      const res = await createCertificate(formData);

      const newCertificate =
        (res as any).certificate || res;

      setCertificates((prev) => [
        newCertificate,
        ...prev,
      ]);

      toast.success(
        "✅ Certificate added successfully!"
      );
    } else if (
      modalType === "edit" &&
      selectedCertificate
    ) {
      await updateCertificate(
        selectedCertificate._id,
        formData
      );

      const updatedCertificates =
        await getAllCertificates();

      setCertificates(updatedCertificates);

      toast.success(
        "📝 Certificate updated successfully!"
      );
    }

    setModalType(null);

    setForm({
      title: "",
      issuer: "",
      issueDate: "",
      description: "",
      credentialUrl: "",
      image: null,
      imagePreview: "",
    });
  } catch (err: any) {
    console.error(
      "❌ Submit Certificate Error:",
      err
    );

    toast.error(
      err?.response?.data?.message ||
        "Failed to save certificate."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  const handleDelete = async () => {
  if (!deleteTarget) return;

  setIsDeleting(true);

  try {
    await deleteCertificate(deleteTarget._id);

    setCertificates((prev) =>
      prev.filter(
        (certificate) =>
          certificate._id !== deleteTarget._id
      )
    );

    toast.success(
      "🗑️ Certificate deleted successfully!"
    );
  } catch (err: any) {
    console.error(
      "❌ Delete Certificate Error:",
      err
    );

    toast.error(
      err?.response?.data?.message ||
        "Failed to delete certificate."
    );
  } finally {
    setDeleteTarget(null);
    setIsDeleting(false);
  }
};

  return (
    <motion.div className="ml-0 lg:ml-66" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="w-full h-full mt-16 space-y-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            Certificates
          </h2>

          <Button
            onClick={() => openModal("add")}
            className="flex items-center gap-2 overflow-hidden border border-slate-700 shadow-md hover:scale-103"
          >
            <PlusCircle className="w-5 h-5" />
            Add Certificate
          </Button>
        </div>

        {/* Certificates Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            <p className="text-slate-400">
              Loading certificates...
            </p>
          ) : certificates.length === 0 ? (
            <p className="text-slate-400">
              No certificates found.
            </p>
          ) : (
            certificates.map((certificate) => (
              <motion.div
                key={certificate._id}
                className="relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-md group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() =>
                      openModal("edit", certificate)
                    }
                    className="p-2 rounded-full bg-slate-700 hover:bg-blue-600 text-white"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() =>
                      setDeleteTarget(certificate)
                    }
                    className="p-2 rounded-full bg-slate-700 hover:bg-red-600 text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Certificate Image */}
                <img
                  src={certificate.imageUrl}
                  alt={certificate.title}
                  className="w-full h-48 object-cover"
                />

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {certificate.title}
                  </h3>

                  <p className="text-teal-400 text-sm font-semibold mb-1">
                    {certificate.issuer}
                  </p>

                  <p className="text-slate-500 text-xs mb-3">
                    Issued{" "}
                    {new Date(
                      certificate.issueDate
                    ).toLocaleDateString()}
                  </p>

                  <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                    {certificate.description}
                  </p>

                  {certificate.credentialUrl && (
                    <div className="flex justify-end text-blue-400 text-sm font-medium">
                      <a
                        href={certificate.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        View Credential
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalType && (
          <motion.div
            className="fixed inset-0 bg-black/50 bg-opacity-60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-lg border border-slate-700"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {modalType === "add"
                  ? "Add Certificate"
                  : "Edit Certificate"}
              </h3>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Title */}
                <input
                  name="title"
                  placeholder="Certificate Title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white p-2 rounded-md"
                  required
                />

                {/* Issuer */}
                <input
                  name="issuer"
                  placeholder="Issuer"
                  value={form.issuer}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white p-2 rounded-md"
                  required
                />

                {/* Issue Date */}
                <input
                  type="date"
                  name="issueDate"
                  value={form.issueDate}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white p-2 rounded-md"
                  required
                />

                {/* Description */}
                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white p-2 rounded-md"
                  rows={4}
                  required
                />

                {/* Credential URL */}
                <input
                  type="url"
                  name="credentialUrl"
                  placeholder="Credential URL"
                  value={form.credentialUrl}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white p-2 rounded-md"
                />

                {/* Image */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-white"
                />

                {form.imagePreview && (
                  <img
                    src={form.imagePreview}
                    alt="preview"
                    className="w-full h-40 object-cover rounded-md mt-2 border border-slate-700"
                  />
                )}

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      (modalType === "edit" && !isChanged)
                    }
                    className={`px-5 py-2 rounded-md text-white ${
                      isSubmitting ||
                      (modalType === "edit" &&
                        !isChanged)
                        ? "bg-slate-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : modalType === "add"
                      ? "Add"
                      : "Update"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      {/* Delete Confirmation */}
<AnimatePresence>
  {deleteTarget && (
    <motion.div
      className="fixed inset-0 bg-black/50 bg-opacity-60 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-sm border border-slate-700"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <h3 className="text-lg text-white font-semibold mb-3">
          Delete "{deleteTarget.title}"?
        </h3>

        <p className="text-slate-400 text-sm mb-5">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteTarget(null)}
            className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </motion.div>
  );
};

export default CertificatesView;
