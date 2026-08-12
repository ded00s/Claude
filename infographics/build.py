#!/usr/bin/env python3
"""
Собирает автономный HTML: вшивает шрифты в виде data-URI.

    python3 infographics/build.py

Источник — *.src.html с плейсхолдерами __CYRILLIC__ / __LATIN__.
Результат — *.html, который открывается где угодно без интернета.
"""
import base64
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent
FONTS = ROOT.parent / 'app/node_modules/@fontsource-variable/ibm-plex-sans/files'


def data_uri(name: str) -> str:
    return f"data:font/woff2;base64,{base64.b64encode((FONTS / name).read_bytes()).decode()}"


def main() -> int:
    if not FONTS.exists():
        print(f'Шрифты не найдены: {FONTS}\nВыполните `npm install` в каталоге app/.', file=sys.stderr)
        return 1

    built = 0
    for src in sorted(ROOT.glob('*.src.html')):
        dst = src.with_name(src.name.replace('.src.html', '.html'))
        html = (
            src.read_text(encoding='utf-8')
            .replace('__CYRILLIC__', data_uri('ibm-plex-sans-cyrillic-wght-normal.woff2'))
            .replace('__LATIN__', data_uri('ibm-plex-sans-latin-wght-normal.woff2'))
        )
        dst.write_text(html, encoding='utf-8')
        print(f'{dst.relative_to(ROOT.parent)}  ({dst.stat().st_size / 1024:.0f} КБ)')
        built += 1

    if not built:
        print('Нечего собирать: не найдено ни одного *.src.html', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
