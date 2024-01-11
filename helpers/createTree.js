let count = 0;
const createTree = (arr, parentId = "") => {
    const tree = [];
    arr.forEach((item) => {
        // console.log("🚀 ~ file: product-category.controller.js:27 ~ arr.forEach ~ item:", item)
        if (item.parent_id === parentId) {
            count++;
            // console.log("⭐⭐⭐⭐⭐ PASS")
            const newItem = item;
            newItem.index = count;
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
    count = 0;
    const tree = createTree(arr, parentId = "");
    return tree;
}