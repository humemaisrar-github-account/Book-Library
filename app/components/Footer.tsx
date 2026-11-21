export default function Footer() {
  return (
    <footer className="bg-stone-900 py-6 text-center text-sm text-stone-300">
      <p>
        &copy; {new Date().getFullYear()} Humema Israr. All rights reserved.
      </p>
      <p className="mt-1 text-stone-500">Built with Next.js, React &amp; Tailwind CSS</p>
    </footer>
  );
}
