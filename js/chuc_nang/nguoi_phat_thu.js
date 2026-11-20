// =====================================================
// BÀI TOÁN NGƯỜI PHÁT THƯ (Chinese Postman) cho đồ thị VÔ HƯỚNG (loai 1-3)
// =====================================================
// Mục tiêu: hành trình ngắn nhất đi qua MỌI cạnh ít nhất 1 lần rồi quay về đỉnh đầu.
// Các bước (đúng như bài mẫu trên lớp):
//   1) Σw(e): tổng trọng số các cạnh (cạnh không có w tính w = 1).
//   2) V_o(G): tập các đỉnh bậc lẻ (luôn là số chẵn). Nếu rỗng -> đã có chu trình Euler, m(G) = 0.
//   3) P = {P1, P2, ...}: các PHÂN HOẠCH CẶP của V_o(G) (ghép các đỉnh lẻ thành từng cặp).
//      d(Pi) = tổng khoảng cách ngắn nhất giữa hai đỉnh của mỗi cặp (Floyd–Warshall).
//   4) m(G) = min d(Pi). Chọn Pi nhỏ nhất, thêm vào đồ thị các cạnh dọc theo đường đi ngắn nhất
//      của từng cặp (cạnh sao chép, màu xanh lá) -> mọi đỉnh bậc chẵn -> có chu trình Euler.
//   Tổng chiều dài hành trình = Σw(e) + m(G).
// Giới hạn: không có trọng số âm; tối đa 12 đỉnh bậc lẻ (10395 phân hoạch).
// Trạng thái dùng chung (trang_thai.js): npt (kết quả), canhThemNPT (chỉ số các cạnh đã thêm), nptThongBao.
// Cạnh thêm vào là cạnh SONG SONG nên đơn đồ thị (loai 1) tự chuyển sang đa đồ thị (loai 2).
// MÔ PHỎNG TỪNG BƯỚC (5 nút trong dieu_khien_buoc.js, kiểu "npt"): taoDKNPT() — gốc → đỉnh bậc lẻ → chọn phân hoạch → ghép từng cặp
//   (thêm cạnh sao chép dọc đường đi ngắn nhất) → kết quả. Tô màu bằng nptHL (trang_thai.js), mỗi bước dựng lại đồ thị = gốc + cạnh đã thêm.

const MAU_THEM = "#16a34a";
const MAU_NPT_LE = "#f59e0b";        // đỉnh bậc lẻ chưa được ghép (mô phỏng)
const MAU_NPT_HIENTAI = "#db2777";   // cặp đỉnh đang ghép và cạnh sao chép vừa thêm (mô phỏng)
const fmt = v => String(Math.round(v * 1e6) / 1e6);
const trongSoCanh = e => e.w === undefined ? 1 : e.w;
const NHAN_LOAI_NPT = "Bài toán người phát thư chỉ hỗ trợ đồ thị vô hướng (loại 1–3).";

// Xóa kết quả và dấu cạnh thêm (KHÔNG khôi phục cạnh): dùng khi người dùng tự sửa đồ thị
function resetNguoiPhatThu() {
    npt = null;
    canhThemNPT = new Set();
    nptThongBao = "";
}

function capNhatTenLoai() {
    $("loaiDangChon").textContent = $("loai").selectedOptions[0].textContent;
}

function cuonDenKetQuaNPT() {
    const e = $("nptKetQua");
    if (e) e.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---- Ghép cặp: mọi cách chia danh sách đỉnh lẻ thành các cặp (đỉnh đầu lần lượt ghép với từng đỉnh còn lại) ----
function cacPhanHoachCap(list) {
    if (!list.length) return [[]];
    const [a, ...rest] = list, out = [];
    rest.forEach((b, i) => {
        const con = rest.filter((_, j) => j !== i);
        cacPhanHoachCap(con).forEach(p => out.push([[a, b], ...p]));
    });
    return out;
}

// ---- Giải bài toán: tính mọi thứ rồi lưu vào npt ----
function tinhNguoiPhatThu() {
    const kq = { goc: edges.map(e => ({ ...e })), loaiGoc: loaiHienTai(), daApDung: null, loi: null };
    if (!edges.length) { kq.loi = "Đồ thị chưa có cạnh nào."; return kq; }
    if (edges.some(e => e.w !== undefined && e.w < 0)) { kq.loi = "Có trọng số âm. Bài toán này chỉ giải được khi mọi trọng số ≥ 0."; return kq; }

    // Bậc và liên thông (vòng khuyên tính bậc 2)
    const deg = Array(n).fill(0), cha = dsDinh();
    const goc = x => cha[x] === x ? x : (cha[x] = goc(cha[x]));
    edges.forEach(e => { deg[e.x]++; deg[e.y]++; cha[goc(e.x)] = goc(e.y); });
    const coCanh = dsDinh().filter(i => deg[i] > 0);
    if (new Set(coCanh.map(goc)).size > 1) { kq.loi = "Đồ thị không liên thông nên không có hành trình đi qua mọi cạnh."; return kq; }

    kq.tong = edges.reduce((s, e) => s + trongSoCanh(e), 0);
    kq.le = dsDinh().filter(i => deg[i] % 2 === 1);
    kq.ds = []; kq.best = null; kq.m = 0;
    if (!kq.le.length) return kq;
    if (kq.le.length > 12) { kq.loi = `Có ${kq.le.length} đỉnh bậc lẻ, quá nhiều để duyệt các phân hoạch cặp (tối đa 12).`; return kq; }

    // Khoảng cách ngắn nhất: Floyd–Warshall, có lưu đỉnh kế tiếp để dựng lại đường đi
    const D = dsDinh().map(i => dsDinh().map(j => i === j ? 0 : Infinity));
    const next = dsDinh().map(() => Array(n).fill(-1));
    edges.forEach(e => {
        const w = trongSoCanh(e);
        if (e.x !== e.y && w < D[e.x][e.y]) { D[e.x][e.y] = D[e.y][e.x] = w; next[e.x][e.y] = e.y; next[e.y][e.x] = e.x; }
    });
    for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        if (D[i][k] + D[k][j] < D[i][j] - 1e-9) { D[i][j] = D[i][k] + D[k][j]; next[i][j] = next[i][k]; }
    }
    const duong = (a, b) => { const p = [a]; while (a !== b) { a = next[a][b]; p.push(a); } return p; };

    kq.ds = cacPhanHoachCap(kq.le).map(p => {
        const pairs = p.map(([a, b]) => ({ a, b, d: D[a][b], path: duong(a, b) }));
        return { pairs, d: pairs.reduce((s, q) => s + q.d, 0) };
    });
    kq.best = 0;
    kq.ds.forEach((p, i) => { if (p.d < kq.ds[kq.best].d - 1e-9) kq.best = i; });
    kq.m = kq.ds[kq.best].d;
    return kq;
}

function giaiNguoiPhatThu() {
    if (coHuong()) return alert(NHAN_LOAI_NPT);
    if (npt && npt.daApDung !== null) traLaiDoThiGoc(true);   // đang hiện đồ thị đã thêm cạnh -> quay về gốc rồi giải lại
    npt = tinhNguoiPhatThu();
    canhThemNPT = new Set();
    nptThongBao = "";
    hienThiThongTin();
    cuonDenKetQuaNPT();   // nhảy thẳng xuống bảng kết quả
}

// Cạnh rẻ nhất nối u-v trong danh sách goc (để sao chép trọng số khi thêm cạnh)
function canhGocGiua(goc, u, v) {
    let tot = null;
    goc.forEach(e => {
        if (((e.x === u && e.y === v) || (e.x === v && e.y === u)) && (!tot || trongSoCanh(e) < trongSoCanh(tot))) tot = e;
    });
    return tot;
}

// Các cạnh cần thêm (sao chép dọc đường đi ngắn nhất của từng cặp) theo phân hoạch p; dùng chung với chu_trinh_euler.js
function canhThemTheoPhanHoach(goc, p) {
    const out = [];
    p.pairs.forEach(pr => {
        for (let t = 0; t + 1 < pr.path.length; t++) {
            const u = pr.path[t], v = pr.path[t + 1], g = canhGocGiua(goc, u, v);
            out.push(taoCanh(u, v, g.w));
        }
    });
    return out;
}

// ---- Xem / áp dụng phân hoạch Pi: dựng lại đồ thị = gốc + các cạnh dọc đường đi ngắn nhất ----
function apDungPhanHoach(i) {
    if (!npt || npt.loi || !npt.ds[i]) return;
    const dangEuler = !!dk && dk.kieu === "euler";   // đang mô phỏng Euler thì nhớ lại để chạy tiếp trên đồ thị mới
    edges = npt.goc.map(e => ({ ...e }));
    canhThemNPT = new Set();
    canhThemTheoPhanHoach(npt.goc, npt.ds[i]).forEach(e => {
        canhThemNPT.add(edges.length);
        edges.push(e);
    });
    if (npt.loaiGoc === 1) { $("loai").value = 2; capNhatTenLoai(); }   // có cạnh song song -> đa đồ thị
    npt.daApDung = i;
    nptThongBao = `Đã thêm ${canhThemNPT.size} cạnh (xanh lá) theo P${i + 1}. Bấm vào đây để xuống bảng kết quả ↓`;
    resetEuler();
    veDoThi();
    hienThiThongTin();
    cuonDenDoThi();       // nhảy lên chỗ đồ thị để xem luôn
    // Đổi sang phân hoạch khác thì hành trình đổi theo: mô phỏng Euler bắt đầu lại từ bước 0 trên đồ thị mới (không để mất)
    if (dangEuler) dkLenh("euler", "dau");
}

function traLaiDoThiGoc(khongCuon) {
    if (!npt || npt.daApDung === null) return;
    edges = npt.goc.map(e => ({ ...e }));
    canhThemNPT = new Set();
    nptThongBao = "";
    $("loai").value = npt.loaiGoc; capNhatTenLoai();
    npt.daApDung = null;
    resetEuler();
    veDoThi();
    hienThiThongTin();
    if (!khongCuon) cuonDenDoThi();
}

// ---- MÔ PHỎNG TỪNG BƯỚC ----
// Bước j (0 → max):
//   0 : đồ thị gốc, Σw(e)
//   1 : tô các đỉnh bậc lẻ V_o(G)   (không có đỉnh lẻ -> max = 1, kết luận đã có chu trình Euler)
//   2 : chọn phân hoạch P_i (nhỏ nhất, hoặc phân hoạch đang xem) và công thức d(P_i)
//   3 … K+2 : ghép cặp thứ j−2: thêm các cạnh sao chép (hồng khi vừa thêm, sau đó xanh lá) dọc đường đi ngắn nhất của cặp
//   K+3 : xong, mọi đỉnh bậc chẵn, tổng chiều dài = Σw(e) + m(G)
// ap(j) luôn dựng lại từ đồ thị gốc npt.goc nên đi lùi / về đầu đều đúng.
function datThongBaoNPT(msg) {
    if (nptHL) nptHL.msg = msg;
    const t = $("nptStatus");
    if (t) t.textContent = msg;
}

function taoDKNPT() {
    if (coHuong()) { alert(NHAN_LOAI_NPT); return null; }
    if (!npt) { npt = tinhNguoiPhatThu(); canhThemNPT = new Set(); nptThongBao = ""; hienThiThongTin(); }
    if (npt.loi) { alert(npt.loi); return null; }

    const kq = npt, K = kq.le.length ? kq.ds[kq.daApDung !== null ? kq.daApDung : kq.best].pairs.length : 0;
    const pi = kq.daApDung !== null ? kq.daApDung : kq.best;     // phân hoạch dùng để mô phỏng (đang xem, nếu không thì nhỏ nhất)
    const P = K ? kq.ds[pi] : null;
    const max = K ? K + 3 : 1;
    const sub = i => `P${i + 1}`;
    const cap = q => `(${nhanDinh(q.a)},${nhanDinh(q.b)})`;

    return {
        max, delay: 1300,
        k0: () => kq.daApDung !== null && canhThemNPT.size > 0 ? max : 0,
        ap: j => {
            eulerHL = null; krHL = null;
            // Dựng lại đồ thị = gốc + cạnh sao chép của da cặp đầu
            const da = Math.max(0, Math.min(K, j - 2));
            edges = kq.goc.map(e => ({ ...e }));
            canhThemNPT = new Set();
            const canhCur = [];
            for (let t = 0; t < da; t++) {
                canhThemTheoPhanHoach(kq.goc, { pairs: [P.pairs[t]] }).forEach(e => {
                    if (t === da - 1) canhCur.push(edges.length);
                    canhThemNPT.add(edges.length);
                    edges.push(e);
                });
            }
            if (kq.loaiGoc === 1) $("loai").value = canhThemNPT.size ? 2 : 1;   // có cạnh song song -> đa đồ thị
            capNhatTenLoai();
            kq.daApDung = da > 0 ? pi : null;
            nptThongBao = j === max && K ? `Đã thêm ${canhThemNPT.size} cạnh (xanh lá) theo ${sub(pi)}. Bấm vào đây để xuống bảng kết quả ↓` : "";

            // Tô màu đỉnh
            const dangGhep = j >= 3 && j <= K + 2;
            const soXong = j >= K + 3 ? K : Math.max(0, da - 1);
            const xong = [];
            for (let t = 0; t < soXong; t++) xong.push(P.pairs[t].a, P.pairs[t].b);
            nptHL = {
                le: j >= 1 ? kq.le : [],
                cur: dangGhep ? [P.pairs[da - 1].a, P.pairs[da - 1].b] : [],
                xong, canhCur: dangGhep ? canhCur : [], msg: ""
            };

            // Lời giải thích của bước
            let msg;
            if (j === 0) msg = `Bắt đầu: đồ thị gốc có ${kq.goc.length} cạnh, Σw(e) = ${fmt(kq.tong)}.`;
            else if (!K) msg = "Mọi đỉnh đều bậc chẵn ⇒ đã có chu trình Euler: m(G) = 0, không cần thêm cạnh.";
            else if (j === 1) msg = `Tìm đỉnh bậc lẻ: Vo(G) = { ${kq.le.map(nhanDinh).join(", ")} } (${kq.le.length} đỉnh, tô cam).`;
            else if (j === 2) msg = `Chọn ${sub(pi)} = { ${P.pairs.map(cap).join(", ")} }: d(${sub(pi)}) = ${P.pairs.map(q => fmt(q.d)).join(" + ")}${K > 1 ? " = " + fmt(P.d) : ""}` +
                (pi === kq.best ? ` là nhỏ nhất${kq.ds.length > 1 ? ` trong ${kq.ds.length} phân hoạch` : ""}.` : " (phân hoạch đang xem).");
            else if (j <= K + 2) {
                const q = P.pairs[j - 3];
                msg = `Ghép cặp ${j - 2}/${K}: ${cap(q)} đi qua [${q.path.map(nhanDinh).join("→")}], sao chép ${q.path.length - 1} cạnh (d = ${fmt(q.d)}).`;
            } else msg = `Xong: mọi đỉnh bậc chẵn. m(G) = ${fmt(P.d)} ⇒ tổng = ${fmt(kq.tong)} + ${fmt(P.d)} = ${fmt(kq.tong + P.d)}. Xem mục Chu trình Euler để đi hành trình.`;
            nptHL.msg = msg;
            hienThiThongTin();   // bậc của đỉnh, ma trận, Euler... đổi theo đồ thị ở bước này
        }
    };
}

// Nút ở khung Điều khiển: mở mô phỏng ở bước 0 (đồ thị gốc), rồi dùng 5 nút ở bảng bên phải
function moPhongNguoiPhatThu() {
    if (coHuong()) return alert(NHAN_LOAI_NPT);
    dkLenh("npt", "dau");
}

// HỦY MÔ PHỎNG: dừng chạy, bỏ tô màu, trả lại đồ thị gốc (bỏ các cạnh sao chép đã thêm)
function huyMoPhongNPT() {
    dkHuy();
    if (npt && npt.daApDung !== null) traLaiDoThiGoc(true);
    else { nptThongBao = ""; veDoThi(); hienThiThongTin(); }
    cuonDenDoThi();
}

function htmlMoPhongNPT() {
    return '<div class="npt-sim"><div class="npt-step"><b>🎬 Mô phỏng từng bước</b></div>' +
        '<div class="npt-btns"><button class="danger" onclick="huyMoPhongNPT()">✖ Hủy mô phỏng</button></div>' +
        htmlDieuKhienBuoc("npt") +
        `<div class="euler-status" id="nptStatus">${nptHL && nptHL.msg ? nptHL.msg : ""}</div></div>`;
}

// ---- Vẽ phần kết quả vào khung thông tin ----
function htmlNguoiPhatThu() {
    let text = '<h3 class="adjacency-matrix-heading">Bài toán người phát thư</h3>';
    if (coHuong()) return text + '<div class="npt-wrap" id="nptKetQua">' + NHAN_LOAI_NPT + "</div>";
    if (!npt) return text + '<div class="npt-wrap" id="nptKetQua"><i>Bấm nút “Phân tích &amp; giải bài toán” ở khung Điều khiển để xem lời giải, hoặc “Mô phỏng từng bước” để xem từng bước.</i>' + htmlMoPhongNPT() + "</div>";
    if (npt.loi) return text + `<div class="npt-wrap" id="nptKetQua"><div class="euler-no">✖ ${npt.loi}</div></div>`;

    const { ds, best, le, m } = npt, tatCa = ds.length <= 15;
    const sub = i => `P<sub>${i + 1}</sub>`;
    text += '<div class="npt-wrap" id="nptKetQua">';
    text += `<div class="npt-step"><b>1. Tổng các cạnh ban đầu:</b> Σw(e) = ${fmt(npt.tong)}</div>`;
    text += `<div class="npt-step"><b>2. Tập hợp các đỉnh bậc lẻ:</b> V<sub>o</sub>(G) = { ${le.map(nhanDinh).join(", ") || "∅"} }</div>`;

    if (!le.length) {
        text += '<div class="euler-yes">✔ Mọi đỉnh đều bậc chẵn nên đồ thị đã có chu trình Euler: m(G) = 0, không cần thêm cạnh.</div>';
    } else {
        const hien = tatCa ? ds.map((_, i) => i) : [best];
        text += `<div class="npt-step"><b>3. ${tatCa
            ? `Tập hợp các phân hoạch cặp:</b> P = { ${ds.map((_, i) => sub(i)).join(", ")} }`
            : `Có ${ds.length} phân hoạch cặp (quá nhiều để liệt kê).</b> Chỉ hiện phân hoạch nhỏ nhất:`}</div>`;
        text += hien.map(i => {
            const p = ds[i], tot = Math.abs(p.d - m) < 1e-9, dang = npt.daApDung === i;
            const cap = p.pairs.map(q => `(${nhanDinh(q.a)},${nhanDinh(q.b)})`).join(", ");
            const tinh = p.pairs.map(q => fmt(q.d)).join(" + ");
            const qua = p.pairs.map(q => `[${q.path.map(nhanDinh).join("→")}]`).join(" và ");
            return `<div class="npt-card${tot ? " npt-best" : ""}${dang ? " npt-on" : ""}"><div class="npt-card-main">` +
                `<b>${sub(i)} = { ${cap} }</b> → d(${sub(i)}) = ${tinh}${p.pairs.length > 1 ? " = " + fmt(p.d) : ""}` +
                `${tot ? ' <span class="npt-badge">nhỏ nhất</span>' : ""}<div class="npt-path">Nối qua: ${qua}</div></div>` +
                `<button onclick="apDungPhanHoach(${i})">${dang ? "Đang xem" : "Xem " + sub(i)}</button></div>`;
        }).join("");
        const ten = tatCa && ds.length > 1 ? `min(${ds.map((_, i) => `d(${sub(i)})`).join(", ")})` : `d(${sub(best)})`;
        text += `<div class="npt-m">4. m(G) = ${ten} = ${fmt(m)}</div>`;
    }
    text += `<div class="npt-total">Tổng chiều dài = Σw(e) + m(G) = ${fmt(npt.tong)} + ${fmt(m)} = ${fmt(npt.tong + m)}</div>`;

    if (le.length) {
        text += '<div class="npt-btns">' +
            `<button class="success" onclick="apDungPhanHoach(${best})">Tự động thêm cạnh &amp; vẽ lại đồ thị</button>` +
            `<button class="danger" onclick="traLaiDoThiGoc()"${npt.daApDung === null ? " disabled" : ""}>Trả lại đồ thị gốc</button></div>`;
        if (npt.daApDung !== null) {
            text += ghiChu(`Đang hiển thị đồ thị sau khi thêm ${canhThemNPT.size} cạnh theo ${sub(npt.daApDung)} (màu xanh lá). Lúc này mọi đỉnh có bậc chẵn; xem mục Chu trình Euler ở trên để mô phỏng hành trình.`);
            if (npt.loaiGoc === 1) text += ghiChu("Đồ thị đơn có thêm cạnh song song nên tự chuyển sang loại 2 (đa đồ thị); bấm “Trả lại đồ thị gốc” sẽ về loại 1.");
        }
    }
    text += htmlMoPhongNPT();
    if (npt.goc.some(e => e.w === undefined)) text += ghiChu("Cạnh nhập không có trọng số được tính w = 1.");
    return text + "</div>";
}
