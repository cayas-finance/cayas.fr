
const R_Ninja = /^(?:\[!NINJA\])\s*?\n*/;

export function ninja() {
  return {
    walkTokens(token) {
      if (token.type !== "blockquote") return;

      if (R_Ninja.test(token.text)) {
        Object.assign(token, { type: "ninja" });

        const firstLine = token.tokens?.[0];
        const firstLineText = firstLine.raw?.replace(R_Ninja, "").trim();

        if (firstLineText) {
          const patternToken = firstLine.tokens[0];

          Object.assign(patternToken, {
            raw: patternToken.raw.replace(R_Ninja, ""),
            text: patternToken.text.replace(R_Ninja, ""),
          });

          if (firstLine.tokens[1]?.type === "br") {
            firstLine.tokens.splice(1, 1);
          }

          // Add <br /> after first line
          if (firstLine.tokens[0]?.type === "text") {
            firstLine.tokens.splice(1, 0, { type: "br", raw: "\n" });
          }
        } else {
          token.tokens?.shift();
        }
      }
    },

    extensions: [
      {
        name: "ninja",
        level: "block",
        renderer({ tokens = [] }) {
          let tmpl = `<details class="accordion">\n`;
          tmpl += `<summary>`;
          tmpl += `<img src="/assets/generic/vs_capy-prof.svg" alt="">\n`;
          tmpl += `<span><strong>La minute</strong> de Professeur Capy</span>\n`;
          tmpl += `</summary>\n`;
          tmpl += `<div [ninjaid] class="accordion__target">\n`;
          tmpl += this.parser.parse(tokens);
          tmpl += "</div>\n";
          tmpl += "</details>\n";

          return tmpl;
        },
      },
    ],
  };
}
