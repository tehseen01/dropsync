import { Shield, Zap, Clock, Smartphone } from "lucide-react";

export function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Instant Transfers</h3>
            <p className="text-muted-foreground">
              Files transfer in real-time with immediate availability
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Secure & Private</h3>
            <p className="text-muted-foreground">
              End-to-end encrypted transfer with no permanent storage
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">No Registration</h3>
            <p className="text-muted-foreground">
              No accounts or registration required to share files
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Smartphone className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Mobile Friendly</h3>
            <p className="text-muted-foreground">
              Optimized for all devices with responsive design
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}