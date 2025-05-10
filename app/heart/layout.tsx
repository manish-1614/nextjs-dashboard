export default function Layout({ children }: { children: React.ReactNode }) {
  
  return (
    <div className="relative h-screen w-full">
      <div className="flex-grow w-full md:overflow-y-auto">{children}</div>
    </div>
  );
}