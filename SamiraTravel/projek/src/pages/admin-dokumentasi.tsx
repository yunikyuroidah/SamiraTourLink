import React, { useMemo, useState } from "react";
import { useDokumentasi, DokumentasiItem } from "../hooks/useDokumentasi";
import { buildDataUrl, extractMimeTypeFromDataUrl, stripDataUrlPrefix } from "../utils/base64";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB
const MAX_ITEMS = 10;

const AdminDokumentasi: React.FC = () => {
  const { items, loading, error, updateItem, createItem, deleteItem } = useDokumentasi();
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<DokumentasiItem | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [creatingSaving, setCreatingSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newItemData, setNewItemData] = useState<Omit<DokumentasiItem, "id">>({
    nama: "",
    deskripsi: "",
    gambar: "",
    gambarMimeType: undefined,
  });

  const remainingSlots = useMemo(() => Math.max(MAX_ITEMS - items.length, 0), [items.length]);
  const canAddMore = useMemo(() => items.length < MAX_ITEMS, [items.length]);

  const resetNewItem = () => {
    setNewItemData({ nama: "", deskripsi: "", gambar: "", gambarMimeType: undefined });
  };

  const processImageFile = async (file: File) => {
    if (file.size > MAX_IMAGE_SIZE) {
      setFeedback("Ukuran gambar melebihi 1MB. Silakan pilih file lain.");
      return null;
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
      return { base64, detectedMime };
    } catch (err) {
      console.error(err);
      setFeedback("Gagal membaca file gambar.");
      return null;
    }
  };

  const handleStartCreate = () => {
    if (!canAddMore) {
      setFeedback("Batas maksimal 10 dokumentasi telah tercapai.");
      return;
    }
    setIsCreating(true);
    setEditId(null);
    setEditData(null);
    resetNewItem();
    setFeedback(null);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    resetNewItem();
  };

  const handleStartEdit = (item: DokumentasiItem) => {
    setIsCreating(false);
    resetNewItem();
    setEditId(item.id);
    setEditData({ ...item });
    setFeedback(null);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditData(null);
  };

  const handleImageChange = async (file: File) => {
    if (!editData) return;
    const result = await processImageFile(file);
    if (!result) return;
    setEditData({ ...editData, gambar: result.base64, gambarMimeType: result.detectedMime });
    setFeedback(null);
  };

  const handleNewImageChange = async (file: File) => {
    const result = await processImageFile(file);
    if (!result) return;
    setNewItemData((prev) => ({ ...prev, gambar: result.base64, gambarMimeType: result.detectedMime }));
    setFeedback(null);
  };

  const handleSave = async () => {
    if (!editId || !editData) return;
    setSaving(true);
    const { nama, deskripsi, gambar, gambarMimeType } = editData;
    const result = await updateItem(editId, {
      nama,
      deskripsi,
      gambar,
      ...(gambarMimeType ? { gambarMimeType } : {}),
    });
    if (!result.success) {
      setFeedback(result.message ?? "Gagal menyimpan data dokumentasi.");
    } else {
      setFeedback("Dokumentasi berhasil diperbarui.");
      handleCancel();
    }
    setSaving(false);
  };

  const handleCreate = async () => {
    if (!isCreating) return;
    const nama = newItemData.nama.trim();
    const deskripsi = newItemData.deskripsi.trim();

    if (!nama || !deskripsi) {
      setFeedback("Nama dan deskripsi wajib diisi.");
      return;
    }

    if (!canAddMore) {
      setFeedback("Batas maksimal 10 dokumentasi telah tercapai.");
      return;
    }

    setFeedback(null);
    setCreatingSaving(true);

    const payload = {
      nama,
      deskripsi,
      gambar: newItemData.gambar,
      ...(newItemData.gambarMimeType ? { gambarMimeType: newItemData.gambarMimeType } : {}),
    };

    const result = await createItem(payload);
    if (!result.success) {
      setFeedback(result.message ?? "Gagal menambah dokumentasi.");
    } else {
      setFeedback("Dokumentasi berhasil ditambahkan.");
      handleCancelCreate();
    }
    setCreatingSaving(false);
  };

  const handleDeleteDokumentasi = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus dokumentasi ini?")) {
      return;
    }

    setFeedback(null);
    setDeletingId(id);
    const result = await deleteItem(id);
    if (!result.success) {
      setFeedback(result.message ?? "Gagal menghapus dokumentasi.");
    } else {
      setFeedback("Dokumentasi berhasil dihapus.");
      if (editId === id) {
        handleCancel();
      }
    }
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-3 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
          <span>Memuat data dokumentasi...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 animate-slide-down">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Manajemen Dokumentasi</h1>
            <p className="text-slate-600">Perbarui foto, nama, dan deskripsi dokumentasi.</p>
            <p className="text-sm text-slate-500 mt-2">Batas ukuran gambar: maksimal 1MB</p>
            <p className="text-sm text-slate-500 mt-1">Sisa slot dokumentasi yang tersedia: {remainingSlots}</p>
          </div>
          <div className="flex flex-col md:items-end gap-2">
            <button
              type="button"
              onClick={handleStartCreate}
              disabled={!canAddMore || loading || saving || creatingSaving}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-skyblue-500 text-white font-semibold hover:from-primary-600 hover:to-skyblue-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Dokumentasi
            </button>
            <p className="text-xs text-slate-500">Batas maksimal 10 dokumentasi</p>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="mb-6 p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
          {feedback}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-100 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 animate-slide-up">
        {isCreating && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 animate-fade-in">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama Dokumentasi</label>
                <input
                  type="text"
                  value={newItemData.nama}
                  onChange={(event) => setNewItemData((prev) => ({ ...prev, nama: event.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  placeholder="Judul dokumentasi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
                <textarea
                  value={newItemData.deskripsi}
                  onChange={(event) => setNewItemData((prev) => ({ ...prev, deskripsi: event.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-none"
                  placeholder="Deskripsi singkat"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Gambar (maks. 1MB)</label>
                <div className="space-y-3">
                  {newItemData.gambar ? (
                    <img
                      src={buildDataUrl(newItemData.gambar, newItemData.gambarMimeType)}
                      alt="Pratinjau"
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
                        void handleNewImageChange(file);
                      }
                    }}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={creatingSaving}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-60"
                >
                  {creatingSaving ? "Menambahkan..." : "Tambah"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelCreate}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-500 text-white hover:bg-slate-600 transition-all duration-200"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {items.map((item, index) => {
          const isEditing = editId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {isEditing && editData ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nama Dokumentasi</label>
                    <input
                      type="text"
                      value={editData.nama}
                      onChange={(event) => setEditData({ ...editData, nama: event.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      placeholder="Judul dokumentasi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
                    <textarea
                      value={editData.deskripsi}
                      onChange={(event) => setEditData({ ...editData, deskripsi: event.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-none"
                      placeholder="Deskripsi singkat"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Gambar (maks. 1MB)</label>
                    <div className="space-y-3">
                      {editData.gambar ? (
                        <img
                          src={buildDataUrl(editData.gambar, editData.gambarMimeType)}
                          alt="Pratinjau"
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
                            handleImageChange(file);
                          }
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-60"
                    >
                      {saving ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-500 text-white hover:bg-slate-600 transition-all duration-200"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    {item.gambar ? (
                      <img
                        src={buildDataUrl(item.gambar, item.gambarMimeType)}
                        alt={item.nama}
                        className="w-full h-40 object-cover rounded-xl border border-slate-200"
                      />
                    ) : (
                      <div className="w-full h-40 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
                        Belum ada gambar
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{item.nama || "Tanpa Nama"}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.deskripsi || "Belum ada deskripsi."}</p>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-skyblue-500 text-white font-semibold hover:from-primary-600 hover:to-skyblue-600 transition-all duration-200 transform hover:scale-105"
                    >
                      Edit Dokumentasi
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDokumentasi(item.id)}
                      disabled={deletingId === item.id}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all duration-200 disabled:opacity-60"
                    >
                      {deletingId === item.id ? "Menghapus..." : "Hapus"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDokumentasi;
