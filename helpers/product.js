// Tính giảm giá cho nhiều SP
module.exports.priceNewProducts = (products) => {
    const newProducts = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0)
        return item;
    })

    return newProducts;
}

// Tính giảm giá cho 1 SP
module.exports.priceNewProduct = (product) => {
    const priceNew = (product.price * (100 - product.discountPercentage) / 100).toFixed(0)

    return priceNew;
}