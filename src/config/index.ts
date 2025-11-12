interface Config {
  baseUrl: string;
}
const config: { [key: string]: Config } = {
  development: {
    baseUrl: "http://localhost:8000/api",
  },
  staging: {
    baseUrl: "https://api.dabiri.xyz/api",
  },
  production: {
    baseUrl: "https://api.dabiri.xyz/api",
  },
};

export default config[import.meta.env.VITE_NODE_ENV || "development"];
