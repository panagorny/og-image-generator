import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

const fontRegular = fetch(
  'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf'
).then((res) => res.arrayBuffer());

const fontBold = fetch(
  'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf'
).then((res) => res.arrayBuffer());

export default async function handler(req, res) {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const title = searchParams.get('title') || 'Бирюза Консалтинг Групп';
  const category = searchParams.get('category') || 'Поддержка трансформации бизнеса';

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 80px',
          fontFamily: 'Inter',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#1A3A42',
        },
        children: [
          {
            type: 'img',
            props: {
              src: 'https://www.birjuza.ru/_public/images/og/samo.jpg',
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: 1200,
                height: 630,
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: 1200,
                height: 630,
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
              },
            },
          },
          {
            type: 'img',
            props: {
              src: 'https://www.birjuza.ru/_template/main/images/webp/logo_bw_rus.png',
              style: {
                height: '96px',
                marginBottom: '40px',
                position: 'relative',
                zIndex: 1,
                filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8))',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '48px',
                fontWeight: 700,
                color: '#FFFFFF',
                textAlign: 'center',
                marginBottom: '20px',
                lineHeight: 1.2,
                maxWidth: '1000px',
                position: 'relative',
                zIndex: 1,
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '28px',
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
                lineHeight: 1.4,
                maxWidth: '800px',
                position: 'relative',
                zIndex: 1,
              },
              children: category,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: await fontBold,
          weight: 700,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: await fontRegular,
          weight: 400,
          style: 'normal',
        },
      ],
    }
  );

  // Рендерим SVG в PNG
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  });
  const pngBuffer = resvg.render().asPng();

  // Конвертируем PNG в JPEG с качеством 80%
  const jpegBuffer = await sharp(pngBuffer)
    .jpeg({ quality: 80 })
    .toBuffer();

  // Отдаём JPEG
  res.setHeader('Content-Type', 'image/jpeg');
  res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
  res.status(200).send(jpegBuffer);
}
