// =====================================================
// THUẬT TOÁN DIJKSTRA: đường đi ngắn nhất từ MỘT đỉnh nguồn tới mọi đỉnh còn lại
// =====================================================
// Dùng được cho CẢ 5 LOẠI đồ thị (vô hướng đi được hai chiều, có hướng chỉ đi đúng chiều mũi tên).
// Điều kiện: mọi trọng số >= 0 (cạnh không có trọng số tính w = 1). Vòng khuyên không bao giờ giúp đường đi ngắn hơn nên bỏ qua.
// Cạnh song song: tự nhiên lấy cạnh nhỏ nhất vì mỗi cạnh đều được thử cập nhật.
//
// Các bước (đúng như file Word “Dijkstra_giai_thich.docx”):
//   1) Chọn đỉnh nguồn s: d(s) = 0 (chốt luôn), các đỉnh khác tạm ghi (∞, -).
//   2) Mỗi bước: trong các đỉnh CHƯA CHỐT, chọn đỉnh có d nhỏ nhất rồi CHỐT nó (bằng nhau thì lấy đỉnh có số hiệu nhỏ hơn).
//   3) Thử đi qua đỉnh vừa chốt u tới mỗi đỉnh kề v chưa chốt: nếu d(u) + w(u,v) < d(v) thì cập nhật d(v) = d(u) + w, p(v) = u.
//   4) Lặp lại đến khi hết đỉnh có thể chốt. Đỉnh còn ∞ là đỉnh không có đường đi từ s.
// Mỗi ô của bảng có dạng (d, p): d = độ dài ngắn nhất tìm được tới đỉnh đó đến lúc này, p = đỉnh đứng ngay trước nó trên đường đi.
//
// Tô màu trên hình dùng CHUNG biến krHL với Kruskal / Prim (trang_thai.js):
//   krHL = { kieu: "dijkstra", buoc, chon: {chỉ số cạnh: thứ tự}, tham: [đỉnh đã chốt], tam: [cạnh tạm thời],
//            cur: đỉnh vừa chốt, xam: true -> cạnh không thuộc cây vẽ nét đứt xám, nhan: {đỉnh: {t: "(d, p)", c: "chot"|"tam"|"vo"}}, msg }
//   ve_do_thi.js đọc krHL khi vẽ cạnh (chon xanh ngọc, tam cam, xam xám nét đứt) và vẽ ô (d, p) dưới mỗi đỉnh (veNhanDijkstra).
// Bộ điều khiển từng bước dùng chung (js/loi/dieu_khien_buoc.js) nên resetKruskalHL() dừng được cả Dijkstra.

let dijkstraStart = 0;      // đỉnh nguồn do người dùng chọn
let dijkstraDich = null;    // đỉnh đích muốn xem riêng một đường đi (null = xem cả cây)

const MAU_DIJKSTRA_TAM = "#f59e0b";   // cạnh đang là “p” tạm thời của một đỉnh chưa chốt
const MAU_DIJKSTRA_XAM = "#94a3b8";   // cạnh không thuộc cây đường đi ngắn nhất (khi xong)

const dinhDijkstraHopLe = () => Number.isInteger(dijkstraStart) && dijkstraStart >= 0 && dijkstraStart < n ? dijkstraStart : 0;
const dichDijkstraHopLe = () => Number.isInteger(dijkstraDich) && dijkstraDich >= 0 && dijkstraDich < n ? dijkstraDich : null;
const gachDijkstra = () => (coHuong() ? "→" : "–");
const tenCanhDijkstra = e => `(${nhanDinh(e.x)},${nhanDinh(e.y)})`;
// Ô (d, p): (∞, -) nghĩa là chưa tìm được đường tới đỉnh đó
const dpDijkstra = (d, p) => d === Infinity ? "(∞, -)" : `(${fmt(d)}, ${p === null || p === undefined ? "-" : nhanDinh(p)})`;

// ---- Tính toàn bộ lời giải trên đồ thị hiện tại ----
function tinhDijkstra() {
    const kq = { loi: null };
    if (!edges.length) { kq.loi = "Đồ thị chưa có cạnh nào."; return kq; }
    const am = edges.findIndex(e => trongSoCanh(e) < 0);
    if (am >= 0) { kq.loi = `Cạnh ${tenCanhDijkstra(edges[am])} có trọng số âm (w = ${fmt(trongSoCanh(edges[am]))}). Dijkstra chỉ đúng khi mọi trọng số ≥ 0.`; return kq; }

    const huong = coHuong(), V = dsDinh(), s = dinhDijkstraHopLe();
    kq.start = s; kq.huong = huong;

    // Danh sách kề: vô hướng đi cả hai chiều, có hướng chỉ đi từ x sang y
    const ke = V.map(() => []);
    edges.forEach((e, i) => {
        if (e.x === e.y) return;
        const w = trongSoCanh(e);
        ke[e.x].push({ v: e.y, w, i });
        if (!huong) ke[e.y].push({ v: e.x, w, i });
    });

    const d = V.map(() => Infinity), p = V.map(() => null), cp = V.map(() => null);   // cp: chỉ số cạnh nối p(v) với v
    const dong = new Set(), thuTu = [];
    d[s] = 0;
    kq.buoc = [];
    let tu = null;   // đỉnh vừa chốt ở bước trước (nguồn của lần cập nhật)
    for (;;) {
        // (a) thử đi qua đỉnh vừa chốt tu tới các đỉnh kề
        const capNhat = [], daChot = [];
        if (tu !== null) {
            ke[tu].forEach(({ v, w, i }) => {
                if (dong.has(v)) { daChot.push(v); return; }
                const tong = d[tu] + w, cu = d[v], pCu = p[v], moi = tong < d[v];
                if (moi) { d[v] = tong; p[v] = tu; cp[v] = i; }
                capNhat.push({ v, w, i, tong, cu, pCu, moi });
            });
        }
        // (b) chọn đỉnh chưa chốt có d nhỏ nhất (bằng nhau thì lấy số hiệu nhỏ hơn)
        let best = null;
        V.forEach(v => { if (!dong.has(v) && d[v] < Infinity && (best === null || d[v] < d[best])) best = v; });
        if (best === null) break;
        const chuaChot = V.filter(v => !dong.has(v) && d[v] < Infinity).map(v => ({ v, d: d[v] }));
        const dongTruoc = [...dong];
        dong.add(best); thuTu.push(best);
        kq.buoc.push({
            k: kq.buoc.length + 1, tu, capNhat, daChot: [...new Set(daChot)], chuaChot,
            hoa: chuaChot.filter(c => c.d === d[best]).length > 1,   // có đỉnh khác cùng d nhỏ nhất
            chon: best, dongTruoc, d: [...d], p: [...p], cp: [...cp], dong: [...dong]
        });
        tu = best;
    }

    kq.d = d; kq.p = p; kq.cp = cp; kq.thuTu = thuTu;
    kq.khongToi = V.filter(v => !dong.has(v));
    kq.duong = v => { const r = []; for (let x = v; x !== null; x = p[x]) r.push(x); return r.reverse(); };   // lần ngược từ v về nguồn
    kq.canhCay = thuTu.filter(v => v !== s).map(v => cp[v]);   // mỗi đỉnh (trừ nguồn) giữ đúng một cạnh nối với đỉnh đứng trước
    kq.tongCay = kq.canhCay.reduce((a, i) => a + trongSoCanh(edges[i]), 0);
    return kq;
}

// ---- Mô tả một bước (hiện góc trên bên trái hình) ----
function moTaBuocDijkstra(b, L) {
    const ten = nhanDinh;
    if (b.tu === null) return `Bước ${b.k}/${L}: d(${ten(b.chon)}) = 0 ⇒ chốt đỉnh nguồn ${ten(b.chon)}.`;
    const moi = b.capNhat.filter(c => c.moi);
    return `Bước ${b.k}/${L}: đi qua ${ten(b.tu)} (d=${fmt(b.d[b.tu])}) ` +
        (moi.length ? `cập nhật ${moi.map(c => `${ten(c.v)}=${fmt(c.tong)}`).join(", ")}` : "không cập nhật đỉnh nào") +
        ` ⇒ chốt ${ten(b.chon)} (d=${fmt(b.d[b.chon])}).`;
}

// ---- Dựng lại toàn bộ phần tô màu ở bước j (0 = chưa làm gì, L = xong) ----
function taoHLDijkstra(kq, j) {
    const L = kq.buoc.length, s = kq.start, V = dsDinh(), ten = nhanDinh;
    const hl = { kieu: "dijkstra", buoc: j, chon: {}, loai: [], tham: [], tam: [], cur: null, xam: false, an: false, nhan: {}, msg: "" };
    if (j <= 0) {
        V.forEach(v => { hl.nhan[v] = v === s ? { t: "0", c: "tam" } : { t: "(∞, -)", c: "vo" }; });
        hl.msg = `Bắt đầu: d(${ten(s)}) = 0, các đỉnh khác tạm ghi (∞, -).`;
        return hl;
    }
    const b = kq.buoc[Math.min(j, L) - 1];
    V.forEach(v => {
        if (b.dong.includes(v)) hl.nhan[v] = { t: v === s ? "0" : dpDijkstra(b.d[v], b.p[v]), c: "chot" };
        else if (b.d[v] < Infinity) hl.nhan[v] = { t: dpDijkstra(b.d[v], b.p[v]), c: "tam" };
        else hl.nhan[v] = { t: "(∞, -)", c: "vo" };
    });
    hl.tham = [...b.dong];
    hl.cur = b.chon;
    b.dong.forEach(v => { if (v !== s) hl.chon[b.cp[v]] = kq.thuTu.indexOf(v) + 1; });          // cạnh của đỉnh đã chốt: số = thứ tự chốt
    V.forEach(v => { if (!b.dong.includes(v) && b.d[v] < Infinity) hl.tam.push(b.cp[v]); });     // cạnh p tạm của đỉnh chưa chốt
    if (j < L) { hl.msg = moTaBuocDijkstra(b, L); return hl; }

    // Bước cuối: xong. Cạnh không thuộc cây vẽ nét đứt xám (như hình trong file Word)
    hl.xam = true; hl.cur = null; hl.tam = [];
    const dich = dichDijkstraHopLe();
    if (dich === null) {
        hl.msg = `Xong: cây đường đi ngắn nhất ${kq.canhCay.length} cạnh, tổng ${fmt(kq.tongCay)} (nét đứt xám = cạnh không dùng).`;
    } else if (kq.d[dich] === Infinity) {
        hl.chon = {}; hl.tham = [s];
        hl.msg = `Không có đường đi từ ${ten(s)} tới ${ten(dich)}.`;
    } else {
        const duong = kq.duong(dich);
        hl.chon = {}; hl.tham = duong; hl.cur = dich;
        duong.forEach((v, i) => { if (i > 0) hl.chon[kq.cp[v]] = i; });   // số trên cạnh = thứ tự đi
        hl.msg = dich === s
            ? `Đỉnh đích trùng đỉnh nguồn: đường đi rỗng, độ dài = 0.`
            : `Đường đi ngắn nhất ${ten(s)} → ${ten(dich)}: ${duong.map(ten).join(" → ")}, độ dài = ${fmt(kq.d[dich])}.`;
    }
    return hl;
}

function datThongBaoDijkstra(msg) {
    if (krHL) krHL.msg = msg;
    const t = $("djStatus");
    if (t) t.textContent = msg;
}

// Mô phỏng từng bước (nút ⏮ ◀ ▶ ⏩ ⏸ trong js/loi/dieu_khien_buoc.js): bước j = đã chốt j đỉnh đầu; bước cuối = xong
function taoDKDijkstra() {
    const kq = tinhDijkstra();
    if (kq.loi) { alert(kq.loi); return null; }
    const L = kq.buoc.length;
    return {
        max: L, delay: 1100,
        k0: () => krHL && krHL.kieu === "dijkstra" ? Math.min(L, krHL.buoc || 0) : 0,
        ap: j => {
            eulerHL = null;
            krHL = taoHLDijkstra(kq, j);
            datThongBaoDijkstra(krHL.msg);
        }
    };
}

// Nút “Tô kết quả” (thanh nút góc phải trên): tô ngay cây đường đi ngắn nhất (hoặc riêng đường tới đỉnh đích)
function hienDijkstra() {
    const kq = tinhDijkstra();
    if (kq.loi) return alert(kq.loi);
    resetEuler();
    krHL = taoHLDijkstra(kq, kq.buoc.length);
    datThongBaoDijkstra(krHL.msg);
    veDoThi();
    cuonDenDoThi();
}

// HỦY MÔ PHỎNG: dừng chạy, bỏ tô màu, đồ thị trở về bình thường
function huyDijkstra() {
    resetKruskalHL();
    veDoThi();
    const t = $("djStatus");
    if (t) t.textContent = "";
    cuonDenDoThi();
}

function doiDinhDijkstra(v) {
    dijkstraStart = parseInt(v);
    resetEuler(); veDoThi();   // đổi đỉnh nguồn: bỏ mô phỏng cũ
    hienThiThongTin();         // dựng lại bảng
}

// Đổi đỉnh đích: nếu đang ở bước cuối thì cập nhật hình ngay
function doiDichDijkstra(v) {
    dijkstraDich = v === "" ? null : parseInt(v);
    if (!krHL || krHL.kieu !== "dijkstra") return;
    const kq = tinhDijkstra();
    if (kq.loi) return;
    if (dk && dk.kieu === "dijkstra") dkDen(dk.k);
    else if (krHL.buoc >= kq.buoc.length) hienDijkstra();
}

// Bấm một dòng trong bảng kết quả: tô đường đi tới đỉnh đó lên đồ thị
function chonDichTuBang(v) {
    dijkstraDich = v;
    const sel = $("djDich");
    if (sel) sel.value = String(v);
    hienDijkstra();
}

// Nút điều khiển Dijkstra: đặt ở khung Điều khiển bên trái (#ctlDijkstra)
function htmlDieuKhienDijkstra() {
    const V = dsDinh(), s = dinhDijkstraHopLe(), dich = dichDijkstraHopLe();
    const opt = (v, chon) => `<option value="${v}"${chon ? " selected" : ""}>${nhanDinh(v)}</option>`;
    return `<div class="euler-start">Đỉnh nguồn: <select onchange="doiDinhDijkstra(this.value)">${V.map(v => opt(v, v === s)).join("")}</select></div>` +
        `<div class="euler-start">Đỉnh đích (tùy chọn): <select id="djDich" onchange="doiDichDijkstra(this.value)"><option value=""${dich === null ? " selected" : ""}>Tất cả (cả cây)</option>${V.map(v => opt(v, v === dich)).join("")}</select></div>` +
        htmlDieuKhienBuoc("dijkstra") +   // nút “Tô kết quả” / “Hủy mô phỏng” nằm ở thanh nút góc phải trên (thanh_nut.js)
        '<div class="euler-status" id="djStatus">' + (krHL && krHL.kieu === "dijkstra" && krHL.msg ? krHL.msg : "") + "</div>";
}

// ---- Các bảng dùng chung cho khung kết quả và khung “Cách giải chi tiết” ----

// Bảng các bước: mỗi dòng là một bước, mỗi cột là một đỉnh. Ô vàng có dấu * = đỉnh được chốt, ô xám “-” = đã chốt từ trước
function htmlBangBuocDijkstra(kq) {
    const V = dsDinh(), s = kq.start;
    const o = (cls, nd) => `<td class="${cls}">${nd}</td>`;
    let h = '<div class="kr-scroll"><table class="kr-table"><tbody><tr><th>Bước</th>' + V.map(v => `<th>${nhanDinh(v)}</th>`).join("") + "</tr>";
    kq.buoc.forEach(b => {
        h += `<tr><td>${b.k}</td>` + V.map(v => {
            if (b.dongTruoc.includes(v)) return o("dj-xam", "-");
            const txt = v === s ? "0" : dpDijkstra(b.d[v], b.p[v]);
            if (v === b.chon) return o("dj-chot", `${txt}*`);
            return o(b.d[v] < Infinity ? "dj-tam" : "dj-vo", txt);
        }).join("") + "</tr>";
    });
    return h + "</tbody></table></div>";
}

// Bảng kết quả: đỉnh, khoảng cách ngắn nhất, đường đi ngắn nhất (sắp theo thứ tự chốt)
function htmlBangKetQuaDijkstra(kq, bamDuoc) {
    const s = kq.start;
    const hang = kq.thuTu.filter(v => v !== s).map(v =>
        `<tr${bamDuoc ? ` class="dj-click" onclick="chonDichTuBang(${v})" title="Bấm để tô đường đi này lên đồ thị"` : ""}>` +
        `<td><b>${nhanDinh(v)}</b></td><td>${fmt(kq.d[v])}</td><td style="text-align:left">${kq.duong(v).map(nhanDinh).join(" → ")}</td></tr>`);
    kq.khongToi.forEach(v => hang.push(`<tr><td><b>${nhanDinh(v)}</b></td><td class="dj-vo">∞</td><td class="dj-vo" style="text-align:left">không có đường đi</td></tr>`));
    return '<div class="kr-scroll"><table class="kr-table"><tbody>' +
        `<tr><th>Đỉnh</th><th>Khoảng cách ngắn nhất từ ${nhanDinh(s)}</th><th>Đường đi ngắn nhất</th></tr>` +
        hang.join("") + "</tbody></table></div>";
}

// Bảng các cạnh của cây đường đi ngắn nhất (mỗi đỉnh trừ nguồn giữ một cạnh nối với đỉnh đứng trước)
function htmlBangCayDijkstra(kq) {
    const s = kq.start, gach = gachDijkstra();
    const ds = kq.thuTu.filter(v => v !== s);
    return '<div class="kr-scroll"><table class="kr-table"><tbody>' +
        "<tr><th>STT</th><th>Cạnh</th><th>Độ dài</th><th>Nằm trên đường đi tới</th></tr>" +
        ds.map((v, k) => `<tr><td>${k + 1}</td><td>${nhanDinh(kq.p[v])} ${gach} ${nhanDinh(v)}</td><td>${fmt(trongSoCanh(edges[kq.cp[v]]))}</td>` +
            `<td style="text-align:left">${kq.duong(v).map(nhanDinh).join(" → ")}</td></tr>`).join("") +
        "</tbody></table></div>";
}

// ---- Vẽ phần kết quả vào khung thông tin ----
function htmlDijkstra() {
    let text = '<h3 class="adjacency-matrix-heading">Thuật toán Dijkstra (đường đi ngắn nhất)</h3>';
    const kq = tinhDijkstra();
    if (kq.loi) return text + `<div class="npt-wrap" id="djKetQua"><i>${kq.loi}</i></div>`;

    const ten = nhanDinh, s = kq.start;
    const ds = kq.thuTu.filter(v => v !== s);
    text += '<div class="npt-wrap" id="djKetQua">';
    text += `<div class="euler-start">Đỉnh nguồn: <b>${ten(s)}</b> <small>(đổi ở khung Điều khiển bên trái)</small></div>`;
    text += '<div class="npt-step"><b>1. Bảng các bước.</b> Mỗi ô là (d, p): d = độ dài ngắn nhất tìm được đến lúc này, p = đỉnh đứng ngay trước nó. Ô vàng có dấu * là đỉnh được chốt ở bước đó, ô xám “-” là đỉnh đã chốt từ trước.</div>';
    text += htmlBangBuocDijkstra(kq);
    text += '<div class="npt-step"><b>2. Kết quả</b> <small>(bấm vào một dòng để tô đường đi đó lên đồ thị)</small></div>';
    text += htmlBangKetQuaDijkstra(kq, true);
    if (ds.length) text += `<div class="npt-total">Khoảng cách ngắn nhất từ ${ten(s)} đến ${ds.map(ten).join(", ")} lần lượt là ${ds.map(v => fmt(kq.d[v])).join(", ")}</div>`;
    else text += `<div class="euler-no">✖ Từ ${ten(s)} không đi được tới đỉnh nào khác.</div>`;
    if (kq.khongToi.length && ds.length) text += `<div class="euler-no">✖ Không có đường đi từ ${ten(s)} tới: ${kq.khongToi.map(ten).join(", ")} (ghi ∞).</div>`;
    if (edges.some(e => e.w === undefined)) text += ghiChu("Cạnh nhập không có trọng số được tính w = 1.");
    return text + "</div>";
}

// ---- Nạp đồ thị mẫu lấy từ file Word “Dijkstra_giai_thich.docx” (u₀, r, s, t, x, y, z, w -> 0..7) ----
const VI_DU_DIJKSTRA = {
    n: 8,
    e: [[0, 1, 4], [0, 5, 1], [1, 5, 2], [1, 2, 7], [1, 3, 3], [2, 3, 3], [2, 4, 1], [3, 4, 1], [3, 6, 4], [4, 7, 3], [5, 6, 3], [6, 7, 5]],
    pos: [[0, 0.51], [0.24, 0.08], [0.67, 0], [0.48, 0.57], [0.86, 0.3], [0.19, 0.96], [0.63, 1], [1, 0.92]]
};

function napViDuDijkstra() {
    if (edges.length && !confirm("Nạp ví dụ sẽ thay thế đồ thị hiện tại. Tiếp tục?")) return;
    resetEuler(); resetNguoiPhatThu();
    $("loai").value = 1; capNhatTenLoai();   // đơn đồ thị vô hướng, có trọng số
    n = VI_DU_DIJKSTRA.n;
    edges = VI_DU_DIJKSTRA.e.map(([x, y, w]) => taoCanh(x, y, w));
    nodes = {};
    for (let i = 0; i < n; i++) nodes[i] = { x: 0, y: 0 };
    dijkstraStart = 0; dijkstraDich = null;
    $("soDinh").value = n; $("soCanh").value = edges.length;
    sapXep();
    const W = svg.clientWidth, H = svg.clientHeight;
    VI_DU_DIJKSTRA.pos.forEach(([px, py], i) => { nodes[i].x = 60 + px * (W - 120); nodes[i].y = 60 + py * (H - 120); });
    veDoThi();
    hienThiThongTin();
}
