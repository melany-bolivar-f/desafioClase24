async function asyncThings(){

    const ProductManager = require("../managers/productManager");

    // Instance new class
    const product = new ProductManager("./src/mockDB/products.json");

    await product.addProduct('producto1', 'descripcion', 1111, ['Without image'], 'coder1', 11);
    await product.addProduct('producto2', 'descripcion2', 2222, ['Without image'], 'coder2', 22);
    //await product.addProduct('Product 3 test', 'This a test product 3', 140, ['Without image'], 'abc456', 10);
    await product.addProduct('producto3', 'descripcion3', 3333, ['Without image'], 'coder3', 33);
    await product.addProduct('producto4', 'descripcion4', 4444, ['Without image'], 'coder4', 44);
    await product.addProduct('producto5', 'descripcion5', 5555, ['Without image'], 'coder5', 55);
    await product.addProduct('producto6', 'descripcion6', 6666, ['Without image'], 'coder6', 66);
    await product.addProduct('producto7', 'descripcion7', 7777, ['Without image'], 'coder7', 77);
    await product.addProduct('Product 8', 'descripcion8', 8888, ['Without image'], 'coder8', 88);
    await product.addProduct('producto9', 'descripcion9', 9999, ['Without image'], 'coder9', 99);
    await product.addProduct('producto10', 'descripcion10', 1000, ['Without image'], 'coder10', 10);
    await product.addProduct('producto4', '', 4444, ['Without image'], 'coder4', 44);
    //await product.updateProduct(2, "Product update test", "This a test product update", 1000, ["Without image"], "coder", 100);
    //await product.deleteProduct(2);

    console.log("Products: ");
    const products = await product.getProducts();
    console.log(products);
    /* console.log("Product found: ")
    const productsById = await product.getProductById(2);
    console.log(productsById);
    const productsById_2 = await product.getProductById(4);
    console.log(productsById_2); */
    /* console.log("Product updated: ")
    const pruductUpdated = await product.getProducts()
    console.log(pruductUpdated); */
    /* const newProducts = await product.getProducts();
    console.log(newProducts); */
}

asyncThings();