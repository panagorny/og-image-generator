import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

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
          backgroundColor: '#1A3A42',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 80px',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'img',
            props: {
              src: 'https://www.birjuza.ru/_template/main/images/webp/logo_bw_rus.png',
              style: {
                height: '80px',
                marginBottom: '50px',
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
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                lineHeight: 1.4,
                maxWidth: '800px',
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

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
  res.status(200).send(pngBuffer);
}
