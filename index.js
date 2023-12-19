const express = require("express");
require("dotenv").config();

const route = require("./routers/client/index.route.js")

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engines", "pug");

//bất kỳ tệp tĩnh nào (như hình ảnh, stylesheet, JavaScript, vv.) trong thư mục "public" sẽ có thể được truy cập qua đường dẫn URL của ứng dụng.
// app.use(): là một middleware thực hiện các tác vụ trung gian trước khi xử lý yêu cầu từ người dùng, đến các tuyến đường (routes) khác.
app.use(express.static("public"));


// Routers
route(app)


app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
