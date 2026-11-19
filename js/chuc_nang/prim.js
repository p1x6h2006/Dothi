// =====================================================
// THUẬT TOÁN PRIM: tìm cây khung nhỏ nhất của đồ thị VÔ HƯỚNG có trọng số (loai 1-3)
// =====================================================
// Các bước:
//   1) Chọn một đỉnh xuất phát s, đặt tập đỉnh đã chọn V_T = {s}, cây T chưa có cạnh.
//   2) Xét mọi cạnh "ứng viên": một đầu nằm trong V_T, đầu kia nằm ngoài V_T.
//      Chọn cạnh có trọng lượng NHỎ NHẤT (bằng nhau thì lấy cạnh nhập trước), thêm vào T, đưa đỉnh mới vào V_T.
//   3) Lặp lại bước 2 cho đến khi đủ n − 1 cạnh (hoặc hết cạnh ứng viên).
//      Trọng lượng nhỏ nhất của cây khung = tổng trọng lượng các cạnh đã chọn.
// Cạnh không có trọng số tính w = 1. Vòng khuyên không bao giờ là cạnh ứng viên.
// Nếu đồ thị không liên thông: Prim chỉ phủ được thành phần liên thông chứa đỉnh xuất phát.
//
// Tô màu trên hình dùng CHUNG biến krHL với Kruskal (trang_thai.js):
//   krHL = { kieu: "prim", chon: {chỉ số cạnh: thứ tự}, loai: [], tham: [đỉnh đã chọn], an: true/false, msg }
//   an = true  -> ve_do_thi.js KHÔNG vẽ các cạnh không thuộc cây khung (xóa cạnh thừa trên hình, dữ liệu đồ thị vẫn nguyên).
//   Bấm "Hủy mô phỏng" -> krHL = null -> đồ thị trở về bình thường.
// Bộ điều khiển từng bước dùng chung (js/loi/dieu_khien_buoc.js) nên resetKruskalHL() dừng được cả Prim.

let primStart = 0;   // đỉnh xuất phát do người dùng chọn

const NHAN_LOAI_PRIM = "Thuật toán Prim chỉ hỗ trợ đồ thị vô hướng (loại 1–3).";

function dinhPrimHopLe() {
    return Number.isInteger(primStart) && primStart >= 0 && primStart < n ? primStart : 0;
}

// ---- Tính toàn bộ lời giải trên đồ thị hiện tại ----
function tinhPrim() {
    const kq = { loi: null };
    if (!edges.length) { kq.loi = "Đồ thị chưa có cạnh nào."; return kq; }

    // Số thành phần liên thông của G
    const cha0 = dsDinh();
    const goc0 = x => cha0[x] === x ? x : (cha0[x] = goc0(cha0[x]));
    edges.forEach(e => { cha0[goc0(e.x)] = goc0(e.y); });
    kq.soThanhPhan = new Set(dsDinh().map(goc0)).size;
    kq.lienThong = kq.soThanhPhan === 1;

    const s = dinhPrimHopLe();
    kq.start = s;
    kq.canChon = dsDinh().filter(v => goc0(v) === goc0(s)).length - 1;   // số cạnh cần chọn trong thành phần chứa s

    const tham = new Set([s]);
    kq.buoc = []; kq.chon = []; kq.tong = 0;
    while (kq.chon.length < kq.canChon) {
        const ungVien = edges
            .map((e, i) => ({ i, x: e.x, y: e.y, w: trongSoCanh(e) }))
            .filter(c => c.x !== c.y && tham.has(c.x) !== tham.has(c.y))
            .sort((a, b) => a.w - b.w || a.i - b.i);
        if (!ungVien.length) break;
        const best = ungVien[0];
        const daTham = [...tham];                       // tập đỉnh đã chọn TRƯỚC khi thêm cạnh này
        const moi = tham.has(best.x) ? best.y : best.x;  // đỉnh mới được đưa vào cây
        tham.add(moi);
        kq.chon.push(best.i);
        kq.tong += best.w;
        kq.buoc.push({ k: kq.buoc.length, i: best.i, x: best.x, y: best.y, w: best.w, moi, thu: kq.chon.length, ungVien, daTham, sauTham: [...tham] });
    }
    kq.tham = [...tham];
    return kq;
}

// ---- Nút "Phân tích & giải": hiện bảng kết quả rồi nhảy xuống đó ----
function giaiPrim() {
    if (coHuong()) return alert(NHAN_LOAI_PRIM);
    resetEuler();   // bỏ tô màu cũ (Euler / Kruskal / Prim)
    hienThiThongTin();
    veDoThi();
    const e = $("primKetQua");
    if (e) e.scrollIntoView({ behavior: "smooth", block: "start" });
}

function datThongBaoPrim(msg) {
    if (krHL) krHL.msg = msg;
    const t = $("primStatus");
    if (t) t.textContent = msg;
}

const tenCanhPrim = c => `(${nhanDinh(c.x)},${nhanDinh(c.y)})`;

const moTaBuocPrim = (b, soCan) =>
    `Bước ${b.thu}/${soCan}: trong ${b.ungVien.length} cạnh ứng viên, cạnh ${tenCanhPrim(b)} có w = ${fmt(b.w)} nhỏ nhất ⇒ CHỌN, thêm đỉnh ${nhanDinh(b.moi)} vào cây.`;

// Mô phỏng từng bước (nút ⏮ ◀ ▶ ⏩ ⏸ trong js/loi/dieu_khien_buoc.js): bước j = đã chọn j cạnh đầu của cây;
// bước cuối (max) = xong, ẩn các cạnh thừa.
function taoDKPrim() {
    if (coHuong()) { alert(NHAN_LOAI_PRIM); return null; }
    const kq = tinhPrim();
    if (kq.loi) { alert(kq.loi); return null; }
    const L = kq.buoc.length;
    return {
        max: L + 1, delay: 1000,
        k0: () => krHL && krHL.kieu === "prim" ? (krHL.an ? L + 1 : Object.keys(krHL.chon).length) : 0,
        ap: j => {
            eulerHL = null;
            krHL = { kieu: "prim", chon: {}, loai: [], tham: [kq.start], an: j > L, msg: "" };
            kq.buoc.slice(0, Math.min(j, L)).forEach(b => { krHL.chon[b.i] = b.thu; krHL.tham = b.sauTham; });
            datThongBaoPrim(j === 0
                ? `Bắt đầu từ đỉnh ${nhanDinh(kq.start)}: V_T = {${nhanDinh(kq.start)}}, F = Ø.`
                : j <= L ? moTaBuocPrim(kq.buoc[j - 1], kq.canChon)
                : `Xong: ${kq.lienThong ? "cây khung nhỏ nhất" : "cây khung của thành phần chứa đỉnh xuất phát"} có ${kq.chon.length} cạnh, trọng lượng = ${fmt(kq.tong)}. Đã xóa các cạnh thừa (bấm “Hủy mô phỏng” để trả lại).`);
        }
    };
}

// Tô ngay cây khung và xóa luôn các cạnh thừa
function hienPrim() {
    if (coHuong()) return alert(NHAN_LOAI_PRIM);
    const kq = tinhPrim();
    if (kq.loi) return alert(kq.loi);
    resetEuler();
    krHL = { kieu: "prim", chon: {}, loai: [], tham: kq.tham, an: true, msg: "" };
    kq.buoc.forEach(b => { krHL.chon[b.i] = b.thu; });
    datThongBaoPrim(`${kq.lienThong ? "Cây khung nhỏ nhất" : "Cây khung của thành phần chứa đỉnh xuất phát"}: ${kq.chon.length} cạnh, trọng lượng = ${fmt(kq.tong)}. Đã xóa các cạnh thừa.`);
    veDoThi();
    cuonDenDoThi();
}

// HỦY MÔ PHỎNG: dừng chạy, bỏ tô màu, hiện lại mọi cạnh -> đồ thị như ban đầu
function huyPrim() {
    resetKruskalHL();
    veDoThi();
    const t = $("primStatus");
    if (t) t.textContent = "";
    cuonDenDoThi();
}

function doiDinhPrim(v) {
    primStart = parseInt(v);
    resetEuler(); veDoThi();   // đổi đỉnh xuất phát: bỏ mô phỏng cũ
    hienThiThongTin();   // dựng lại bảng và tự bỏ tô màu cũ
}

// ---- Vẽ phần kết quả vào khung thông tin ----
function htmlPrim() {
    let text = '<h3 class="adjacency-matrix-heading">Thuật toán Prim (cây khung nhỏ nhất)</h3>';
    if (coHuong()) return text + '<div class="npt-wrap" id="primKetQua">' + NHAN_LOAI_PRIM + "</div>";
    const kq = tinhPrim();
    if (kq.loi) return text + `<div class="npt-wrap" id="primKetQua"><i>${kq.loi}</i></div>`;

    const tp = ds => "{" + ds.map(nhanDinh).join(", ") + "}";
    text += '<div class="npt-wrap" id="primKetQua">';
    text += `<div class="euler-start">Đỉnh bắt đầu: <select onchange="doiDinhPrim(this.value)">${
        dsDinh().map(i => `<option value="${i}"${i === kq.start ? " selected" : ""}>${nhanDinh(i)}</option>`).join("")}</select></div>`;
    text += `<div class="npt-step"><b>1. Chọn đỉnh ${nhanDinh(kq.start)}</b>: V<sub>T</sub> = ${tp([kq.start])}, F = Ø.</div>`;
    text += '<div class="npt-step"><b>2. Mỗi bước chọn cạnh ứng viên nhỏ nhất</b> (một đầu trong V<sub>T</sub>, một đầu ngoài V<sub>T</sub>):</div>';

    text += '<div class="kr-scroll"><table class="kr-table"><tbody>' +
        "<tr><th>Bước</th><th>V<sub>T</sub> trước khi chọn</th><th>Cạnh ứng viên</th><th>Cạnh chọn</th></tr>" +
        kq.buoc.map(b =>
            `<tr><td>${b.thu}</td><td>${tp(b.daTham)}</td>` +
            `<td style="text-align:left">${b.ungVien.map(c => (c.i === b.i ? "<b>" : "") + `${tenCanhPrim(c)}:${fmt(c.w)}` + (c.i === b.i ? "</b>" : "")).join(", ")}</td>` +
            `<td class="kr-chon">${tenCanhPrim(b)} · ${fmt(b.w)}</td></tr>`).join("") +
        "</tbody></table></div>";
    text += ghiChu("Cạnh in đậm trong cột “Cạnh ứng viên” là cạnh có trọng lượng nhỏ nhất, được chọn ở bước đó.");

    text += `<div class="npt-step"><b>3.</b> Dừng khi có n − 1 = ${n - 1} cạnh${kq.lienThong ? "." : " (không đạt được vì đồ thị không liên thông)."}</div>`;
    if (kq.lienThong) {
        text += `<div class="npt-total">Trọng lượng nhỏ nhất cây khung: ${kq.chon.map(i => fmt(trongSoCanh(edges[i]))).join(" + ")} = ${fmt(kq.tong)}</div>`;
    } else {
        text += `<div class="euler-no">✖ Đồ thị không liên thông (${kq.soThanhPhan} thành phần) nên Prim chỉ phủ được thành phần chứa đỉnh ${nhanDinh(kq.start)}.</div>`;
        text += `<div class="npt-total">Cây khung của thành phần đó (${kq.chon.length} cạnh): ${kq.chon.map(i => fmt(trongSoCanh(edges[i]))).join(" + ") || "0"} = ${fmt(kq.tong)}</div>`;
    }
    text += '<div class="npt-btns kr-btns">' +
        '<button class="success" onclick="hienPrim()">Tô cây khung</button>' +
        '<button class="danger" onclick="huyPrim()">✖ Hủy mô phỏng</button></div>';
    text += htmlDieuKhienBuoc("prim");
    text += '<div class="euler-status" id="primStatus">' + (krHL && krHL.kieu === "prim" && krHL.msg ? krHL.msg : "") + "</div>";
    if (edges.some(e => e.w === undefined)) text += ghiChu("Cạnh nhập không có trọng số được tính w = 1.");
    return text + "</div>";
}
