import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import type { FirebaseError } from "firebase/app";
import { buildDataUrl, extractMimeTypeFromDataUrl, stripDataUrlPrefix } from "../utils/base64";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB

const AdminTourLeader: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tour_leader"));
        setData(
          querySnapshot.docs.map((docSnapshot) => {
            const raw = docSnapshot.data() as Record<string, unknown>;
            return {
              id: docSnapshot.id,
              ...raw,
              gambar: typeof raw.gambar === "string" ? raw.gambar : "",
              gambarMimeType:
                typeof raw.gambarMimeType === "string" && raw.gambarMimeType
                  ? (raw.gambarMimeType as string)
                  : undefined,
            };
          })
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (id: string, row: any) => {
    setEditId(id);
    setEditData({ ...row });
    setStatusMessage(null);
  };

  const handleSave = async () => {
    if (editId) {
      try {
        const payload: Record<string, unknown> = {
          nama: editData.nama ?? "",
          telepon: editData.telepon ?? "",
        };
        if (typeof editData.gambar === "string") {
          payload.gambar = editData.gambar;
        }
        if (typeof editData.gambarMimeType === "string" && editData.gambarMimeType) {
          payload.gambarMimeType = editData.gambarMimeType;
        }
        await updateDoc(doc(db, "tour_leader", editId), payload);
        handleCancel();
        // Refresh data
        const querySnapshot = await getDocs(collection(db, "tour_leader"));
        setData(
          querySnapshot.docs.map((docSnapshot) => {
            const raw = docSnapshot.data() as Record<string, unknown>;
            return {
              id: docSnapshot.id,
              ...raw,
              gambar: typeof raw.gambar === "string" ? raw.gambar : "",
              gambarMimeType:
                typeof raw.gambarMimeType === "string" && raw.gambarMimeType
                  ? (raw.gambarMimeType as string)
                  : undefined,
            };
          })
        );
        setStatusMessage("Data tour leader berhasil diperbarui.");
      } catch (error) {
        console.error("Error saving data:", error);
        const firebaseError = error as FirebaseError;
        if (firebaseError?.message && /too many bytes|larger than|maximum size/i.test(firebaseError.message)) {
          setStatusMessage("Ukuran data terlalu besar untuk Firestore (~1MB). Kompres gambar sebelum mengunggah.");
        } else {
          setStatusMessage("Gagal menyimpan data tour leader. Coba lagi beberapa saat.");
        }
      }
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setEditData({});
  };

  const handleImageChange = async (file: File) => {
    if (file.size > MAX_IMAGE_SIZE) {
      setStatusMessage("Ukuran gambar melebihi 1MB. Pilih file lain.");
      return;
    }
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Gagal membaca file"));
        reader.readAsDataURL(file);
      });
      const base64 = stripDataUrlPrefix(dataUrl);
      const detectedMime = extractMimeTypeFromDataUrl(dataUrl) || file.type || undefined;
      setEditData((prev: any) => ({ ...prev, gambar: base64, gambarMimeType: detectedMime }));
      setStatusMessage(null);
    } catch (error) {
      console.error("Error converting image:", error);
      setStatusMessage("Gagal memproses gambar.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
          <span className="text-slate-600">Memuat data tour leader...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8 animate-slide-down">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Manajemen Tour Leader</h1>
            <p className="text-slate-600">Kelola informasi pemandu wisata profesional</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary-500 to-skyblue-500 p-3 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">{data.length}</div>
              <div className="text-sm text-slate-500">Tour Leader</div>
            </div>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-6 p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
          {statusMessage}
        </div>
      )}

      {/* Cards Container */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
        {data.map((item, index) => (
          <div
            key={item.id}
            className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 animate-fade-in"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            {editId === item.id ? (
              <>
                {/* Edit Mode */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nama Tour Leader</label>
                    <input
                      type="text"
                      value={editData.nama || ""}
                      onChange={e => setEditData({ ...editData, nama: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nomor Telepon</label>
                    <input
                      type="text"
                      value={editData.telepon || ""}
                      onChange={e => setEditData({ ...editData, telepon: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      placeholder="Nomor telepon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Foto Tour Leader (maks. 1MB)</label>
                    <div className="space-y-3">
                      {editData.gambar ? (
                        <img
                          src={buildDataUrl(editData.gambar, editData.gambarMimeType)}
                          alt="Tour Leader"
                          className="w-full h-40 object-cover rounded-xl border border-slate-200"
                        />
                      ) : (
                        <div className="w-full h-40 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
                          Belum ada foto
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          event.target.value = "";
                          if (file) {
                            handleImageChange(file);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Simpan
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Batal
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* View Mode */}
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden border border-white/60 bg-slate-200">
                    {item.gambar ? (
                      <img
                        src={buildDataUrl(item.gambar, item.gambarMimeType)}
                        alt={item.nama}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="h-40 flex items-center justify-center text-slate-500 text-sm">Belum ada foto</div>
                    )}
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-slate-800">{item.nama}</h3>
                    <div className="flex items-center justify-center space-x-2 text-primary-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm font-medium">{item.telepon}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(item.id, item)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-primary-500 to-skyblue-500 text-white rounded-lg hover:from-primary-600 hover:to-skyblue-600 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Data
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTourLeader;
