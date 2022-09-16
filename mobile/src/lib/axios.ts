import axios from "axios";
import { API_URL } from "@env";

console.log(API_URL);

export const api = axios.create({
  baseURL: API_URL,
});
