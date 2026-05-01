import axios from "axios";
import { ENV } from "@/config/env";

const API_URL = ENV.API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getContent = async (slug: string) => {
  const { data } = await api.get(`/content/${slug}`);
  return data;
};

export const getBlogs = async () => {
  const { data } = await api.get("/blogs");
  return data;
};

export const getTestimonials = async () => {
  const { data } = await api.get("/testimonials");
  return data;
};

export default api;
