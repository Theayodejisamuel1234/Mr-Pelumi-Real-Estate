/* Mr Pelumi Real Estate
   Edit CONFIG and LISTINGS below. The plot data lives in index.html
   (the data-* attributes on each <polygon class="plot">). */

const CONFIG = {
  // WhatsApp number in international format, digits only (no + or spaces).
  whatsapp: "2348000000000",
  phoneDisplay: "+234 800 000 0000",
  email: "hello@example.com"
};

// kind: "buy" | "rent" | "land"   icon: "house" | "block" | "plot"
const LISTINGS = [
  { kind: "buy",  icon: "house", name: "4-bedroom terrace duplex", area: "Lekki Phase 1",       specs: "4 beds, 4 baths, 320 sqm",   price: 185000000 },
  { kind: "rent", icon: "block", name: "3-bedroom flat",           area: "Yaba",                specs: "3 beds, 2 baths, parking",   price: 3500000,   per: "per year" },
  { kind: "land", icon: "plot",  name: "600 sqm residential plot", area: "Ibeju-Lekki",         specs: "Survey plan, dry land",      price: 24000000 },
  { kind: "rent", icon: "block", name: "Serviced 2-bedroom apartment", area: "Victoria Island", specs: "2 beds, 2 baths, generator", price: 7000000,   per: "per year" },
  { kind: "buy",  icon: "house", name: "5-bedroom detached house", area: "Ikeja GRA",           specs: "5 beds, 5 baths, BQ",        price: 420000000 },
  { kind: "rent", icon: "block", name: "Mini flat",                area: "Surulere",            specs: "1 bed, 1 bath",              price: 1200000,   per: "per year" }
];

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0
});

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ---------- contact details ---------- */

(function setContact() {
  const phone = $("#c-phone");
  const email = $("#c-email");
  phone.textContent = CONFIG.phoneDisplay;
  phone.href = "tel:+" + CONFIG.whatsapp;
  email.textContent = CONFIG.email;
  email.href = "mailto:" + CONFIG.email;
})();

/* ---------- prefill the contact form and jump to it ---------- */

function goToContact({ interest, message }) {
  const select = $("#f-interest");
  const text = $("#f-message");
  if (interest) select.value = interest;
  if (message) text.value = message;
  $("#contact").scrollIntoView({ behavior: "smooth" });
  // Focus after the scroll starts so the browser does not jump.
  setTimeout(() => $("#f-name").focus({ preventScroll: true }), 350);
}

/* ---------- site plan ---------- */

const plots = $$(".plot");
const statusLabel = { available: "Available", reserved: "Reserved", sold: "Sold" };
let selectedPlot = null;

function showPlot(plot) {
  const { id, size, price, status, docs } = plot.dataset;
  selectedPlot = plot;

  plots.forEach(p => {
    const on = p === plot;
    p.classList.toggle("is-selected", on);
    p.setAttribute("aria-pressed", String(on));
  });

  $("#pd-title").textContent = "Plot " + id;
  const badge = $("#pd-status");
  badge.textContent = statusLabel[status];
  badge.dataset.status = status;
  $("#pd-size").textContent = size + " sqm";
  $("#pd-price").textContent = naira.format(Number(price));
  $("#pd-docs").textContent = docs;
  $("#pd-ask").textContent = status === "sold" ? "Ask about similar plots" : "Ask about plot " + id;
}

plots.forEach(plot => {
  const { id, size, status } = plot.dataset;
  plot.setAttribute("aria-label", `Plot ${id}, ${size} square metres, ${statusLabel[status].toLowerCase()}`);
  plot.setAttribute("aria-pressed", "false");
  plot.addEventListener("click", () => showPlot(plot));
  plot.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      showPlot(plot);
    }
  });
});

$("#pd-ask").addEventListener("click", () => {
  if (!selectedPlot) return;
  const { id, size, status } = selectedPlot.dataset;
  const message = status === "sold"
    ? `Hello, plot ${id} is sold. Do you have similar plots of about ${size} sqm?`
    : `Hello, I am interested in plot ${id} (${size} sqm). Is it still available?`;
  goToContact({ interest: "buy land", message });
});

showPlot($('.plot[data-id="A2"]'));

/* ---------- listings ---------- */

const rows = $("#rows");
const count = $("#count");
const chips = $$(".chip");
let activeFilter = "all";

function renderListings() {
  const items = LISTINGS.filter(l => activeFilter === "all" || l.kind === activeFilter);
  rows.innerHTML = "";

  items.forEach(item => {
    const li = document.createElement("li");
    li.className = "row";
    li.innerHTML = `
      <svg class="row-icon" aria-hidden="true"><use href="#i-${item.icon}"/></svg>
      <div>
        <h3 class="row-title"></h3>
        <p class="row-area"></p>
      </div>
      <p class="row-specs"></p>
      <p class="row-price"></p>
      <button type="button" class="btn">Enquire</button>`;

    $(".row-title", li).textContent = item.name;
    $(".row-area", li).textContent = item.area;
    $(".row-specs", li).textContent = item.specs;

    const price = $(".row-price", li);
    price.textContent = naira.format(item.price);
    if (item.per) {
      const small = document.createElement("small");
      small.textContent = item.per;
      price.appendChild(small);
    }

    const btn = $(".btn", li);
    btn.setAttribute("aria-label", `Enquire about ${item.name} in ${item.area}`);
    btn.addEventListener("click", () => {
      const interest = item.kind === "rent" ? "rent a home" : item.kind === "land" ? "buy land" : "buy a home";
      goToContact({
        interest,
        message: `Hello, I am interested in the ${item.name} in ${item.area}. Is it still available?`
      });
    });

    rows.appendChild(li);
  });

  const word = items.length === 1 ? "listing" : "listings";
  count.textContent = `Showing ${items.length} ${word}`;
}

chips.forEach(chip => {
  chip.addEventListener("click", () => {
    activeFilter = chip.dataset.filter;
    chips.forEach(c => c.setAttribute("aria-pressed", String(c === chip)));
    renderListings();
  });
});

renderListings();

/* ---------- contact form: opens WhatsApp with the message ---------- */

$("#form").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#f-name").value.trim();
  const interest = $("#f-interest").value;
  const message = $("#f-message").value.trim();
  const error = $("#form-error");

  if (!name || !message) {
    error.textContent = !name
      ? "Enter your name so Mr Pelumi knows who to reply to."
      : "Write a short message about what you are looking for.";
    error.hidden = false;
    (!name ? $("#f-name") : $("#f-message")).focus();
    return;
  }

  error.hidden = true;
  const text = `Hello, my name is ${name}. I want to ${interest}.\n\n${message}`;
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener");
});
