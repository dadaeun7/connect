import { Search } from "lucide-react";

export default function IssueSearch() {
  return (
    <div className="flex gap-4 mb-10">
      <div className="relative flex-1">
        <input
          className="w-full bg-[#111] border border-white/10 rounded-2xl py-3.5 px-12 outline-none text-sm focus:border-[#00FFA3]/50 transition-all"
          placeholder="Search issues..."
        />
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-600" />
      </div>
      <button className="bg-[#111] border border-white/10 px-6 py-2 rounded-2xl text-xs font-bold hover:bg-[#1A1A1A]">
        FILTER
      </button>
    </div>
  );
}
