import axios from "axios";
import { FMP_API_KEY } from "@env";

export const FMP_API = axios.create({
  baseURL: "https://financialmodelingprep.com/api/v3",
  params: {
    apikey: FMP_API_KEY,
  },
});
