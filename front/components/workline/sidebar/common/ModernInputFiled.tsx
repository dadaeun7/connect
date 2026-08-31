import React, { useState } from "react";
import { Link } from "lucide-react";
import { FieldProps } from "../../types/type";

export default function ModernInputField({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  projects,
  onSelectProject,
}: Readonly<FieldProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const tomorrowStr = new Date(Date.now() + 86400000).toLocaleDateString(
    "sv-SE",
  );

  return (
    <div className="relative flex flex-col w-full">
      <label
        htmlFor={id}
        className="pb-1 text-sm font-black uppercase tracking-wider text-[var(--foreground)]"
      >
        {label}
      </label>

      <div className="relative w-full">
        <input
          type={type}
          id={id}
          min={type === "date" ? tomorrowStr : ""}
          disabled={id === "project"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full bg-[var(--background)] border border-[var(--border)] rounded-lg py-[11.5px] text-[12px] text-[var(--foreground)] font-medium focus:outline-none focus:border-[var(--primary)] transition-all ${
            id === "project"
              ? "pl-10 pr-4 placeholder:text-transparent"
              : "px-3 placeholder:text-[var(--muted-foreground)]/30"
          }`}
        />

        {id === "project" && (
          <>
            <Link
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 cursor-pointer z-10 text-gray-500 hover:text-black transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            />
            <div className="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
              <span className="bg-black text-white text-[12px] font-mono font-black px-2.5 py-0.5 rounded shadow-sm">
                {placeholder}
              </span>
            </div>
          </>
        )}
      </div>

      {id === "project" && isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg z-50 overflow-y-auto p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
          {projects && projects.length > 0 ? (
            projects.map((p) => (
              <div
                key={p.id}
                className="py-2 px-2.5 text-[12px] font-bold text-[var(--foreground)] hover:bg-[var(--muted)] rounded-md cursor-pointer transition-colors"
                onClick={() => {
                  if (onSelectProject) onSelectProject(p);
                  setIsOpen(false);
                }}
              >
                {p.name}
              </div>
            ))
          ) : (
            <div className="py-2 px-2 text-xs text-[var(--muted-foreground)] font-medium">
              프로젝트가 존재하지 않습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
