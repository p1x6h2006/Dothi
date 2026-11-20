// =====================================================
// VẼ ĐỒ THỊ: bố trí đỉnh, vẽ cạnh và đỉnh bằng SVG, kéo đỉnh
// =====================================================
// [Mục] SẮP XẾP: đặt các đỉnh đều trên một vòng tròn
function sapXep() {
    const cx = svg.clientWidth / 2, cy = svg.clientHeight / 2;
    const r = Math.min(svg.clientWidth, svg.clientHeight) * 0.35;
    for (let i = 0; i < n; i++) {
        const angle = 2 * Math.PI * i / n - Math.PI / 2;
        nodes[i].x = cx + r * Math.cos(angle);
        nodes[i].y = cy + r * Math.sin(angle);
    }
    veDoThi();
}

// =========================================
// PHÓNG TO / THU NHỎ (nút nằm trên khung đồ thị: #zoomBar trong index.html)
// =========================================
let zoom = 1;                                   // 1 = 100%
const ZOOM_MIN = 0.3, ZOOM_MAX = 3, ZOOM_BUOC = 1.2;
const tamKhung = () => ({ x: svg.clientWidth / 2, y: svg.clientHeight / 2 });   // phóng to/nhỏ quanh tâm khung đồ thị
// Đổi tọa độ chuột trong khung (px màn hình) -> tọa độ đồ thị (trước khi phóng to/nhỏ)
function manHinhSangDoThi(sx, sy) {
    const t = tamKhung();
    return { x: (sx - t.x) / zoom + t.x, y: (sy - t.y) / zoom + t.y };
}
function datZoom(z) {
    zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
    const nhan = $("zoomPhanTram");
    if (nhan) nhan.textContent = Math.round(zoom * 100) + "%";
    const a = $("zoomRa"), b = $("zoomVao");
    if (a) a.disabled = zoom <= ZOOM_MIN + 1e-9;
    if (b) b.disabled = zoom >= ZOOM_MAX - 1e-9;
    veDoThi();
}
const phongTo = () => datZoom(zoom * ZOOM_BUOC);
const thuNho = () => datZoom(zoom / ZOOM_BUOC);
const datLaiZoom = () => datZoom(1);

// =========================================
// VẼ ĐỒ THỊ
// =========================================
let gocVe = svg;   // nơi el() vẽ vào mặc định: nhóm <g> có phóng to/nhỏ (đỉnh + cạnh), hoặc svg gốc (thông báo giữ nguyên cỡ)
function el(tag, attrs = {}, parent = gocVe) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    parent.appendChild(e);
    return e;
}

// [Mục] VẼ TOÀN BỘ: xóa svg -> tạo mũi tên -> vẽ cạnh (trước) -> vẽ đỉnh (sau, nằm đè lên)
function veDoThi() {
    svg.innerHTML = "";
    gocVe = svg;
    const defs = el("defs");
    const marker = el("marker", { id: "arrow", markerWidth: 10, markerHeight: 10, refX: 9, refY: 3, orient: "auto", fill: graphPalette.edge }, defs);
    el("path", { d: "M0,0 L0,6 L9,3 z", fill: graphPalette.edge }, marker);
    // Mũi tên màu cam cho cạnh thuộc chu trình Euler đang tô (chu_trinh_euler.js)
    const markerHL = el("marker", { id: "arrowHL", markerWidth: 10, markerHeight: 10, refX: 9, refY: 3, orient: "auto", fill: MAU_EULER }, defs);
    el("path", { d: "M0,0 L0,6 L9,3 z", fill: MAU_EULER }, markerHL);

    // Đỉnh + cạnh nằm trong nhóm <g> được phóng to/nhỏ quanh tâm khung; thông báo bên dưới vẫn vẽ ngoài nhóm nên giữ nguyên cỡ chữ
    const tam = tamKhung();
    gocVe = el("g", { id: "noiDungDoThi", transform: `translate(${tam.x} ${tam.y}) scale(${zoom}) translate(${-tam.x} ${-tam.y})` });

    // Khi ra kết quả cây khung (krHL.an): chỉ vẽ các cạnh thuộc cây khung, các cạnh thừa không vẽ (dữ liệu vẫn còn; "Hủy mô phỏng" sẽ hiện lại)
    edges.forEach((e, index) => { if (krHL && krHL.an && !krHL.chon[index]) return; veCanh(e.x, e.y, index); });
    for (const i in nodes) veDinh(Number(i));
    gocVe = svg;

    // Thông báo bước Euler đang chạy (chu_trinh_euler.js), đặt góc trên bên trái hình
    if (eulerHL && eulerHL.msg) el("text", { x: 16, y: 26, class: "edge-label", style: "text-anchor:start;font-size:15px" }).textContent = eulerHL.msg;

    // Thông báo đường đi / chu trình đang tô (duong_di.js)
    const dd = pathDangHien();
    if (dd && dd.msg) el("text", { x: 16, y: 26, class: "edge-label", style: "text-anchor:start;font-size:15px" }).textContent = dd.msg;

    // Thông báo bước Kruskal / Prim đang chạy (kruskal.js, prim.js), cùng chỗ với thông báo Euler
    if (krHL && krHL.msg) el("text", { x: 16, y: 26, class: "edge-label", style: "text-anchor:start;font-size:15px" }).textContent = krHL.msg;

    // Thông báo bước mô phỏng người phát thư đang chạy (nguoi_phat_thu.js), cùng chỗ với thông báo Euler / Kruskal
    if (nptHL && nptHL.msg) el("text", { x: 16, y: 26, class: "edge-label", style: "text-anchor:start;font-size:15px" }).textContent = nptHL.msg;

    // Dòng thông báo của bài toán người phát thư (nguoi_phat_thu.js), góc dưới trái; bấm vào để xuống bảng kết quả
    if (nptThongBao) {
        const t = el("text", { x: 16, y: svg.clientHeight - 14, class: "edge-label", style: "text-anchor:start;font-size:14px;cursor:pointer;pointer-events:all" });
        t.textContent = nptThongBao;
        t.addEventListener("click", cuonDenKetQuaNPT);
    }
    if (typeof luuTuDong === "function") luuTuDong();   // tự động lưu (luu_tru.js)
}

// [Mục] Nhãn của cạnh: "(x,y)" hoặc "(x,y) · w"; cạnh LẶP (cạnh sao chép do bài toán người phát thư / Euler thêm vào) ghi thêm dấu *: "(x,y)*" hoặc "(x,y)* · w"
function nhanCanh(index) {
    const { x, y, w } = edges[index];
    const sao = canhThemNPT.has(index) ? "*" : "";
    return w !== undefined ? `(${nhanDinh(x)},${nhanDinh(y)})${sao} · ${w}` : `(${nhanDinh(x)},${nhanDinh(y)})${sao}`;
}

function taoNhan(x, y, text, hl) {
    el("text", { x, y, class: hl ? "edge-label euler-label" : "edge-label" }).textContent = text;
}

// Vẽ một cạnh. Cách vẽ theo loại đồ thị:
//   - Vòng khuyên (x = y)      : hình elip phía trên đỉnh          (loai 3)
//   - Cạnh thường              : đường cong bậc hai                 (loai 1-5)
//   - Cạnh song song           : cong ra hai bên để không chồng nhau (loai 2, 3, 5)
//   - Có hướng (coHuong())     : thêm mũi tên ở đầu y               (loai 4, 5)
function veCanh(x, y, index) {
    const p1 = nodes[x], p2 = nodes[y], P = graphPalette;
    const pHL = pathDangHien();                                    // đường đi / chu trình người dùng chọn ở mục "Đường đi & chu trình" (duong_di.js)
    const buoc = eulerHL ? eulerHL.order[index] : pHL ? pHL.canh[index] : undefined;   // thứ tự đi của cạnh trong chu trình Euler hoặc đường đi đang tô (cùng màu cam)
    const them = canhThemNPT.has(index);                           // cạnh do bài toán người phát thư thêm vào (xanh lá)
    const kBuoc = krHL ? krHL.chon[index] : undefined;              // thứ tự chọn của cạnh trong cây khung Kruskal (nếu đang tô)
    const kLoai = krHL ? krHL.loai.includes(index) : false;         // cạnh bị Kruskal loại (tạo chu trình): đỏ, nét đứt
    const vuaThem = !!(nptHL && nptHL.canhCur && nptHL.canhCur.includes(index));   // cạnh sao chép vừa thêm ở bước mô phỏng người phát thư hiện tại (hồng)
    const mauCanh = buoc ? MAU_EULER : kBuoc ? MAU_KRUSKAL : kLoai ? MAU_KRUSKAL_LOAI : vuaThem ? MAU_NPT_HIENTAI : them ? MAU_THEM : P.edge;
    const mauGlow = buoc ? MAU_EULER : kBuoc ? MAU_KRUSKAL : kLoai ? MAU_KRUSKAL_LOAI : vuaThem ? MAU_NPT_HIENTAI : them ? MAU_THEM : P.glow;
    const dayNet = buoc ? 6 : kBuoc ? 7 : kLoai ? 4 : vuaThem ? 7 : them ? 5 : 4;
    const nhan = (buoc ? `#${buoc} ` : kBuoc ? `✔${kBuoc} ` : kLoai ? "✖ " : vuaThem ? "＋ " : "") + nhanCanh(index);
    const mui = buoc ? "url(#arrowHL)" : "url(#arrow)";

    // --- Vòng khuyên (chỉ loai 3 mới có) ---
    if (x === y) {
        // Nhiều vòng khuyên trên cùng một đỉnh: vòng thứ k vẽ to dần lên phía trên để không chồng nhau
        const k = edges.slice(0, index).filter(e => e.x === x && e.y === y).length;
        const cy = p1.y - 35 - k * 25, ex = k * 15, ey = k * 25;
        el("ellipse", { cx: p1.x, cy, rx: 39 + ex, ry: 54 + ey, fill: "none", stroke: mauGlow, "stroke-width": 15, opacity: 0.25 });   // quầng sáng: nét to mờ, không dùng filter
        const loop = el("ellipse", { cx: p1.x, cy, rx: 35 + ex, ry: 50 + ey, class: "edge", stroke: mauCanh, "stroke-width": dayNet, fill: "none" });
        if (kLoai) loop.setAttribute("stroke-dasharray", "8 6");
        if (coHuong()) loop.setAttribute("marker-end", mui);
        taoNhan(p1.x, p1.y - 90 - k * 50, nhan, buoc);
        return;
    }

    // --- Cạnh thường: tính độ cong ---
    // Độ cong: các cạnh song song được tách ra hai bên
    // (đang hiện riêng cây khung thì không có cạnh song song nào được vẽ cùng, nên vẽ thẳng)
    const same = krHL && krHL.an ? [edges[index]] : edges.filter(e => (e.x === x && e.y === y) || (e.x === y && e.y === x));
    const offset = (same.indexOf(edges[index]) - (same.length - 1) / 2) * 50;
    // Pháp tuyến luôn tính theo chiều CỐ ĐỊNH (đỉnh nhỏ -> đỉnh lớn), không phụ thuộc chiều cạnh.
    // Nhờ vậy (1,4) và (4,1) cong về HAI PHÍA KHÁC NHAU thành 2 đường riêng, thay vì chồng lên nhau.
    const [pa, pb] = x < y ? [p1, p2] : [p2, p1];
    const dx = pb.x - pa.x, dy = pb.y - pa.y, len = Math.hypot(dx, dy);
    const cx = (p1.x + p2.x) / 2 + (-dy / len) * offset;
    const cy = (p1.y + p2.y) / 2 + (dx / len) * offset;

    const diem = (a, b, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b;      // phần đầu + điều khiển
    const bez = (t, a, b, c) => diem(a, b, t) + t * t * c;                       // điểm trên đường cong bậc hai
    const d = `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`;

    el("path", { d, fill: "none", stroke: mauGlow, "stroke-width": 14, opacity: 0.25, "stroke-linecap": "round" });   // quầng sáng: nét to mờ, không dùng filter
    const path = el("path", { d, class: "edge", stroke: mauCanh, "stroke-width": dayNet, fill: "none" });
    if (kLoai) path.setAttribute("stroke-dasharray", "8 6");

    // --- Mũi tên cho đồ thị có hướng (loai 4, 5) ---
    if (coHuong()) {
        // Đưa đầu mũi tên ra ngoài đỉnh (cách tâm 34px) để không bị hình tròn che
        const cachDich = t => Math.hypot(bez(t, p1.x, cx, p2.x) - p2.x, bez(t, p1.y, cy, p2.y) - p2.y);
        if (cachDich(0) >= 34) {
            let lo = 0, hi = 1;
            for (let i = 0; i < 30; i++) {
                const mid = (lo + hi) / 2;
                if (cachDich(mid) >= 34) lo = mid; else hi = mid;
            }
            const t = (lo + hi) / 2;
            path.setAttribute("d", `M ${p1.x} ${p1.y} Q ${p1.x + t * (cx - p1.x)} ${p1.y + t * (cy - p1.y)} ${bez(t, p1.x, cx, p2.x)} ${bez(t, p1.y, cy, p2.y)}`);
        }
        path.setAttribute("marker-end", mui);
    }

    // Nhãn cạnh (x,y) · w đặt ở giữa đường cong
    taoNhan((p1.x + 2 * cx + p2.x) / 4, (p1.y + 2 * cy + p2.y) / 4, nhan, buoc);
}

// Màu viền đỉnh khi đang mô phỏng người phát thư: cặp đang ghép (hồng) > đã ghép xong (xanh lá) > đỉnh bậc lẻ chưa ghép (cam); không thuộc loại nào -> ""
function mauVienNPT(i) {
    if (!nptHL) return "";
    if (nptHL.cur.includes(i)) return MAU_NPT_HIENTAI;
    if (nptHL.xong.includes(i)) return MAU_THEM;
    if (nptHL.le.includes(i)) return MAU_NPT_LE;
    return "";
}

// Vẽ một đỉnh (hình tròn + số hiệu), có thể kéo bằng chuột
function veDinh(i) {
    const p = nodes[i], g = el("g");
    el("circle", { cx: p.x, cy: p.y + 7, r: 32, fill: "rgba(59, 130, 246, 0.22)", "pointer-events": "none" }, g);   // bóng đổ nhẹ, thay cho drop-shadow
    const dd = pathDangHien(), vienCam = (eulerHL && eulerHL.cur === i) || (dd && dd.dinh.includes(i));   // đỉnh hiện tại của Euler / đỉnh nằm trên đường đi đang tô: viền cam
    const c = el("circle", { cx: p.x, cy: p.y, r: 30, class: "node", fill: graphPalette.node, stroke: vienCam ? MAU_EULER : krHL && krHL.tham && krHL.tham.includes(i) ? MAU_KRUSKAL : mauVienNPT(i) || graphPalette.border, "stroke-width": vienCam ? 7 : krHL && krHL.tham && krHL.tham.includes(i) ? 6 : mauVienNPT(i) ? 7 : 3 }, g);   // đỉnh đã vào cây Prim: viền xanh ngọc
    c.addEventListener("mousedown", e => { draggingNode = i; e.preventDefault(); });
    el("text", { x: p.x, y: p.y, class: "node-text" }, g).textContent = nhanDinh(i);
}

// Kéo bằng chuột: kéo 1 đỉnh (bấm trúng đỉnh) hoặc kéo CẢ ĐỒ THỊ (bấm vào chỗ trống / cạnh trong khung đồ thị)
let veCho = false;     // gom nhiều lần di chuột thành 1 lần vẽ lại mỗi khung hình
let keoNen = null;     // đang kéo cả đồ thị: vị trí chuột lần trước { x, y } (null = không kéo)

// Bấm chuột xuống nền / cạnh (đỉnh đã tự xử lý ở veDinh và đặt draggingNode trước khi sự kiện nổi lên tới đây)
svg.addEventListener("mousedown", e => {
    if (e.button !== 0 || draggingNode !== null) return;
    keoNen = { x: e.clientX, y: e.clientY };
    svg.classList.add("dang-keo");
    e.preventDefault();
});

svg.addEventListener("mousemove", e => {
    if (draggingNode !== null) {
        const rect = svg.getBoundingClientRect();
        const w = manHinhSangDoThi(e.clientX - rect.left, e.clientY - rect.top);   // tính lại theo mức phóng to/nhỏ
        nodes[draggingNode].x = w.x;
        nodes[draggingNode].y = w.y;
    } else if (keoNen) {
        const dx = (e.clientX - keoNen.x) / zoom, dy = (e.clientY - keoNen.y) / zoom;
        keoNen = { x: e.clientX, y: e.clientY };
        for (const i in nodes) { nodes[i].x += dx; nodes[i].y += dy; }
    } else return;
    if (veCho) return;
    veCho = true;
    requestAnimationFrame(() => { veCho = false; veDoThi(); });
});
document.addEventListener("mouseup", () => { draggingNode = null; keoNen = null; svg.classList.remove("dang-keo"); });
