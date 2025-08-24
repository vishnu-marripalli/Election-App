"use client";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import { Upload, Vote, FileSpreadsheet, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import io, { Socket } from "socket.io-client";

interface Voter {
  _id?: string;
  name: string;
  class: string;
  studentId: string;
}

let socket: Socket;
export default function VoterPage() {
  const [voters, setVoters] = useState<Record<string, Voter[]>>({});
  const router = useRouter();

  // Fetch voters from backend
  useEffect(() => {
    fetch("/api/voters")
      .then((res) => res.json())
      .then((data) => {
        const grouped: Record<string, Voter[]> = {};
        data.forEach((voter: Voter) => {
          if (!grouped[voter.class]) grouped[voter.class] = [];
          grouped[voter.class].push(voter);
        });
        setVoters(grouped);
        console.log("Voters fetched:", grouped);
      });
  }, []);

  // Handle Excel Import
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    await fetch("/api/voters/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sheet),
    });

    window.location.reload();
  };
useEffect(() => {
    socket = io("http://192.168.29.110:4000");
    // socket = io("http://192.168.31.143:4000");
    // socket = io("https://election-backend-tudq.onrender.com");

    socket.on("connect", () => {
      console.log("Officer connected:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const unlockBooth = (boothId: string,studentId:string) => {
    if (!studentId) return alert("Enter student ID first!");
    socket.emit("unlock-booth", { boothId, studentId });
    };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Vote className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link href="/admin">Dashboard</Link>
            </Button>

            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition cursor-pointer">
              <FileSpreadsheet className="w-5 h-5" />
              Upload Excel
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

           
          </div>
        </div>
      </div>

      {/* Display Voters */}
      {Object.keys(voters).length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-20">
          <Upload className="w-16 h-16 mb-4 text-gray-400" />
          <p className="text-lg font-medium">No voters uploaded yet</p>
          <p className="text-sm">Start by uploading an Excel file.</p>
        </div>
      ) : (
        <div className="mt-8 max-w-5xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {Object.keys(voters).map((className) => (
              <AccordionItem
                key={className}
                value={className}
                className="border rounded-lg shadow-sm bg-white"
              >
                <AccordionTrigger className="px-4 py-3 flex justify-between items-center hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="text-lg font-semibold text-gray-800">
                      Class {className}
                    </span>
                  </div>
                  <Badge variant="secondary">
                    {voters[className].length} Voters
                  </Badge>
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="border-0 shadow-none">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-100">
                            <TableHead>Name</TableHead>
                            <TableHead>Roll No</TableHead>
                            <TableHead className="text-center">
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {voters[className].map((voter, idx) => (
                            <TableRow
                              key={voter._id || idx}
                              className="hover:bg-gray-50 transition"
                            >
                              <TableCell className="font-medium">
                                {voter.name}
                              </TableCell>
                              <TableCell>{voter.studentId}</TableCell>
                              <TableCell className="text-center">
                                <Button
                                  size="sm"
                                  className="mx-2"
                                  onClick={() =>
                                    // router.push(`/voter/${voter._id}`)
                                    unlockBooth("booth1", voter._id ?? "")
                                    
                                  }
                                >
                                  Booth 1
                                </Button>
                                 <Button
                                 className="mx-2"
                                  size="sm"
                                  onClick={() =>
                                    // router.push(`/voter/${voter._id}`)
                                    unlockBooth("booth2", voter._id ?? "")
                                    
                                  }
                                >
                                  Booth 2
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
