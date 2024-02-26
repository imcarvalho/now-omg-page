import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

export async function getShows() {
 // lol variable is named trakt but I'm using serializd now and I'm too lazy to change the env vars
 const id = process.env.TRAKTID;

 const shows = await fetch(
  `https://www.serializd.com/api/user/${id}/currently_watching_page/1?sort_by=date_added_desc`
 )
  .then((response) => response.json())
  .then(({ items }) =>
   items.map((show) => ({
    title: show.showName,
    link: `https://www.serializd.com/show/${show.showId}`,
    image: `https://serializd-tmdb-images.b-cdn.net/t/p/w300${show.bannerImage}`,
   }))
  );

 return shows;
}
