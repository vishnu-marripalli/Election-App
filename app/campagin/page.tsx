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
  { id: 1, name: "Padakanti Rudransh Reddy", position: "Head Boy", campaign: "Dedicated to lead with responsibility and vision.", photo: "/candidates/rudransh.jpg" },
  { id: 2, name: "Nagampeta Swajith Reddy", position: "Head Boy", campaign: "A leader who listens and acts.", photo: "/candidates/srujith.jpg" },
  { id: 3, name: "Gaddam Shiva", position: "Head Boy", campaign: "Together towards excellence.", photo: "/candidates/shiva.jpg" },

  // Head Girl
  { id: 4, name: "Machharla Bindhu Reddy", position: "Head Girl", campaign: "Leadership with kindness and courage.", photo: "/candidates/bindu.jpg" },
  { id: 5, name: "Gollapalli Harshini", position: "Head Girl", campaign: "Your voice, my responsibility.", photo: "/candidates/harshini.jpg" },

  // Cultural Coordinator
  { id: 6, name: "Ankannagari Varadhan", position: "Cultural Coordinator", campaign: "Creativity and culture for all.", photo: "/candidates/varadhan.jpg" },
  { id: 7, name: "Cheelam Yashwanth", position: "Cultural Coordinator", campaign: "Culture unites us together.", photo: "/candidates/yashwanth.jpg" },
  { id: 8, name: "Puchula Samanvi", position: "Cultural Coordinator", campaign: "Bringing vibrance and joy to school life.", photo: "/candidates/samvni.jpg" },
  { id: 9, name: "Yerra Sathwika", position: "Cultural Coordinator", campaign: "Celebrating diversity and talent.", photo: "/candidates/sathvika.jpg" },

  // Sports Captain (Boys)
  { id: 10, name: "Manga Ajay", position: "Sports Captain (Boys)", campaign: "Discipline, dedication, and sportsmanship.", photo: "/candidates/ajay.jpg" },
  { id: 11, name: "Sama Reshwanth Reddy", position: "Sports Captain (Boys)", campaign: "For fair play and teamwork.", photo: "/candidates/reshwanth.jpg" },
  { id: 12, name: "Ungarala Rohith Roshan", position: "Sports Captain (Boys)", campaign: "Passion for sports, power for progress.", photo: "/candidates/roshan.jpg" },
  { id: 13, name: "Rajula Ritesh Reddy", position: "Sports Captain (Boys)", campaign: "Strength and spirit on the field.", photo: "/candidates/ritesh.jpg" },

  // Sports Captain (Girls)
  { id: 14, name: "Dhanarekula Rahithya", position: "Sports Captain (Girls)", campaign: "Encouraging girls in sports with confidence.", photo: "/candidates/rahithya.jpg" },
  { id: 15, name: "Pandhena Arankitha", position: "Sports Captain (Girls)", campaign: "Unity and strength in sports.", photo: "/candidates/arankitha.jpg" },
  { id: 16, name: "Mudavath Geethika", position: "Sports Captain (Girls)", campaign: "Play fair, play strong, play together.", photo: "/candidates/geethika.jpg" },
];

export default function CampaignPage() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
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

    <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
  <div className="w-[90%] max-w-6xl">
    <Slider {...settings}>
      {Object.entries(groupedCandidates).map(([role, roleCandidates]) => (
        <div key={role} className="relative">
          <h2 className="text-4xl font-bold text-center text-blue-700 mb-8">
            {role}
          </h2>

          {/* Grid of candidates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-3 gap-10">
            {roleCandidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg"
              >
                {/* Candidate Image (optional) */}
                {/* <Image
                  src={candidate.photo}
                  alt={candidate.name}
                  width={200}
                  height={200}
                  className="rounded-2xl shadow-lg object-cover mb-4"
                /> */}

                <h3 className="text-2xl font-bold text-gray-800">{candidate.name}</h3>
                <p className="mt-2 text-lg text-gray-600 italic">“{candidate.campaign}”</p>
              </motion.div>
            ))}
          </div>
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
