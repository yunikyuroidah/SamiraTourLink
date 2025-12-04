import React, { useEffect, useState } from "react";
import { PhoneCall } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config"; // ✅ gunakan import dari firebase.ts agar konsisten
import { useTourLeaderContact } from "../hooks/useTourLeaderContact";

type Paket = {
  id?: string;
  nama_paket: string;
  deskripsi: string;
  features?: string[];
  fasilitas?: string[];
};

const Packages: React.FC = () => {
  const [packages, setPackages] = useState<Paket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { whatsappLink } = useTourLeaderContact();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "paket"));
        const data: Paket[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Paket, "id">),
        }));
        setPackages(data);
      } catch (err: any) {
        console.error("Gagal ambil data paket:", err);
        setError("Gagal memuat data paket. Periksa koneksi atau Firestore rules.");
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            <span className="text-xl text-slate-600 animate-pulse">Memuat paket perjalanan...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center text-red-500 py-10 animate-slide-up">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-primary-200/10 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-skyblue-200/10 rounded-full blur-2xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slide-down px-2">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Paket <span className="text-primary-600">Umroh</span> <span className="text-skyblue-600">&amp; Haji</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Pilih paket sesuai kebutuhan Anda. Semua paket didukung fasilitas
            terbaik & pembimbing berpengalaman.
          </p>
        </div>
        
  <div className="overflow-x-auto pb-6 scroll-smooth">
          <div className="flex gap-6 sm:gap-8 xl:gap-10 snap-x snap-mandatory">
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 sm:p-8 border border-white/50 group hover:scale-[1.02] transform animate-fade-in flex flex-col flex-shrink-0 min-w-[280px] sm:min-w-[320px] xl:min-w-[340px] snap-center"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-primary-500 to-skyblue-500 text-white p-4 rounded-xl mb-6 group-hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl sm:text-2xl font-bold">
                    {pkg.nama_paket}
                  </h3>
                </div>
                
                <p className="text-slate-600 mb-6 leading-relaxed text-sm sm:text-base">{pkg.deskripsi}</p>

                <div className="flex-1 space-y-6">
                  {/* Features Section */}
                  <div>
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 text-primary-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Fitur Utama:
                    </h4>
                    <div className="space-y-2">
                      {Array.isArray(pkg.features) &&
                        pkg.features.map((f, j) => (
                          <div key={j} className="flex items-center space-x-3 animate-slide-right" style={{animationDelay: `${(index * 0.2) + (j * 0.1)}s`}}>
                            <div className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0"></div>
                            <span className="text-slate-700 text-sm sm:text-base">{f}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Facilities Section */}
                  <div>
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 text-skyblue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Fasilitas:
                    </h4>
                    <div className="space-y-2">
                      {Array.isArray(pkg.fasilitas) &&
                        pkg.fasilitas.map((f, j) => (
                          <div key={j} className="flex items-center space-x-3 animate-slide-right" style={{animationDelay: `${(index * 0.2) + (j * 0.1) + 0.3}s`}}>
                            <div className="w-2 h-2 bg-skyblue-400 rounded-full flex-shrink-0"></div>
                            <span className="text-slate-700 text-sm sm:text-base">{f}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <a
                    href={whatsappLink || "#"}
                    onClick={(event) => {
                      if (!whatsappLink) event.preventDefault();
                    }}
                    className="w-full inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-green-500/25 group/btn"
                  >
                    <PhoneCall className="w-5 h-5 mr-3 animate-bounce-gentle" /> 
                    <span className="group-hover/btn:text-green-100 transition-colors duration-200">Konsultasi via WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Packages;
