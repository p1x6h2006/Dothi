// =====================================================
// GIAO DIỆN: tạo nút chọn loại, đổi theme, áp dụng màu, chuyển màn hình
// =====================================================
// Tạo nút chọn loại ở màn hình đầu và danh sách trong ô chọn
$("loaiGrid").innerHTML = TEN_LOAI.map((t, i) => `<button class="loai-btn" onclick="chonLoaiDoThi(${i + 1})">${EMOJI[i]} ${t}</button>`).join("");
$("loai").innerHTML = TEN_LOAI.map((t, i) => `<option value="${i + 1}">${i + 1}. ${t}</option>`).join("");

// [Mục] Đổi theme: gắn class lên <body> (CSS đổi biến màu) và nạp bảng màu PALETTES vào đồ thị
function chonGiaoDien(mode) {
    document.body.classList.remove("theme-dark", "theme-premium");
    if (mode !== "light") document.body.classList.add("theme-" + mode);
    ["light", "premium", "dark"].forEach(m => $(m + "ThemeBtn").classList.toggle("active", m === mode));
    graphPalette = { ...PALETTES[mode] };
    for (const k in COLOR_INPUTS) $(COLOR_INPUTS[k]).value = graphPalette[k];
    veDoThi();
}

// [Mục] Áp dụng 4 màu người dùng chọn (đỉnh, viền, cạnh, glow) rồi vẽ lại
function apDungMauDoThi() {
    for (const k in COLOR_INPUTS) graphPalette[k] = $(COLOR_INPUTS[k]).value;
    document.documentElement.style.setProperty("--primary", graphPalette.edge);
    document.documentElement.style.setProperty("--primary-dark", graphPalette.edge);
    veDoThi();
}

// [Mục] Đổi kiểu nhãn đỉnh/cạnh: "so" (0,1,2…) hoặc "chu" (a,b,c…). Chỉ đổi cách hiển thị, dữ liệu đồ thị giữ nguyên.
function chonKieuNhan(k) {
    kieuNhan = k === "chu" ? "chu" : "so";
    $("soNhanBtn").classList.toggle("active", kieuNhan === "so");
    $("chuNhanBtn").classList.toggle("active", kieuNhan === "chu");
    $("goiYNhan").textContent = kieuNhan === "chu" ? "Cạnh hiện dạng (A,B) · (C,D)… (nhập số hoặc chữ đều được)" : "Cạnh hiện dạng (0,1) · (2,3)… (nhập số hoặc chữ đều được)";
    if (!Object.keys(nodes).length) return;   // chưa có đồ thị: chỉ nhớ chế độ
    resetEuler();                              // bỏ tô Euler/Kruskal cũ (thông báo bước còn ghi nhãn kiểu cũ)
    veDoThi();
    hienThiThongTin();
}

// =========================================
// CHỌN LOẠI ĐỒ THỊ
// =========================================
function hieuUng(el, cls) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
}

function chonLoaiDoThi(loai) {
    hieuUng(document.querySelector(".chon-box"), "pulse-box");
    hieuUng(document.querySelector(`.loai-btn:nth-of-type(${loai})`), "flash");
    $("loai").value = loai;
    $("chonLoai").style.display = "none";
    $("manHinhChinh").style.display = "flex";
    $("loaiDangChon").textContent = $("loai").selectedOptions[0].textContent;
}
