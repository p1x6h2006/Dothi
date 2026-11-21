// =====================================================
// MA TRẬN: ma trận kề, ma trận liên thuộc và ma trận trọng số
// =====================================================

// [Mục] Hàm tiện ích dùng chung (ghiChu cũng được danh_sach_ke.js dùng lại)
const ghiChu = s => `<div class="adjacency-matrix-note">${s}</div>`;
const dsDinh = () => Array.from({ length: n }, (_, i) => i);
const loaiDoThi = () => (coHuong() ? "có hướng" : "vô hướng");

// Vẽ một ma trận n x n thành bảng HTML; hienThiO quyết định cách hiện từng ô
function bangMa(M, hienThiO) {
    const head = Array.from({ length: n }, (_, c) => `<th>${nhanDinh(c)}</th>`).join("");
    const rows = M.map((row, r) => `<tr><th>${nhanDinh(r)}</th>${row.map((v, c) => hienThiO(v, r, c)).join("")}</tr>`).join("");
    return `<table class="adjacency-matrix"><thead><tr><th>Đỉnh</th>${head}</tr></thead><tbody>${rows}</tbody></table>`;
}

// ---- Ma trận kề ----
// Ô [i][j] = số cạnh nối i với j.
//   Vô hướng (loai 1-3): đối xứng, vòng khuyên ghi 1 trên đường chéo.
//   Có hướng (loai 4-5): chỉ ghi [x][y], hàng = đỉnh xuất phát, cột = đỉnh đích.
//   Đa đồ thị (loai 2, 5): ô có thể > 1 (cạnh song song).
function htmlMaTranKe() {
    const loai = loaiHienTai(), huong = coHuong();
    const adj = dsDinh().map(() => Array(n).fill(0));
    edges.forEach(({ x, y }) => {
        adj[x][y]++;
        if (!huong && x !== y) adj[y][x]++;
    });

    let text = `<h3 class="adjacency-matrix-heading">Ma trận kề (đồ thị ${loaiDoThi()})</h3><div class="adjacency-matrix-wrap">`;
    text += bangMa(adj, v => `<td class="${v !== 0 ? "cell-lit" : ""}">${v}</td>`);
    text += ghiChu(`Hàng và cột sử dụng cùng số hiệu đỉnh trên đồ thị (${nhanDinh(0)}–${nhanDinh(n - 1)}).`);
    if (huong) text += ghiChu("Hàng là đỉnh xuất phát, cột là đỉnh đích.");
    else if (edges.some(e => e.x === e.y)) text += ghiChu("Mỗi vòng khuyên ghi 1 trên đường chéo chính và đóng góp 2 vào bậc đỉnh.");
    if (loai === 2 || loai === 5) text += ghiChu("Mỗi ô ghi số cạnh song song giữa hai đỉnh.");
    return text + "</div>";
}

// ---- Ma trận liên thuộc: hàng = đỉnh, cột = cạnh e1…em (theo thứ tự nhập) ----
//   Vô hướng (loai 1-3): M[v][e] = 1 nếu v là đầu mút của e, ngược lại 0.
//                        Mỗi cột có đúng hai số 1; vòng khuyên chỉ có MỘT số 1 (quy ước giống ma trận kề: vòng khuyên ghi 1).
//   Có hướng (loai 4-5): M[v][e] = 1 nếu e đi RA từ v (v là đỉnh đầu), -1 nếu e đi VÀO v (v là đỉnh cuối), 0 còn lại.
//                        Mỗi cột có đúng một số 1 và một số -1.
function xayMaTranLienThuoc() {
    const huong = coHuong();
    const M = dsDinh().map(() => Array(edges.length).fill(0));
    edges.forEach(({ x, y }, j) => {
        if (huong) { if (x !== y) { M[x][j] = 1; M[y][j] = -1; } }   // loại 4, 5 không có vòng khuyên
        else { M[x][j] = 1; M[y][j] = 1; }                            // vòng khuyên: x = y nên chỉ ghi 1 ô
    });
    return M;
}

function htmlMaTranLienThuoc() {
    const huong = coHuong(), m = edges.length;
    let text = `<h3 class="adjacency-matrix-heading">Ma trận liên thuộc (đồ thị ${loaiDoThi()})</h3><div class="adjacency-matrix-wrap">`;
    if (!m) return text + ghiChu("Chưa có cạnh nào nên ma trận liên thuộc chưa có cột (cỡ n × 0).") + "</div>";

    const M = xayMaTranLienThuoc();
    const sao = j => canhThemNPT.has(j) ? "*" : "";
    const head = edges.map((e, j) => `<th title="cạnh e${j + 1}${sao(j) ? " (cạnh lặp)" : ""}${e.w !== undefined ? `, w = ${e.w}` : ""}">e<sub>${j + 1}</sub>${sao(j)}<small>(${nhanDinh(e.x)},${nhanDinh(e.y)})</small></th>`).join("");
    const rows = M.map((row, v) => `<tr><th>${nhanDinh(v)}</th>${row.map(c => `<td class="${c === 1 ? "cell-lit" : c === -1 ? "cell-neg" : ""}">${c}</td>`).join("")}</tr>`).join("");
    text += `<table class="adjacency-matrix incidence"><thead><tr><th>Đỉnh / Cạnh</th>${head}</tr></thead><tbody>${rows}</tbody></table>`;

    text += ghiChu(`Hàng là đỉnh (${nhanDinh(0)}–${nhanDinh(n - 1)}), cột là cạnh e<sub>1</sub>…e<sub>${m}</sub> theo thứ tự nhập; dưới tên cạnh là hai đầu (x,y).`);
    if (huong) {
        text += ghiChu("Có hướng: M[v][e] = <b>1</b> nếu cạnh e đi <b>ra</b> từ v (v là đỉnh đầu x), <b>−1</b> nếu e đi <b>vào</b> v (v là đỉnh cuối y), 0 nếu không liên thuộc.");
        text += ghiChu("Mỗi cột có đúng một số 1 và một số −1 nên tổng mỗi cột bằng 0. Số 1 trên hàng v là deg⁺(v), số −1 trên hàng v là deg⁻(v).");
    } else {
        text += ghiChu(`Vô hướng: M[v][e] = <b>1</b> nếu v là đầu mút của cạnh e, ngược lại 0. Mỗi cột có đúng hai số 1 (hai đầu của cạnh)${edges.some(e => e.x === e.y) ? ", trừ cột của vòng khuyên" : ""}.`);
        if (edges.some(e => e.x === e.y)) text += ghiChu("Vòng khuyên chỉ có <b>một</b> số 1 trong cột của nó (hai đầu trùng nhau, giống quy ước ghi 1 trên đường chéo của ma trận kề).");
    }
    if (canhThemNPT.size) text += ghiChu("* = cạnh lặp (cạnh sao chép được thêm vào).");
    return text + "</div>";
}

// ---- Ma trận trọng số (mọi loại): 0 khi trùng đỉnh, w(i,j) nếu có cạnh, ∞ nếu không có ----
function htmlMaTranTrongSo() {
    const huong = coHuong();
    const D = dsDinh().map(i => dsDinh().map(j => i === j ? 0 : Infinity));
    edges.forEach(({ x, y, w = 1 }) => {
        if (x === y) return;
        D[x][y] = Math.min(D[x][y], w);
        if (!huong) D[y][x] = Math.min(D[y][x], w);
    });

    let text = `<h3 class="adjacency-matrix-heading">Ma trận trọng số (đồ thị ${loaiDoThi()})</h3><div class="adjacency-matrix-wrap">`;
    text += bangMa(D, (v, r, c) => v === Infinity ? '<td class="weight-inf">∞</td>' : `<td class="${[r === c ? "weight-diag" : "", v !== 0 ? "cell-lit" : ""].filter(Boolean).join(" ")}">${v}</td>`);
    text += ghiChu("d(i,j) = 0 khi i trùng j; = w(i,j) là trọng số cạnh nối hai đỉnh; = ∞ nếu không có cạnh nối.");
    text += ghiChu("Cạnh nhập không có trọng số được tính w = 1. Nếu có nhiều cạnh song song, lấy trọng số nhỏ nhất.");
    text += ghiChu(huong ? "Hàng là đỉnh xuất phát, cột là đỉnh đích." : "Đồ thị vô hướng nên ma trận đối xứng qua đường chéo chính.");
    return text + "</div>";
}
