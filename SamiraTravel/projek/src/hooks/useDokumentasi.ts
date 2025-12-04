import { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { FirebaseError } from "firebase/app";
import { db } from "../firebase-config";

export type DokumentasiItem = {
  id: string;
  nama: string;
  deskripsi: string;
  gambar: string;
  gambarMimeType?: string;
};

type UpdatePayload = {
  nama?: string;
  deskripsi?: string;
  gambar?: string;
  gambarMimeType?: string;
};

const COLLECTION_NAME = "dokumentasi";

const DEFAULT_CONTENT: Record<string, Pick<DokumentasiItem, "nama" | "deskripsi">> = {
  dokumentasi1: {
    nama: "Jabal Uhud - Madinah",
    deskripsi: "Petualangan ziarah serasa menunggang unta di perbukitan Jabal Uhud yang menjadi saksi sejarah perjuangan para syuhada"
  },
  dokumentasi2: {
    nama: "Stasiun Madinah",
    deskripsi: "Foto bersama rombongan Samira Travel di Stasiun Madinah dengan nuansa arsitektur modern jelang keberangkatan kereta Haramain"
  },
  dokumentasi3: {
    nama: "Hotel Arkan Almanarah",
    deskripsi: "Momen kebersamaan rombongan saat berkumpul di depan Hotel Arkan Almanarah usai agenda city tour dan ziarah"
  },
  dokumentasi4: {
    nama: "Bandara Juanda Keberangkatan Umroh",
    deskripsi: "Briefing terakhir dan doa bersama rombongan Samira Travel boarding menuju Tanah Suci"
  },
  dokumentasi5: {
    nama: "Masjid Nabawi Madinah",
    deskripsi: "Suasana syahdu di pelataran Masjid Nabawi dengan payung raksasa yang menaungi jamaah saat beribadah"
  },
  dokumentasi6: {
    nama: "Masjidil Haram Mekah",
    deskripsi: "Momen jamaah Samira travel bertawaf mengelilingi Ka'bah pada siang hari yang penuh kehangatan"
  }
};

export const useDokumentasi = () => {
  const [items, setItems] = useState<DokumentasiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const documents = snapshot.docs.map((item) => {
        const raw = item.data() as Partial<DokumentasiItem>;
        const fallback = DEFAULT_CONTENT[item.id] ?? { nama: "", deskripsi: "" };
        return {
          id: item.id,
          nama: raw.nama ?? fallback.nama ?? "",
          deskripsi: raw.deskripsi ?? fallback.deskripsi ?? "",
          gambar: typeof raw.gambar === "string" ? raw.gambar : "",
          gambarMimeType:
            typeof raw.gambarMimeType === "string" && raw.gambarMimeType
              ? raw.gambarMimeType
              : undefined,
        };
      });
      setItems(documents);
      setError(null);
    } catch (err) {
      console.error("Gagal memuat dokumentasi:", err);
      setError("Tidak dapat memuat dokumentasi. Coba muat ulang.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (id: string, payload: UpdatePayload) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    try {
      await updateDoc(docRef, payload);
      await fetchItems();
      return { success: true } as const;
    } catch (err) {
      const firebaseError = err as FirebaseError;
      if (firebaseError?.code === "not-found") {
        try {
          await setDoc(docRef, payload, { merge: true });
          await fetchItems();
          return { success: true } as const;
        } catch (createError) {
          console.error(`Gagal membuat dokumentasi ${id}:`, createError);
          return {
            success: false as const,
            message: "Gagal menyimpan dokumentasi. Coba lagi beberapa saat.",
          };
        }
      }
      console.error(`Gagal memperbarui dokumentasi ${id}:`, err);
      if (firebaseError?.message && /too many bytes|larger than|maximum size/i.test(firebaseError.message)) {
        return {
          success: false as const,
          message: "Ukuran data terlalu besar untuk Firestore (maksimal ~1MB per dokumen). Kompres gambar terlebih dahulu.",
        };
      }
      return {
        success: false as const,
        message: "Gagal memperbarui dokumentasi. Coba lagi beberapa saat.",
      };
    }
  }, [fetchItems]);

  const createItem = useCallback(
    async (payload: Omit<DokumentasiItem, "id">) => {
      try {
        const colRef = collection(db, COLLECTION_NAME);
        const snapshot = await getDocs(colRef);
        if (snapshot.size >= 10) {
          return {
            success: false as const,
            message: "Batas maksimal 10 dokumentasi telah tercapai.",
          };
        }

        const docRef = await addDoc(colRef, payload);
        await fetchItems();
        return { success: true as const, id: docRef.id };
      } catch (err) {
        console.error("Gagal menambah dokumentasi:", err);
        return {
          success: false as const,
          message: "Gagal menambah dokumentasi. Coba lagi beberapa saat.",
        };
      }
    },
    [fetchItems]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        await fetchItems();
        return { success: true as const };
      } catch (err) {
        console.error(`Gagal menghapus dokumentasi ${id}:`, err);
        return {
          success: false as const,
          message: "Gagal menghapus dokumentasi. Coba lagi beberapa saat.",
        };
      }
    },
    [fetchItems]
  );

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, error, refresh: fetchItems, updateItem, createItem, deleteItem };
};
