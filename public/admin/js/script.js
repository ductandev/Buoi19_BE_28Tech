// Button Status  => những thuộc tính tự định nghĩa khi dùng querySelectorAll thì phải thêm dấu ngoặc vuông [] vào
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
    // let url = window.location.href   => Lấy ra url của trang web hiện tại
    // console.log(url);
    // hàm URL() dùng để thêm key hay params trên này dùng để thay đổi params
    let url = new URL(window.location.href) // => Lấy ra url của trang web hiện tại

    buttonStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");    // LẤy ra status hiện tại của button

            if (status) {
                url.searchParams.set("status", status);     // Xét lại params cho URL
            } else {
                url.searchParams.delete("status");
            }

            console.log(url.href)
            window.location.href = url.href     // Chuyển hướng trang sang params mới
        });
    });
}
// End Button Status


// Form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href) // => Lấy ra url của trang web hiện tại

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();  // Ngăn sự kiện load lại trang web
        const keyword = e.target.elements.keyword.value
        // console.log(keyword);

        if (keyword) {
            url.searchParams.set("keyword", keyword);     // Xét lại params cho URL
        } else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href     // Chuyển hướng trang sang params mới
    });
}
// End Form search


// Pagination
const buttonPagination = document.querySelectorAll("[button-pagination")
if (buttonPagination) {
    let url = new URL(window.location.href) // => Lấy ra url của trang web hiện tại

    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");

            url.searchParams.set("page", page);
            window.location.href = url.href     // Chuyển hướng trang sang params mới

        })
    })
}
// End Pagination
