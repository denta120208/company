import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Send, ChevronRight } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="relative">
        {/* Top wave decoration */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Logo & About */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.jpeg" alt="PT. Milia Kreastika Persada" className="h-9 w-auto" />
                <div>
                  <p className="text-sm font-semibold text-white">PT. Milia Kreastika Persada</p>
                  <p className="text-[10px] text-gray-500 tracking-wider uppercase">FMCG Export Company</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Trusted Indonesian FMCG export partner since 2012. We deliver premium quality food and consumer products to markets worldwide.
              </p>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Navigate</h3>
              <ul className="space-y-2.5">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'Products', to: '/products' },
                  { label: 'About Us', to: '/about' },
                  { label: 'Contact', to: '/contact' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors group"
                    >
                      <ChevronRight size={12} className="text-gray-600 group-hover:text-blue-500 transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-3">
              <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-gray-500" />
                  <span className="text-gray-500">
                    Ruko Danau Sunter Mas Blok B No. 48<br />
                    Jl. Sunter Jaya 1, Jakarta Utara 14350
                  </span>
                </li>
                <li>
                  <a href="mailto:miliakreastika@yahoo.com" className="flex items-center gap-2.5 text-gray-500 hover:text-white transition-colors group">
                    <Mail size={14} className="shrink-0 text-gray-500 group-hover:text-blue-500 transition-colors" />
                    miliakreastika@yahoo.com
                  </a>
                </li>
                <li>
                  <a href="tel:+622129460530" className="flex items-center gap-2.5 text-gray-500 hover:text-white transition-colors group">
                    <Phone size={14} className="shrink-0 text-gray-500 group-hover:text-blue-500 transition-colors" />
                    (021) 2946 0530
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-3">
              <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Get In Touch</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                Have questions or ready to partner? We're here to help.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                <Send size={14} />
                Contact Us
              </Link>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <p>&copy; {year} PT. Milia Kreastika Persada. All rights reserved.</p>
            <p className="text-gray-700">Premium Indonesian FMCG Exporter</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
