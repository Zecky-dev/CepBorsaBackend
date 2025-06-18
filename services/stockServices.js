import axios from "axios";
import * as cheerio from "cheerio";
import CryptoJS from "crypto-js";

async function fetchStockData(stockName) {
  try {
    const url = `https://halkarz.com/${stockName}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
      },
    });
    const $ = cheerio.load(data);

    const id = CryptoJS.SHA256(url).toString();
    const image = $(".detail-page").find("a img").attr("src")?.trim() || "";
    const code = $(".il-content .il-bist-kod").html()?.trim() || "";
    const name = $(".il-halka-arz-sirket").html()?.trim() || "";

    const companyInfo = {
      descriptionHTML: $(".sh-content p").html()?.trim() || "",
      foundCity: $(".shc-city").text()?.split(" : ")[1]?.trim() || "",
      foundYear: $(".shc-founded").text()?.split(" : ")[1]?.trim() || "",
    };

    const tableData = [];

    const fiiliDolasimVar = $(".sp-table tbody tr")
      .toArray()
      .some((el) => {
        const firstTd = $(el).find("td:nth-child(1)").text()?.trim() || "";
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
      const secondTd = $(el).find("td:nth-child(2)").text()?.trim() || "";
      if (secondTd) {
        tableData.push(secondTd);
      } else {
        tableData.push("");
      }
    });

    return {
      ...Object.fromEntries(
        tableDataKeys.map((key, index) => [key, tableData[index] || ""])
      ),
      image,
      code,
      name,
      companyInfo,
      id,
    };
  } catch (error) {
    console.error("FETCH_STOCK_DATA_ERROR", error);
    return null;
  }
}

async function fetchAllStocks(year, page) {
  try {
    const url = `https://halkarz.com/k/halka-arz/${year}/page/${page}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
      },
    });
    const $ = cheerio.load(data);

    const halkaArzListesi = [];

    const listItems = $("ul.halka-arz-list.archives > li");

    if (listItems.length === 0) {
      console.log(`No data found for year: ${year}, page: ${page}`);
      return []; // Boş dizi dön
    }

    listItems.each((index, element) => {
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
          $(element).find('.il-badge i[title="Halka Arz Sonuçları"]').length >
            0;

      halkaArzListesi.push({ index, data: halkaArz });
    });

    return halkaArzListesi;
  } catch (error) {
    return [];
  }
}

export { fetchAllStocks, fetchStockData };
