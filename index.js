const express = require("express");
require("dotenv").config();

// ------ Connect mongoose ---------------
const database = require("./config/database.js")
database.connect();

const systemConfig = require("./config/system.js")

const route = require("./routers/client/index.route.js")
const routeAdmin = require("./routers/admin/index.route.js")

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engines", "pug");

// App Locals Variables (dùng sửa biến nếu đổi enponit /admin/) => cách làm làm cho biến prefixAdmin tồn tại được trong tất cả các file pug để lấy sử dụng nó
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// bất kỳ tệp tĩnh nào (như hình ảnh, stylesheet, JavaScript, vv.) trong thư mục "public" sẽ có thể được truy cập qua đường dẫn URL của ứng dụng.
// app.use(): là một middleware thực hiện các tác vụ trung gian trước khi xử lý yêu cầu từ người dùng, đến các tuyến đường (routes) khác.
app.use(express.static("public"));


// Routers
route(app)
routeAdmin(app)


app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
