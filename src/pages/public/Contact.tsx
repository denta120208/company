import { useState, useCallback } from 'react'
import { Mail, Phone, MapPin, Clock, Send, Copy, Check } from 'lucide-react'

const contactInfo = [
  {
    icon: MapPin,
    title: 'Address',
    lines: [
      'Ruko Danau Sunter Mas Blok B No. 48',
      'Jl. Sunter Jaya 1, Jakarta Utara 14350',
      'Indonesia',
    ],
  },
  {
    icon: Phone,
    title: 'Telepon',
    href: 'tel:+622129460530',
    value: '(021) 2946 0530',
  },
  {
    icon: Mail,
    title: 'Email',
    href: 'mailto:miliakreastika@yahoo.com',
    value: 'miliakreastika@yahoo.com',
    copyable: true,
  },
  {
    icon: Clock,
    title: 'Business Hours',
    lines: ['Monday - Friday: 08:00 - 17:00', 'Saturday: 08:00 - 13:00'],
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' })
  const [copied, setCopied] = useState(false)

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText('miliakreastika@yahoo.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Inquiry from ${formData.name}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company || '-'}\n\n${formData.message}`
    )
    window.location.href = `mailto:miliakreastika@yahoo.com?subject=${subject}&body=${body}`
  }

  return (
    <div className="pt-20 lg:pt-24">
      {/* HEADER */}
      <section className="relative bg-gray-900 py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-glow" />
            Get In Touch
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Contact Us</h1>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto">
            Get in touch for inquiries, quotations, and partnerships
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* INFO */}
            <div className="animate-fade-in-left">
              <h2 className="text-xl font-bold text-gray-900 mb-8">Get In Touch</h2>
              <div className="space-y-6">
                {contactInfo.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="flex items-start gap-4 group">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shrink-0 transition-all">
                        <Icon size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                        {'lines' in item && item.lines && (
                          item.lines.map((line, i) => (
                            <p key={i} className="text-sm text-gray-500 mt-0.5">{line}</p>
                          ))
                        )}
                        {'value' in item && item.value && (
                          <div className="flex items-center gap-2 mt-0.5">
                            {'href' in item && item.href ? (
                              <a href={item.href} className="text-sm text-blue-600 hover:underline">{item.value}</a>
                            ) : (
                              <span className="text-sm text-gray-500">{item.value}</span>
                            )}
                            {'copyable' in item && item.copyable && (
                              <button onClick={copyEmail} className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="Copy email">
                                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-10 rounded-xl overflow-hidden border border-gray-200 card-hover">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.8549384179705!2d106.8590696730423!3d-6.150175560280665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f51e4c521ea7%3A0x5ad094ab5e381ba9!2sPT.%20MILIA%20KREASTIKA%20PERSADA!5e0!3m2!1sid!2sus!4v1782704448027!5m2!1sid!2sus"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Google Maps"
                />
              </div>
            </div>

            {/* FORM */}
            <div className="animate-fade-in-right">
              <h2 className="text-xl font-bold text-gray-900 mb-8">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                  <input type="text" required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg input-focus" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input type="email" required value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg input-focus" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company</label>
                  <input type="text" value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg input-focus" placeholder="Your company name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea required rows={5} value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg input-focus resize-none" placeholder="Your message" />
                </div>
                <button type="submit"
                  className="btn-primary w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/25">
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
