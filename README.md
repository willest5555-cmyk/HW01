# HW01

AI Course 2026 Homework 01：個人化 Hello World 儀表板網頁。

## Index URL

- GitHub Pages：https://willest5555-cmyk.github.io/HW01/
- Index 原始碼：https://github.com/willest5555-cmyk/HW01/blob/master/index.html
- Repository：https://github.com/willest5555-cmyk/HW01

## 專案說明

本作業是一個純前端靜態網頁，入口檔案為 `index.html`。頁面以玻璃擬態風格呈現個人歡迎區、即時時鐘、月曆與天氣資訊，適合直接部署到 GitHub Pages。

## 功能彙整

- 個人歡迎區：顯示 Hello World 與個人名稱。
- 即時時鐘：每秒更新時間、秒數、AM/PM、日期與星期。
- 互動月曆：可切換上一個月 / 下一個月，並可選取日期。
- 天氣卡片：使用 Open-Meteo API 取得目前天氣。
- 城市搜尋：輸入城市名稱後按 Enter，可查詢指定城市天氣。
- 定位天氣：支援瀏覽器定位，若無法定位則使用預設座標。
- 響應式版面：桌機與手機皆可瀏覽。

## 檔案結構

| 檔案 | 說明 |
| --- | --- |
| `index.html` | 網頁入口，負責頁面結構與外部資源引用 |
| `style.css` | 視覺樣式、響應式版面、動畫與卡片設計 |
| `app.js` | 時鐘、月曆、天氣 API、城市搜尋與互動邏輯 |
| `.gitignore` | Git 忽略規則 |

## 使用方式

1. 直接開啟 `index.html`。
2. 或使用 GitHub Pages 網址瀏覽：
   https://willest5555-cmyk.github.io/HW01/

## 使用技術

- HTML5
- CSS3
- JavaScript
- Lucide Icons CDN
- Open-Meteo Forecast API
- Open-Meteo Geocoding API

