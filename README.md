<h1 align="center"> PeekABoo </h1>

#### Features
- Free movies, tv shows and anime
- "Rooms" offering live chat while watching movies/episodes together
- More than 15 servers to choose from in case one fails

#### Planned features
- Manga, books, comics and news
- Non-intrusive ads

## How it works
#### Sources
PeekABoo makes use of the [Consumet API](https://github.com/consumet/api.consumet.org), specifically the [consumet.ts](https://github.com/consumet/consumet.ts) library to get anime and movies when possible.

It also makes use of [TMDB](https://themoviedb.org) to get metadata of movies and TV shows, after which it gets embedded players for said movies/shows from VidSrc and Superembed.

It then scrapes VidSrc to get the direct streaming link (.m3u8 playlist) for the currently playing media.

#### Tools and libraries
- [Consumet API](https://github.com/consumet/api.consumet.org)
- [Consumet.ts](https://github.com/consumet/consumet.ts)
- [The Movie DB (TMDB)](https://themoviedb.org)
- [DrissionPage](https://github.com/g1879/DrissionPage) for web scraping
- [CloudflareBypassForScraping](https://github.com/sarperavci/CloudflareBypassForScraping) to bypass Captcha's
- [Cheerio](https://cheerio.js.org) for web scraping

## How to run
- Clone the repository
```
git clone https://github.com/WinterSunset95/PeekABoo
cd PeekABoo
```

- Start the frontend
    - Install the npm packages
    ```
    cd peek-a-boo
    npm install
    ```

    - Start the dev server
    ```
    ionic serve
    ```

- Backend
```
cd backend
deno run dev
```

- Scraper
```
cd scraper/src
pip install -r requirements.txt
fastapi dev main.py
```
