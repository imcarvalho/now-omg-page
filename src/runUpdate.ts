import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { Handler, HandlerEvent, schedule } from '@netlify/functions';
import { getShows } from './services/tv';
import { getBooks } from './services/books';
import { getTopAlbums } from './services/music';
import { getGames } from './services/games';
import { baseMarkdown } from './assets/baseMarkdown';

dotenv.config();

const replaceKeys = ({
  tv,
  book,
  albums,
  game,
}: {
  tv: string;
  book: string;
  albums: string;
  game: string;
}) => {
  return baseMarkdown
    .replace('{TV_SHOWS}', tv)
    .replace('{BOOK}', book)
    .replace('{ALBUMS}', albums)
    .replace('{GAME}', game);
};

const getContent = async () => {
  const book = await getBooks();
  const shows = await getShows();
  const albums = await getTopAlbums();
  const game = await getGames();

  const formattedShows = shows
    .map((show) => `\n [![${show.title}](${show.image})](${show.link})`)
    .join('\n');

  const formattedAlbums = albums
    .map((album) => `\n [![${album.title}](${album.image})](${album.link})`)
    .join('\n');

  // games are the only thing I can be long stretches of time without
  const formattedGame =
    game.length === 0
      ? "Haven't played anything recently!"
      : `[![${game[0].title}](${game[0].image})](${game[0].link})\n`;

  return replaceKeys({
    tv: formattedShows,
    book: `[![${book.title}](${book.image})](${book.link})\n`,
    game: formattedGame,
    albums: formattedAlbums,
  });
};

const update = async () => {
  const omglolkey = process.env.OMGLOLKEY;
  const content = await getContent();

  await fetch('https://api.omg.lol/address/ines/now', {
    headers: {
      Authorization: `Bearer ${omglolkey}`,
    },
    method: 'POST',
    body: JSON.stringify({
      content,
      listed: 1,
    }),
  }).then((response) => {
    if (response.status === 200) {
      console.log('✅ Success');
    } else {
      console.log('❌ Failure');
      console.log(response);
    }
  });
};

update();

// This is the magic for Netlify scheduled functions ✨
const runUpdate: Handler = async (event: HandlerEvent) => {
  console.log('Received event:', event);

  await update();

  return {
    statusCode: 200,
  };
};

const handler = schedule('@daily', runUpdate);

export { handler };
