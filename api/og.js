import satori from 'satori';

// Загружаем шрифт
const fontRegular = fetch(
  'https://ogcdn.ru/fonts/Inter-Regular.ttf'
).then((res) => res.arrayBuffer());

const fontBold = fetch(
  'https://ogcdn.ru/fonts/Inter-Bold.ttf'
).then((res) => res.arrayBuffer());

export default async function handler(req, res) {
  // Берём параметры из URL
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
          // Логотип
          {
            type: 'img',
            props: {
              src: 'https://www.birjuza.ru/_template/main/images/webp/logo_rus.png',
              style: {
                height: '80px',
                marginBottom: '50px',
              },
            },
          },
          // Заголовок
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
          // Подзаголовок
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

  // Конвертируем SVG в PNG
  const { Resvg } = await import('@resvg/resvg-js');
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  // Отдаём картинку
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
  res.status(200).send(pngBuffer);
}