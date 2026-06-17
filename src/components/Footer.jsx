import { Link } from "react-router-dom"; // برای ناوبری بین صفحات بدون ریفریش
import { BookOpen, Mail, Github, Twitter } from "lucide-react"; // آیکن های کتاب
import { useAuth } from "../context/AuthContext"; // هوک سفارسی برای احزار هویت

// تعریف کامپونیت
const Footer = () => {
  const { isAuthenticated } = useAuth();

  // لینک داینامیک های فوتر
  const footerLinks = [
    { name: "Explore Stories", path: "/explore" },
    { name: "Add Story", path: isAuthenticated ? "/add-story" : "/login" },
    { name: "About", path: "/" },
  ];

  // ساختار اصلی فوتر
  return (
    <footer className="bg-background-secondary border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-accent to-secondary-accent flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-background" />
              </div>
              <span className="text-xl font-bold text-text-primary">
                Afghan Folklore Archive
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              Preserving the rich cultural heritage of Afghanistan through the
              timeless art of storytelling. A digital sanctuary for ancient
              wisdom and folklore.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-text-primary font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-text-secondary hover:text-primary-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {!isAuthenticated && (
                <>
                  <li>
                    <Link
                      to="/register"
                      className="text-text-secondary hover:text-primary-accent transition-colors text-sm"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-text-primary font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 rounded-lg bg-card-background border border-border hover:border-primary-accent transition-colors group"
              >
                <Mail className="w-5 h-5 text-text-secondary group-hover:text-primary-accent transition-colors" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-card-background border border-border hover:border-primary-accent transition-colors group"
              >
                <Twitter className="w-5 h-5 text-text-secondary group-hover:text-primary-accent transition-colors" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-card-background border border-border hover:border-primary-accent transition-colors group"
              >
                <Github className="w-5 h-5 text-text-secondary group-hover:text-primary-accent transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-text-secondary text-sm">
            &copy; 2026 Afghan Folklore Archive. All rights reserved. Preserving
            culture, one story at a time.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
