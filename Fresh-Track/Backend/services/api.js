const axios = require("axios");

async function SearchProduct(searchQuery) {
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl`;
    const response = await axios.get(url, {
      params: {
        search_terms: searchQuery,
        search_simple: 1,
        action: "process",
        json: 1,
        page_size: 5,
      },
      //   timeout: 5000,
    });

    // Return only the products array
    return response.data.products.map((p) => ({
      name: p.product_name,
      brand: p.brands,
      image: p.image_small_url,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

module.exports = {
  SearchProduct,
};
