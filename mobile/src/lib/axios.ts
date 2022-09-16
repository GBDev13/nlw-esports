import axios from "axios";
//import { API_URL } from "@env";

export const api = axios.create({
  baseURL: "https://nlw-esports-production.up.railway.app",
});
