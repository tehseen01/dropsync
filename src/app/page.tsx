import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileIcon, UploadCloud, MonitorSmartphone } from "lucide-react";
import { Features } from "@/components/features";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Share Files Instantly with QR Codes
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  No account needed. Generate a QR code, let others scan and upload, receive files instantly.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/receive">
                  <Button size="lg" className="animate-pulse bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
                    Start Receiving Files
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <Features />
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  How It Works
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Transfer files in three simple steps
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-card">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <MonitorSmartphone className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold">Generate QR Code</h3>
                  <p className="text-muted-foreground text-center">
                    Create a receiving session and get a unique QR code
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-card">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <FileIcon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold">Scan & Upload</h3>
                  <p className="text-muted-foreground text-center">
                    Sender scans QR code and uploads files directly
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-card">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <UploadCloud className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold">Receive Instantly</h3>
                  <p className="text-muted-foreground text-center">
                    Files appear in real-time on your device for download
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}