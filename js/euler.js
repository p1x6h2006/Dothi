// =====================================================
// CHU TRÌNH EULER: kiểm tra điều kiện, tìm chu trình, mô phỏng trên đồ thị
// =====================================================
// Điều kiện (xét trên các đỉnh có cạnh; đỉnh cô lập bị bỏ qua):
//   Vô hướng (loai 1-3): các cạnh cùng một thành phần liên thông VÀ mọi đỉnh có bậc chẵn
//                        (vòng khuyên tính bậc 2, nên không phá điều kiện).
//   Có hướng (loai 4-5): liên thông yếu VÀ mọi đỉnh có deg⁺ = deg⁻.
// Thuật toán tìm chu trình: Hierholzer (đi theo cạnh chưa dùng, kẹt thì lùi và ghép chu trình con).
//   Dùng "số thứ tự cạnh" để đánh dấu đã dùng -> đúng với cạnh song song và vòng khuyên.
// Tô màu trên hình: biến eulerHL (state.js) = { order: {chỉ số cạnh: thứ tự đi}, cur: đỉnh hiện tại }
//   draw.js đọc eulerHL khi vẽ cạnh / đỉnh.

const MAU_EULER = "#f59e0b";
let eulerTimer = null;   // bộ đếm giờ của phần mô phỏng từng bước
let eulerStart = null;   // đỉnh bắt đầu do người dùng chọn (null = đỉnh nhỏ nhất có cạnh)

// Dừng mô phỏng và bỏ tô màu (KHÔNG vẽ lại; nơi gọi tự vẽ lại nếu cần)
function resetEuler() {
    clearInterval(eulerTimer);
    eulerTimer = null;
    eulerHL = null;
}

// ---- Bước 1: phân tích đồ thị, trả về { ok, lyDo[], vs[], es[], ... } ----
function phanTichEuler() {
    const huong = coHuong(), m = edges.length;
    const deg = Array(n).fill(0), dIn = Array(n).fill(0), dOut = Array(n).fill(0);
    edges.forEach(e => {
        if (huong) { dOut[e.x]++; dIn[e.y]++; }
        else { deg[e.x]++; deg[e.y]++; }          // vòng khuyên x = y: cộng 2 lần -> bậc 2
    });
    const coCanh = dsDinh().filter(i => (huong ? dIn[i] + dOut[i] : deg[i]) > 0);
    const r = { ok: false, lyDo: [], vs: [], es: [], coCanh, coDuongDi: null, start: null };

    if (m === 0) { r.lyDo.push("Đồ thị không có cạnh nào."); return r; }

    // Liên thông (yếu, với đồ thị có hướng): gộp các đỉnh bằng union-find
    const cha = dsDinh();
    const goc = x => cha[x] === x ? x : (cha[x] = goc(cha[x]));
    edges.forEach(e => { cha[goc(e.x)] = goc(e.y); });
    const lienThong = new Set(coCanh.map(goc)).size === 1;
    if (!lienThong) r.lyDo.push("Các cạnh không nằm trong cùng một thành phần liên thông.");

    // Điều kiện về bậc
    let le = [];
    if (huong) {
        le = coCanh.filter(i => dIn[i] !== dOut[i]);
        if (le.length) r.lyDo.push("Có đỉnh deg⁺ ≠ deg⁻: " + le.map(i => `${i} (deg⁺=${dOut[i]}, deg⁻=${dIn[i]})`).join(", ") + ".");
    } else {
        le = coCanh.filter(i => deg[i] % 2 === 1);
        if (le.length) r.lyDo.push("Có đỉnh bậc lẻ: " + le.map(i => `${i} (bậc ${deg[i]})`).join(", ") + ".");
    }

    // Không có chu trình: xét xem có ĐƯỜNG ĐI Euler không (để báo thêm 1 dòng)
    if (r.lyDo.length) {
        if (lienThong) {
            if (!huong && le.length === 2) r.coDuongDi = `từ đỉnh ${le[0]} đến đỉnh ${le[1]}`;
            if (huong) {
                const dau = le.filter(i => dOut[i] - dIn[i] === 1), cuoi = le.filter(i => dIn[i] - dOut[i] === 1);
                if (le.length === 2 && dau.length === 1 && cuoi.length === 1) r.coDuongDi = `từ đỉnh ${dau[0]} đến đỉnh ${cuoi[0]}`;
            }
        }
        return r;
    }

    // ---- Bước 2: Hierholzer ----
    const adj = dsDinh().map(() => []);
    edges.forEach((e, id) => {
        adj[e.x].push({ to: e.y, id });
        if (!huong) adj[e.y].push({ to: e.x, id });   // vô hướng: lưu cả 2 chiều (vòng khuyên: 2 lần, cùng id)
    });
    adj.forEach(l => l.sort((a, b) => a.to - b.to || a.id - b.id));

    const s = coCanh.includes(eulerStart) ? eulerStart : coCanh[0];
    const used = Array(m).fill(false), ptr = Array(n).fill(0);
    const stV = [s], stE = [-1], resV = [], resE = [];
    while (stV.length) {
        const v = stV[stV.length - 1], l = adj[v];
        while (ptr[v] < l.length && used[l[ptr[v]].id]) ptr[v]++;
        if (ptr[v] < l.length) {
            const { to, id } = l[ptr[v]++];
            used[id] = true;
            stV.push(to); stE.push(id);
        } else {
            stV.pop(); resV.push(v); resE.push(stE.pop());
        }
    }
    r.vs = resV.reverse();              // dãy đỉnh: s, ..., s (m + 1 phần tử)
    r.es = resE.reverse().slice(1);     // dãy cạnh (chỉ số trong edges): m phần tử
    r.start = s;
    r.ok = r.es.length === m;           // phòng hờ
    return r;
}

// ---- Tô màu / mô phỏng trên hình ----
function trangThaiEuler(r, k) {
    const t = $("eulerStatus");
    if (!t) return;
    if (k === 0) t.textContent = `Bắt đầu tại đỉnh ${r.vs[0]}.`;
    else if (k < r.es.length) t.textContent = `Bước ${k}/${r.es.length}: đi ${r.vs[k - 1]} → ${r.vs[k]} qua cạnh e${r.es[k - 1] + 1}.`;
    else t.textContent = `Xong: đã đi hết ${r.es.length} cạnh và quay về đỉnh ${r.vs[k]}.`;
}

function chayEuler() {
    const r = phanTichEuler();
    if (!r.ok) return;
    resetEuler();
    eulerHL = { order: {}, cur: r.vs[0] };
    veDoThi();
    trangThaiEuler(r, 0);
    let k = 0;
    eulerTimer = setInterval(() => {
        if (k >= r.es.length) { clearInterval(eulerTimer); eulerTimer = null; return; }
        eulerHL.order[r.es[k]] = k + 1;
        k++;
        eulerHL.cur = r.vs[k];
        veDoThi();
        trangThaiEuler(r, k);
    }, 800);
}

function hienEuler() {
    const r = phanTichEuler();
    if (!r.ok) return;
    resetEuler();
    eulerHL = { order: {}, cur: null };
    r.es.forEach((id, i) => { eulerHL.order[id] = i + 1; });
    veDoThi();
    const t = $("eulerStatus");
    if (t) t.textContent = `Đã tô cả ${r.es.length} cạnh, số trên cạnh là thứ tự đi.`;
}

function boEuler() {
    resetEuler();
    veDoThi();
    const t = $("eulerStatus");
    if (t) t.textContent = "";
}

function doiDinhEuler(v) {
    eulerStart = parseInt(v);
    hienThiThongTin();   // dựng lại bảng và tự bỏ tô màu cũ
}

// ---- Bước 3: vẽ phần Euler vào khung thông tin ----
function htmlEuler() {
    const r = phanTichEuler(), huong = coHuong();
    let text = `<h3 class="adjacency-matrix-heading">Chu trình Euler (đồ thị ${loaiDoThi()})</h3><div class="euler-wrap">`;

    if (!r.ok) {
        text += '<div class="euler-no">✖ Không có chu trình Euler</div>';
        text += r.lyDo.map(s => `<div class="euler-reason">${s}</div>`).join("");
        if (r.coDuongDi) text += `<div class="euler-path">Nhưng có <b>đường đi Euler</b> ${r.coDuongDi}.</div>`;
        text += "</div>";
        text += ghiChu(huong
            ? "Điều kiện: liên thông yếu và mọi đỉnh có deg⁺ = deg⁻."
            : "Điều kiện: liên thông và mọi đỉnh có bậc chẵn (vòng khuyên tính bậc 2).");
        return text;
    }

    const chon = r.coCanh.map(i => `<option value="${i}"${i === r.start ? " selected" : ""}>${i}</option>`).join("");
    text += '<div class="euler-yes">✔ Có chu trình Euler</div>';
    text += `<div class="euler-start">Đỉnh bắt đầu: <select onchange="doiDinhEuler(this.value)">${chon}</select></div>`;
    text += '<div class="euler-seq">' + r.vs.map((v, i) =>
        `<span class="euler-v">${v}</span>` + (i < r.es.length ? `<span class="euler-e" title="cạnh e${r.es[i] + 1}">${huong ? "→" : "–"} e${r.es[i] + 1} ${huong ? "→" : "–"}</span>` : "")
    ).join("") + "</div>";
    text += `<div class="euler-line">${r.vs.join(" → ")}</div>`;
    text += '<div class="euler-btns"><button onclick="chayEuler()">▶ Mô phỏng</button><button class="success" onclick="hienEuler()">Tô cả chu trình</button><button class="danger" onclick="boEuler()">Bỏ tô màu</button></div>';
    text += '<div class="euler-status" id="eulerStatus"></div></div>';
    text += ghiChu(`Chu trình đi qua đủ ${edges.length} cạnh, mỗi cạnh đúng 1 lần, rồi quay về đỉnh xuất phát. Thuật toán Hierholzer.`);
    if (r.coCanh.length < n) text += ghiChu("Các đỉnh cô lập (không có cạnh) được bỏ qua khi xét liên thông.");
    return text;
}
