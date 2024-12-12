import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { AuthProvider } from "../contexts/authcontext";
import { NotifProvider } from "@/components/ui/notif";
import MobileHeader from "@/components/mobileHeader";
import MobileNav from "@/components/mobileNav";
import "react-datepicker/dist/react-datepicker.css"; // Import react-datepicker styles

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const montserrat = localFont({
  src: "./fonts/Montserrat-VariableFont_wght.ttf",
  variable: "--font-montserrat",
  weight: "100 900",
});

const dancingScript = localFont({
  src: "./fonts/DancingScript-VariableFont_wght.ttf",
  variable: "--font-dancing-script",
  weight: "100 900",
});

export const metadata = {
  title: "Eventually - Create, Join & Schedule Events",
  description:
    "Let’s make it happen.. eventually. Join an event with a code now, no account required. Or make an account for more features. Want to create your own event? Schedule an event with your friends, family, co-workers, or anyone else. For free.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${dancingScript.variable} ${montserrat.variable} antialiased font-[family-name:var(--font-montserrat)] bg-pagebackground`}
      >
        <NotifProvider>
          <AuthProvider>
            {/* Desktop Navbar & Footer (hidden on mobile) */}
            <div className="hidden md:block lg:block">
              <Navbar />
            </div>

            {/* Mobile Header & Bottom Nav (hidden on desktop) */}
            <div className="pt-0 md:hidden lg:hidden">
              <MobileHeader />
            </div>

            <div>{children}</div>
              <Footer />
            <div className="block md:hidden lg:hidden">
              <MobileNav />
            </div>
          </AuthProvider>
        </NotifProvider>
      </body>
    </html>
  );
}
