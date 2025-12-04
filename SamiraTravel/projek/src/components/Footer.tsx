// src/components/Footer.tsx
import React, { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { MapPin, Phone, Mail } from "lucide-react";
import logo from "../assets/logo.png";
import instagramLogo from "../assets/instagram.png";
import tiktokLogo from "../assets/tiktok.png";
import { useNavigate } from "react-router-dom";
import { useTourLeaderContact } from "../hooks/useTourLeaderContact";

const Footer: React.FC = () => {
  const [alamat, setAlamat] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [packages, setPackages] = useState<any[]>([]);
  const [nama, setNama] = useState("");
  const navigate = useNavigate();
  const { phoneNumber } = useTourLeaderContact();
  const displayPhone = phoneNumber || telepon;
  const sanitizedPhone = displayPhone ? displayPhone.replace(/[^0-9]/g, "") : "";

  useEffect(() => {
    const fetchProfil = async () => {
      const docRef = doc(db, "profil_travel", "profil_id"); // BUKAN "profilId"
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAlamat(data.alamat);
        setEmail(data.email);
      }
    };
    const fetchTelepon = async () => {
      const leaderSnap = await getDoc(doc(db, "tour_leader", "tour_leader_id"));
      if (leaderSnap.exists()) {
        setTelepon(leaderSnap.data().telepon);
      }
    };
    const fetchPackages = async () => {
      const querySnapshot = await getDocs(collection(db, "paket")); // BUKAN "produk"
      setPackages(querySnapshot.docs.map((doc) => doc.data()));
    };
    const fetchLeader = async () => {
      const docRef = doc(db, "tour_leader", "tour_leader_id");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setNama(docSnap.data().nama);
    };
    fetchProfil();
    fetchTelepon();
    fetchPackages();
    fetchLeader();
  }, []);

  return (
    <footer className="bg-gradient-to-br from-[#0a2540] via-[#0f3460] to-[#1a4b70] text-white py-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-skyblue-500/10 rounded-full blur-2xl animate-bounce-gentle"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary-400/5 rounded-full blur-xl animate-float"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid gap-12 md:grid-cols-3 mb-12">
          {/* Profil singkat */}
          <div className="animate-fade-in">
            <div className="mb-6">
              <h3 className="text-3xl font-bold mb-4 flex items-center">
                <img src={logo} alt="Logo" className="h-10 w-auto mr-3 object-contain sm:h-12" />
                Samira <span className="gradient-text bg-gradient-to-r from-primary-400 to-skyblue-400">Travel</span>
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-skyblue-500 rounded-full mb-4"></div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-base sm:text-lg">
              Melayani perjalanan ibadah Umrah & Haji dengan penuh profesionalisme, 
              kenyamanan, dan amanah. Berpengalaman mendampingi ribuan jamaah menuju Baitullah 
              dengan pelayanan terbaik dan harga terjangkau.
            </p>
          </div>

          {/* Kontak */}
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h4 className="text-lg sm:text-xl font-semibold mb-6 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-primary-400" />
              Kontak Kami
            </h4>
            <ul className="space-y-4 text-gray-300 text-sm sm:text-base">
              <li className="flex items-start group">
                <MapPin className="w-5 h-5 mr-3 text-primary-400 mt-1 group-hover:text-skyblue-400 transition-colors" />
                <span className="group-hover:text-white transition-colors">{alamat || "Jakarta, Indonesia"}</span>
              </li>
              <li className="flex items-center group">
                <Phone className="w-5 h-5 mr-3 text-primary-400 group-hover:text-skyblue-400 transition-colors" />
                <a href={sanitizedPhone ? `tel:${sanitizedPhone}` : "#"} className="group-hover:text-white transition-colors">
                  {displayPhone ?? ""}
                </a>
              </li>
              <li className="flex items-center group">
                <Mail className="w-5 h-5 mr-3 text-primary-400 group-hover:text-skyblue-400 transition-colors" />
                <a href={`mailto:${email}`} className="group-hover:text-white transition-colors">
                  {email || "info@samiratravel.com"}
                </a>
              </li>
            </ul>

            {/* WhatsApp Button */}
            <div className="mt-6">
              <a 
                href={sanitizedPhone ? `https://wa.me/${sanitizedPhone}` : "#"}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 rounded-full text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <i className="fab fa-whatsapp text-lg"></i>
                <span>Chat WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Sosial media */}
          <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
            <h4 className="text-lg sm:text-xl font-semibold mb-6">Ikuti Kami</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <a
                href="https://www.instagram.com/bundachika_samiratravel/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/10 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 p-4 rounded-xl transition-all duration-300 flex items-center space-x-3 backdrop-blur-sm"
              >
                <img src={instagramLogo} alt="Instagram" className="w-8 h-8 object-contain" />
                <span className="text-sm font-semibold text-white group-hover:text-white">Tour Leader Bersertifikat BNSP</span>
              </a>
              <a
                href="https://www.tiktok.com/@bundachika_samiratravel"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/10 hover:bg-gradient-to-r hover:from-gray-900 hover:to-black p-4 rounded-xl transition-all duration-300 flex items-center space-x-3 backdrop-blur-sm"
              >
                <img src={tiktokLogo} alt="TikTok" className="w-8 h-8 object-contain" />
                <span className="text-sm font-semibold text-white group-hover:text-white">Samira Travel</span>
              </a>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                <div className="text-lg font-bold gradient-text bg-gradient-to-r from-primary-400 to-skyblue-400">2000+</div>
                <div className="text-gray-400 text-xs">Jamaah</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                <div className="text-lg font-bold gradient-text bg-gradient-to-r from-skyblue-400 to-primary-400">15+</div>
                <div className="text-gray-400 text-xs">Tahun</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                <div className="text-lg font-bold gradient-text bg-gradient-to-r from-primary-400 to-skyblue-400">4.9</div>
                <div className="text-gray-400 text-xs">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8">
          <div className="text-center">
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Samira{" "}
              <button
                type="button"
                onClick={() => navigate("/admin/login")}
                className="gradient-text bg-gradient-to-r from-primary-400 to-skyblue-400 hover:from-skyblue-400 hover:to-primary-400 cursor-pointer transition-all duration-300 font-bold bg-transparent border-none p-0"
              >
                Travel
              </button>
              . Semua hak dilindungi.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
