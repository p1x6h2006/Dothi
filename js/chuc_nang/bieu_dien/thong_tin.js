// =====================================================
// THÔNG TIN: danh sách đỉnh/cạnh, bậc của đỉnh, ghép các bảng ma trận
// =====================================================

// Danh sách đỉnh và cạnh
function htmlDinhCanh() {
    const text = `<b>Đỉnh:</b> ${dsDinh().map(nhanDinh).join(", ")}<br><b>Cạnh:</b><br>`;
    // Cạnh lặp (do người phát thư / Euler thêm vào) ghi dấu *
    const sao = i => canhThemNPT.has(i) ? "*" : "";
    return text + (edges.length ? edges.map((e, i) => `e${i + 1}${sao(i)}: (${nhanDinh(e.x)},${nhanDinh(e.y)})${sao(i)}<br>`).join("") : "<i>(Không có cạnh)</i><br>") +
        (canhThemNPT.size ? `<small>* = cạnh lặp (cạnh sao chép được thêm vào, ${canhThemNPT.size} cạnh)</small><br>` : "");
}

// Bậc của đỉnh
//   Vô hướng (loai 1-3): deg(v) = số cạnh kề, vòng khuyên tính 2.
//   Có hướng (loai 4-5): deg(v) = deg⁻ + deg⁺, kèm bảng bán bậc ra / vào.
function htmlBac() {
    const huong = coHuong(), range = dsDinh(), m = edges.length;
    const degIn = Array(n).fill(0), degOut = Array(n).fill(0), deg = Array(n).fill(0);
    edges.forEach(e => {
        if (huong) { degOut[e.x]++; degIn[e.y]++; }
        else if (e.x === e.y) deg[e.x] += 2;   // vòng khuyên tính bậc 2
        else { deg[e.x]++; deg[e.y]++; }
    });
    const bac = range.map(i => huong ? degIn[i] + degOut[i] : deg[i]);
    const dsBac = range.map(i => huong ? `deg(${nhanDinh(i)}) = ${bac[i]} (deg⁻=${degIn[i]}, deg⁺=${degOut[i]})` : `deg(${nhanDinh(i)}) = ${bac[i]}`);
    const loc = k => range.filter(i => bac[i] === k).map(nhanDinh).join(", ") || "Không có";

    let text = `<br><b>Bậc của đỉnh</b><br><div class="degree-values">${dsBac.join(", ")}</div>`;
    text += `<div class="degree-category">Đỉnh treo: ${loc(1)}</div>`;
    text += `<div class="degree-category">Đỉnh cô lập: ${loc(0)}</div>`;
    text += '<h3 class="degree-total-heading">Tổng tất cả các bậc của đỉnh:</h3>';
    text += `<div class="degree-total">Σ deg(v) = ${bac.reduce((a, b) => a + b, 0)} = 2 × ${m} cạnh</div>`;

    if (huong) {
        text += '<h3 class="directed-degree-heading">Bán bậc ra và bán bậc vào của đồ thị</h3>';
        text += '<div class="directed-degree-table-wrap"><table class="directed-degree-table"><thead><tr><th>Đỉnh</th><th>deg⁺(v)<br><small>Bán bậc ra</small></th><th>deg⁻(v)<br><small>Bán bậc vào</small></th></tr></thead><tbody>';
        text += range.map(i => `<tr><td>${nhanDinh(i)}</td><td>${degOut[i]}</td><td>${degIn[i]}</td></tr>`).join("");
        text += `</tbody></table><div class="directed-degree-sums">Σ deg⁺(v) = ${m} = ${m} cạnh<br>Σ deg⁻(v) = ${m}</div></div>`;
    }
    return text;
}

// Ghép tất cả vào khung thông tin bên dưới đồ thị. Thứ tự hiển thị:
//   1) Đỉnh/cạnh  2) Bậc  2b) THÀNH PHẦN LIÊN THÔNG (thanh_phan_lien_thong.js)  3) DANH SÁCH KỀ (danh_sach_ke.js)  4) Ma trận kề  4b) MA TRẬN LIÊN THUỘC  5) Ma trận trọng số  6) CHU TRÌNH EULER (chu_trinh_euler.js)  7) NGƯỜI PHÁT THƯ (nguoi_phat_thu.js)  8) KRUSKAL (kruskal.js)  9) PRIM (prim.js)  10) DIJKSTRA (dijkstra.js)
function hienThiThongTin() {
    if (eulerHL) { resetEuler(); veDoThi(); }   // dựng lại thông tin thì bỏ tô màu Euler cũ
    // Nhớ các khung "Cách giải chi tiết" đang mở (cach_giai.js) để mở lại sau khi dựng lại
    const dangMo = new Set([...document.querySelectorAll("#thongTin details.giai[open]")].map(d => d.dataset.key));
    $("thongTin").innerHTML =
        htmlDinhCanh() + giaiDinhCanh() +
        htmlBac() + giaiBac() +
        htmlThanhPhanLienThong() +
        htmlDanhSachKe() + giaiDanhSachKe() +
        htmlMaTranKe() + giaiMaTranKe() +
        htmlMaTranLienThuoc() + giaiMaTranLienThuoc() +
        htmlMaTranTrongSo() + giaiMaTranTrongSo() +
        htmlEuler() + giaiEuler() +
        htmlNguoiPhatThu() + giaiChiTietNPT() +
        htmlKruskal() + giaiChiTietKruskal() +
        htmlPrim() + giaiChiTietPrim() +
        htmlDijkstra() + giaiChiTietDijkstra();
    // Các nút chức năng nằm hết ở khung Điều khiển bên trái; khung bên phải chỉ hiện kết quả
    $("ctlEuler").innerHTML = htmlDieuKhienEuler();
    $("ctlNPT").innerHTML = htmlDieuKhienNPT();
    $("ctlKruskal").innerHTML = htmlDieuKhienKruskal();
    $("ctlPrim").innerHTML = htmlDieuKhienPrim();
    $("ctlDijkstra").innerHTML = htmlDieuKhienDijkstra();
    capNhatThanhNut();   // thanh nút góc phải trên (thanh_nut.js)
    if (typeof capNhatLuuY === "function") capNhatLuuY();   // dòng “Lưu ý” loại đồ thị dùng được (luu_y_loai.js)
    document.querySelectorAll("#thongTin details.giai").forEach(d => { if (dangMo.has(d.dataset.key)) d.open = true; });
    if (typeof ddDongBo === "function") ddDongBo();   // đồ thị đổi thì bỏ kết quả "Đường đi & chu trình" cũ (duong_di.js)
    capNhatNutDK();   // số bước + bật/tắt 5 nút điều khiển (dieu_khien_buoc.js)
    if (typeof luuTuDong === "function") luuTuDong();   // tự động lưu (luu_tru.js)
}
