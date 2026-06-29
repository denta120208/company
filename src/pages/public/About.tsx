import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Eye, Target, Heart, Award, TrendingUp, Shield, ChevronRight, Package, Globe } from 'lucide-react'

const values = [
  { icon: Award, title: 'Quality First', desc: 'We ensure every product meets the highest quality standards.' },
  { icon: Heart, title: 'Integrity', desc: 'Honest and transparent business relationships with all partners.' },
  { icon: TrendingUp, title: 'Innovation', desc: 'Continuously improving our services and product offerings.' },
  { icon: Shield, title: 'Commitment', desc: 'Dedicated to delivering the best for our clients.' },
]

export default function About() {
  const [stats, setStats] = useState({ brands: 0, variants: 0, categories: 0 })

  useEffect(() => {
    async function load() {
      const { count: b } = await supabase.from('brands').select('*', { count: 'exact', head: true })
      const { count: v } = await supabase.from('variants').select('*', { count: 'exact', head: true })
      const { count: c } = await supabase.from('categories').select('*', { count: 'exact', head: true })
      setStats({ brands: b || 0, variants: v || 0, categories: c || 0 })
    }
    load()
  }, [])

  return (
    <div className="pt-20 lg:pt-24">
      {/* HEADER */}
      <section className="relative bg-gray-900 py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-glow" />
            Who We Are
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">About Us</h1>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto">
            Your trusted partner in Indonesian food and consumer product export
          </p>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Company Overview</h2>
              <div className="section-divider mt-3" />
              <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-900">PT. Milia Kreastika Persada</strong> is a trusted Indonesian FMCG export company dedicated to delivering high-quality food and consumer products to international markets.
                </p>
                <p>We partner with leading Indonesian manufacturers to provide our global clients with the finest products Indonesia has to offer.</p>
                <p>With years of experience in international trade, we ensure every shipment meets the highest standards of quality and compliance.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 stagger">
              {[
                { label: 'Categories', value: stats.categories || '20+', icon: Package },
                { label: 'Brands', value: stats.brands || '50+', icon: TrendingUp },
                { label: 'Variants', value: stats.variants || '200+', icon: ChevronRight },
                { label: 'Export Countries', value: '20+', icon: Globe },
              ].map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="bg-gray-50 rounded-xl p-5 text-center border border-gray-100 card-hover">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-2">
                      <Icon size={18} className="text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* VISI & MISI */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 card-hover">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shrink-0">
                  <Eye size={22} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Our Vision</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">
                    To become Indonesia's most trusted and reliable FMCG export partner, connecting Indonesian excellence with global markets.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 card-hover">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shrink-0">
                  <Target size={22} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Our Mission</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">
                    To provide high-quality Indonesian products to international buyers with professional service, competitive pricing, and reliable delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Our Values</h2>
            <div className="section-divider mt-3" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {values.map((v) => {
              const Icon = v.icon
              return (
                <div key={v.title} className="text-center p-6 rounded-xl bg-gray-50 border border-gray-100 card-hover">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mx-auto mb-3">
                    <Icon size={22} className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{v.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-500">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}


