const express = require("express");
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash')
const pug = require('pug');
require("dotenv").config();

// ------ Connect mongoose ---------------
const database = require("./config/database.js")
database.connect();

const systemConfig = require("./config/system.js")

const route = require("./routers/client/index.route.js")
const routeAdmin = require("./routers/admin/index.route.js")

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//⭐ app.set("views", `./views`);         // => Chỉ chạy được local
app.set("views", `${__dirname}/views`);
app.set("view engines", "pug");

// FLASH
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End FLASH

// App Locals Variables (dùng sửa biến nếu đổi enponit /admin/) => cách làm làm cho biến prefixAdmin tồn tại được trong tất cả các file pug để lấy sử dụng nó
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// bất kỳ tệp tĩnh nào (như hình ảnh, stylesheet, JavaScript, vv.) trong thư mục "public" sẽ có thể được truy cập qua đường dẫn URL của ứng dụng.
// app.use(): là một middleware thực hiện các tác vụ trung gian trước khi xử lý yêu cầu từ người dùng, đến các tuyến đường (routes) khác.
//⭐ console.log(__dirname)
//⭐ app.use(express.static(`public`)); // => Chỉ chạy được local
app.use(express.static(`${__dirname}/public`));


// Routers
route(app)
routeAdmin(app)


app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
