import client from "../../configs/redis.config.js";

export const withRedis = () => {
  client.connect();
};
