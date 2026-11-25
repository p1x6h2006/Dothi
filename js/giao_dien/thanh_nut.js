// =====================================================
// THANH NÚT GÓC PHẢI TRÊN: hiện đúng các nút của chức năng đang chọn
// =====================================================
// Chức năng đang chọn (chucNangHien) đổi khi người dùng bấm vào / mở ô của chức năng đó (thuộc tính data-cn trong index.html):
//   euler   : Tô cả chu trình · Trả lại đồ thị gốc · Hủy mô phỏng
//   npt     : Tô cả hành trình · Trả lại đồ thị gốc · Hủy mô phỏng
//   kruskal : Tô cây khung · Trả lại đồ thị gốc · Hủy mô phỏng
//   prim    : Tô cây khung · Trả lại đồ thị gốc · Hủy mô phỏng
//   dijkstra: Tô kết quả · Trả lại đồ thị gốc · Hủy mô phỏng (dùng được cả đồ thị có hướng)
// “Trả lại đồ thị gốc” (traLaiGocChung): bỏ mọi tô màu + hiện lại cạnh đã ẩn + bỏ cạnh lặp (*) đã thêm. “Hủy mô phỏng” chỉ dừng và bỏ tô màu của chức năng đó.
// Đóng ô thì thanh nút ẩn đi. capNhatThanhNut() được gọi mỗi lần dựng lại thông tin (thong_tin.js) để bật/tắt nút đúng trạng thái.

let chucNangHien = null;

const TN_TIEU_DE = { euler: "🔄 Chu trình Euler", npt: "📮 Người phát thư", kruskal: "🌲 Kruskal", prim: "🌳 Prim", dijkstra: "🛣️ Dijkstra" };

// TRẢ LẠI ĐỒ THỊ GỐC (dùng chung cho mọi chức năng có mô phỏng): dừng chạy, bỏ mọi tô màu (Euler / hành trình / Kruskal / Prim / đường đi),
// hiện lại các cạnh Kruskal / Prim đã ẩn, và bỏ các cạnh lặp (*) do người phát thư / Euler thêm vào -> đồ thị đúng như lúc người dùng nhập.
function traLaiGocChung() {
    resetEuler();   // dừng chạy (dkHuy) + bỏ tô màu + krHL = null (hiện lại cạnh bị ẩn) + pathHL = null
    if (npt && npt.daApDung !== null) traLaiDoThiGoc(true);   // bỏ cạnh lặp, về loại đồ thị ban đầu, vẽ lại + dựng lại bảng
    else { nptThongBao = ""; veDoThi(); hienThiThongTin(); }
    cuonDenDoThi();
}

function datChucNang(cn) {
    chucNangHien = cn || null;
    capNhatThanhNut();
}

function capNhatThanhNut() {
    const tn = $("thanhNut");
    if (!tn) return;
    const cn = chucNangHien;
    if (!cn || !Object.keys(nodes).length || (coHuong() && cn !== "euler" && cn !== "dijkstra")) { tn.hidden = true; tn.innerHTML = ""; return; }
    const nut = (cls, txt, fn, tat) => `<button class="${cls}" onclick="${fn}"${tat ? " disabled" : ""}>${txt}</button>`;
    let h = `<span class="tn-ten">${TN_TIEU_DE[cn]}</span>`;
    const goc = nut("info", "↩ Trả lại đồ thị gốc", "traLaiGocChung()");
    if (cn === "euler") h += nut("success", "Tô cả chu trình", "hienEuler()", !phanTichEuler().ok) + goc + nut("danger", "✖ Hủy mô phỏng", "huyEuler()");
    else if (cn === "npt") h += nut("success", "Tô cả hành trình", "hienHanhTrinh()", !phanTichEuler().ok) + goc + nut("danger", "✖ Hủy mô phỏng", "huyMoPhongNPT()");
    else if (cn === "kruskal") h += nut("success", "Tô cây khung", "hienKruskal()") + goc + nut("danger", "✖ Hủy mô phỏng", "boKruskal()");
    else if (cn === "prim") h += nut("success", "Tô cây khung", "hienPrim()") + goc + nut("danger", "✖ Hủy mô phỏng", "huyPrim()");
    else if (cn === "dijkstra") h += nut("success", "Tô kết quả", "hienDijkstra()") + goc + nut("danger", "✖ Hủy mô phỏng", "huyDijkstra()");
    tn.innerHTML = h;
    tn.hidden = false;
}

// Bấm vào bất cứ chỗ nào trong ô của một chức năng -> chọn chức năng đó
document.addEventListener("click", e => {
    const o = e.target.closest("[data-cn]");
    if (o) datChucNang(o.dataset.cn);
});

// Đóng ô chứa chức năng đang chọn thì ẩn thanh nút
document.querySelectorAll(".control details").forEach(d => d.addEventListener("toggle", () => {
    if (!chucNangHien) return;
    const chu = document.querySelector(`[data-cn="${chucNangHien}"]`);
    if (!chu || chu.closest("details:not([open])")) datChucNang(null);   // ô của chức năng (hoặc ô chứa nó) đã đóng
}));
