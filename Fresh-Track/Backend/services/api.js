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

async function GetProductByBarcode(barcode) {
  try {
    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`,
      {
        headers: {
          'User-Agent': 'FreshTrack/1.0 (your@email.com)'
        }
      }
    );

    if (response.data.status === 0) {
      return null; // Product not found
    }

    const p = response.data.product;
    return {
      name: p.product_name,
      brand: p.brands,
      image: p.image_small_url,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  SearchProduct,
  GetProductByBarcode
};
