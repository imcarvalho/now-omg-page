import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const getURL = (
  method: 'gettopalbums' | 'gettoptracks' | 'gettopartists',
  period: '1month' | '7day' | 'overall' = '1month'
) => {
  const apiKey = process.env.LASTFMKEY;
  const user = process.env.LASTFMUSER;

  return `https://ws.audioscrobbler.com/2.0/?method=user.${method}&user=${user}&api_key=${apiKey}&format=json&period=${period}`;
};

export async function getTopAlbums() {
  const albumsData = await fetch(getURL('gettopalbums'));
  const albumBody = await albumsData.json();
  // out of 8 albums, 3 at least should have a picture
  const albums = albumBody.topalbums.album.slice(0, 8);

  const albumsFormatted = albums
    .map((album) => {
      const image = album.image[album.image.length - 1]['#text'];

      return !image
        ? null
        : {
            title: `${album.artist.name} - ${album.name}`,
            image,
            link: album.mbid
              ? `https://musicbrainz.org/release/${album.mbid}`
              : album.url,
          };
    })
    .filter((album) => album !== null)
    .slice(0, 3);

  return albumsFormatted;
}
