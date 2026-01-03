import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>宋子杰的个人作品集</title>
        <meta
          name="description"
          content="欢迎来到宋子杰的个人世界，这里记录着我的琐事和作品"
        />
        <meta name="keywords" content="宋子杰,个人作品集,博客,创意设计" />
        <meta name="author" content="宋子杰" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-domain.com/" />
        <meta property="og:title" content="宋子杰的个人作品集" />
        <meta
          property="og:description"
          content="欢迎来到宋子杰的个人世界，这里记录着我的琐事和作品"
        />
        <meta property="og:image" content="/logo.svg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://your-domain.com/" />
        <meta property="twitter:title" content="宋子杰的个人作品集" />
        <meta
          property="twitter:description"
          content="欢迎来到宋子杰的个人世界，这里记录着我的琐事和作品"
        />
        <meta property="twitter:image" content="/logo.svg" />

        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
