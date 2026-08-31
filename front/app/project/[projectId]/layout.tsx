// app/project/[projectId]/layout.tsx
import { ConfirmationProvider } from "@/components/share/ConfirmationContext";

export default function ProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConfirmationProvider>
      <div className="project-container">
        <main>{children}</main>
      </div>
    </ConfirmationProvider>
  );
}
