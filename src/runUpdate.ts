import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { Handler, HandlerEvent, schedule } from '@netlify/functions';
import { getShows } from './services/tv';
import { getBooks } from './services/books';
import { getTopAlbums } from './services/music';
import { baseMarkdown } from './assets/baseMarkdown';

dotenv.config();

const replaceKeys = ({
  tv,
  book,
  albums,
}: {
  tv: string;
  book: string;
  albums: string;
}) => {
  return baseMarkdown
    .replace('{TV_SHOWS}', tv)
    .replace('{BOOK}', book)
    .replace('{ALBUMS}', albums);
};

const getContent = async () => {
  const book = await getBooks();
  const shows = await getShows();
  const albums = await getTopAlbums();

  const formattedShows = shows
    .map((show) => `\n [![${show.title}](${show.image})](${show.link})`)
    .join('\n');

  const formattedAlbums = albums
    .map((album) => `\n [![${album.title}](${album.image})](${album.link})`)
    .join('\n');

  return replaceKeys({
    tv: formattedShows,
    book: `[![${book.title}](${book.image})](${book.link})\n`,
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

const runUpdate: Handler = async (event: HandlerEvent) => {
  console.log('Received event:', event);

  await update();

  return {
    statusCode: 200,
  };
};

const handler = schedule('@daily', runUpdate);

export { handler };
