import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";

const TOUR_LEADER_COLLECTION = "tour_leader";
const TOUR_LEADER_DOC_ID = "tour_leader_id";

const sanitizePhone = (rawPhone: string) => rawPhone.replace(/[^0-9]/g, "");

export const useTourLeaderContact = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const docRef = doc(db, TOUR_LEADER_COLLECTION, TOUR_LEADER_DOC_ID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (typeof data.telepon === "string") {
            setPhoneNumber(data.telepon);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil nomor telepon tour leader:", error);
      }
    };

    fetchPhoneNumber();
  }, []);

  const whatsappLink = phoneNumber ? `https://wa.me/${sanitizePhone(phoneNumber)}` : "";

  return { phoneNumber, whatsappLink };
};
