"use client";

import { useState } from "react";
import SelectOption from "./SelectOption";
import { Mail, Lock } from "lucide-react";
import ExternalUp from "./ExternalUp";

export default function AuthPage({
  mode,
  comment,
  firstInput,
  secondInput,
  external,
  button,
}: {
  readonly mode: string;
  readonly comment: string;
  readonly firstInput: string;
  readonly secondInput: string;
  readonly external: boolean;
  readonly button: string;
}) {
  const [formFirInput, setformFirInput] = useState("");
  const [formSecInput, setformSecInput] = useState("");

  return (
    <>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
          {comment}
        </h1>
        <p className="text-xs text-gray-500 mt-3 font-medium tracking-tight">
          {mode !== "verify" && <SelectOption mode={mode} />}
        </p>
      </div>
      <form onSubmit={() => {}} className="space-y-4">
        <div className="relative group">
          <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-600 group-focus-within:text-[#00FFA3] transition-colors" />
          <input
            type={firstInput}
            placeholder={firstInput}
            className="w-full bg-black border border-white/5 rounded-xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-[#00FFA3]/50 focus:ring-1 focus:ring-[#00FFA3]/50 transition-all text-white"
            value={formFirInput}
            onChange={(e) => setformFirInput(e.target.value)}
            required
          />
        </div>
        <div className="relative group">
          <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-600 group-focus-within:text-[#00FFA3] transition-colors" />
          <input
            type={secondInput}
            placeholder={secondInput}
            className="w-full bg-black border border-white/5 rounded-xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-[#00FFA3]/50 focus:ring-1 focus:ring-[#00FFA3]/50 transition-all text-white"
            value={formSecInput}
            onChange={(e) => setformSecInput(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-white text-black font-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] hover:bg-[#00FFA3] disabled:bg-gray-800 transition-all shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(0,255,163,0.2)] mt-4"
        >
          {button}
        </button>
        {external && <ExternalUp />}
      </form>
    </>
  );
}
