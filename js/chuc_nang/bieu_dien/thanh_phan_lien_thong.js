// =====================================================
// THÀNH PHẦN LIÊN THÔNG: ô hiển thị trong khung thông tin bên phải
// =====================================================
// Vô hướng (loai 1-3): các thành phần liên thông của đồ thị (đỉnh cô lập là một thành phần riêng).
// Có hướng (loai 4-5): hiện cả hai loại
//   - Thành phần LIÊN THÔNG YẾU  : bỏ hướng các cạnh rồi tìm thành phần liên thông.
//   - Thành phần LIÊN THÔNG MẠNH : hai đỉnh u, v cùng thành phần khi có đường đi u→v VÀ v→u (thuật toán Kosaraju).
// Đồ thị đổi (thêm / xóa / sửa cạnh, người phát thư thêm cạnh lặp, Kruskal / Prim chỉ ẩn cạnh trên hình) thì ô này tính lại theo dữ liệu cạnh hiện có.

// Liên thông (yếu): union-find; trả về mảng các thành phần, mỗi thành phần là mảng đỉnh tăng dần
function thanhPhanLienThong() {
    const cha = dsDinh();
    const goc = x => cha[x] === x ? x : (cha[x] = goc(cha[x]));
    edges.forEach(e => { cha[goc(e.x)] = goc(e.y); });
    const nhom = new Map();
    dsDinh().forEach(v => { const r = goc(v); if (!nhom.has(r)) nhom.set(r, []); nhom.get(r).push(v); });
    return [...nhom.values()];
}

// Liên thông mạnh (đồ thị có hướng): Kosaraju
function thanhPhanLienThongManh() {
    const ra = dsDinh().map(() => []), vao = dsDinh().map(() => []);
    edges.forEach(e => { ra[e.x].push(e.y); vao[e.y].push(e.x); });
    const tham = Array(n).fill(false), thuTu = [];
    const dfs1 = u => { tham[u] = true; ra[u].forEach(v => { if (!tham[v]) dfs1(v); }); thuTu.push(u); };
    dsDinh().forEach(u => { if (!tham[u]) dfs1(u); });

    const nhan = Array(n).fill(-1), out = [];
    const dfs2 = (u, k) => { nhan[u] = k; out[k].push(u); vao[u].forEach(v => { if (nhan[v] < 0) dfs2(v, k); }); };
    for (let i = thuTu.length - 1; i >= 0; i--) {
        const u = thuTu[i];
        if (nhan[u] < 0) { out.push([]); dfs2(u, out.length - 1); }
    }
    out.forEach(l => l.sort((a, b) => a - b));
    return out.sort((a, b) => a[0] - b[0]);
}

function htmlDanhSachThanhPhan(ds) {
    return '<div class="tplt-list">' + ds.map((tp, i) =>
        `<div class="tplt-item"><span class="tplt-ten">${i + 1}</span>` +
        `<span class="tplt-dinh">{ ${tp.map(nhanDinh).join(", ")} }</span>` +
        `<small>${tp.length} đỉnh${tp.length === 1 ? " (đỉnh đơn lẻ)" : ""}</small></div>`).join("") + "</div>";
}

function htmlThanhPhanLienThong() {
    if (!n) return "";
    const huong = coHuong(), yeu = thanhPhanLienThong();
    let text = '<h3 class="adjacency-matrix-heading">Thành phần liên thông</h3><div class="tplt-box" id="tpltKetQua">';

    text += `<div class="tplt-tomtat">${huong ? "Liên thông yếu" : "Số thành phần liên thông"}: <b>${yeu.length}</b> ` +
        (yeu.length === 1
            ? '<span class="tplt-ok">✔ đồ thị liên thông' + (huong ? " yếu" : "") + "</span>"
            : '<span class="tplt-no">✖ đồ thị không liên thông' + (huong ? " yếu" : "") + "</span>") + "</div>";
    text += htmlDanhSachThanhPhan(yeu);

    if (huong) {
        const manh = thanhPhanLienThongManh();
        text += `<div class="tplt-tomtat" style="margin-top:12px">Liên thông mạnh: <b>${manh.length}</b> ` +
            (manh.length === 1
                ? '<span class="tplt-ok">✔ đồ thị liên thông mạnh</span>'
                : '<span class="tplt-no">✖ đồ thị không liên thông mạnh</span>') + "</div>";
        text += htmlDanhSachThanhPhan(manh);
    }
    text += "</div>";
    text += ghiChu(huong
        ? "Liên thông yếu: bỏ hướng các cạnh rồi xét. Liên thông mạnh: hai đỉnh u, v cùng thành phần khi đi được u→v và v→u. Đỉnh cô lập tự là một thành phần."
        : "Hai đỉnh cùng thành phần khi có đường đi nối chúng. Đỉnh cô lập (không có cạnh) tự là một thành phần.");
    return text;
}
