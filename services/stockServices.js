const axios = require("axios");
const cheerio = require("cheerio");

async function fetchStockData(stockName) {
  const url = `https://halkarz.com/${stockName}`;
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const image = $(".detail-page").find("a img").attr("src").trim();
  const code = $(".il-content .il-bist-kod").html().trim();
  const name = $(".il-halka-arz-sirket").html()
  const companyInfo = {
    descriptionHTML: $('.sh-content p').html(),
    foundCity: $('.shc-city').text().split(' : ')[1].trim(),
    foundYear: $('.shc-founded').text().split(' : ')[1].trim()
  }  
  const tableData = [];

  const fiiliDolasimVar = $(".sp-table tbody tr")
    .toArray()
    .some((el) => {
      const firstTd = $(el).find("td:nth-child(1)").text().trim();
      return firstTd === "Fiili Dolaşımdaki Pay :";
    });

  const tableDataKeys = fiiliDolasimVar
    ? [
        "ipoDate",
        "ipoPrice",
        "distrubitionMethod",
        "shares",
        "broker",
        "sharesActual",
        "sharesActualPercentage",
        "bistCode",
        "market",
        "firstTradingDate",
      ]
    : [
        "ipoDate",
        "ipoPrice",
        "distrubitionMethod",
        "shares",
        "broker",
        "bistCode",
        "market",
        "firstTradingDate",
      ];

  $(".sp-table tbody tr").each((_, el) => {
    const secondTd = $(el).find("td:nth-child(2)").text().trim();
    if (secondTd) {
      tableData.push(secondTd);
    }
  });

  return {
    ...Object.fromEntries(
      tableDataKeys.map((key, index) => [key, tableData[index]])
    ),
    image,
    code,
    name,
    companyInfo,
  };
}

async function fetchAllStocks(year, page) {
  const url = `https://halkarz.com/k/halka-arz/${year}/page/${page}`;
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const halkaArzListesi = [];

  $("ul.halka-arz-list.archives > li").each((index, element) => {
    const halkaArz = {
      code: $(element).find(".il-bist-kod").text().trim(),
      name: $(element).find(".il-halka-arz-sirket a").text().trim(),
      image: $(element).find("a .slogo").attr("src"),
      link: $(element).find(".il-halka-arz-sirket a").attr("href"),
    };
    halkaArz.subLink = halkaArz.link
      .split("/")
      .filter((part) => part)
      .slice(-1)[0];

    halkaArz.isNew = $(element).find('.il-badge i[title="Yeni!"]').length > 0;
    halkaArz.isResulted = !halkaArz.isNew
      ? true
      : halkaArz.isNew &&
        $(element).find('.il-badge i[title="Halka Arz Sonuçları"]').length > 0;

    halkaArzListesi.push({ index, data: halkaArz });
  });

  return halkaArzListesi;
}

module.exports = {
  fetchStockData,
  fetchAllStocks,
};
