import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-violet-800 bg-[#4c1d95] py-8">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 lg:gap-8">
          {/* Column 1 */}
          <div className="flex flex-col gap-4 sm:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">StegoShield</span>
            </div>
            <p className="text-sm text-violet-100 max-w-[280px] leading-relaxed">
              Advanced steganography and encryption tools for secure, invisible data protection.
            </p>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-start gap-4 sm:items-center">
            <div className="flex flex-col items-start gap-4 sm:items-center">
              <h3 className="font-semibold text-white">Quick Links</h3>
              <ul className="flex flex-col items-start gap-3 text-sm text-violet-100 sm:items-center">
                <li>
                  <Link to="/app" className="transition-colors hover:text-white hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/app" className="transition-colors hover:text-white hover:underline">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/app" className="transition-colors hover:text-white hover:underline">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col items-start gap-4 sm:items-end">
            <div className="flex flex-col items-start gap-4 sm:items-center">
              <h3 className="font-semibold text-white">Security</h3>
              <ul className="flex flex-col items-start gap-3 text-sm text-violet-100 sm:items-center">
                <li>
                  <Link to="/app" className="transition-colors hover:text-white hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/app" className="transition-colors hover:text-white hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/app" className="transition-colors hover:text-white hover:underline">
                    Cookie Settings
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-violet-800 pt-8 text-center text-sm text-violet-200">
          <p>© 2026 StegoShield Protection. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
