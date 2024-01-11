const createTree = (arr, parentId = "") => {
    const tree = [];
    arr.forEach((item) => {
        // console.log("🚀 ~ file: product-category.controller.js:27 ~ arr.forEach ~ item:", item)
        if (item.parent_id === parentId) {
            // console.log("⭐⭐⭐⭐⭐ PASS")
            const newItem = item;
            const children = createTree(arr, item.id)       // khi bạn sử dụng "item.id" trong mã của bạn, Mongoose hiểu rằng bạn đang muốn truy cập trường _id và tự động chuyển đổi nó thành dạng chuỗi nếu cần thiết.
            if (children.length > 0) {
                newItem.children = children;
            }
            tree.push(newItem);
        }
    });
    return tree;
}

module.exports.tree = (arr, parentId = "") => {
    const tree = createTree(arr, parentId = "");
    return tree;
}