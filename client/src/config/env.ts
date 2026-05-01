export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
};

if (!process.env.NEXT_PUBLIC_API_URL && ENV.IS_PRODUCTION) {
  console.warn("⚠️ NEXT_PUBLIC_API_URL is missing in production environment!");
}
