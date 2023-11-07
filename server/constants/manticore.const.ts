import Manticoresearch from "manticoresearch";

const client = new Manticoresearch.ApiClient();
client.basePath = "http://127.0.0.1:9308";

export default client;
