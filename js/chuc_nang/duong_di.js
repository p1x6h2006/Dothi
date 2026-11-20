// =====================================================
// ĐƯỜNG ĐI & CHU TRÌNH: chọn đỉnh xuất phát / đích -> Tìm kiếm -> danh sách kết quả -> bấm để tô lên đồ thị
// =====================================================
// Các loại (ô chọn #ddLoai, giá trị "nhóm:kiểu"; riêng "tatca" = liệt kê MỌI loại cùng lúc, mỗi dòng có nhãn loại sơ cấp/đơn/chung;
//   s ≠ t -> đường đi, s = t (hoặc bỏ trống đích) -> chu trình):
//   Đường đi (xuất phát s -> đích t, s ≠ t)        Chu trình (xuất phát và quay về cùng đỉnh s)
//     duong:sc     sơ cấp  (không lặp đỉnh)           ct:sc     sơ cấp  (chỉ lặp đỉnh đầu = đỉnh cuối)
//     duong:don    đơn     (không lặp cạnh)           ct:don    đơn     (không lặp cạnh)
//     duong:chung  chung   (cho phép lặp)             ct:chung  chung   (cho phép lặp)
//     duong:nncanh ngắn nhất theo số cạnh             ct:nncanh ngắn nhất theo số cạnh
//     duong:nnw    ngắn nhất theo tổng trọng số       ct:nnw    ngắn nhất theo tổng trọng số
// Thuật toán: sơ cấp / đơn = DFS quay lui; chung = BFS theo độ dài (có cắt nhánh không tới được đích);
//             ngắn nhất = Dijkstra + liệt kê mọi đường "chặt" (chu trình ngắn nhất: thử từng cạnh ra khỏi s, cấm cạnh đó rồi tìm đường về s).
// Tô màu trên hình: biến pathHL (trang_thai.js) = { canh: {chỉ số cạnh: "thứ tự đi"}, dinh: [đỉnh], idx, msg }
//   ve_do_thi.js đọc pathDangHien() khi vẽ (dùng chung màu cam với Euler). Cạnh không có trọng số tính w = 1.

const DD_GIOI_HAN = 100;       // số kết quả hiển thị tối đa
const DD_THU_THAP = 5000;      // số kết quả tối đa thu thập khi duyệt DFS (rồi sắp theo số cạnh, lấy DD_GIOI_HAN đầu)
const DD_MAX_BUOC = 300000;    // số lần mở rộng tối đa mỗi lần tìm (chống treo trình duyệt)
const DD_EPS = 1e-9;

const DD_TEN = {
    "duong:sc": "Đường đi sơ cấp", "duong:don": "Đường đi đơn", "duong:chung": "Đường đi chung",
    "duong:nncanh": "Đường đi ngắn nhất (số cạnh)", "duong:nnw": "Đường đi ngắn nhất (trọng số)",
    "ct:sc": "Chu trình sơ cấp", "ct:don": "Chu trình đơn", "ct:chung": "Chu trình chung",
    "duong:tatca": "Đường đi (tất cả loại)", "ct:tatca": "Chu trình (tất cả loại)",
    "ct:nncanh": "Chu trình ngắn nhất (số cạnh)", "ct:nnw": "Chu trình ngắn nhất (trọng số)"
};

let ddKq = null;   // kết quả lần tìm gần nhất: { loai, s, t, ds: [{vs, es}], tong, cham, ghiChu[], sig } hoặc { loi }

// Đường đi đang tô (null nếu đang có kiểu tô khác: Euler / Kruskal / Prim / người phát thư)
const pathDangHien = () => (eulerHL || krHL || nptHL) ? null : pathHL;

const ddCoTrongSo = () => edges.some(e => e.w !== undefined);
const ddSig = () => $("loai").value + "|" + n + "|" + JSON.stringify(edges);
const ddTongW = r => r.es.reduce((t, id) => t + trongSoCanh(edges[id]), 0);

// ---------- Đồ thị kề (theo CẠNH, nên đúng với cạnh song song và vòng khuyên) ----------
// adj[u] = [{ to, id }] ; radj = kề ngược (đồ thị có hướng), vô hướng thì radj = adj. Vòng khuyên chỉ xuất hiện 1 lần.
function ddDungKe() {
    const huong = coHuong();
    const adj = dsDinh().map(() => []), radj = huong ? dsDinh().map(() => []) : adj;
    edges.forEach((e, id) => {
        adj[e.x].push({ to: e.y, id });
        if (huong) radj[e.y].push({ to: e.x, id });
        else if (e.x !== e.y) adj[e.y].push({ to: e.x, id });
    });
    adj.forEach(l => l.sort((a, b) => a.to - b.to || a.id - b.id));
    return { adj, radj, huong };
}

// ---------- 1) Sơ cấp: DFS, mỗi đỉnh đi qua tối đa 1 lần (chu trình: chỉ đỉnh đầu = đỉnh cuối) ----------
function ddSoCap(adj, huong, s, t, dong) {
    const ds = [], dung = Array(n).fill(false), vs = [s], es = [];
    let dem = 0, cham = false;
    dung[s] = true;
    (function dfs(u) {
        for (const { to, id } of adj[u]) {
            if (cham || ds.length >= DD_THU_THAP) return;
            if (++dem > DD_MAX_BUOC) { cham = true; return; }
            if (to === t) {
                // chu trình vô hướng: không quay lại bằng chính cạnh vừa đi; mỗi chu trình chỉ lấy 1 chiều (cạnh đầu < cạnh cuối)
                if (dong && !huong && es.length > 0 && (id === es[es.length - 1] || es[0] > id)) continue;
                ds.push({ vs: [...vs, to], es: [...es, id] });
                continue;
            }
            if (dung[to]) continue;
            dung[to] = true; vs.push(to); es.push(id);
            dfs(to);
            dung[to] = false; vs.pop(); es.pop();
        }
    })(s);
    return { ds, cham: cham || ds.length >= DD_THU_THAP };
}

// ---------- 2) Đơn: DFS, mỗi cạnh đi qua tối đa 1 lần (được lặp đỉnh) ----------
function ddDon(adj, huong, s, t, dong) {
    const ds = [], dung = Array(edges.length).fill(false), vs = [s], es = [];
    let dem = 0, cham = false;
    (function dfs(u) {
        for (const { to, id } of adj[u]) {
            if (cham || ds.length >= DD_THU_THAP) return;
            if (dung[id]) continue;
            if (++dem > DD_MAX_BUOC) { cham = true; return; }
            dung[id] = true; vs.push(to); es.push(id);
            let ghi = to === t;
            if (ghi && dong && !huong && es.length > 1 && es[0] > id) ghi = false;   // bỏ bản đi ngược chiều của cùng một chu trình
            if (ghi) ds.push({ vs: [...vs], es: [...es] });
            dfs(to);
            dung[id] = false; vs.pop(); es.pop();
        }
    })(s);
    return { ds, cham: cham || ds.length >= DD_THU_THAP };
}

// ---------- 3) Chung: BFS theo độ dài, cho phép lặp đỉnh & cạnh (có thể vô hạn -> dừng ở DD_GIOI_HAN) ----------
function ddChung(adj, radj, s, t) {
    const toi = Array(n).fill(false), st = [t];   // toi[v] = từ v còn đi tới được t (cắt nhánh cụt)
    toi[t] = true;
    while (st.length) { const v = st.pop(); for (const { to } of radj[v]) if (!toi[to]) { toi[to] = true; st.push(to); } }
    const ds = [], q = [{ u: s, id: -1, cha: null, d: 0 }];
    let dem = 0, cham = false;
    for (let h = 0; h < q.length && ds.length < DD_GIOI_HAN && !cham; h++) {
        const nut = q[h];
        if (nut.d > 0 && nut.u === t) {
            const vs = [], es = [];
            for (let p = nut; p; p = p.cha) { vs.push(p.u); if (p.id >= 0) es.push(p.id); }
            ds.push({ vs: vs.reverse(), es: es.reverse() });
        }
        for (const { to, id } of adj[nut.u]) {
            if (!toi[to]) continue;
            if (++dem > DD_MAX_BUOC) { cham = true; break; }
            q.push({ u: to, id, cha: nut, d: nut.d + 1 });
        }
    }
    return { ds, cham: cham || ds.length >= DD_GIOI_HAN };
}

// ---------- 4) Ngắn nhất: Dijkstra (trọng số không âm) ----------
function ddDijkstra(adj, nguon, c, cam) {
    const d = Array(n).fill(Infinity), xong = Array(n).fill(false);
    d[nguon] = 0;
    for (let k = 0; k < n; k++) {
        let u = -1;
        for (let i = 0; i < n; i++) if (!xong[i] && (u < 0 || d[i] < d[u])) u = i;
        if (u < 0 || d[u] === Infinity) break;
        xong[u] = true;
        for (const { to, id } of adj[u]) if (id !== cam && d[u] + c(id) < d[to]) d[to] = d[u] + c(id);
    }
    return d;
}

// Mọi đường đi sơ cấp ngắn nhất s -> t (không dùng cạnh `cam`). Trả { D, ds }
function ddNganNhat(adj, radj, s, t, c, cam) {
    const dS = ddDijkstra(adj, s, c, cam), dT = ddDijkstra(radj, t, c, cam), D = dS[t];
    const ds = [];
    if (D === Infinity) return { D, ds };
    const dung = Array(n).fill(false), vs = [s], es = [];
    dung[s] = true;
    (function dfs(u) {
        if (u === t) { ds.push({ vs: [...vs], es: [...es] }); return; }
        for (const { to, id } of adj[u]) {
            if (ds.length >= DD_GIOI_HAN) return;
            if (id === cam || dung[to]) continue;
            if (Math.abs(dS[u] + c(id) + dT[to] - D) > DD_EPS) continue;   // chỉ đi theo cạnh nằm trên đường ngắn nhất
            dung[to] = true; vs.push(to); es.push(id);
            dfs(to);
            dung[to] = false; vs.pop(); es.pop();
        }
    })(s);
    return { D, ds };
}

// Chu trình sơ cấp ngắn nhất qua s: thử từng cạnh (s -> a), cấm cạnh đó rồi tìm đường ngắn nhất a -> s
function ddChuTrinhNganNhat(adj, radj, huong, s, c) {
    let tot = Infinity, ds = [];
    for (const { to, id } of adj[s]) {
        let tong, cac;
        if (to === s) { tong = c(id); cac = [{ vs: [s, s], es: [id] }]; }   // vòng khuyên
        else {
            const r = ddNganNhat(adj, radj, to, s, c, id);
            if (r.D === Infinity) continue;
            tong = c(id) + r.D;
            cac = r.ds.map(p => ({ vs: [s, ...p.vs], es: [id, ...p.es] }));
        }
        if (tong < tot - DD_EPS) { tot = tong; ds = cac; }
        else if (Math.abs(tong - tot) <= DD_EPS) ds = ds.concat(cac);
    }
    if (!huong) ds = ds.filter(p => p.es.length < 2 || p.es[0] < p.es[p.es.length - 1]);   // vô hướng: mỗi chu trình thấy 2 chiều, giữ 1
    return ds.slice(0, DD_GIOI_HAN);
}

// ---------- Tính kết quả cho một yêu cầu ----------
function ddTinh(loai, s, t) {
    const tatca = loai === "tatca";
    const [nhom, kieu] = loai.split(":"), dong = tatca ? s === t : nhom === "ct";
    const { adj, radj, huong } = ddDungKe();
    if (tatca) loai = (dong ? "ct:" : "duong:") + "tatca";
    const r = { loai, s, t, ds: [], tong: 0, cham: false, ghiChu: [] };

    if (tatca) {
        // gộp sơ cấp + đơn + chung, bỏ trùng (chu trình vô hướng: một chu trình đi 2 chiều chỉ tính 1)
        const key = p => {
            const a = p.es.join(","), b = [...p.es].reverse().join(",");
            return dong && !huong && b < a ? b : a;
        };
        const gop = new Map();
        const A = ddSoCap(adj, huong, s, t, dong), B = ddDon(adj, huong, s, t, dong), C = ddChung(adj, radj, s, t);
        [A.ds, B.ds, C.ds].forEach(l => l.forEach(p => { if (!gop.has(key(p))) gop.set(key(p), p); }));
        const all = [...gop.values()].sort((x, y) => x.es.length - y.es.length);
        r.tong = all.length; r.ds = all.slice(0, DD_GIOI_HAN); r.cham = A.cham || B.cham;   // C.cham chỉ nghĩa là loại chung bị cắt ở 100 (đã có ghi chú riêng)
        if (!r.ds.length) return r;
        const dem = { sc: 0, don: 0, chung: 0 };
        all.forEach(p => dem[ddPhanLoai(p.vs, p.es).cap]++);
        r.ghiChu.push(`Gồm ${dem.sc} sơ cấp · ${dem.don} đơn · ${dem.chung} chung (chưa kể các đường chung dài hơn, vì loại chung có thể vô hạn).`);
        if (r.tong > DD_GIOI_HAN) r.ghiChu.push(`Chỉ hiển thị ${DD_GIOI_HAN} kết quả có ít cạnh nhất.`);
        if (r.cham) r.ghiChu.push("Đã dừng sớm vì quá nhiều khả năng: có thể còn nhiều kết quả khác.");
        return r;
    }

    if (kieu === "sc" || kieu === "don") {
        const k = kieu === "sc" ? ddSoCap(adj, huong, s, t, dong) : ddDon(adj, huong, s, t, dong);
        k.ds.sort((a, b) => a.es.length - b.es.length);   // ngắn trước (sắp ổn định: giữ thứ tự duyệt)
        r.tong = k.ds.length; r.ds = k.ds.slice(0, DD_GIOI_HAN); r.cham = k.cham;
        if (r.tong > DD_GIOI_HAN) r.ghiChu.push(`Chỉ hiển thị ${DD_GIOI_HAN} kết quả có ít cạnh nhất.`);
    } else if (kieu === "chung") {
        const k = ddChung(adj, radj, s, t);
        r.ds = k.ds; r.tong = k.ds.length; r.cham = k.cham;
        if (k.cham) r.ghiChu.push(`${dong ? "Chu trình" : "Đường đi"} chung có thể vô hạn: chỉ liệt kê ${DD_GIOI_HAN} kết quả ngắn nhất (theo số cạnh).`);
    } else {
        const theoW = kieu === "nnw";
        if (theoW && edges.some(e => trongSoCanh(e) < 0)) return { loi: "Có cạnh trọng số âm: chưa hỗ trợ tìm ngắn nhất theo trọng số. Hãy chọn “ngắn nhất (số cạnh)”." };
        const c = theoW ? id => trongSoCanh(edges[id]) : () => 1;
        r.ds = dong ? ddChuTrinhNganNhat(adj, radj, huong, s, c) : ddNganNhat(adj, radj, s, t, c, -1).ds;
        r.tong = r.ds.length;
        if (r.ds.length) {
            const L = r.ds[0];
            r.ghiChu.push(theoW ? `Tổng trọng số nhỏ nhất = ${fmt(ddTongW(L))}` : `Số cạnh ít nhất = ${L.es.length}`);
            if (r.tong >= DD_GIOI_HAN) r.ghiChu.push(`Chỉ hiển thị ${DD_GIOI_HAN} kết quả đầu tiên.`);
        }
    }
    if (r.cham && kieu !== "chung") r.ghiChu.push("Đã dừng sớm vì quá nhiều khả năng: có thể còn nhiều kết quả khác.");
    if (!r.ds.length) r.ghiChu = [];
    return r;
}

// ---------- Giao diện ----------
const ddLaChuTrinh = () => $("ddLoai").value.startsWith("ct:");

// Chọn loại: với chu trình, đỉnh đích luôn = đỉnh xuất phát (khóa ô đích)
function ddDoiLoai() {
    const ct = ddLaChuTrinh();
    $("ddDich").disabled = ct;
    if (ct) $("ddDich").value = $("ddXuatPhat").value;
}
function ddGoDinhDau() { if (ddLaChuTrinh()) $("ddDich").value = $("ddXuatPhat").value; }

function ddBao(html) { $("ddKetQua").innerHTML = html; }
const ddLoi = s => ddBao(`<div class="dd-loi">${s}</div>`);

function ddTim() {
    if (!n || !Object.keys(nodes).length) return ddLoi("Chưa có đồ thị. Hãy tạo đồ thị trước.");
    const loai = $("ddLoai").value, tatca = loai === "tatca";
    const s = docDinh($("ddXuatPhat").value);
    const dichTrong = $("ddDich").value.trim() === "";
    const dong = ddLaChuTrinh() || (tatca && dichTrong);
    const t = dong ? s : docDinh($("ddDich").value);
    const khoang = `${nhanDinh(0)} đến ${nhanDinh(n - 1)}`;
    if (!kiemTraDinh(s)) return ddLoi(`Đỉnh xuất phát không hợp lệ (phải từ ${khoang}).`);
    if (!kiemTraDinh(t)) return ddLoi(`Đỉnh đích không hợp lệ (phải từ ${khoang}).`);
    if (!dong && !tatca && s === t) return ddLoi("Đỉnh xuất phát và đỉnh đích đang trùng nhau. Hãy chọn đỉnh đích khác, hoặc chọn loại “Chu trình” để đi và quay về cùng một đỉnh.");

    const r = ddTinh(loai, s, t);
    if (r.loi) return ddLoi(r.loi);
    r.sig = ddSig();
    ddXoaTo();              // kết quả cũ không còn đúng: bỏ phần tô cũ
    ddKq = r;
    ddVeKetQua();
}

// ---------- Lọc đường đi nhanh ----------
// Gõ dãy đỉnh vào ô "Lọc đường đi nhanh" để chỉ giữ lại các kết quả có đi qua đúng dãy đỉnh đó, liền nhau, theo thứ tự.
//   Ví dụ gõ 12542 -> giữ các đường chứa 1 → 2 → 5 → 4 → 2 (không có dấu phân cách thì mỗi ký tự là một đỉnh).
//   Đỉnh từ 10 trở lên (hoặc muốn rõ ràng) thì ngăn cách bằng khoảng trắng, dấu phẩy hoặc ->, vd: 10 2 11 hoặc 10->2->11.
//   Nhãn chữ cũng được: ABD. Ô để trống = hiện tất cả. Dãy không hợp lệ -> không có kết quả nào khớp.
function ddTachDinh(v) {
    const co = /[\s,;>\-]/.test(v);
    const tok = co ? v.split(/[\s,;>\-]+/).filter(Boolean) : v.split("");
    return tok.map(docDinh);    // NaN nếu sai
}
function ddDocLoc() {
    const v = ($("ddLoc") ? $("ddLoc").value : "").trim();
    if (!v) return null;
    return ddTachDinh(v);
}
function ddKhop(p, loc) {
    if (!loc) return true;
    if (!loc.length || loc.some(x => Number.isNaN(x))) return false;
    const vs = p.vs;
    for (let i = 0; i + loc.length <= vs.length; i++) {
        let ok = true;
        for (let j = 0; j < loc.length; j++) if (vs[i + j] !== loc[j]) { ok = false; break; }
        if (ok) return true;
    }
    return false;
}
function ddLocNhanh() { ddVeKetQua(); }

// ---------- Phân loại một dãy đỉnh/cạnh: đường đi hay chu trình, sơ cấp / đơn / chung ----------
// sơ cấp ⊂ đơn ⊂ chung. Nhãn trả về là loại CHẶT NHẤT mà dãy thỏa.
function ddPhanLoai(vs, es) {
    const ct = vs.length > 1 && vs[0] === vs[vs.length - 1];
    const donCanh = new Set(es).size === es.length;
    const dinh = ct ? vs.slice(0, -1) : vs;
    const khacDinh = new Set(dinh).size === dinh.length;
    const cap = donCanh && khacDinh ? "sc" : donCanh ? "don" : "chung";
    return { ct, donCanh, khacDinh, cap };
}
const DD_CAP = { sc: "sơ cấp", don: "đơn", chung: "chung" };
const ddNhan = (ct, cap) => `<span class="dd-tag dd-${cap}">${ct ? "Chu trình" : "Đường đi"} ${DD_CAP[cap]}</span>`;

// Vẽ danh sách kết quả (vẽ lại được bất cứ lúc nào, ví dụ khi đổi nhãn số / chữ)
function ddVeKetQua() {
    const r = ddKq;
    if (!r) return;
    const nhanHeo = edges.some((e, i) => edges.some((f, j) => j > i && ((e.x === f.x && e.y === f.y) || (!coHuong() && e.x === f.y && e.y === f.x))));   // có cạnh song song -> ghi thêm số cạnh để phân biệt
    const coW = ddCoTrongSo(), ten = DD_TEN[r.loai];
    let h = "";
    if (!r.ds.length) {
        h = `<div class="dd-rong">Không tìm thấy ${r.loai.startsWith("ct:") ? "chu trình" : "đường đi"} nào (${ten.toLowerCase()}) từ ${nhanDinh(r.s)}${r.loai.startsWith("ct:") ? "" : " đến " + nhanDinh(r.t)}.</div>`;
    } else {
        const loc = ddDocLoc();
        const hien = r.ds.map((p, k) => ({ p, k })).filter(o => ddKhop(o.p, loc));
        h = `<div class="dd-tieude">Tìm thấy ${r.tong} kết quả${loc ? ` · ${hien.length} kết quả khớp bộ lọc` : ""}:</div>`;
        h += r.ghiChu.map(s => `<div class="dd-ghichu">${s}</div>`).join("");
        if (loc && !hien.length) h += `<div class="dd-rong">Không có kết quả nào đi qua dãy đỉnh đã gõ.</div>`;
        h += hien.map(({ p, k }) => {
            const meta = `${p.es.length} cạnh` + (coW ? ` · w = ${fmt(ddTongW(p))}` : "");
            const pl = ddPhanLoai(p.vs, p.es);
            const eid = nhanHeo ? ` <span class="dd-eid">[${p.es.map(i => "e" + (i + 1)).join(",")}]</span>` : "";
            return `<div class="dd-item${pathHL && pathHL.idx === k ? " dd-on" : ""}" data-k="${k}" onclick="ddChon(${k})" title="Bấm để tô đường này lên đồ thị">` +
                `<span class="dd-stt">${k + 1}.</span><span class="dd-duong">${p.vs.map(nhanDinh).join(" → ")}${eid}</span><span class="dd-phai"><span class="dd-meta">${meta}</span>${ddNhan(pl.ct, pl.cap)}</span></div>`;
        }).join("");
    }
    ddBao(h);
}

// Tô một đường/chu trình p lên đồ thị (idx = chỉ số dòng trong danh sách, -1 nếu không thuộc danh sách)
function ddToDuong(p, ct, idx) {
    resetEuler();   // bỏ tô Euler / Kruskal / Prim / mô phỏng đang có (cũng bỏ pathHL cũ)
    const canh = {};
    p.es.forEach((id, i) => { canh[id] = canh[id] ? canh[id] + "," + (i + 1) : String(i + 1); });   // cạnh đi nhiều lần: nhãn "2,5"
    pathHL = {
        canh, dinh: [...new Set(p.vs)], idx,
        msg: `${ct ? "Chu trình" : "Đường đi"}: ${p.vs.map(nhanDinh).join(" → ")} (${p.es.length} cạnh${ddCoTrongSo() ? ", w = " + fmt(ddTongW(p)) : ""})`
    };
    veDoThi();
    ddCapNhatChon();
}

// Bấm vào một kết quả: tô đường đó lên đồ thị
function ddChon(k) {
    if (!ddKq || !ddKq.ds[k]) return;
    if (ddKq.sig !== ddSig()) return ddXoaKetQua(true);
    ddToDuong(ddKq.ds[k], ddKq.loai.startsWith("ct:"), k);
}

// Nút "Xóa tô màu": chỉ bỏ phần tô trên hình, giữ nguyên danh sách kết quả
function ddXoaTo() {
    const co = !!pathHL;
    pathHL = null;
    if (co) veDoThi();
    ddCapNhatChon();
}

// Đánh dấu dòng đang được tô (không dựng lại cả danh sách)
function ddCapNhatChon() {
    document.querySelectorAll("#ddKetQua .dd-item").forEach(e => e.classList.toggle("dd-on", !!pathHL && pathHL.idx === Number(e.dataset.k)));
}

// Xóa kết quả (đổi phiên / đồ thị thay đổi)
function ddXoaKetQua(thongBao) {
    ddKq = null;
    if (pathHL) { pathHL = null; veDoThi(); }
    const kv = $("ddKetQua");
    if (kv) kv.innerHTML = thongBao ? '<div class="dd-rong">Đồ thị đã thay đổi, kết quả cũ không còn đúng. Hãy bấm “Tìm kiếm” lại.</div>' : "";
}

// Gọi từ hienThiThongTin() (thong_tin.js): đồ thị đổi thì bỏ kết quả cũ; không đổi (vd. đổi nhãn số / chữ) thì chỉ vẽ lại danh sách
function ddDongBo() {
    if (!ddKq) return;
    if (ddKq.sig !== ddSig()) ddXoaKetQua(true);
    else ddVeKetQua();
}

ddDoiLoai();
