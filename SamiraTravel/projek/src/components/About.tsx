import React, { useEffect, useState } from "react";
import { useTourLeaderContact } from "../hooks/useTourLeaderContact";
import profilVideoSrc from "../assets/profilvideo.mp4";
import sponsorImg from "../assets/sponsor.jpg";

const About: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { whatsappLink } = useTourLeaderContact();
  const aboutVideo = profilVideoSrc;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('about-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section id="about-section" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-200/20 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-skyblue-200/20 rounded-full blur-xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto grid gap-12 items-center justify-items-center px-4 sm:px-6 lg:px-8 md:grid-cols-2 relative z-10">
        {/* Video kiri */}
        <div
          className={`flex justify-center transform transition-all duration-1000 ${
            isVisible ? "animate-slide-right opacity-100" : "opacity-0 -translate-x-10"
          }`}
        >
          <div className="relative group mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-skyblue-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-all duration-500"></div>
            <div className="relative w-full max-w-[320px] sm:max-w-sm md:max-w-md lg:max-w-lg">
              <video
                src={aboutVideo}
                autoPlay
                loop
                muted
                playsInline
                className="relative w-full h-auto max-h-[360px] sm:max-h-[420px] md:max-h-[480px] object-cover rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-500 border-4 border-white/50"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl pointer-events-none"></div>
          </div>
        </div>

        {/* Teks kanan */}
        <div
          className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? "animate-slide-left opacity-100" : "opacity-0 translate-x-10"
          }`}
        >
          <div className="space-y-6 text-center md:text-left">
            <div className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Tentang <span className="text-primary-600">Samira</span>{" "}
                <span className="text-skyblue-600">Travel</span>
              </h2>
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: "0.8s" }}>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6 sm:mb-8">
                Samira Travel hadir untuk melayani perjalanan ibadah Umrah dan Haji
                Anda dengan pelayanan terpercaya, fasilitas lengkap, dan bimbingan
                profesional yang berpengalaman.
              </p>
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: "1s" }}>
              <a
                href={whatsappLink || "#"}
                onClick={(event) => {
                  if (!whatsappLink) event.preventDefault();
                }}
                className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-green-500/25 group w-full max-w-xs sm:max-w-sm md:max-w-none"
              >
                <svg className="w-5 h-5 mr-3 animate-bounce-gentle" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.425 3.585"/>
                </svg>
                <span className="group-hover:text-green-100 transition-colors duration-200">Konsultasi Gratis</span>
              </a>
            </div>

            {/* Sponsor */}
            <div className="mt-10 sm:mt-12 animate-slide-up" style={{ animationDelay: "1.2s" }}>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Didukung oleh:</h3>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <img
                  src={sponsorImg}
                  alt="Sponsor"
                  className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
