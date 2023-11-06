import Manticoresearch from "manticoresearch";
import client from "../constants/manticore.const.js";

async function fetchProducts(totalPages) {
  let productsAll = [];
  for (let page = 0; page <= totalPages; page++) {
    try {
      await fetch(`http:localhost:3000/api/products?paging=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((response) => {
          const productsData = response.data;
          productsAll.push(...productsData);
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error("Fetch products failed: ", err);
    }
  }
  return productsAll;
}

var indexApi = new Manticoresearch.IndexApi(client);
async function bulkInsert(products) {
  let docs = products.map((product, index) => {
    return {
      insert: {
        index: "products",
        id: product.id,
        doc: {
          title: product.title,
          price: product.price,
        },
      },
    };
  });
  try {
    res = await indexApi.bulk(docs.map((e) => JSON.stringify(e)).join("\n"));
    console.log(JSON.stringify(res));
  } catch (error) {
    console.error("Error inserting into manticore: ", error);
  }
}

(async () => {
  const productsAll = await fetchProducts(2);
  bulkInsert(productsAll);
})();
