# VookIt!

✨100%趣味で書かれたソフトウェアです。

I really wanted to write a sentence in Japanese. It means “This software is written entirely as a hobby.” It’s sales copy of light-weighted novel, *BAKEMONOGATARI*.

  VookIt! = <u>V</u>ideo + B<u>ook</u>mark <u>it!</u>

*VookIt* is short video sharing software. **In the Development Stages!!**

~~日本語で「ヴキット！」って発音してほしいけど、字面にするとダサい、草。~~

## Features and Future

### Implemented features

- Create MPEG-DASH & HLS files automatically
- Ultrawide (21.6:9) & 120 fps video support
- Chunk uploading with JavaScript
- HEVC (default off) & AV1 video support

### TODO

- **Manage streams** (I'm sorry. Currently, stream name isn't applied automatically.)
- **User authentication**
- Tag
  - Tune encode settings by game title tag.
- Bypass audio data (ABR 256 kbps AAC-LC only)
- Detect device features (120 fps, HDR and supported codec)

### Planned Features

- Markdown Description
- Limited Share (account-based & time-based limit)
- List view for top page
- Reaction (like misskey.io)
  - Text-based (use emoji and short word)
    - like "lol", "No Way!", "For Real?", "What?", "(笑)", "笑", "草", "w", "W", "www", "草www", "草に草生やすなwww", "マジで?" and "🤔"
    - DO NOT TRANSLATION. But, show meaning.
- Portrait video support
- HDR video support
  - 10-bit encoding system
  - SDR color grading

### Under Consideration

- Change database

### Not Planned Features

- **Live streaming**

## How to Use

1. Install nodejs, Redis, ffmpeg and SQLite.
2. Build static assets.
  ```shell-session
  % npm run webpack:build
  ```
3. Generate SSL certificate (if use ssl).
  ```shell-session
  % npm run openssl:init
  ```
4. Start redis, clogs (frontend) and hawks (backend).
  ```shell-session
  % npm run redis:start
  % npm run clogs:start
  % npm run hawks:start
  ```
5. (Tentatively) Create your user. Currently program use screenname "dev" (hard coding on source).
  ```shell-session
  % npm run user:new
  ```
6. (Manual) Rename directory after encoding. For example, rename "./.media/[usid]/st_avc1_ntvp" to "./.media/[usid]/avc1". In the future, program use as-is stream name like "st_avc1_720p" or "st_avc1_ntvp".

## Architecture

### Frontend: clogs

- Controllers: parse requests, invoke usecases and return objects ([nest](https://nestjs.com/) with [fastify](https://fastify.dev/))
- Views: build views ([React](https://react.dev/) SSR + [Bulma](https://bulma.io/))
- Usecase: execute jobs
- Database: read/write data ([Prisma](https://www.prisma.io/) with sqlite)

```
+-------------+
|   Browser   |
+-------------+
  ↓ 1  ↑ 6
+-------------+
| Controllers |
+-------------+
  ↓ 2  ↑ 5
+-------------+
|   Usecase   |
+-------------+
  ↓ 3  ↑ 4
+-------------+
|  Database   |
+-------------+
```

### Backend: hawks

- Service Workers: dispatch tasks ([BullMQ](https://docs.bullmq.io/) with [Redis](https://redis.io/))
- Dispatchers: create jobs (internal)
- Encoders: encode video and audio (ffmpeg with x264, x265, libvpx, SVT-AV1 and so on…)

```
+-----------------+
| Service Worker  |
+-----------------+
    ↓ 1    ↑ 4
+-----------------+
|   Dispatcher    |
+-----------------+
    ↓ 2    ↑ 3
+-----------------+
|     Encoder     |
+-----------------+
```

## Authors

- mntone - Initial work.

## License

*VookIt!* is licensed under the GPLv3 license - see the [LICENSE.txt](https://github.com/mntone/VookIt/blob/master/LICENSE.txt) file for details.
