import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/public/Home'
import Products from './pages/public/Products'
import ProductDetail from './pages/public/ProductDetail'
import About from './pages/public/About'
import Contact from './pages/public/Contact'

const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const ImportPage = lazy(() => import('./pages/admin/ImportPage'))
const ManageCategories = lazy(() => import('./pages/admin/ManageCategories'))
const ManageProducts = lazy(() => import('./pages/admin/ManageProducts'))

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-[400px] text-gray-500">Loading...</div>}>{children}</Suspense>
}

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/login" element={<SuspenseWrapper><Login /></SuspenseWrapper>} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<SuspenseWrapper><Dashboard /></SuspenseWrapper>} />
        <Route path="import" element={<SuspenseWrapper><ImportPage /></SuspenseWrapper>} />
        <Route path="categories" element={<SuspenseWrapper><ManageCategories /></SuspenseWrapper>} />
        <Route path="products" element={<SuspenseWrapper><ManageProducts /></SuspenseWrapper>} />
      </Route>
    </Routes>
  )
}

export default App
