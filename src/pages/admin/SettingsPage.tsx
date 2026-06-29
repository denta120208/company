import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-5">Settings</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Settings size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 text-sm">Settings panel coming soon.</p>
      </div>
    </div>
  )
}
