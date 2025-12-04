import React, { useCallback, useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";

const AdminPackages: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const MAX_ITEMS = 10;
  const remainingSlots = Math.max(MAX_ITEMS - data.length, 0);
  const canAddMore = data.length < MAX_ITEMS;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "paket"));
      setData(querySnapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      setErrorMessage(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Gagal memuat data paket. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleEdit = (id: string, row: any) => {
    const { id: _ignored, ...rest } = row;
    setEditId(id);
    setEditData({
      ...rest,
      fasilitas: Array.isArray(rest.fasilitas) ? rest.fasilitas : [],
      features: Array.isArray(rest.features) ? rest.features : [],
    });
    setFeedback(null);
    setErrorMessage(null);
  };

  const handleAddNew = () => {
    if (!canAddMore) {
      setErrorMessage("Batas maksimal 10 paket telah tercapai.");
      setFeedback(null);
      return;
    }

    setEditId("__new__");
    setEditData({
      nama_paket: "",
      deskripsi: "",
      fasilitas: [""],
      features: [""],
    });
    setFeedback(null);
    setErrorMessage(null);
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const source = Array.isArray(editData[field]) ? [...editData[field]] : [];
    source[index] = value;
    setEditData({ ...editData, [field]: source });
  };

  const handleAddArrayItem = (field: string) => {
    const source = Array.isArray(editData[field]) ? [...editData[field]] : [];
    source.push("");
    setEditData({ ...editData, [field]: source });
  };

  const handleRemoveArrayItem = (field: string, index: number) => {
    const source = Array.isArray(editData[field]) ? [...editData[field]] : [];
    source.splice(index, 1);
    setEditData({ ...editData, [field]: source });
  };

  const handleSave = async () => {
    if (!editId) return;

    const nama = (editData.nama_paket ?? "").trim();
    const deskripsi = (editData.deskripsi ?? "").trim();
    const fasilitas = Array.isArray(editData.fasilitas)
      ? editData.fasilitas.map((value: string) => value.trim()).filter(Boolean)
      : [];
    const features = Array.isArray(editData.features)
      ? editData.features.map((value: string) => value.trim()).filter(Boolean)
      : [];

    if (!nama || !deskripsi) {
      setErrorMessage("Nama paket dan deskripsi wajib diisi.");
      return;
    }

    if (editId === "__new__" && !canAddMore) {
      setErrorMessage("Batas maksimal 10 paket telah tercapai.");
      return;
    }

    setActionInProgress(true);
    setErrorMessage(null);

    const payload = {
      nama_paket: nama,
      deskripsi,
      fasilitas,
      features,
    };

    try {
      if (editId === "__new__") {
        await addDoc(collection(db, "paket"), payload);
        setFeedback("Paket baru berhasil ditambahkan.");
      } else {
        await updateDoc(doc(db, "paket", editId), payload);
        setFeedback("Paket berhasil diperbarui.");
      }
      setEditId(null);
      setEditData({});
      await fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
      setErrorMessage("Gagal menyimpan data paket. Coba lagi nanti.");
    } finally {
      setActionInProgress(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus paket ini?")) {
      return;
    }

    setDeletingId(id);
    setFeedback(null);
    setErrorMessage(null);

    try {
      await deleteDoc(doc(db, "paket", id));
      if (editId === id) {
        setEditId(null);
        setEditData({});
      }
      setFeedback("Paket berhasil dihapus.");
      await fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
      setErrorMessage("Gagal menghapus data paket. Coba lagi nanti.");
    } finally {
      setDeletingId(null);
    }
  };

  const renderEditCells = (isNew: boolean) => (
    <>
      <td className="px-6 py-4">
        <input
          type="text"
          value={editData.nama_paket || ""}
          onChange={(event) => setEditData({ ...editData, nama_paket: event.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
          placeholder="Nama Paket"
        />
      </td>
      <td className="px-6 py-4">
        <textarea
          value={editData.deskripsi || ""}
          onChange={(event) => setEditData({ ...editData, deskripsi: event.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-none"
          rows={3}
          placeholder="Deskripsi"
        />
      </td>
      <td className="px-6 py-4">
        <div className="space-y-3">
          {(editData.fasilitas || []).map((f: string, idx: number) => (
            <div key={`fasilitas-${idx}`} className="flex items-center space-x-2">
              <input
                type="text"
                value={f}
                onChange={(event) => handleArrayChange("fasilitas", idx, event.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                placeholder={`Fasilitas ${idx + 1}`}
              />
              <button
                type="button"
                onClick={() => handleRemoveArrayItem("fasilitas", idx)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 flex-shrink-0"
                title="Hapus fasilitas"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddArrayItem("fasilitas")}
            className="w-full px-3 py-2 border-2 border-dashed border-primary-300 text-primary-600 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Tambah Fasilitas</span>
          </button>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-3">
          {(editData.features || []).map((f: string, idx: number) => (
            <div key={`features-${idx}`} className="flex items-center space-x-2">
              <input
                type="text"
                value={f}
                onChange={(event) => handleArrayChange("features", idx, event.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                placeholder={`Feature ${idx + 1}`}
              />
              <button
                type="button"
                onClick={() => handleRemoveArrayItem("features", idx)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 flex-shrink-0"
                title="Hapus feature"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddArrayItem("features")}
            className="w-full px-3 py-2 border-2 border-dashed border-skyblue-300 text-skyblue-600 rounded-lg hover:border-skyblue-400 hover:bg-skyblue-50 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Tambah Feature</span>
          </button>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            disabled={actionInProgress}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-60"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {actionInProgress ? "Menyimpan..." : isNew ? "Tambah" : "Simpan"}
          </button>
          <button
            onClick={() => {
              setEditId(null);
              setEditData({});
              setFeedback(null);
              setErrorMessage(null);
            }}
            className="flex items-center px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Batal
          </button>
        </div>
      </td>
    </>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
          <span className="text-slate-600">Memuat data paket...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8 animate-slide-down">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Manajemen Paket Travel</h1>
            <p className="text-slate-600">Kelola paket perjalanan wisata dengan mudah</p>
            <p className="text-sm text-slate-500 mt-2">Sisa slot paket yang tersedia: {remainingSlots}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary-500 to-skyblue-500 p-3 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">{data.length}</div>
                <div className="text-sm text-slate-500">Total Paket</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddNew}
              disabled={!canAddMore || loading || actionInProgress}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-skyblue-500 text-white font-semibold hover:from-primary-600 hover:to-skyblue-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Paket
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {errorMessage}
        </div>
      )}

      {feedback && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
          {feedback}
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden animate-slide-up">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-primary-500 to-skyblue-500 text-white">
                <th className="px-6 py-4 text-left font-semibold">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>Nama Paket</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Deskripsi</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Fasilitas</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Features</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center font-semibold">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                    <span>Aksi</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {editId === "__new__" && (
                <tr className="hover:bg-slate-50/50 transition-all duration-200 animate-fade-in">
                  {renderEditCells(true)}
                </tr>
              )}
              {data.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-all duration-200 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  {editId === item.id ? (
                    renderEditCells(false)
                  ) : (
                    <>
                      {/* View Mode */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 text-lg">{item.nama_paket}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-600 text-sm leading-relaxed max-w-xs">{item.deskripsi}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {(item.fasilitas || []).map((f: string, idx: number) => (
                            <div key={idx} className="flex items-center text-sm text-slate-600">
                              <div className="w-2 h-2 bg-primary-400 rounded-full mr-2"></div>
                              {f}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {(item.features || []).map((f: string, idx: number) => (
                            <div key={idx} className="flex items-center text-sm text-slate-600">
                              <div className="w-2 h-2 bg-skyblue-400 rounded-full mr-2"></div>
                              {f}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(item.id, item)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-skyblue-500 text-white rounded-lg hover:from-primary-600 hover:to-skyblue-600 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 disabled:opacity-60"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {deletingId === item.id ? "Menghapus..." : "Hapus"}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPackages;