import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

export async function getShows() {
  const id = process.env.TRAKTID;

  const shows = await fetch(
    `https://www.serializd.com/api/user/${id}/currently_watching_page/1?sort_by=showName_asc#`
  )
    .then((response) => response.json())
    .then((data) =>
      data.items.map((show) => ({
        title: show.showName,
        link: `https://www.serializd.com/show/${show.showId}`,
        image: `https://serializd-tmdb-images.b-cdn.net/t/p/w300${show.bannerImage}`,
      }))
    );

  return shows;
}
