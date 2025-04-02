import { marked } from "marked";

// const defaultRenderer = new marked.Renderer();
// const renderTable = defaultRenderer.table;

export function table() {
  return {
    renderer: {
    //   table(token) {
    //     console.log(renderTable(token));
    //     return '???';
    //     // return `<div class="table-container">${renderTable(token)}</div>`;
    //   },


      table(token) {
        let header = '';
    
        // header
        let cell = '';
        for (let j = 0; j < token.header.length; j++) {
          cell += this.tablecell(token.header[j]);
        }
        header += this.tablerow({ text: cell });
    
        let body = '';
        for (let j = 0; j < token.rows.length; j++) {
          const row = token.rows[j];
    
          cell = '';
          for (let k = 0; k < row.length; k++) {
            cell += this.tablecell(row[k]);
          }
    
          body += this.tablerow({ text: cell });
        }
        if (body) body = `<tbody>${body}</tbody>`;
    
        return '<div class="table-container">\n'
          + '<table>\n'
          + '<thead>\n'
          + header
          + '</thead>\n'
          + body
          + '</table>\n'
          + '</div>\n';
      },
    
      tablerow({ text }) {
        return `<tr>\n${text}</tr>\n`;
      },
    
      tablecell(token) {
        const content = this.parser.parseInline(token.tokens);
        const type = token.header ? 'th' : 'td';
        const tag = token.align
          ? `<${type} align="${token.align}">`
          : `<${type}>`;
        return tag + content + `</${type}>\n`;
      }
    },
  };
}
