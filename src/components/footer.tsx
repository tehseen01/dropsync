import Link from "next/link";
import { FileUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 md:px-6 py-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <FileUp className="h-6 w-6 text-primary" />
              <Link href="/" className="text-xl font-bold">
                DropSync
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Secure and instant file sharing with QR codes
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/receive" className="text-muted-foreground hover:text-foreground">
                  Receive Files
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="mailto:support@dropsync.com" className="text-muted-foreground hover:text-foreground">
                  support@dropsync.com
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} DropSync. All rights reserved.
        </div>
      </div>
    </footer>
  );
}