// =====================================================
// TRẠNG THÁI DÙNG CHUNG: số đỉnh, danh sách cạnh, vị trí đỉnh, màu
// =====================================================
let n = 5, edges = [], nodes = {}, draggingNode = null;
let eulerHL = null;   // tô màu chu trình Euler (xem chu_trinh_euler.js): { order: {chỉ số cạnh: thứ tự}, cur: đỉnh hiện tại }
let npt = null, canhThemNPT = new Set(), nptThongBao = "";   // bài toán người phát thư (nguoi_phat_thu.js): kết quả, chỉ số cạnh đã thêm, dòng thông báo trên hình
let nptHL = null;    // tô màu mô phỏng từng bước người phát thư (nguoi_phat_thu.js): { le: [đỉnh bậc lẻ], cur: [cặp đang ghép], xong: [đỉnh đã ghép xong], canhCur: [chỉ số cạnh vừa thêm], msg }
let krHL = null;     // tô màu cây khung, DÙNG CHUNG cho Kruskal (kruskal.js), Prim (prim.js) và Dijkstra (dijkstra.js; có thêm buoc, tam, cur, xam, nhan): { kieu: "kruskal"|"prim"|"dijkstra", chon: {chỉ số cạnh: thứ tự chọn}, loai: [chỉ số cạnh bị loại], tham: [đỉnh đã vào cây (Prim)], an: true = ẩn cạnh thừa, msg }
let pathHL = null;   // tô màu đường đi / chu trình đã chọn (duong_di.js): { canh: {chỉ số cạnh: "thứ tự đi"}, dinh: [đỉnh], idx: dòng kết quả, msg }
let graphPalette = { ...PALETTES.light };
const loaiHienTai = () => parseInt($("loai").value);
// loai 1-3: vô hướng | loai 4-5: có hướng
const coHuong = () => loaiHienTai() >= 4;
