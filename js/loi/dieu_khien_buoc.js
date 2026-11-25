// =====================================================
// BỘ ĐIỀU KHIỂN TỪNG BƯỚC (dùng chung cho Euler, Kruskal, Prim, Dijkstra, Người phát thư và Đi hành trình)
// =====================================================
// 5 nút: ⏮ Về đầu · ◀ Bước trước · Bước tiếp ▶ · ⏩ Tự chạy · ⏸ Dừng
// Mỗi thuật toán chỉ cần đưa ra:  { max, delay, k0(), ap(j) }
//   max   : số bước tối đa (bước 0 = trạng thái ban đầu, bước max = kết quả cuối)
//   delay : thời gian giữa hai bước khi Tự chạy (ms)
//   k0()  : bước hiện tại suy ra từ phần đang tô màu (dùng khi trang vừa tải lại hoặc vừa bấm "Tô cả...")
//   ap(j) : DỰNG LẠI toàn bộ phần tô màu (eulerHL / krHL) đúng ở bước j (không dựa vào bước trước)
//           -> nhờ vậy đi lùi, nhảy về đầu hay đi tới đều dùng chung một hàm.
// Trạng thái: biến dk (null = chưa có mô phỏng). resetEuler() / resetKruskalHL() gọi dkHuy() nên sửa đồ thị là tự dừng.

let dk = null;   // { kieu, max, delay, ap, k, timer, daVe }

const DK_CAU_HINH = {
    euler:   () => taoDKEuler(),
    hanhtrinh: () => taoDKEuler("hanhtrinh"),   // đi hành trình ngay trong mục Người phát thư (nguoi_phat_thu.js)
    kruskal: () => taoDKKruskal(),
    prim:    () => taoDKPrim(),
    dijkstra: () => taoDKDijkstra(),
    npt:     () => taoDKNPT()
};

// Khung 5 nút để chèn vào bảng thông tin của từng thuật toán
function htmlDieuKhienBuoc(kieu) {
    const nut = (act, cls, txt) => `<button class="${cls}" data-act="${act}" onclick="dkLenh('${kieu}','${act}')">${txt}</button>`;
    return `<div class="dk-wrap" data-kieu="${kieu}"><div class="dk-count"></div><div class="dk-btns">` +
        nut("dau", "dk-dau", "⏮ Về đầu") +
        nut("truoc", "info", "◀ Bước trước") +
        nut("tiep", "success", "Bước tiếp ▶") +
        nut("chay", "success", "⏩ Tự chạy") +
        nut("dung", "danger", "⏸ Dừng") +
        "</div></div>";
}

// Cập nhật số bước và trạng thái bật/tắt của các nút (gọi sau mỗi lần đổi bước hoặc dựng lại bảng)
function capNhatNutDK() {
    document.querySelectorAll(".dk-wrap").forEach(w => {
        const hoatDong = !!dk && dk.kieu === w.dataset.kieu;
        const k = hoatDong ? dk.k : 0, chay = hoatDong && dk.timer !== null;
        const dat = (act, tat) => { const b = w.querySelector(`[data-act="${act}"]`); if (b) b.disabled = tat; };
        dat("dau", hoatDong && k === 0 && !chay);
        dat("truoc", !hoatDong || k === 0);
        dat("tiep", hoatDong && k >= dk.max);
        dat("chay", chay);
        dat("dung", !chay);
        w.querySelector(".dk-count").textContent = hoatDong
            ? `Bước ${k}/${dk.max}${chay ? " · đang tự chạy…" : k >= dk.max ? " · đã xong" : ""}`
            : "Chưa bắt đầu · bấm “Bước tiếp” hoặc “Tự chạy”";
    });
}

// Dừng tự chạy (giữ nguyên bước hiện tại)
function dkDung() {
    if (dk && dk.timer !== null) { clearInterval(dk.timer); dk.timer = null; }
    capNhatNutDK();
}

// Hủy hẳn mô phỏng (gọi từ resetKruskalHL → resetEuler)
function dkHuy() {
    if (dk) clearInterval(dk.timer);
    dk = null;
    nptHL = null;   // bỏ tô màu mô phỏng người phát thư (đồ thị giữ nguyên; muốn về đồ thị gốc dùng huyMoPhongNPT / traLaiDoThiGoc)
    capNhatNutDK();
}

// Tạo mô phỏng cho thuật toán `kieu`; trả về false nếu không chạy được (đã báo lỗi)
function dkKhoiTao(kieu) {
    // Đang mô phỏng người phát thư dở dang (đã thêm một phần cạnh lặp) mà chuyển sang thuật toán khác -> trả đồ thị về gốc trước
    if (dk && dk.kieu === "npt" && kieu !== "npt" && dk.k < dk.max) traLaiDoThiGoc(true);
    const d = DK_CAU_HINH[kieu]();
    if (!d) return false;
    const k0 = Math.max(0, Math.min(d.max, d.k0()));   // đọc trước khi resetEuler() xóa phần tô màu
    resetEuler();                                       // bỏ tô màu của loại khác + dkHuy()
    dk = { kieu, max: d.max, delay: d.delay, ap: d.ap, k: k0, timer: null, daVe: false };
    cuonDenDoThi();
    return true;
}

// Đi tới bước j: dựng lại phần tô màu rồi vẽ
function dkDen(j) {
    if (!dk) return;
    dk.k = Math.max(0, Math.min(dk.max, j));
    dk.daVe = true;
    dk.ap(dk.k);
    veDoThi();
    capNhatNutDK();
}

function dkTuChay() {
    if (dk.timer !== null) return;
    if (dk.k >= dk.max) dkDen(0);            // đã xong thì chạy lại từ đầu
    else if (!dk.daVe) dkDen(dk.k);          // lần đầu: hiện trạng thái ban đầu trước
    dk.timer = setInterval(() => {
        if (!dk) return;
        if (dk.k >= dk.max) { dkDung(); return; }
        dkDen(dk.k + 1);
        if (dk.k >= dk.max) dkDung();
    }, dk.delay);
    capNhatNutDK();
}

// Điểm vào duy nhất của 5 nút: act = dau | truoc | tiep | chay | dung
function dkLenh(kieu, act) {
    if (!dk || dk.kieu !== kieu) {
        if (act === "dung") return;
        if (!dkKhoiTao(kieu)) return;
    }
    if (act === "dung") return dkDung();
    if (act === "chay") return dkTuChay();
    dkDung();
    if (act === "dau") dkDen(0);
    else if (act === "truoc") dkDen(dk.k - 1);
    else if (act === "tiep") dkDen(dk.k + 1);
}
