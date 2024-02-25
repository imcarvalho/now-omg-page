import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

export async function getShows() {
  // doing this until I implement this with cheerio, since the Serializd API is now useless
  return [
  {
    title: "The Wire",
    image: "https://serializd-tmdb-images.b-cdn.net/t/p/w300/4lbclFySvugI51fwsyxBTOm4DqK.jpg",
    link: "https://www.serializd.com/show/1438",
  },
  {
    title: "Expats",
    image: "https://serializd-tmdb-images.b-cdn.net/t/p/w300/vKAkT96TIf3Mh8q2FXV6GqcuJab.jpg",
    link: "https://www.serializd.com/show/95556",
  },
  {
    title: "Masters of the Air",
    image: "https://serializd-tmdb-images.b-cdn.net/t/p/w300/rSAmgcoA74371rplbqM27yVsd3y.jpg",
    link: "https://www.serializd.com/show/46518"
  },
  {
    title: "Brush Up Life",
    image: "https://serializd-tmdb-images.b-cdn.net/t/p/w300/vEqyoS81tZJWDW0myiG42lNzUox.jpg",
    link: "https://www.serializd.com/show/215197",
  },
  {
    title: "The Apothecary Diaries",
    image: "https://serializd-tmdb-images.b-cdn.net/t/p/w300/qGObcxuXKcKhP43BqTeIC7KgRcM.jpg",
    link: "https://www.serializd.com/show/220542",
  },
  {
    title: "A Sign of Affection",
    image: "https://serializd-tmdb-images.b-cdn.net/t/p/w300/xRHlM1Gs4Ws9QNXyYrZGdQ0V45F.jpg",
    link: "https://www.serializd.com/show/230059",
  }
];
  // lol variable is named trakt but I'm using serializd now and I'm too lazy to change the env vars
  const id = process.env.TRAKTID;

  const shows = await fetch(
    `https://www.serializd.com/api/user/${id}/currently_watching?sort_by=showName_asc`
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
