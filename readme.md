# VookIt!

✨100%趣味で書かれたソフトウェアです。

I really wanted to write a sentence in Japanese. It means “This software is written entirely as a hobby.” It’s sales copy of light-weighted novel, *BAKEMONOGATARI*.

  VookIt! = <u>V</u>ideo + B<u>ook</u>mark <u>it!</u>

*VookIt* is short video sharing software.

~~日本語で「ヴキット！」って発音してほしいけど、字面にするとダサい、草。~~

## Future

### Implemented features

- Ultrawide support

### TODO

- Tag
- Chunk uploading with JavaScript
- Bypass audio data (ABR 256 kbps AAC-LC only)
- 24/48/60 fps detection (30 fps only)

### Planned Features

- Portrait Video support
- Markdown Description
- Limited Share (account-based & time-based limit)
- List view for top page
- Reaction (like misskey.io)
  - Text-based (use emoji and short word)
    - like "lol", "No Way!", "For Real?", "What?", "(笑)", "笑", "草", "w", "W", "www", "草www", "草に草生やすなwww", "マジで?" and "🤔"
    - DO NOT TRANSLATION. But, show meaning.

### Under Consideration

- Change database
- 120 fps support
  - detect device refresh rate
  - preferred bitrate
- HDR support
  - 10-bit encoding system
  - SDR color grading
  - detect device HDR status
- Use Open API for REST API Schema

### Not Planned Features

- **Live streaming**

## Architecture

### Frontend: clogs

- Routers: parse requests ([Express](https://expressjs.com/))
  - Validators: valid request ([express-validator](https://github.com/express-validator/express-validator))
- Coordinates: call usecases and render views
- Views: build views ([React](https://react.dev/) SSR + [Bulma](https://bulma.io/))
- Usecase: execute jobs
- Database: read/write data ([Prisma](https://www.prisma.io/) + sqlite)

```
+-------------+
|   Browser   |
+-------------+
  ↓ 1  ↑ 11
+-------------+
|   Routers   |
+-------------+
  ↓ 2  ↑ 10
+-------------+  9 +-------------+
| Coordinates | ⇆ |    Views    |
+-------------+  8 +-------------+
  ↓ 3  ↑ 7
+-------------+
|   Usecase   |
+-------------+
  ↓ 5  ↑ 6
+-------------+
|  Database   |
+-------------+
```

### Backend: hawks

- Service Workers: dispatch services ([BullMQ](https://docs.bullmq.io/) with [Redis](https://redis.io/))
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
