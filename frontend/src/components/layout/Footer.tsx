export default function Footer() {
  return (
    <footer className="border-t border-ink-900/10 bg-chalk-50 py-8 text-center text-sm text-ink-900/50">
      © {new Date().getFullYear()} BuffTurf. All rights reserved.
    </footer>
  );
}