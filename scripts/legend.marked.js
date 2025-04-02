const R_Legend = /^\s*legend\s*:/i;
const R_ContentLegend = /legend\s*:/i;

export function legend() {
  return {
    walkTokens(token) {
      if (token.type !== "paragraph") return;

      if (R_Legend.test(token.text)) {
        Object.assign(token, { type: "legend" });
      }
    },

    extensions: [
      {
        name: "legend",
        level: "block",
        renderer({ tokens = [] }) {
          let tmpl = `<div class="legend">\n`;
          tmpl += this.parser.parse(tokens).replace(R_ContentLegend, "");
          tmpl += "</div>\n";

          return tmpl;
        },
      },
    ],
  };
}
