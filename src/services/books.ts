import dotenv from 'dotenv';
import fetch from 'node-fetch';
import xml2json from 'xml2json';

dotenv.config();

export async function getBooks() {
  const id = process.env.GOODREADSID;

  const books = await fetch(
    `https://www.goodreads.com/review/list_rss/${id}?shelf=currently-reading`
  )
    .then((response) => response.text())
    .then((str) => xml2json.toJson(str, { object: true }))
    .then((data) => {
      const book = data.rss.channel.item;

      if (book === undefined){
        return undefined;
      }

      // I never read more than 1 book at the same time
      return {
        title: book.title,
        authors: book.author_name,
        link: `https://www.goodreads.com/book/show/${book.book_id}`,
        image: book.book_medium_image_url,
      };
    });

  return books;
}
