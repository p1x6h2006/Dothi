// =====================================================
// TRẠNG THÁI DÙNG CHUNG: số đỉnh, danh sách cạnh, vị trí đỉnh, màu
// =====================================================
let n = 5, edges = [], nodes = {}, draggingNode = null;
let eulerHL = null;   // tô màu chu trình Euler (xem chu_trinh_euler.js): { order: {chỉ số cạnh: thứ tự}, cur: đỉnh hiện tại }
let npt = null, canhThemNPT = new Set(), nptThongBao = "";   // bài toán người phát thư (nguoi_phat_thu.js): kết quả, chỉ số cạnh đã thêm, dòng thông báo trên hình
let krHL = null;     // tô màu thuật toán Kruskal (kruskal.js): { chon: {chỉ số cạnh: thứ tự chọn}, loai: [chỉ số cạnh bị loại], msg }
let graphPalette = { ...PALETTES.light };
const loaiHienTai = () => parseInt($("loai").value);
// loai 1-3: vô hướng | loai 4-5: có hướng
const coHuong = () => loaiHienTai() >= 4;
