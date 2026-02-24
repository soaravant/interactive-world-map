# Interactive World Map

A premium, interactive vector map of the world built with D3.js, TopoJSON, and the RestCountries API. Designed for easy embedding in web and mobile applications (e.g., FlutterFlow via WebView).

## Features
- **Interactive**: Smooth zoom and pan controls.
- **Detailed**: Click any country to see real-time population, capital, and region.
- **Premium UI**: Glassmorphism styling, clean typography (Outfit font), and dark mode aesthetic.
- **Lightweight**: Pure HTML/CSS/JS with no build steps required. Dependencies loaded via CDN.

## Usage

### Local Development
To run the map locally:

```bash
# Using Python
python3 -m http.server 8080

# OR using Node
npx serve .
```
Then open `http://localhost:8080` in your browser.

### Embedding in FlutterFlow
1.  **Host the files**: Upload `index.html`, `style.css`, and `script.js` to a hosting provider (GitHub Pages, Firebase Hosting, Vercel, or Netlify).
2.  **Add WebView**: In FlutterFlow, drag a `WebView` widget onto your page.
3.  **Configure**: Set the URL to your hosted link (e.g., `https://your-username.github.io/interactive-world-map/`).
4.  **Layout**: Ensure the WebView is set to expand or has fixed dimensions appropriate for a landscape view.

## Customization
-   **Colors**: Edit the CSS variables in `style.css` (e.g., `--accent`, `--map-fill`).
-   **Data**: Modify `script.js` to change the API endpoint or the `updateModal` function to display different data fields.
