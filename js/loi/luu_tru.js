// =====================================================
// PHIÊN ĐỒ THỊ + LƯU / KHÔI PHỤC / RESET (localStorage)
// =====================================================
// Mỗi PHIÊN = 1 đồ thị riêng. Bấm vào phiên nào thì đồ thị đó hiện ra.
// Mỗi phiên lưu: loại đồ thị, số đỉnh / số cạnh, cạnh, vị trí đỉnh, phần tô màu Euler, đỉnh bắt đầu Euler,
//                phần tô màu Kruskal, kết quả người phát thư (cạnh thêm màu xanh lá).
// Dùng chung cho mọi phiên: theme, 4 màu đồ thị, kiểu nhãn số / chữ.
// Khi nào lưu: tự động sau mỗi lần vẽ lại (veDoThi) / dựng lại thông tin (hienThiThongTin), khi tạo / chuyển phiên, khi thoát trang.
// Khi mở lại trang: tự khôi phục mọi phiên + phiên đang xem. Dữ liệu cũ (1 đồ thị, khóa v1) được chuyển thành "Phiên 1".
// Mô phỏng Euler đang chạy dở khi thoát / chuyển phiên: khôi phục đúng phần đã tô, KHÔNG tự chạy tiếp (bấm ▶ Mô phỏng để chạy lại).

const KHOA_LUU = "moPhongDoThi.v2";
const KHOA_CU = "moPhongDoThi.v1";
let kho = { v: 2, hien: null, phien: [], chung: null };   // phien[i] = { id, ten, d } (d = null: phiên chưa có đồ thị)
let luuHen = null;          // bộ đếm giờ gom nhiều lần vẽ lại thành 1 lần lưu
let sanSangLuu = false;     // chỉ cho lưu sau khi đã khôi phục xong (tránh ghi đè dữ liệu cũ bằng trạng thái rỗng)

const dangOManHinhChinh = () => $("manHinhChinh").style.display === "flex";
const themeHienTai = () => document.body.classList.contains("theme-dark") ? "dark" : document.body.classList.contains("theme-premium") ? "premium" : "light";
const taoIdPhien = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const phienHienTai = () => kho.phien.find(p => p.id === kho.hien);
const coDoThi = () => Object.keys(nodes).length > 0;

function ghiTrangThaiLuu(msg) {
    const t = $("luuTrangThai");
    if (t) t.textContent = msg;
}

// ---- Chụp trạng thái ----
// Đồ thị đang hiện (null nếu chưa tạo đồ thị)
const chupPhien = () => coDoThi() ? {
    loai: $("loai").value, soDinh: $("soDinh").value, soCanh: $("soCanh").value,
    n, edges, nodes, eulerHL, eulerStart, krHL,
    npt, canhThemNPT: [...canhThemNPT], nptThongBao
} : null;
const chupChung = () => ({ theme: themeHienTai(), palette: graphPalette, kieuNhan });

function capNhatPhienHienTai() {
    const p = phienHienTai();
    if (p) p.d = chupPhien();
}

function ghiKho() {
    kho.chung = chupChung();
    localStorage.setItem(KHOA_LUU, JSON.stringify(kho));
}

function luuNgay(hienThongBao) {
    clearTimeout(luuHen); luuHen = null;
    if (!sanSangLuu || !dangOManHinhChinh()) return;
    try {
        capNhatPhienHienTai();
        ghiKho();
        veDanhSachPhien();
        ghiTrangThaiLuu((hienThongBao ? "✔ Đã lưu lúc " : "Tự động lưu lúc ") + new Date().toLocaleTimeString("vi-VN"));
    } catch (err) {
        ghiTrangThaiLuu("⚠ Không lưu được (trình duyệt chặn hoặc hết dung lượng)");
    }
}

// Gọi sau mỗi lần vẽ lại: chờ 400 ms rồi mới lưu (kéo đỉnh vẽ liên tục nên không lưu từng khung hình)
function luuTuDong() {
    if (!sanSangLuu) return;
    clearTimeout(luuHen);
    luuHen = setTimeout(() => luuNgay(false), 400);
}

// ---- Áp dụng 1 phiên lên màn hình (d = null: phiên trống) ----
function apDungPhien(d) {
    resetEuler(); resetNguoiPhatThu(); resetKruskalHL(); eulerStart = null;   // bỏ mọi kết quả của phiên trước
    ["themX", "themY", "themW", "xoaX", "xoaY", "cuX", "cuY", "moiX", "moiY", "moiW"].forEach(id => { $(id).value = ""; });
    if (d && d.nodes && Object.keys(d.nodes).length) {
        $("loai").value = d.loai; capNhatTenLoai();
        $("soDinh").value = d.soDinh; $("soCanh").value = d.soCanh;
        n = d.n; edges = d.edges; nodes = d.nodes;
        eulerStart = d.eulerStart === undefined ? null : d.eulerStart;
        npt = d.npt || null;
        canhThemNPT = new Set(d.canhThemNPT || []);
        nptThongBao = d.nptThongBao || "";

        hienThiThongTin();                       // dựng bảng thông tin (khi đó eulerHL còn rỗng nên không bị xóa)
        eulerHL = d.eulerHL || null;             // rồi mới đặt lại phần tô màu Euler
        krHL = d.krHL || null;                   // và phần tô màu Kruskal
        veDoThi();
        if (eulerHL && eulerHL.msg) { const t = $("eulerStatus"); if (t) t.textContent = eulerHL.msg; }
        if (krHL && krHL.msg) { const t = $(krHL.kieu === "prim" ? "primStatus" : "krStatus"); if (t) t.textContent = krHL.msg; }
    } else {
        n = 5; edges = []; nodes = {};
        $("soDinh").value = 5; $("soCanh").value = 5;
        svg.innerHTML = "";
        $("thongTin").textContent = "Chưa có đồ thị";
    }
}

// ---- Danh sách phiên (khung Điều khiển) ----
function veDanhSachPhien() {
    const kv = $("danhSachPhien");
    if (!kv) return;
    kv.innerHTML = "";
    kho.phien.forEach(p => {
        const b = document.createElement("button");
        b.className = "phien-item" + (p.id === kho.hien ? " active" : "");
        const d = p.id === kho.hien ? chupPhien() : p.d;
        const ten = document.createElement("span"); ten.className = "phien-ten"; ten.textContent = p.ten;
        const info = document.createElement("small"); info.textContent = d ? `${d.n} đỉnh · ${d.edges.length} cạnh` : "chưa có đồ thị";
        b.append(ten, info);
        b.addEventListener("click", () => chuyenPhien(p.id));
        kv.appendChild(b);
    });
}

function chuyenPhien(id) {
    if (id === kho.hien) return;
    const p = kho.phien.find(x => x.id === id);
    if (!p) return;
    clearTimeout(luuHen); luuHen = null;
    capNhatPhienHienTai();                 // lưu phiên đang xem trước khi rời (kể cả phần tô màu Euler / Kruskal)
    kho.hien = id;
    apDungPhien(p.d);
    veDanhSachPhien();
    luuNgay(false);
}

function tenPhienMacDinh() {
    let i = kho.phien.length + 1;
    while (kho.phien.some(p => p.ten === "Phiên " + i)) i++;
    return "Phiên " + i;
}

// [Mục] PHIÊN MỚI: lưu phiên đang xem, tạo phiên trống và chuyển sang đó
function phienMoi() {
    const t = prompt("Tên phiên mới:", tenPhienMacDinh());
    if (t === null) return;
    clearTimeout(luuHen); luuHen = null;
    capNhatPhienHienTai();
    const p = { id: taoIdPhien(), ten: t.trim() || tenPhienMacDinh(), d: null };
    kho.phien.push(p);
    kho.hien = p.id;
    apDungPhien(null);
    veDanhSachPhien();
    luuNgay(false);
    ghiTrangThaiLuu(`Đã tạo "${p.ten}". Nhập số đỉnh, số cạnh rồi bấm Tạo đồ thị.`);
}

function doiTenPhien() {
    const p = phienHienTai();
    if (!p) return;
    const t = prompt("Tên mới của phiên:", p.ten);
    if (t === null || !t.trim()) return;
    p.ten = t.trim();
    luuNgay(false);
    veDanhSachPhien();
}

function xoaPhien() {
    const p = phienHienTai();
    if (!p) return;
    if (!confirm(`Xóa phiên "${p.ten}" cùng đồ thị của nó? Không thể hoàn tác.`)) return;
    clearTimeout(luuHen); luuHen = null;
    const i = kho.phien.indexOf(p);
    kho.phien.splice(i, 1);
    if (!kho.phien.length) kho.phien.push({ id: taoIdPhien(), ten: "Phiên 1", d: null });
    const ke = kho.phien[Math.min(i, kho.phien.length - 1)];
    kho.hien = ke.id;
    apDungPhien(ke.d);
    veDanhSachPhien();
    luuNgay(false);
}

// ---- Khôi phục khi mở lại trang ----
function docKho() {
    try {
        const k = JSON.parse(localStorage.getItem(KHOA_LUU));
        if (k && k.v === 2 && Array.isArray(k.phien) && k.phien.length) return k;
    } catch (err) { /* bỏ qua */ }
    // dữ liệu cũ (1 đồ thị, khóa v1) -> "Phiên 1"
    try {
        const c = JSON.parse(localStorage.getItem(KHOA_CU));
        if (c && c.v === 1 && Array.isArray(c.edges) && c.nodes) {
            const { theme, palette, kieuNhan: kn, v, ...d } = c;
            return { v: 2, hien: "p1", chung: { theme, palette, kieuNhan: kn }, phien: [{ id: "p1", ten: "Phiên 1", d }] };
        }
    } catch (err) { /* bỏ qua */ }
    return null;
}

function khoiPhuc() {
    const k = docKho();
    if (!k) {   // lần đầu: 1 phiên trống, ở lại màn hình chọn loại
        kho = { v: 2, hien: "p1", phien: [{ id: "p1", ten: "Phiên 1", d: null }], chung: null };
        veDanhSachPhien();
        return false;
    }
    try {
        kho = k;
        if (!phienHienTai()) kho.hien = kho.phien[0].id;
        $("chonLoai").style.display = "none";
        $("manHinhChinh").style.display = "flex";

        const c = kho.chung || {};
        chonKieuNhan(c.kieuNhan || "so");            // nhãn số / chữ (nodes còn rỗng nên chỉ đặt chế độ, chưa vẽ)
        chonGiaoDien(c.theme || "light");            // đổi theme trước, rồi mới ghi đè bằng màu người dùng đã chọn
        graphPalette = { ...graphPalette, ...c.palette };
        for (const key in COLOR_INPUTS) $(COLOR_INPUTS[key]).value = graphPalette[key];
        if (c.theme !== "light" || JSON.stringify(c.palette) !== JSON.stringify(PALETTES.light)) {
            document.documentElement.style.setProperty("--primary", graphPalette.edge);
            document.documentElement.style.setProperty("--primary-dark", graphPalette.edge);
        }
        const d = phienHienTai().d;
        if (d) { $("loai").value = d.loai; capNhatTenLoai(); }
        apDungPhien(d);
        veDanhSachPhien();
        ghiTrangThaiLuu("Đã khôi phục " + kho.phien.length + " phiên đã lưu");
        return true;
    } catch (err) {
        console.error("Không khôi phục được dữ liệu đã lưu:", err);
        return false;
    }
}

// [Mục] RESET: xóa đồ thị của PHIÊN ĐANG XEM (các phiên khác giữ nguyên), đưa màu, theme và nhãn về mặc định
function resetDoThi() {
    if (!confirm("Reset sẽ xóa đồ thị của phiên đang xem và đưa màu, giao diện, nhãn về mặc định. Các phiên khác giữ nguyên. Bạn chắc chắn chứ?")) return;
    clearTimeout(luuHen); luuHen = null;
    apDungPhien(null);
    chonGiaoDien("light");                           // về theme và 4 màu mặc định
    chonKieuNhan("so");                              // và về nhãn số
    document.documentElement.style.removeProperty("--primary");
    document.documentElement.style.removeProperty("--primary-dark");
    veDanhSachPhien();
    luuNgay(false);
    ghiTrangThaiLuu("Đã reset phiên đang xem");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Lưu nốt khi đóng / ẩn trang
window.addEventListener("beforeunload", () => luuNgay(false));
document.addEventListener("visibilitychange", () => { if (document.hidden) luuNgay(false); });
