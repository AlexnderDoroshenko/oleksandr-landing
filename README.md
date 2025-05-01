# Oleksandr Doroshenko – AQA Engineer Landing Page

Це персональний сайт, створений з метою представлення професійного профілю AQA інженера, з підтримкою блогу, мультимовності та готовністю до автотестів.

## 🛠 Стек
- **Next.js** (React фреймворк)
- **TailwindCSS** (швидка стилізація)
- **i18next** (мультимовність: українська/англійська)
- **Markdown** (для блогу)
- **Jest + React Testing Library** (для автотестів)
- **GitHub Actions** (CI/CD)

## 📁 Структура
- `pages` — сторінки (головна, про себе, блог, контакти)
- `posts` — markdown-файли блогу
- `components` — повторно використовувані компоненти
- `public/images` — зображення (фото, іконки)
- `styles` — глобальні стилі
- `.github/workflows` — GitHub Actions для CI/CD

## 🚀 Як запустити
1. Встановіть залежності:
```bash
npm install
```

2. Запустіть локально:
```bash
npm run dev
```

3. Для деплою на GitHub Pages або Vercel — див. `.github/workflows/deploy.yml`

## 📄 Ліцензія
MIT
