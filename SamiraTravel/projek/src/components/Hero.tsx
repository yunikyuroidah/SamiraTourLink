import React from "react";
import logo from "../assets/logo.png";
import { useTourLeaderContact } from "../hooks/useTourLeaderContact";
import { useProfilTravelContent } from "../hooks/useProfilTravelContent";
import { buildDataUrl } from "../utils/base64";

const Hero: React.FC = () => {
  const { whatsappLink } = useTourLeaderContact();
  const { content } = useProfilTravelContent();
  const heroBackground = buildDataUrl(content.gambar, content.gambarMimeType);

  const backgroundStyle = heroBackground
    ? {
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  return (
    <section
      className="relative min-h-[620px] md:min-h-screen flex items-center justify-center text-center text-white overflow-hidden px-4 sm:px-8 bg-slate-900"
      style={backgroundStyle}
    >
      {/* Overlay kabut hitam sedang */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      <div className="relative z-10 max-w-3xl animate-fade-in pt-24 pb-20 md:py-0">
        <div className="animate-slide-down" style={{animationDelay: '0.3s'}}>
          <img
            src={logo}
            alt="Samira Travel Logo"
            className="mx-auto mb-4 w-24 sm:w-28 animate-pulse-slow hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white animate-slide-up" style={{animationDelay: '0.6s'}}>
          SAMIRA TRAVEL
        </h1>
        
        <p className="mt-4 text-lg sm:text-xl md:text-2xl font-medium animate-slide-up opacity-90" style={{animationDelay: '0.9s'}}>
          Sahabat Umroh &amp; Haji Keluarga Anda
        </p>
        
        <div className="animate-slide-up" style={{animationDelay: '1.2s'}}>
          <a
            href={whatsappLink || "#"}
            onClick={(event) => {
              if (!whatsappLink) event.preventDefault();
            }}
            className="mt-8 inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-green-500/25 group"
          >
            <svg className="w-6 h-6 mr-3 animate-bounce-gentle" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.425 3.585"/>
            </svg>
            <span className="group-hover:text-green-100 transition-colors duration-200">Hubungi via WhatsApp</span>
          </a>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
          <div className="w-1 h-3 bg-white/70 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
