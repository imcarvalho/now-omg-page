import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const getURL = (
  method: 'gettopalbums' | 'gettoptracks' | 'gettopartists',
  period: "1month" | "7day" | "overall" = "1month"
) => {
  const apiKey = process.env.LASTFMKEY;
  const user = process.env.LASTFMUSER;

  return `https://ws.audioscrobbler.com/2.0/?method=user.${method}&user=${user}&api_key=${apiKey}&format=json&period=${period}`;
};

const getImage = (images: { size: string; '#text': string }[]) => {
  return images[images.length - 1]['#text'];
};

export async function getTopAlbums() {
  const albumsData = await fetch(getURL('gettopalbums'));
  const albumBody = await albumsData.json();
  const albums = albumBody.topalbums.album.slice(0, 3);

  const albumsFormatted = albums.map((album) => ({
    title: `${album.artist.name} - ${album.name}`,
    image: getImage(album.image),
    link: `https://musicbrainz.org/release/${album.mbid}`,
  }));

  return albumsFormatted;
}
