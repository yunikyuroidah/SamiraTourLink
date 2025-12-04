import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useProfilTravelContent, type ProfilTravelContent } from "../hooks/useProfilTravelContent";
import { base64ByteLength, buildDataUrl, extractMimeTypeFromDataUrl, stripDataUrlPrefix } from "../utils/base64";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB
const FIRESTORE_DOC_LIMIT_BYTES = 1024 * 1024; // Firestore document hard limit (~1MB)
const FIRESTORE_BUFFER_BYTES = 100 * 1024; // sisakan ruang untuk field lain
const MAX_BASE64_BYTES = FIRESTORE_DOC_LIMIT_BYTES - FIRESTORE_BUFFER_BYTES;

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsDataURL(file);
  });

const AdminProfileTravel: React.FC = () => {
  const { content, loading, error, updateContent } = useProfilTravelContent();
  const [formData, setFormData] = useState<ProfilTravelContent>({});
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const hasContent = Object.values(content ?? {}).some((value) => Boolean(value));

  useEffect(() => {
    if (!isEditing) {
      setFormData(content ? { ...content } : {});
    }
  }, [content, isEditing]);

  const handleInputChange = (field: keyof ProfilTravelContent) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleImageChange = async (file: File) => {
    if (file.size > MAX_IMAGE_SIZE) {
      setStatusMessage("Ukuran gambar melebihi 1MB. Kompres gambar terlebih dahulu.");
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const base64 = stripDataUrlPrefix(dataUrl);
      const estimatedBytes = base64ByteLength(base64);
      if (estimatedBytes > MAX_BASE64_BYTES) {
        setStatusMessage("Ukuran gambar setelah dikonversi melebihi batas 1MB Firestore. Kompres gambar hingga <900KB sebelum mengunggah.");
        return;
      }
      const detectedMime = extractMimeTypeFromDataUrl(dataUrl) || file.type || undefined;
      setFormData((prev) => ({ ...prev, gambar: base64, gambarMimeType: detectedMime }));
      setStatusMessage(null);
    } catch (err) {
      console.error("Gagal mengonversi gambar:", err);
      setStatusMessage("Gagal memproses gambar. Coba file lain.");
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setFormData(content ? { ...content } : {});
    setStatusMessage(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(content ? { ...content } : {});
    setStatusMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const payload: ProfilTravelContent = {
      alamat: formData.alamat ?? "",
      email: formData.email ?? "",
      gambar: formData.gambar ?? "",
      ...(formData.gambarMimeType ? { gambarMimeType: formData.gambarMimeType } : {}),
    };

    const result = await updateContent(payload);
    if (result.success) {
      setStatusMessage("Data profil berhasil diperbarui.");
      setIsEditing(false);
    } else {
      setStatusMessage(result.message ?? "Gagal menyimpan data profil. Coba lagi beberapa saat.");
    }
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
          <span className="text-slate-600">Memuat data profil travel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 animate-slide-down">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Manajemen Profil Travel</h1>
            <p className="text-slate-600">Kelola informasi profil perusahaan travel</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary-500 to-skyblue-500 p-3 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">{hasContent ? 1 : 0}</div>
              <div className="text-sm text-slate-500">Total Profil</div>
            </div>
          </div>
        </div>
  <p className="text-sm text-slate-500 mt-3">Batas ukuran gambar maksimal 1MB. Kompres berkas sebelum diunggah bila diperlukan.</p>
      </div>

      {statusMessage && (
        <div className="mb-6 p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
          {statusMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-100 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Alamat</label>
                <input
                  type="text"
                  value={formData.alamat ?? ""}
                  onChange={handleInputChange("alamat")}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  placeholder="Alamat perusahaan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email ?? ""}
                  onChange={handleInputChange("email")}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  placeholder="Email perusahaan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Gambar Profil (maks. 1MB)</label>
                <div className="space-y-3">
                  {formData.gambar ? (
                    <img
                      src={buildDataUrl(formData.gambar, formData.gambarMimeType)}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-xl border border-slate-200"
                    />
                  ) : (
                    <div className="w-full h-40 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
                      Belum ada gambar
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      if (file) {
                        void handleImageChange(file);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-60"
                >
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-all duration-200"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-white/60 bg-slate-200">
                {content?.gambar ? (
                  <img
                    src={buildDataUrl(content.gambar, content.gambarMimeType)}
                    alt="Profil Travel"
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="h-40 flex items-center justify-center text-slate-500 text-sm">Belum ada gambar</div>
                )}
              </div>
              <div className="rounded-xl overflow-hidden border border-white/60 bg-slate-50 p-4 text-center space-y-2">
                <h3 className="text-xl font-bold text-slate-800">{content?.alamat ?? "Alamat belum diisi"}</h3>
                <p className="text-slate-600 text-sm break-words">{content?.email ?? "Email belum diisi"}</p>
              </div>
              <button
                onClick={handleStartEdit}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-primary-500 to-skyblue-500 text-white rounded-lg hover:from-primary-600 hover:to-skyblue-600 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Edit Profil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfileTravel;
