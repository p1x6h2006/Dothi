// =====================================================
// CUỘN KHUNG PHẢI TỚI KẾT QUẢ: bấm vào chức năng nào ở khung Điều khiển (bên trái)
// thì khung thông tin bên phải (.info-area, cuộn độc lập) tự cuộn tới đúng phần kết quả của chức năng đó.
// =====================================================
// Cách nối: ô <details> / khối .mst-algo ở index.html có thuộc tính data-kq = khóa trong KQ_DICH.
// Khóa -> tiêu đề <h3> (đầu chuỗi) của phần kết quả tương ứng trong #thongTin; null = đầu khung (danh sách đỉnh / cạnh).
const KQ_DICH = {
    canh: null,
    euler: "Chu trình Euler",
    npt: "Bài toán người phát thư",
    kruskal: "Thuật toán Kruskal",
    prim: "Thuật toán Prim"
};

// Cuộn mượt khung phải tới phần kết quả của khóa `kq`, rồi nháy sáng tiêu đề cho dễ thấy
function cuonKhungPhai(kq) {
    const khung = document.querySelector(".info-area"), tt = $("thongTin");
    if (!khung || !tt || !(kq in KQ_DICH)) return;
    let dich = null;
    if (KQ_DICH[kq]) {
        dich = [...tt.querySelectorAll("h3")].find(h => h.textContent.trim().startsWith(KQ_DICH[kq]));
        if (!dich) return;
    }
    const top = dich ? Math.max(0, dich.getBoundingClientRect().top - khung.getBoundingClientRect().top + khung.scrollTop - 12) : 0;
    khung.scrollTo({ top, behavior: "smooth" });
    // Màn hình hẹp: khung phải nằm dưới điều khiển, đưa luôn vào tầm nhìn
    if (getComputedStyle(document.querySelector(".container")).flexDirection === "column") khung.scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (dich) {
        dich.classList.remove("kq-nhay");
        void dich.offsetWidth;   // khởi động lại hiệu ứng nếu bấm liên tiếp
        dich.classList.add("kq-nhay");
    }
}

// 1) Mở một ô chức năng -> cuộn tới kết quả của nó (đóng ô thì thôi)
document.querySelectorAll(".control details[data-kq]").forEach(d =>
    d.addEventListener("toggle", () => { if (d.open) cuonKhungPhai(d.dataset.kq); }));

// 2) Bấm vào khối Kruskal / Prim (trong ô cây khung nhỏ nhất) -> cuộn tới thuật toán đó.
//    Bỏ qua nút / ô nhập: các nút “Phân tích & giải…” đã tự cuộn tới bảng kết quả (kruskal.js, prim.js)
document.addEventListener("click", e => {
    if (e.target.closest("button, input, select, textarea, summary")) return;
    const o = e.target.closest(".mst-algo[data-kq]");
    if (o) cuonKhungPhai(o.dataset.kq);
});

// 3) Tạo đồ thị / thêm / xóa / sửa cạnh / sắp xếp -> cuộn về danh sách đỉnh, cạnh để thấy ngay thay đổi
["taoDoThi", "themCanh", "xoaCanh", "suaCanh", "sapXep"].forEach(ten => {
    const goc = window[ten];
    if (typeof goc !== "function") return;
    window[ten] = function () {
        const kq = goc.apply(this, arguments);
        cuonKhungPhai("canh");
        return kq;
    };
});
