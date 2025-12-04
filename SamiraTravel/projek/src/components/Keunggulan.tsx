import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

const Keunggulan: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const items = [
    { text: "Legalitas resmi & terpercaya", icon: "🏛️" },
    { text: "Pembimbing berpengalaman", icon: "👨‍🏫" },
    { text: "Fasilitas hotel terbaik", icon: "🏨" },
    { text: "Pesawat langsung tanpa transit", icon: "✈️" },
    { text: "Harga terjangkau", icon: "💰" },
    { text: "Jadwal fleksibel", icon: "📅" },
    { text: "Layanan customer care 24/7", icon: "🛎️" },
    { text: "Ribuan jamaah puas bersama kami", icon: "⭐" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('keunggulan-section');
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
  <section id="keunggulan-section" className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-50/30 to-skyblue-50/30"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary-200/20 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-skyblue-200/20 rounded-full blur-xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'animate-slide-down opacity-100' : 'opacity-0 -translate-y-10'
        }`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Keunggulan <span className="text-primary-600">Samira</span> <span className="text-skyblue-600">Travel</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Alasan mengapa ribuan jamaah mempercayakan perjalanan ibadahnya
            kepada kami
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-white/50 group animate-fade-in ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{animationDelay: `${i * 0.1}s`}}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-skyblue-500/20 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-r from-primary-500 to-skyblue-500 p-3 rounded-full">
                      <CheckCircle className="text-white w-6 h-6" />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">
                      {item.icon}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors duration-300">
                    {item.text}
                  </p>
                </div>
              </div>
              
              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/10 to-skyblue-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>
            </div>
          ))}
        </div>
        
        {/* Statistics Section */}
        <div className={`mt-16 grid gap-6 sm:grid-cols-3 transform transition-all duration-1000 delay-500 ${
          isVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-10'
        }`}>
          <div className="text-center p-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl text-white shadow-xl">
            <div className="text-3xl font-bold mb-2 animate-pulse-slow">500+</div>
            <div className="text-primary-100">Jamaah Terlayani</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-skyblue-500 to-skyblue-600 rounded-2xl text-white shadow-xl">
            <div className="text-3xl font-bold mb-2 animate-pulse-slow" style={{animationDelay: '0.5s'}}>15+</div>
            <div className="text-skyblue-100">Tahun Pengalaman</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl text-white shadow-xl">
            <div className="text-3xl font-bold mb-2 animate-pulse-slow" style={{animationDelay: '1s'}}>98%</div>
            <div className="text-green-100">Tingkat Kepuasan</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Keunggulan;
