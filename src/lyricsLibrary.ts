import axios, { AxiosRequestConfig } from "axios";
import cheerio from 'cheerio';
import { SearchData } from './types';

export class LyricsVerse {
  private options:AxiosRequestConfig = {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4918.0 Safari/537.36",
      referer: "https://www.karaoke-lyrics.net/",
    },
  };

  async search(query: string): Promise<SearchData | null> {
    const searchUrl = `https://www.karaoke-lyrics.net/search?sid=jyptz&q=${encodeURIComponent(query)}`;

    const htmls = await axios.get(searchUrl, this.options);
    const $ = cheerio.load(htmls.data);

    const spanSSong = $("span.searchresrow_songs").eq(0);
    if (!spanSSong.length) return null;

    const aSSong = spanSSong.children().eq(0);
    const songUrl = `https://www.karaoke-lyrics.net${aSSong.attr('href')}`;

    const htmlSong = await axios.get(songUrl, this.options);
    const $song = cheerio.load(htmlSong.data);

    const artist = $song("div.navigation_lyrics").children().eq(2).text().trim();

    const h1sTitle = $song("h1#song_title").text();
    const title = h1sTitle.replace("- lyrics", "").trim();

    const lyrics = $song("div.para_row")
      .map((i, el) => $song(el).text().trim())
      .get()
      .join("\n\n");

    const data: SearchData = { title, artist, lyrics };
    return data;
  }
}
