import { useCallback, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { FirebaseError } from "firebase/app";
import { db } from "../firebase-config";

export type ProfilTravelContent = {
  alamat?: string;
  email?: string;
  gambar?: string;
  gambarMimeType?: string;
};

const COLLECTION_NAME = "profil_travel";
const DOCUMENT_ID = "profil_id";

export const useProfilTravelContent = () => {
  const [content, setContent] = useState<ProfilTravelContent>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const snapshot = await getDoc(doc(db, COLLECTION_NAME, DOCUMENT_ID));
      if (snapshot.exists()) {
        const raw = snapshot.data() as ProfilTravelContent;
        setContent({
          alamat: raw.alamat ?? "",
          email: raw.email ?? "",
          gambar: typeof raw.gambar === "string" ? raw.gambar : "",
          gambarMimeType:
            typeof raw.gambarMimeType === "string" && raw.gambarMimeType ? raw.gambarMimeType : undefined,
        });
        setError(null);
      } else {
        setContent({});
        setError("Data profil travel belum tersedia.");
      }
    } catch (err) {
      console.error("Gagal memuat profil travel:", err);
      setError("Tidak dapat memuat data profil travel.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContent = useCallback(async (payload: Partial<ProfilTravelContent>) => {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, DOCUMENT_ID), payload);
      await fetchContent();
      return { success: true } as const;
    } catch (err) {
      console.error("Gagal memperbarui profil travel:", err);
      const firebaseError = err as FirebaseError;
      if (firebaseError?.message && /too many bytes|larger than|maximum size/i.test(firebaseError.message)) {
        return {
          success: false as const,
          message: "Ukuran data melebihi batas Firestore (~1MB per dokumen). Kompres gambar terlebih dahulu.",
        };
      }
      if (firebaseError?.code === "not-found") {
        return {
          success: false as const,
          message: "Dokumen profil belum tersedia di Firestore. Buat dokumen 'profil_id' terlebih dahulu.",
        };
      }
      return {
        success: false as const,
        message: "Gagal memperbarui profil travel. Coba lagi beberapa saat.",
      };
    }
  }, [fetchContent]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { content, loading, error, refresh: fetchContent, updateContent };
};
