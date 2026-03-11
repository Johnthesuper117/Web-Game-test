import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="shell shell-center">
      <section className="hero hero-compact">
        <p className="eyebrow">404</p>
        <h1>That game slug does not exist.</h1>
        <p className="lede">Return to the catalog and pick a valid playable entry.</p>
        <Link href="/" className="button">
          Back to catalog
        </Link>
      </section>
    </main>
  );
}