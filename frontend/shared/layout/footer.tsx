export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-900/50">
      <div className="mx-auto flex min-h-12 max-w-7xl flex-col items-center justify-center gap-1 px-4 py-3 text-center text-xs text-slate-500 sm:flex-row sm:justify-between sm:px-6 sm:text-sm">
        <span>SRM Credit Engine</span>

        <span>
          Desenvolvido por João Barbosa · © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
