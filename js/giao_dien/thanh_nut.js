// =====================================================
// THANH NÚT GÓC PHẢI TRÊN: hiện đúng các nút của chức năng đang chọn
// =====================================================
// Chức năng đang chọn (chucNangHien) đổi khi người dùng bấm vào / mở ô của chức năng đó (thuộc tính data-cn trong index.html):
//   euler   : Tô cả chu trình · Hủy mô phỏng
//   npt     : Tô cả hành trình · Trả lại đồ thị gốc · Hủy mô phỏng
//   kruskal : Tô cây khung · Hủy mô phỏng
//   prim    : Tô cây khung · Hủy mô phỏng
// Đóng ô thì thanh nút ẩn đi. capNhatThanhNut() được gọi mỗi lần dựng lại thông tin (thong_tin.js) để bật/tắt nút đúng trạng thái.

let chucNangHien = null;

const TN_TIEU_DE = { euler: "🔄 Chu trình Euler", npt: "📮 Người phát thư", kruskal: "🌲 Kruskal", prim: "🌳 Prim" };

function datChucNang(cn) {
    chucNangHien = cn || null;
    capNhatThanhNut();
}

function capNhatThanhNut() {
    const tn = $("thanhNut");
    if (!tn) return;
    const cn = chucNangHien;
    if (!cn || !Object.keys(nodes).length || (coHuong() && cn !== "euler")) { tn.hidden = true; tn.innerHTML = ""; return; }
    const nut = (cls, txt, fn, tat) => `<button class="${cls}" onclick="${fn}"${tat ? " disabled" : ""}>${txt}</button>`;
    let h = `<span class="tn-ten">${TN_TIEU_DE[cn]}</span>`;
    if (cn === "euler") h += nut("success", "Tô cả chu trình", "hienEuler()", !phanTichEuler().ok) + nut("danger", "✖ Hủy mô phỏng", "huyEuler()");
    else if (cn === "npt") h += nut("success", "Tô cả hành trình", "hienHanhTrinh()", !phanTichEuler().ok) + nut("danger", "↩ Trả lại đồ thị gốc", "traLaiDoThiGoc()", !npt || npt.daApDung === null) + nut("danger", "✖ Hủy mô phỏng", "huyMoPhongNPT()");
    else if (cn === "kruskal") h += nut("success", "Tô cây khung", "hienKruskal()") + nut("danger", "✖ Hủy mô phỏng", "boKruskal()");
    else if (cn === "prim") h += nut("success", "Tô cây khung", "hienPrim()") + nut("danger", "✖ Hủy mô phỏng", "huyPrim()");
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
