import { useState, useEffect } from "react";
import { ALPHAVANTAGE_API_KEY } from "@env";
//Use Alpha Vantage API to get some stock news
//----------------------------------------------------------------------------
async function getNews(symbol) {
  const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${ALPHAVANTAGE_API_KEY}`;
  let res = await fetch(url);
  let data = await res.json();
  let news = data["feed"];

  return news.map((x) => ({
    title: x.title,
    url: x.url,
    summary: x.summary,
    image: x.banner_image,
  }));
}

export default function useNews(symbol) {
  const [newsIsloading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [newsError, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setNews(await getNews(symbol));
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    })();
  }, []);
  return {
    newsIsloading,
    news,
    newsError,
  };
}

// ======The data format obtained by the API
// const datatype = {
//   items: "50",
//   sentiment_score_definition:
//     "x <= -0.35: Bearish; -0.35 < x <= -0.15: Somewhat-Bearish; -0.15 < x < 0.15: Neutral; 0.15 <= x < 0.35: Somewhat_Bullish; x >= 0.35: Bullish",
//   relevance_score_definition:
//     "0 < x <= 1, with a higher score indicating higher relevance.",
//   feed: [
//     {
//       title:
//         "Central Banks And ESG Investing: A Fatal Combination Of Incompetence And Overreach",
//       url: "https://www.forbes.com/sites/tilakdoshi/2023/04/29/central-banks-and-esg-investing-a-fatal-combination-of-incompetence-and-overreach/",
//       time_published: "20230429T225835",
//       authors: ["Tilak Doshi"],
//       summary:
//         'The only systemic risk related to climate is not from "climate change" that occurs with much natural variation over time an space but from the climate policy responses to the hobgoblins of our own making. Let us not allow central bankers to be lead players in all of this.',
//       banner_image:
//         "https://imageio.forbes.com/specials-images/imageserve/644d8df1741bc46ddf04982d/0x0.jpg?format=jpg&width=1200",
//       source: "Forbes",
//       category_within_source: "Business",
//       source_domain: "www.forbes.com",
//       topics: [
//         {
//           topic: "Economy - Monetary",
//           relevance_score: "1.0",
//         },
//         {
//           topic: "Economy - Fiscal",
//           relevance_score: "0.158519",
//         },
//         {
//           topic: "Financial Markets",
//           relevance_score: "0.918141",
//         },
//       ],
//       overall_sentiment_score: 0.029393,
//       overall_sentiment_label: "Neutral",
//       ticker_sentiment: [
//         {
//           ticker: "FOREX:USD",
//           relevance_score: "0.023464",
//           ticker_sentiment_score: "-0.219321",
//           ticker_sentiment_label: "Somewhat-Bearish",
//         },
//       ],
//     },
//   ],
// };
