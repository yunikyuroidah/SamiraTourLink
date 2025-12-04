import React, { useEffect, useState, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { Award, Phone, Star, Users, Calendar, CheckCircle, Shield, Heart, MessageCircle } from "lucide-react";
import { buildDataUrl } from "../utils/base64";

const Leader: React.FC = () => {
  const [nama, setNama] = useState("");
  const [pengalaman, setPengalaman] = useState("");
  const [telepon, setTelepon] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchLeader = async () => {
      const leaderSnap = await getDoc(doc(db, "tour_leader", "tour_leader_id"));
      if (leaderSnap.exists()) {
        const data = leaderSnap.data();
        setNama(data.nama || "Sri Wahyuningsih (Bunda Chika)");
        setPengalaman(data.pengalaman || "15+ tahun");
        setTelepon(data.telepon || "+62 812-3456-7890");
        setDeskripsi(
          data.deskripsi ||
            "Tour Leader berpengalaman dengan dedikasi tinggi dalam melayani jamaah umrah. Telah mendampingi ribuan jamaah dengan penuh kesabaran dan keikhlasan."
        );
        setGambar(buildDataUrl(data.gambar, data.gambarMimeType));
      }
    };
    fetchLeader();
  }, []);

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

  const achievements = [
    { icon: Users, label: "2000+ Jamaah", description: "Telah mendampingi lebih dari 2000 jamaah" },
    { icon: Award, label: "Bersertifikat", description: "Memiliki sertifikat resmi dari Kemenag" },
    { icon: Star, label: "Rating 4.9/5", description: "Mendapat rating tinggi dari jamaah" },
    { icon: Shield, label: "Amanah", description: "Terpercaya dan bertanggung jawab penuh" }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-skyblue-50 via-white to-primary-50/30 relative overflow-hidden" 
      id="leader"
    >
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-24 h-24 bg-primary-200/20 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-32 left-16 w-32 h-32 bg-skyblue-200/20 rounded-full blur-xl animate-bounce-gentle"></div>
        <div className="absolute top-1/3 left-1/3 w-16 h-16 bg-primary-300/10 rounded-full blur-lg animate-float"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <span className="text-sm font-semibold tracking-widest text-primary-600 uppercase mb-2 block">
            🎯 Pemimpin Perjalanan
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gray-900">Tour </span>
            <span className="gradient-text animate-gradient bg-gradient-to-r from-primary-600 via-primary-500 to-skyblue-500">
              Leader
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-skyblue-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Didampingi oleh tour leader berpengalaman yang akan memastikan perjalanan spiritual Anda berjalan dengan lancar dan berkesan.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Profile Section */}
          <div className={`transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
          }`}>
            <div className="relative group">
              {/* Profile Image with Floating Effects */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-skyblue-400 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow"></div>
                <div className="relative bg-white p-6 sm:p-8 rounded-3xl shadow-2xl">
                  <div className="relative mx-auto w-52 h-52 sm:w-64 sm:h-64 mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-skyblue-500 rounded-full animate-pulse-slow"></div>
                    {gambar ? (
                      <img
                        src={gambar}
                        alt="Tour Leader"
                        className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-lg transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="relative w-full h-full rounded-full border-4 border-white shadow-lg bg-slate-200" />
                    )}
                    {/* Verification Badge */}
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-primary-500 to-skyblue-500 p-3 rounded-full shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="text-center">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{nama}</h3>
                    <p className="text-primary-600 font-semibold mb-4 text-base sm:text-lg">Tour Leader Bersertifikat</p>
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Calendar className="w-5 h-5 text-primary-500" />
                        <span className="font-medium">{pengalaman} Pengalaman</span>
                      </div>
                      <div className="hidden sm:block w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Phone className="w-5 h-5 text-skyblue-500" />
                        <span className="font-medium">Siap 24/7</span>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">{deskripsi}</p>

                    {/* Contact Button */}
                    <div className="flex justify-center">
                      <a
                        href={telepon ? `https://wa.me/${telepon.replace(/[^0-9]/g, "")}` : "#"}
                        onClick={(event) => {
                          if (!telepon) event.preventDefault();
                        }}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>Chat WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className={`transform transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
          }`}>
            <div className="space-y-6">
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Mengapa Memilih Tour Leader Kami?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Kepercayaan ribuan jamaah menjadi bukti dedikasi dan profesionalisme dalam melayani perjalanan spiritual Anda.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={index}
                      className={`group bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl border border-primary-100/50 transform transition-all duration-500 hover:-translate-y-2 animate-fade-in`}
                      style={{ animationDelay: `${(index + 1) * 200}ms` }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-skyblue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                            {achievement.label}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                      {/* Hover Effect Line */}
                      <div className="h-1 bg-gradient-to-r from-primary-500 to-skyblue-500 rounded-full mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className={`mt-20 text-center transform transition-all duration-1000 delay-900 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-primary-100/50 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-lg sm:text-xl text-gray-700 italic mb-6 leading-relaxed">
              "Alhamdulillah, perjalanan umrah bersama Bunda Chika sangat berkesan. Beliau sabar membimbing dan membantu kami memahami setiap rukun serta sunnah umrah dengan baik."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-skyblue-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Ibu Siti Aminah</p>
                <p className="text-gray-600 text-sm">Jamaah Umrah 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leader;
