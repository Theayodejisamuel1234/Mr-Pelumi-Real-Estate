# Mr Pelumi Real Estate

A one-page website for a Lagos real estate business: homes to buy or rent, plots of land, and an enquiry form that opens WhatsApp.

## Files

| File | What it does |
| --- | --- |
| `index.html` | Page content, including the estate site plan and its plot data |
| `styles.css` | All styling (colours are set at the top in `:root`) |
| `script.js` | Listings, plot selection, filters and the WhatsApp enquiry form |

## Before you publish

The listings, plot prices, phone number and email are **sample content**. Replace them:

1. **Contact details**: edit `CONFIG` at the top of `script.js`. The WhatsApp number uses international format with digits only, for example `2348012345678`.
2. **Listings**: edit the `LISTINGS` list in `script.js`. Each entry needs `kind` (`buy`, `rent` or `land`), `icon`, `name`, `area`, `specs` and `price` (in naira). Add `per: "per year"` for rentals.
3. **Estate plots**: each plot in the site plan is a `<polygon class="plot">` in `index.html`. Change its `data-size`, `data-price`, `data-status` (`available`, `reserved` or `sold`) and `data-docs`. Delete the "Sample estate" note under the plan when the data is real.
4. **About text**: replace the two paragraphs in the About section with Mr Pelumi's own words.

## Run it locally

Open `index.html` in a browser. No build step or dependencies are needed.

## Publish it with GitHub Pages

In the repository, go to **Settings, Pages**, choose **Deploy from a branch**, select `main` and the `/ (root)` folder, then save. The site will be live at `https://theayodejisamuel1234.github.io/Mr-Pelumi-Real-Estate/` after a minute or two.
