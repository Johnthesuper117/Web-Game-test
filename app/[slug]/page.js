import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGameBySlug, getGames } from '@/lib/games';

export const dynamicParams = false;

export function generateStaticParams() {
  return getGames().map((game) => ({ slug: game.slug }));
}

export function generateMetadata({ params }) {
  const game = getGameBySlug(params.slug);

  if (!game) {
    return {
      title: 'Game not found | Web Game Test',
    };
  }

  return {
    title: `${game.title} | Web Game Test`,
    description: `Play ${game.title} in the shared iframe layout.`,
  };
}

export default function GamePage({ params }) {
  const game = getGameBySlug(params.slug);

  if (!game) {
    notFound();
  }

  return (
    <main className="player-shell">
      <header className="player-header">
        <div>
          <p className="eyebrow">{game.provider}</p>
          <h1>{game.title}</h1>
          <p className="player-path">/{game.slug}</p>
        </div>
        <div className="player-actions">
          <Link href="/" className="button button-secondary">
            Back to list
          </Link>
          <a
            href={game.iframeSrc}
            target="_blank"
            rel="noreferrer"
            className="button"
          >
            Open source
          </a>
        </div>
      </header>

      <section className="player-frame-wrap">
        <iframe
          className="player-frame"
          title={game.title}
          src={game.iframeSrc}
          allowFullScreen
        />
      </section>
    </main>
  );
}