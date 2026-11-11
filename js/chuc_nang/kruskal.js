// =====================================================
// THUẬT TOÁN KRUSKAL: tìm cây khung nhỏ nhất của đồ thị VÔ HƯỚNG có trọng số (loai 1-3)
// =====================================================
// Các bước (đúng như file "Thuật toán Kruskal" trên lớp):
//   1) Bắt đầu từ đồ thị rỗng T có n đỉnh, F = Ø.
//   2) Sắp xếp các cạnh của G theo trọng lượng TĂNG DẦN (bằng nhau thì giữ thứ tự nhập).
//   3) Lần lượt xét từng cạnh: bổ sung vào F nếu KHÔNG tạo nên chu trình trong T (hai đầu thuộc hai cây khác nhau),
//      ngược lại thì loại. Kiểm tra chu trình bằng Union–Find (tập các đỉnh rời nhau).
//   4) Dừng khi đã chọn đủ n−1 cạnh. Trọng lượng nhỏ nhất của cây khung = tổng trọng lượng các cạnh đã chọn.
// Cạnh không có trọng số tính w = 1 (giống bài người phát thư). Vòng khuyên luôn bị loại (tự tạo chu trình).
// Nếu đồ thị không liên thông: không có cây khung, thuật toán cho RỪNG KHUNG NHỎ NHẤT (n − k cạnh, k = số thành phần liên thông).
// Trạng thái tô màu: krHL (trang_thai.js) = { chon: {chỉ số cạnh: thứ tự chọn}, loai: [chỉ số cạnh bị loại], msg }
//   ve_do_thi.js đọc krHL khi vẽ cạnh: cạnh chọn màu xanh ngọc, cạnh bị loại màu đỏ nét đứt.

const MAU_KRUSKAL = "#059669";    // cạnh được chọn vào cây khung
const MAU_KRUSKAL_LOAI = "#ef4444";   // cạnh bị loại (tạo chu trình)
const NHAN_LOAI_KRUSKAL = "Thuật toán Kruskal chỉ hỗ trợ đồ thị vô hướng (loại 1–3).";
let krTimer = null;   // bộ đếm giờ của phần xem từng bước

// Dừng xem từng bước và bỏ tô màu (KHÔNG vẽ lại; nơi gọi tự vẽ lại nếu cần). resetEuler() cũng gọi hàm này.
function resetKruskalHL() {
    clearInterval(krTimer);
    krTimer = null;
    krHL = null;
}

function cuonDenKetQuaKruskal() {
    const e = $("krKetQua");
    if (e) e.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---- Tính toàn bộ lời giải trên đồ thị hiện tại ----
function tinhKruskal() {
    const kq = { loi: null };
    if (!edges.length) { kq.loi = "Đồ thị chưa có cạnh nào."; return kq; }

    const cha = dsDinh();
    const goc = x => cha[x] === x ? x : (cha[x] = goc(cha[x]));
    const dsThanhPhan = () => {   // các thành phần hiện tại (để giải thích từng bước)
        const m = new Map();
        dsDinh().forEach(v => { const r = goc(v); if (!m.has(r)) m.set(r, []); m.get(r).push(v); });
        return [...m.values()];
    };

    // Số thành phần liên thông của G (để biết cần chọn bao nhiêu cạnh)
    const cha0 = dsDinh();
    const goc0 = x => cha0[x] === x ? x : (cha0[x] = goc0(cha0[x]));
    edges.forEach(e => { cha0[goc0(e.x)] = goc0(e.y); });
    kq.soThanhPhan = new Set(dsDinh().map(goc0)).size;
    kq.lienThong = kq.soThanhPhan === 1;
    kq.canChon = n - kq.soThanhPhan;   // n−1 nếu liên thông

    // Bước 2: sắp xếp tăng dần theo trọng lượng (ổn định: bằng nhau thì theo thứ tự nhập)
    kq.sorted = edges.map((e, i) => ({ i, x: e.x, y: e.y, w: trongSoCanh(e) })).sort((a, b) => a.w - b.w || a.i - b.i);

    // Bước 3-4: duyệt từng cạnh
    kq.buoc = []; kq.chon = []; kq.tong = 0;
    kq.ban = dsThanhPhan();   // thành phần ban đầu: mỗi đỉnh một cây
    for (let k = 0; k < kq.sorted.length; k++) {
        if (kq.chon.length === kq.canChon) break;   // đã đủ cạnh -> dừng
        const c = kq.sorted[k], rx = goc(c.x), ry = goc(c.y);
        const chon = rx !== ry;
        if (chon) { cha[rx] = ry; kq.chon.push(c.i); kq.tong += c.w; }
        kq.buoc.push({ k, i: c.i, x: c.x, y: c.y, w: c.w, chon, thu: chon ? kq.chon.length : 0, dsTP: dsThanhPhan() });
    }
    // trạng thái của từng cạnh theo thứ tự đã sắp: "chon" | "loai" | "chua" (chưa xét vì đã dừng)
    kq.tt = kq.sorted.map((_, k) => kq.buoc[k] ? (kq.buoc[k].chon ? "chon" : "loai") : "chua");
    return kq;
}

// ---- Nút "Phân tích & giải": hiện bảng kết quả rồi nhảy xuống đó ----
function giaiKruskal() {
    if (coHuong()) return alert(NHAN_LOAI_KRUSKAL);
    resetEuler();   // bỏ tô màu Euler / Kruskal cũ
    hienThiThongTin();
    veDoThi();
    cuonDenKetQuaKruskal();
}

// ---- Tô màu trên hình ----
function datThongBaoKruskal(msg) {
    if (krHL) krHL.msg = msg;
    const t = $("krStatus");
    if (t) t.textContent = msg;
}

const moTaBuocKruskal = (b, soCan) => b.chon
    ? `Xét (${nhanDinh(b.x)},${nhanDinh(b.y)}) w = ${fmt(b.w)}: hai đầu ở hai cây khác nhau ⇒ CHỌN (${b.thu}/${soCan}).`
    : `Xét (${nhanDinh(b.x)},${nhanDinh(b.y)}) w = ${fmt(b.w)}: ${b.x === b.y ? "là vòng khuyên" : "hai đầu đã cùng một cây"} ⇒ tạo chu trình, LOẠI.`;

// Xem từng bước: mỗi 1 giây xét thêm một cạnh theo thứ tự đã sắp xếp
function chayKruskal() {
    if (coHuong()) return alert(NHAN_LOAI_KRUSKAL);
    const kq = tinhKruskal();
    if (kq.loi) return alert(kq.loi);
    resetEuler();
    krHL = { chon: {}, loai: [], msg: "" };
    datThongBaoKruskal(`Bắt đầu với F = Ø: đồ thị rỗng T có ${n} đỉnh, ${kq.sorted.length} cạnh đã xếp tăng dần.`);
    veDoThi();
    cuonDenDoThi();
    let k = 0;
    krTimer = setInterval(() => {
        if (!krHL) { clearInterval(krTimer); krTimer = null; return; }
        if (k >= kq.buoc.length) {
            clearInterval(krTimer); krTimer = null;
            datThongBaoKruskal(`Xong: đã chọn ${kq.chon.length} cạnh, trọng lượng nhỏ nhất = ${fmt(kq.tong)}.`);
            veDoThi();
            return;
        }
        const b = kq.buoc[k++];
        if (b.chon) krHL.chon[b.i] = b.thu; else krHL.loai.push(b.i);
        datThongBaoKruskal(moTaBuocKruskal(b, kq.canChon));
        veDoThi();
    }, 1000);
}

// Tô ngay cây khung (chỉ các cạnh được chọn)
function hienKruskal() {
    if (coHuong()) return alert(NHAN_LOAI_KRUSKAL);
    const kq = tinhKruskal();
    if (kq.loi) return alert(kq.loi);
    resetEuler();
    krHL = { chon: {}, loai: [], msg: "" };
    kq.buoc.forEach(b => { if (b.chon) krHL.chon[b.i] = b.thu; });
    datThongBaoKruskal(`${kq.lienThong ? "Cây khung nhỏ nhất" : "Rừng khung nhỏ nhất"}: ${kq.chon.length} cạnh, trọng lượng = ${fmt(kq.tong)}.`);
    veDoThi();
    cuonDenDoThi();
}

function boKruskal() {
    resetKruskalHL();
    veDoThi();
    const t = $("krStatus");
    if (t) t.textContent = "";
    cuonDenDoThi();
}

// ---- Nạp đồ thị mẫu lấy từ file Word (đỉnh a,b,c,… được đánh số 0,1,2,…) ----
const VI_DU_KRUSKAL = {
    1: {   // Ví dụ: 6 đỉnh a..f -> 0..5, cây khung nặng 33
        n: 6, tenDinh: "A=0, B=1, C=2, D=3, E=4, F=5",
        e: [[3, 4, 1], [0, 5, 3], [1, 5, 4], [2, 3, 5], [2, 4, 7], [0, 1, 12], [5, 4, 20], [1, 2, 24]],
        pos: null   // bố trí đều trên vòng tròn
    },
    2: {   // Bài tập: 9 đỉnh, cây khung nặng 37
        n: 9, tenDinh: "9 đỉnh 0..8",
        e: [[6, 7, 1], [2, 8, 2], [5, 6, 2], [0, 1, 4], [2, 5, 4], [6, 8, 6], [2, 3, 7], [7, 8, 7], [0, 7, 8], [1, 2, 8], [3, 4, 9], [4, 5, 10], [1, 7, 11], [3, 5, 14]],
        pos: [[0.08, 0.5], [0.28, 0.15], [0.5, 0.15], [0.72, 0.15], [0.92, 0.5], [0.72, 0.85], [0.5, 0.85], [0.28, 0.85], [0.5, 0.5]]
    }
};

function napViDuKruskal(k) {
    const vd = VI_DU_KRUSKAL[k];
    if (!vd) return;
    if (edges.length && !confirm("Nạp ví dụ sẽ thay thế đồ thị hiện tại. Tiếp tục?")) return;
    resetEuler(); resetNguoiPhatThu();
    $("loai").value = 1; capNhatTenLoai();   // đơn đồ thị vô hướng
    n = vd.n;
    edges = vd.e.map(([x, y, w]) => taoCanh(x, y, w));
    nodes = {};
    for (let i = 0; i < n; i++) nodes[i] = { x: 0, y: 0 };
    $("soDinh").value = n; $("soCanh").value = edges.length;
    sapXep();   // bố trí tròn (cũng vẽ lại)
    if (vd.pos) {
        const W = svg.clientWidth, H = svg.clientHeight;
        vd.pos.forEach(([px, py], i) => { nodes[i].x = 60 + px * (W - 120); nodes[i].y = 60 + py * (H - 120); });
        veDoThi();
    }
    hienThiThongTin();
}

// ---- Vẽ phần kết quả vào khung thông tin ----
function htmlKruskal() {
    let text = '<h3 class="adjacency-matrix-heading">Thuật toán Kruskal (cây khung nhỏ nhất)</h3>';
    if (coHuong()) return text + '<div class="npt-wrap" id="krKetQua">' + NHAN_LOAI_KRUSKAL + "</div>";
    const kq = tinhKruskal();
    if (kq.loi) return text + `<div class="npt-wrap" id="krKetQua"><i>${kq.loi}</i></div>`;

    text += '<div class="npt-wrap" id="krKetQua">';
    text += `<div class="npt-step"><b>1. Bắt đầu từ đồ thị rỗng T có ${n} đỉnh</b>, F = Ø.</div>`;
    text += '<div class="npt-step"><b>2. Sắp xếp các cạnh theo thứ tự tăng dần:</b></div>';
    const o = (cls, nd) => `<td class="${cls}">${nd}</td>`;
    text += '<div class="kr-scroll"><table class="kr-table"><tbody>' +
        "<tr><th>Cạnh</th>" + kq.sorted.map((c, k) => o("kr-" + kq.tt[k], `(${nhanDinh(c.x)},${nhanDinh(c.y)})`)).join("") + "</tr>" +
        "<tr><th>Trọng lượng</th>" + kq.sorted.map((c, k) => o("kr-" + kq.tt[k], fmt(c.w))).join("") + "</tr>" +
        "<tr><th>Kết quả</th>" + kq.sorted.map((c, k) => o("kr-" + kq.tt[k], { chon: "✔ chọn", loai: "✖ loại", chua: "—" }[kq.tt[k]])).join("") + "</tr>" +
        "</tbody></table></div>";
    text += ghiChu("✔ chọn: không tạo chu trình trong T. ✖ loại: hai đầu đã cùng một cây nên sẽ tạo chu trình. — : chưa xét vì thuật toán đã dừng.");

    text += `<div class="npt-step"><b>3. Bổ sung dần các cạnh vào F</b> với điều kiện không tạo nên chu trình trong T:</div>`;
    text += '<div class="kr-scroll"><table class="kr-table"><tbody>' +
        "<tr><th>Cạnh</th>" + kq.chon.map(i => `<td class="kr-chon">(${nhanDinh(edges[i].x)},${nhanDinh(edges[i].y)})</td>`).join("") + "</tr>" +
        "<tr><th>Trọng lượng</th>" + kq.chon.map(i => `<td class="kr-chon">${fmt(trongSoCanh(edges[i]))}</td>`).join("") + "</tr>" +
        "</tbody></table></div>";
    text += `<div class="npt-step"><b>4.</b> Thuật toán dừng lại khi có n − 1 = ${n - 1} cạnh được chọn${kq.lienThong ? "." : " (không đạt được vì đồ thị không liên thông)."}</div>`;

    if (kq.lienThong) {
        text += `<div class="npt-total">Trọng lượng nhỏ nhất cây khung: ${kq.chon.map(i => fmt(trongSoCanh(edges[i]))).join(" + ")} = ${fmt(kq.tong)}</div>`;
    } else {
        text += `<div class="euler-no">✖ Đồ thị không liên thông (${kq.soThanhPhan} thành phần) nên không có cây khung.</div>`;
        text += `<div class="npt-total">Rừng khung nhỏ nhất (${kq.chon.length} cạnh): ${kq.chon.map(i => fmt(trongSoCanh(edges[i]))).join(" + ") || "0"} = ${fmt(kq.tong)}</div>`;
    }
    text += '<div class="npt-btns kr-btns">' +
        '<button onclick="chayKruskal()">▶ Xem từng bước</button>' +
        '<button class="success" onclick="hienKruskal()">Tô cây khung</button>' +
        '<button class="danger" onclick="boKruskal()">Bỏ tô màu</button></div>';
    text += '<div class="euler-status" id="krStatus">' + (krHL && krHL.msg ? krHL.msg : "") + "</div>";
    if (edges.some(e => e.w === undefined)) text += ghiChu("Cạnh nhập không có trọng số được tính w = 1.");
    return text + "</div>";
}
