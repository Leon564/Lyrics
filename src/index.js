const axios = require("axios");
const cheerio = require("cheerio");

async function search(q) {
  const options = {
    header: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4918.0 Safari/537.36",
      referer: "https://www.karaoke-lyrics.net/",
    },
  };
  //Get html Search
  const htmls = await axios.get(
    `https://www.karaoke-lyrics.net/search?sid=jyptz&q=${encodeURIComponent(
      q
    )}`,
    options
  );
  const $ = cheerio.load(htmls.data);
  const spanSSong = $("span.searchresrow_songs")[0];
  if (!spanSSong) return null;
  const aSSong = spanSSong.children[0];
  //Get html Song
  const htmlSong = await axios.get(
    `https://www.karaoke-lyrics.net${aSSong.attribs.href}`,
    options
  );
  const $song = cheerio.load(htmlSong.data);
  //Get artist
  const artist = $song("div.navigation_lyrics").children().eq(2).text().trim();
  //Get title
  const h1sTitle = $song("h1#song_title").text();
  const title = h1sTitle.replace("- lyrics", "").trim();
  //Get lyrics
  const lyrics = $song("div.para_row")
    .map((i, el) => {
      return $(el).text().trim();
    })
    .toArray()
    .join("\n\n");

  const data = { title, artist, lyrics };
  return data;
}

module.exports = search;
