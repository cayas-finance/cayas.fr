var options = [];

const locale = "fr-FR";

const percentFormatter = new Intl.NumberFormat(locale, {
  style: "percent",
});

const numberFormatter = new Intl.NumberFormat(locale, {
  maximumFractionDigits: 2,
  style: "decimal",
});

const dateFormatter = new Intl.DateTimeFormat(locale, {
  year: "numeric",
  month: "long",
});

function formatCurrency(v, options = {}) {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 2,
    ...options,
  });
  const parts = formatter.formatToParts(v);

  const km = parts.findIndex(
    ({ value }) => value === "M" || value === "k" || value === "Bn"
  );
  if (km !== -1 && parts.at(km + 1)?.type === "literal")
    parts.splice(km + 1, 1);
  return parts.map(({ value }) => value).join("");
}

function formatPercent(v) {
  return percentFormatter.format(v);
}

function formatNumber(v) {
  return numberFormatter.format(v);
}

function formatDate(v) {
  if (typeof v === "string") v = new Date(v);
  return dateFormatter.format(v);
}

function formatValue(v, name) {
  const isPercentage = name.includes("%");
  const isCurrency = name.includes("€");
  if (typeof v === "number" && isCurrency) return formatCurrency(v);
  if (typeof v === "number" && isPercentage) return formatPercent(v);
  if (typeof v === "number") return formatNumber(v);
  if (R_ISODate.test(String(v))) return formatDate(String(v));
  return v;
}
