"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const options = {
    headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4918.0 Safari/537.36",
        referer: "https://www.karaoke-lyrics.net/",
    },
};
function search(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchUrl = `https://www.karaoke-lyrics.net/search?sid=jyptz&q=${encodeURIComponent(query)}`;
        const htmls = yield axios_1.default.get(searchUrl, options);
        const $ = cheerio.load(htmls.data);
        const spanSSong = $("span.searchresrow_songs").eq(0);
        if (!spanSSong.length)
            return null;
        const aSSong = spanSSong.children().eq(0);
        const songUrl = `https://www.karaoke-lyrics.net${aSSong.attr('href')}`;
        const htmlSong = yield axios_1.default.get(songUrl, options);
        const $song = cheerio.load(htmlSong.data);
        const artist = $song("div.navigation_lyrics").children().eq(2).text().trim();
        const h1sTitle = $song("h1#song_title").text();
        const title = h1sTitle.replace("- lyrics", "").trim();
        const lyrics = $song("div.para_row")
            .map((i, el) => $song(el).text().trim())
            .get()
            .join("\n\n");
        const data = { title, artist, lyrics };
        return data;
    });
}
exports.default = search;
