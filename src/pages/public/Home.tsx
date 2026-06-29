import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Globe, Clock, Package, HeadphonesIcon, Award, ChevronDown, Users, Calendar } from 'lucide-react'
import type { Category, Brand } from '../../types/database'
import { supabase } from '../../lib/supabase'

const statsData = [
  { label: 'Established', value: '2012', icon: Calendar },
  { label: 'Export Countries', value: '16+', icon: Globe },
  { label: 'Product Categories', value: '20+', icon: Package },
  { label: 'Trusted Partners', value: '50+', icon: Users },
]

const features = [
  { icon: Shield, title: 'Competitive Prices', desc: 'Best market prices for bulk orders worldwide.' },
  { icon: Globe, title: 'Worldwide Export', desc: 'Reliable shipping to destinations across the globe.' },
  { icon: Clock, title: 'Fast Response', desc: 'Quick quotation and prompt customer service.' },
  { icon: Package, title: 'Professional Service', desc: 'Complete export documentation and handling.' },
  { icon: Award, title: 'Quality Assurance', desc: 'Strict quality control on every shipment.' },
  { icon: HeadphonesIcon, title: 'Reliable Packaging', desc: 'Export-grade packaging for product safety.' },
]

const exportGroups: { region: string; countries: { name: string; code: string }[] }[] = [
  {
    region: 'Asia',
    countries: [
      { name: 'Hongkong', code: 'hk' },
      { name: 'Taiwan', code: 'tw' },
      { name: 'China', code: 'cn' },
      { name: 'Malaysia', code: 'my' },
      { name: 'Brunei', code: 'bn' },
      { name: 'Singapore', code: 'sg' },
      { name: 'South Korea', code: 'kr' },
    ]
  },
  {
    region: 'Oceania',
    countries: [{ name: 'Australia', code: 'au' }]
  },
  {
    region: 'Middle East',
    countries: [
      { name: 'Qatar', code: 'qa' },
      { name: 'UAE', code: 'ae' },
      { name: 'Saudi Arabia', code: 'sa' },
      { name: 'Oman', code: 'om' },
      { name: 'Iraq', code: 'iq' },
    ]
  },
  {
    region: 'Europe',
    countries: [{ name: 'Netherlands', code: 'nl' }]
  },
  {
    region: 'Africa',
    countries: [
      { name: 'Namibia', code: 'na' },
      { name: 'Algeria', code: 'dz' },
    ]
  },
]

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])

  useEffect(() => {
    async function loadData() {
      const { data: cats } = await supabase.from('categories').select('*').limit(8)
      if (cats) setCategories(cats)
      const { data: brs } = await supabase.from('brands').select('*, variants:variants(count)').limit(6)
      if (brs) setBrands(brs)
    }
    loadData()
  }, [])

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-950/80 to-gray-900" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16 lg:pt-32 lg:pb-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full text-xs font-medium mb-6 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-glow" />
              Premium Indonesian FMCG Exporter
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-in-up">
              Trusted Indonesian<br />FMCG Export Partner
            </h1>
            <p className="mt-5 text-lg text-gray-300 max-w-xl leading-relaxed animate-fade-in-up">
              We export high quality Indonesian food and consumer products worldwide. Your trusted gateway to Indonesia's finest FMCG brands.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 animate-fade-in-up">
              <Link
                to="/products"
                className="btn-primary inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/25"
              >
                Explore Products
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="btn-secondary inline-flex items-center gap-2 border border-gray-500 text-gray-200 px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-float">
          <ChevronDown size={24} className="text-white/50" />
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 lg:py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsData.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="text-center p-6 relative stagger">
                  <div className={`w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-3 animate-fade-in`} style={{ animationDelay: `${i * 100}ms` }}>
                    <Icon className="text-blue-600" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900">{stat.value}</div>
                  <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Product Categories</h2>
            <div className="section-divider mt-3" />
            <p className="mt-3 text-gray-500">Explore our wide range of high-quality Indonesian products</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 stagger">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group bg-white rounded-xl p-5 text-center border border-gray-200 card-hover"
              >
                {(cat as any).image ? (
                  <img src={(cat as any).image} alt={cat.name} className="w-12 h-12 mx-auto mb-3 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
                    {cat.name[0]}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Featured Brands</h2>
            <div className="section-divider mt-3" />
            <p className="mt-3 text-gray-500">We partner with Indonesia's most trusted FMCG brands</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 stagger">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/products/${brand.slug}`}
                className="group p-6 text-center rounded-xl border border-gray-200 bg-gray-50 card-hover"
              >
                {brand.thumbnail ? (
                  <img src={brand.thumbnail} alt={brand.name} className="h-12 w-auto mx-auto mb-3" />
                ) : (
                  <div className="w-14 h-14 mx-auto mb-3 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-gray-200 group-hover:to-gray-300 transition-all">
                    <span className="text-lg font-bold text-gray-600">{brand.name[0]}</span>
                  </div>
                )}
                <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Why Choose Us</h2>
            <div className="section-divider mt-3" />
            <p className="mt-3 text-gray-500">What makes us your trusted export partner</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {features.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-200 card-hover group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-4 group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
                    <Icon size={20} className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* EXPORT COUNTRIES */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Export Countries</h2>
            <div className="section-divider mt-3" />
            <p className="mt-3 text-gray-500">We serve customers across the globe</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            {exportGroups.map((group) => (
              <div key={group.region}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-3">
                  <span className="w-6 h-px bg-gray-300" />
                  {group.region}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {group.countries.map((c) => (
                    <div key={c.name} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-300 hover:bg-white hover:shadow-sm transition-all">
                      <img
                        src={`https://flagcdn.com/24x18/${c.code}.png`}
                        srcSet={`https://flagcdn.com/48x36/${c.code}.png 2x`}
                        alt={c.name}
                        className="w-6 h-[18px] rounded-sm object-cover shrink-0"
                        loading="lazy"
                      />
                      <span className="text-sm text-gray-700 font-medium">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 lg:py-24 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white">Interested in our products?</h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto">
            Contact us today for quotation and partnership opportunities.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="btn-primary inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/25"
            >
              Contact Us
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/products"
              className="btn-secondary inline-flex items-center gap-2 border border-gray-600 text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-white/5 transition-colors"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
