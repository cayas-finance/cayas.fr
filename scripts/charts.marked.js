
export function charts() {
    return {
      renderer: {
        code({text, lang}) {
          if (lang === "mermaid") {
            return parseMermaid(text);
          }
  
          return ""; // Do not display code blocks
        },
      },
    };
  }

  // TODO pie
  
  const R_Space = /\s+/g;
  const R_Title = /^\s*title\s+"?(?<title>[^"]*)"?/;
  const R_XAxis = /^\s*x-axis\s+("(?<label>(.)*)")?\s*\[(?<values>[^,^\s]*(\s*,\s*[^,^\s]+)*)\s*\]/;
  const R_YAxis =
    /^\s*y-axis\s*("(?<label>(.*))")?\s*((?<min>[+-]?\d*\.?\d+)\s*-->\s*(?<max>[+-]?\d*\.?\d+))?/;
  const R_Bar = /^\s*bar\s+\[\s*(?<values>[+-]?(\d*[.])?\d+(\s*(,\s*[+-]?(\d*[.])?\d+))*)\s*\]/;
  const R_Line =
    /^\s*line\s*("(?<legend>(.*))")?\s*\[\s*(?<values>[+-]?(\d*[.])?\d+(\s*(,\s*[+-]?(\d*[.])?\d+))*)\s*\]/;
  const R_Legend = /^\s*%%\s+legend\s+(?<legend>.+)/;
  const R_ISODate = /(?<year>\d{4})-(?<month>\d{2})/;
  const R_Config = /^---\s*\n([\s\S]*?)---\s*\n/;
  
  function parseMermaid(code) {
      try {
        // TODO Mermaid config
        const configMatch = R_Config.exec(code);
  
        const mermaidConfig = {}; // configMatch ? this.#getMermaidConfig(configMatch[1]) : {};
  
        const lines = code
          .replace(R_Config, "")
          .split("\n")
          .filter((s) => s.replace(R_Space, "") !== "");
        if (!lines.length) throw new Error();
  
        const [type, ...rest] = (lines.shift() || "").split(R_Space).filter((x) => !!x);
  
        if (rest?.length) {
          lines.unshift(rest.join(" "));
        }
  
        let title = "";
        const r_Title = R_Title.exec(lines.at(0) || "");
        if (r_Title) {
          title = r_Title.groups?.["title"] || "";
        }
  
        // XY CHART
        if (type === "xychart-beta" || type === "xychart") {
          const xAxis = {
            name: "",
            data: [],
            type: "category",
            nameLocation: "middle",
            nameGap: 30,
          };
          const yAxis = {
            name: "",
            min: minFn,
            max: maxFn,
            nameLocation: "middle",
            nameGap: 50,
          };
          const series = [];
          let dates = [];
  
          let legend = "";
          lines.forEach((line) => {
            const r_XAxis = R_XAxis.exec(line);
            
            if (r_XAxis) {
              xAxis.name = r_XAxis.groups?.["label"] || "";
              const data = (r_XAxis.groups?.["values"] || "")
                .split(",")
                .map((v) => v.replace(R_Space, ""));
  
              if (R_ISODate.test(data[0])) {
                xAxis.type = "time";
                dates = data.map((v) => {
                  const d = R_ISODate.exec(v);
                  return `${d?.groups?.["year"]}-${d?.groups?.["month"]}`;
                });
              } else {
                xAxis.data = data;
                dates = [];
              }
            }
  
  
            const r_YAxis = R_YAxis.exec(line);
            if (r_YAxis) {
              yAxis.name = r_YAxis.groups?.["label"] || "";
              const min = parseFloat(r_YAxis.groups?.["min"] || "");
              const max = parseFloat(r_YAxis.groups?.["max"] || "");
              if (!isNaN(min)) yAxis.min = min;
              if (!isNaN(max)) yAxis.max = max;
            }
  
            const r_Bar = R_Bar.exec(line);
            if (r_Bar) {
              series.push({
                name: legend,
                type: "bar",
                data: (r_Bar.groups?.["values"] || "").split(",").map((v) => parseFloat(v) || 0),
              });
              legend = "";
            }
  
            const r_Line = R_Line.exec(line);
            if (r_Line) {
              let data = (r_Line.groups?.["values"] || "")
                .split(",")
                .map((v) => parseFloat(v) || 0);
  
              if (dates.length === data.length) {
                data = data.map((d, i) => [dates[i], d]);
              }
  
              series.push({
                name: r_Line.groups?.["legend"] || legend,
                type: "line",
                smooth: true,
                data,
              });
              legend = "";
            }
  
            const r_Legend = R_Legend.exec(line);
            if (r_Legend) {
              legend = r_Legend.groups?.["legend"] || "";
            }
          });
  
          const uuid = guidGenerator();
          const options = JSON.stringify(buildXYOption({
            title,
            xAxis,
            yAxis,
            series,
            mermaidConfig,
          }));

          // TODO legend format

          return `
            <div id="${uuid}" style="width: 600px;height:400px;">????</div>
            <script>
            options['${uuid}'] = ${options};
            options['${uuid}'].yAxis[0] = {
              ...options['${uuid}'].yAxis[0],
              axisLabel: { formatter: (v) => formatValue(v, options['${uuid}'].yAxis[0].name) },
            }
            echarts.init(document.getElementById('${uuid}')).setOption(options['${uuid}']);
            </script>
          `;
        }
  
      } catch (e) {
        console.error("Error parsing Mermaid code block");
        return "";
      }
  }
  
  function buildXYOption({ title, xAxis, yAxis, series, mermaidConfig }) {
  
    return {
      title: {
        text: title,
        left: "center",
        top: "20",
      },
      grid: {
        bottom: series.length > 1 ? 80 : 60,
        left: "6%",
        right: "2%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#999",
          },
        },
      },
      legend: {
        bottom: 15,
      },
      xAxis: [xAxis],
      yAxis: [yAxis],
      series: series.map((s, i) => {
        if (mermaidConfig?.colors?.length) {
          const color = mermaidConfig.colors[i % mermaidConfig.colors.length];
          return {
            ...s,
            itemStyle: {
              color,
            },
          };
        }
        return s;
      }),
    };
  }
  
  
  const maxFn = ({ min, max }) => {
    const base = Math.pow(10, String(Math.floor((max - min) / 10)).length);
    return Math.ceil(max / base) * base;
  };
  
  const minFn = ({ min, max }) => {
    const base = Math.pow(10, String(Math.floor((max - min) / 10)).length);
    return Math.floor(min / base) * base;
  };
  
  function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }