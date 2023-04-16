import dotenv from 'dotenv';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

dotenv.config();

export async function getGames() {
  const user = process.env.STEAMUSER;

  const response = await fetch(`https://steamcommunity.com/id/${user}`);
  const body = await response.text();
  const $ = cheerio.load(body);

  const mostRecent = $('.recent_game_content:first');

  if (!mostRecent) {
    return [];
  }

  // check if it's recent

  const dateDetails = mostRecent
    .find('.game_info_details')
    .html()
    .trim()
    .split('last played on ');

  if (dateDetails.length !== 2) {
    return [];
  }

  const currentDate = new Date();
  const currentYear = new Date().getFullYear();
  let latestDateStr = dateDetails[1];

  // in case it returns something like "25 Apr", it's a date from the current year
  if (latestDateStr.length < 7) {
    latestDateStr += ` ${currentYear}`;
  }
  const latestDate = new Date(latestDateStr);

  const howManyDaysAgo = Math.ceil(
    (currentDate.getTime() - latestDate.getTime()) / (1000 * 3600 * 24)
  );

  // if I haven't played this in over a month, might as well not include it
  if (howManyDaysAgo > 30) {
    return [];
  }

  const image = mostRecent.find('.game_capsule').attr('src');
  const link = mostRecent.find('.game_name a').attr('href');
  const title = mostRecent.find('.game_name a').html();

  return [
    {
      title,
      link,
      image,
    },
  ];
}
