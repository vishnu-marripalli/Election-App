"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import logo from '@/public/logo.png';

export default function VoterCountUI() {
  const { electionid } = useParams() as { electionid: string };
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch data once on load + auto-refresh every 2 mins
  useEffect(() => {
    if (electionid) {
      fetchVotes(electionid);

      const interval = setInterval(() => {
        console.log("⏳ Auto-refreshing votes for electionid:", electionid);
        fetchVotes(electionid);
      }, 2 * 60 * 1000); // 2 minutes = 120,000ms

      return () => clearInterval(interval); // cleanup on unmount
    }
  }, [electionid]);

  const fetchVotes = async (id: string) => {
    if (!id) {
      setError("Election ID is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/votes?electionId=${id}`);
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to fetch data");
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      {/* Header with Logo */}
      <header className="flex flex-col items-center mb-10">
        <Image
          src={logo}
          alt="School Logo"
          width={160}
          height={160}
          className="shadow-lg"
        />
        <h1 className="text-5xl font-extrabold text-blue-900 mt-4 tracking-wide">
          School Election Dashboard
        </h1>
        <p className="text-xl text-gray-600 mt-2">Live Voter Statistics</p>
      </header>

      {/* Main Content */}
      <main className="flex w-full max-w-6xl items-center justify-between gap-8 px-8">
        {/* Left Photo */}
        <div className="hidden lg:block w-1/4">
          <Image
            src="/students-voting.jpg"
            alt="Students Voting"
            width={400}
            height={500}
            className="rounded-2xl shadow-lg object-cover"
          />
        </div>

        {/* Voter Stats */}
        <div className="flex-1 text-center bg-white rounded-2xl shadow-xl p-12">
          {error && (
            <div className="p-4 mb-6 bg-red-100 text-red-700 text-2xl rounded-lg">
              {error}
            </div>
          )}

          {loading && (
            <p className="text-2xl font-semibold text-gray-600">Loading...</p>
          )}

          {result && (
            <>
              <div className="text-6xl font-extrabold text-green-600">
                {result.totalVoters}
              </div>
              <p className="text-2xl text-gray-700 mt-2">Total Votes Cast</p>
            </>
          )}
        </div>

        {/* Right Photo */}
        <div className="hidden lg:block w-1/4">
          <Image
            src="/school-event.jpg"
            alt="School Event"
            width={400}
            height={500}
            className="rounded-2xl shadow-lg object-cover"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-gray-700 text-lg">
        {/* Powered by <span className="font-semibold text-blue-800">School Election System</span> */}
      </footer>
    </div>
  );
}
