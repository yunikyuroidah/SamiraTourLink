// src/components/Gallery.tsx
import React, { useEffect, useRef, useState } from "react";
import { useDokumentasi } from "../hooks/useDokumentasi";
import { buildDataUrl } from "../utils/base64";
import { Eye, Heart, Share2 } from "lucide-react";

const fallbackStats = [
  { likes: "2.4k", views: "15k" },
  { likes: "3.1k", views: "18k" },
  { likes: "1.8k", views: "12k" },
  { likes: "2.1k", views: "14k" },
  { likes: "3.4k", views: "19k" },
  { likes: "4.2k", views: "25k" }
];

const Gallery: React.FC = () => {
  const { items, loading, error } = useDokumentasi();
  const [visibleImages, setVisibleImages] = useState<boolean[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const galleryImages = items.map((item, index) => ({
    id: item.id,
    caption: item.nama,
    description: item.deskripsi,
    src: buildDataUrl(item.gambar, item.gambarMimeType),
    alt: item.nama || "Dokumentasi Samira Travel",
    likes: fallbackStats[index]?.likes ?? "2.0k",
    views: fallbackStats[index]?.views ?? "12k",
  }));
  const galleryIdsKey = galleryImages.map((image) => image.id).join("|");

  useEffect(() => {
    setVisibleImages(Array(galleryImages.length).fill(false));
    if (imageRefs.current.length > galleryImages.length) {
      imageRefs.current.splice(galleryImages.length);
    }
  }, [galleryImages.length, galleryIdsKey]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute("data-index") || "-1", 10);
          if (entry.isIntersecting && index >= 0) {
            setVisibleImages((prev) => {
              const nextState = prev.length ? [...prev] : Array(galleryImages.length).fill(false);
              nextState[index] = true;
              return nextState;
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    imageRefs.current.forEach((ref) => {
      if (ref) imageObserver.observe(ref);
    });

    return () => imageObserver.disconnect();
  }, [galleryIdsKey]);

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-skyblue-50/30 relative overflow-hidden" 
      id="gallery"
    >
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200/20 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-skyblue-200/20 rounded-full blur-xl animate-bounce-gentle"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary-300/10 rounded-full blur-lg animate-float"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'opacity-100 sm:opacity-0 sm:translate-y-8'
        }`}>
          <div className="inline-block">
            <span className="text-sm font-semibold tracking-widest text-primary-600 uppercase mb-2 block animate-fade-in">
              ✨ Galeri Perjalanan
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gray-900">Galeri </span>
              <span className="gradient-text animate-gradient bg-gradient-to-r from-primary-600 via-primary-500 to-skyblue-500">
                Dokumentasi
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-skyblue-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Saksikan momen-momen berharga perjalanan spiritual jamaah kami ke Tanah Suci. 
              Setiap foto menyimpan cerita kebahagiaan dan kekhusyukan dalam beribadah.
            </p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-16 transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'opacity-100 sm:opacity-0 sm:translate-y-8'
        }`}>
          <div className="text-center group">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-primary-100/50">
              <div className="text-3xl md:text-4xl font-bold gradient-text bg-gradient-to-r from-primary-600 to-skyblue-500 mb-2">
                500+
              </div>
              <div className="text-gray-600 font-medium">Foto Dokumentasi</div>
            </div>
          </div>
          <div className="text-center group">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-skyblue-100/50">
              <div className="text-3xl md:text-4xl font-bold gradient-text bg-gradient-to-r from-skyblue-600 to-primary-500 mb-2">
                50+
              </div>
              <div className="text-gray-600 font-medium">Keberangkatan</div>
            </div>
          </div>
          <div className="text-center group">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-primary-100/50">
              <div className="text-3xl md:text-4xl font-bold gradient-text bg-gradient-to-r from-primary-600 to-skyblue-500 mb-2">
                2000+
              </div>
              <div className="text-gray-600 font-medium">Jamaah Bahagia</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-10 px-4 py-3 rounded-xl bg-red-100 border border-red-200 text-red-700 text-center">
            {error}
          </div>
        )}

        {!loading && !error && galleryImages.length === 0 && (
          <div className="mb-10 px-4 py-6 rounded-xl bg-white/70 border border-slate-200 text-center text-slate-600">
            Dokumentasi belum tersedia. Tambahkan konten melalui halaman admin untuk menampilkan galeri.
          </div>
        )}

        {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="rounded-2xl bg-white/60 border border-slate-200 shadow-sm p-6 animate-pulse space-y-4"
                  >
                    <div className="w-full aspect-[4/3] bg-slate-200 rounded-xl" />
                    <div className="h-4 bg-slate-200 rounded-full w-3/4" />
                    <div className="h-3 bg-slate-200 rounded-full w-full" />
                    <div className="h-3 bg-slate-200 rounded-full w-5/6" />
                  </div>
                ))
              : galleryImages.map((image, index) => {
                  const delay = index * 200;
                  return (
                    <div
                      key={image.id}
                      ref={(el) => (imageRefs.current[index] = el)}
                      data-index={index}
                      className={`group cursor-pointer transform transition-all duration-700 ${
                        visibleImages[index] ? "translate-y-0 opacity-100" : "opacity-100 md:opacity-0 md:translate-y-12"
                      }`}
                      style={{ transitionDelay: `${delay}ms` }}
                    >
                      <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2">
                        {/* Image Container */}
                        <div className="relative overflow-hidden aspect-[4/3]">
                          {image.src ? (
                            <img
                              src={image.src}
                              alt={image.alt}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-200" />
                          )}

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                          {/* Action Buttons */}
                          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                              <Eye className="w-4 h-4 text-white" />
                            </button>
                            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                              <Heart className="w-4 h-4 text-white" />
                            </button>
                            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                              <Share2 className="w-4 h-4 text-white" />
                            </button>
                          </div>

                          {/* Stats */}
                          <div className="absolute bottom-4 left-4 flex space-x-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                            <div className="flex items-center space-x-1 text-white text-sm">
                              <Heart className="w-4 h-4" />
                              <span>{image.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-white text-sm">
                              <Eye className="w-4 h-4" />
                              <span>{image.views}</span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="mb-3">
                            <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                              {image.caption}
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{image.description}</p>
                          </div>

                          {/* Hover Effect Line */}
                          <div className="h-1 bg-gradient-to-r from-primary-500 to-skyblue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'opacity-100 sm:opacity-0 sm:translate-y-8'
        }`}>
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-primary-100/50 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ingin Melihat Lebih Banyak Dokumentasi?
            </h3>
            <p className="text-gray-600 mb-6">
              Ikuti media sosial kami untuk mendapatkan update foto dan video terbaru dari perjalanan umrah jamaah Samira Travel.
            </p>
            <button
              type="button"
              onClick={() => window.open("https://www.tiktok.com/@bundachika_samiratravel", "_blank", "noopener,noreferrer")}
              className="bg-gradient-to-r from-primary-500 to-skyblue-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Ikuti Kami
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;