import { Video as LucideIcon } from 'lucide-react';

export default function PlaceholderSection({ title, description, icon: Icon }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-600">{description}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-6 bg-emerald-100 rounded-full">
            <Icon size={48} className="text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
          <p className="text-slate-600 max-w-md">{description}</p>
          <button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
