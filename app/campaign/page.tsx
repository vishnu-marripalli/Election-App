// app/campaign/page.tsx
"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import { motion } from "framer-motion";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const candidates = [
  // Head Boy
  { id: 1, name: "Padakanti Rudransh Reddy", position: "Head Boy", campaign: "Dedicated to lead with responsibility and vision.", photo: "/rudhransh.jpg" },
  { id: 2, name: "Nagampeta Swajith Reddy", position: "Head Boy", campaign: "A leader who listens and acts.", photo: "/swajith.jpg" },
  { id: 3, name: "Gaddam Shiva", position: "Head Boy", campaign: "Together towards excellence.", photo: "/shiva.jpg" },

  // Head Girl
  { id: 4, name: "Maccharla Bindhu Reddy", position: "Head Girl", campaign: "Leadership with kindness and courage.", photo: "/bindhu.jpg" },
  { id: 5, name: "Gollapalli Harshini", position: "Head Girl", campaign: "Your voice, my responsibility.", photo: "/harshini.jpg" },

  // Cultural Coordinator
  { id: 6, name: "Ankannagari Vardhan", position: "Cultural Coordinator", campaign: "Creativity and culture for all.", photo: "/vardhan.jpg" },
  { id: 7, name: "Cheelam Yashwanth", position: "Cultural Coordinator", campaign: "Culture unites us together.", photo: "/yash.jpg" },
  { id: 8, name: "Puchula Samanvi", position: "Cultural Coordinator", campaign: "Bringing vibrance and joy to school life.", photo: "/samanvi.jpg" },
  { id: 9, name: "Yerrani Sathwika", position: "Cultural Coordinator", campaign: "Celebrating diversity and talent.", photo: "/sathwika.jpg" },

  // Sports Captain (Boys)
  { id: 10, name: "Manga Ajay", position: "Sports Captain (Boys)", campaign: "Discipline, dedication, and sportsmanship.", photo: "/ajay.jpg" },
  { id: 11, name: "Sama Reshwanth Reddy", position: "Sports Captain (Boys)", campaign: "For fair play and teamwork.", photo: "/reshwanth.jpg" },
  { id: 12, name: "Ungarala Rohith Roshan", position: "Sports Captain (Boys)", campaign: "Passion for sports, power for progress.", photo: "/rohith.jpg" },
  { id: 13, name: "Rajula Ritesh Reddy", position: "Sports Captain (Boys)", campaign: "Strength and spirit on the field.", photo: "/ritesh.jpg" },

  // Sports Captain (Girls)
  { id: 14, name: "Dhanrekkala Rahithya", position: "Sports Captain (Girls)", campaign: "Encouraging girls in sports with confidence.", photo: "/rahitya.jpg" },
  { id: 15, name: "Pandena Avankitha", position: "Sports Captain (Girls)", campaign: "Unity and strength in sports.", photo: "/avanthika.jpg" },
  { id: 16, name: "Mudavath Geethika", position: "Sports Captain (Girls)", campaign: "Play fair, play strong, play together.", photo: "/geethika.jpg" },
];

export default function CampaignPage() {

  const settings = {
    dots: false,
    infinite: true,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    fade: true,
    pauseOnHover: false,
  };
  // Group candidates by position (role)
  const groupedCandidates = candidates.reduce((acc, candidate) => {
    if (!acc[candidate.position]) {
      acc[candidate.position] = [];
    }
    acc[candidate.position].push(candidate);
    return acc;
  }, {} as Record<string, typeof candidates>);

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-center bg-blue-900 text-white py-6 shadow-xl relative">
        <Image
          src="/logo.png"
          alt="School Logo"
          width={70}
          height={70}
          className="mr-4 b"
        />
        <h1 className="text-4xl font-extrabold tracking-wide uppercase">
          Kanthi High School Elections
        </h1>
      </header>

      {/* Slider */}
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="w-[85%] max-w-5xl">
          <Slider {...settings}>
            {candidates.map((candidate) => (
              <div key={candidate.id} className="relative flex justify-center">
                {/* Candidate Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="flex flex-col items-center justify-center text-center p-6"
                >
                  <Image
                    src={candidate.photo}
                    alt={candidate.name}
                    width={200}
                    height={200}
                    className="rounded-3xl shadow-2xl object-cover mb-6 border-4 border-blue-200"
                  />
                  {/* Text */}
                  <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl font-extrabold text-gray-800"
                  >
                    {candidate.name}
                  </motion.h2>
                  <motion.h3
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-3xl text-blue-700 mt-2 font-semibold"
                  >
                    {candidate.position}
                  </motion.h3>
                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="mt-6 text-2xl text-gray-600 italic max-w-3xl"
                  >
                    “{candidate.campaign}”
                  </motion.p>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </main>

      {/* Footer ticker */}
      <footer className="bg-blue-900 text-white py-3 text-lg font-medium overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap">
          📢 Vote Responsibly · Your Voice, Your Power · Support Your Leaders ·
          Build a Better Tomorrow · 📢 Vote Responsibly · Your Voice, Your Power
        </div>
      </footer>

      {/* Ticker Animation */}
      <style jsx>{`
        .animate-marquee {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 25s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
