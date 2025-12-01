"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, FileText, MessageSquare, Upload, Loader2 } from "lucide-react";

export default function AIToolsPage() {
  const { currentBusinessId, businesses } = useStore();
  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "ai"; content: string }>>([
    { role: "ai", content: "Hello! I'm Bizness Assistant. How can I help you today?" },
  ]);
  const [chatInput, setChatInput] = useState("");

  const currentBusiness = businesses.find((b) => b.id === currentBusinessId);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setOcrFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOcrFile(file);
    }
  };

  const simulateOCR = () => {
    if (!ocrFile) return;
    setIsScanning(true);
    
    // Simulate scanning animation
    setTimeout(() => {
      // Generate realistic random data
      const randomData = {
        invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toLocaleDateString("id-ID"),
        supplier: ["PT Supplier A", "CV Supplier B", "PT Supplier C"][Math.floor(Math.random() * 3)],
        items: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
          name: ["Product A", "Product B", "Product C", "Product D"][i % 4],
          quantity: Math.floor(Math.random() * 10) + 1,
          price: (Math.floor(Math.random() * 100000) + 10000),
        })),
        total: 0,
      };
      randomData.total = randomData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      setOcrResult(randomData);
      setIsScanning(false);
    }, 2000);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "";
      const businessType = currentBusiness?.type.toLowerCase() || "";
      
      if (userMessage.toLowerCase().includes("stock") || userMessage.toLowerCase().includes("inventory")) {
        aiResponse = `Based on your ${businessType} business, I recommend keeping a buffer stock of 20% above your average monthly sales. Would you like me to analyze your current inventory levels?`;
      } else if (userMessage.toLowerCase().includes("price") || userMessage.toLowerCase().includes("pricing")) {
        aiResponse = `For ${businessType} businesses, a good markup is typically 50-100% above cost. I can help you calculate optimal pricing for your products.`;
      } else if (userMessage.toLowerCase().includes("sales") || userMessage.toLowerCase().includes("revenue")) {
        aiResponse = `Your sales performance looks good! For ${businessType}, peak hours are usually morning and evening. Consider running promotions during slower periods.`;
      } else {
        aiResponse = `I understand you're asking about "${userMessage}". As your ${businessType} business assistant, I can help with inventory management, pricing strategies, sales analysis, and more. What specific area would you like to explore?`;
      }

      setChatMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">AI Tools</h1>
        <p className="text-slate-500">Leverage AI to streamline your business operations</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Document Intelligence (OCR) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Document Intelligence (OCR)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-colors hover:border-primary"
            >
              {isScanning ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-slate-600">Scanning document...</p>
                </div>
              ) : ocrResult ? (
                <div className="w-full space-y-2 text-left">
                  <h3 className="font-semibold">Extracted Data:</h3>
                  <div className="rounded-lg bg-white p-4 text-sm">
                    <p><strong>Invoice:</strong> {ocrResult.invoiceNumber}</p>
                    <p><strong>Date:</strong> {ocrResult.date}</p>
                    <p><strong>Supplier:</strong> {ocrResult.supplier}</p>
                    <div className="mt-2">
                      <strong>Items:</strong>
                      <ul className="ml-4 list-disc">
                        {ocrResult.items.map((item: any, i: number) => (
                          <li key={i}>
                            {item.name} - {item.quantity}x @ {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item.price)}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="mt-2 font-bold">Total: {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(ocrResult.total)}</p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setOcrResult(null);
                      setOcrFile(null);
                    }}
                  >
                    Scan Another Document
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="mb-4 h-12 w-12 text-slate-400" />
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Drag & drop invoice or receipt here
                  </p>
                  <p className="mb-4 text-xs text-slate-500">or</p>
                  <label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button type="button" variant="outline">
                      Browse Files
                    </Button>
                  </label>
                  {ocrFile && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-600">Selected: {ocrFile.name}</p>
                      <Button className="mt-2" onClick={simulateOCR}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Extract Data
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bizness Assistant (Chat) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Bizness Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[400px] flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto rounded-lg bg-slate-50 p-4">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.role === "user"
                          ? "bg-primary text-white"
                          : "bg-white text-slate-900 shadow-sm"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleChatSubmit} className="mt-4 flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me anything about your business..."
                  className="flex-1"
                />
                <Button type="submit">
                  <Sparkles className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


