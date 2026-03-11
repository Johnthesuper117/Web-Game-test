import Link from 'next/link';
import { getGames } from '@/lib/games';

export default function HomePage() {
  const games = getGames();

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Next.js + Vercel</p>
        <h1>Browser games, routed by slug.</h1>
        <p className="lede">
          This index is compiled from the existing game wrappers, then rendered as a
          single list of slug-based routes.
        </p>
        <div className="hero-meta">
          <span>{games.length} playable entries</span>
          <span>Shared iframe layout</span>
          <span>Ready for Vercel deploys</span>
        </div>
      </section>

      <section className="catalog" aria-label="Game catalog">
        {games.map((game) => (
          <Link key={game.slug} href={`/${game.slug}`} className="game-card">
            <div>
              <p className="card-kicker">{game.provider}</p>
              <h2>{game.title}</h2>
            </div>
            <div className="card-meta">
              <span>/{game.slug}</span>
              <span>Open game</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}