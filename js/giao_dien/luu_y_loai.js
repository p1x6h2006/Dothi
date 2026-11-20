// =====================================================
// LƯU Ý LOẠI ĐỒ THỊ: mỗi chức năng / bài tập có một dòng “📌 Lưu ý” cho biết loại đồ thị nào dùng được
// =====================================================
// Nội dung lưu ý viết sẵn trong index.html (class "ap-dung"). Thuộc tính data-loai="1,2,3" liệt kê các loại được dùng;
// hàm dưới đây thêm một dòng trạng thái theo LOẠI ĐANG CHỌN: ✔ dùng được (xanh) hoặc ✖ không dùng được (đỏ).
//   Cả 5 loại   : Lưu/Reset, Phiên, Giao diện, Tạo đồ thị, Thêm/xóa/sửa cạnh, Chu trình Euler, Đường đi & chu trình
//   Loại 1-3    : Người phát thư (và Đi hành trình), Kruskal, Prim
//   Ví dụ/Bài tập (không có data-loai): luôn nạp thành loại 1, chỉ hiện chữ lưu ý.
// Gọi từ hienThiThongTin() (thong_tin.js) và chonLoaiDoThi() (doi_giao_dien.js) mỗi khi loại đồ thị đổi.

function capNhatLuuY() {
    const sel = $("loai");
    if (!sel) return;
    const loai = String(sel.value), ten = sel.selectedOptions[0] ? sel.selectedOptions[0].textContent : "loại " + loai;
    document.querySelectorAll(".ap-dung[data-loai]").forEach(note => {
        const dung = note.dataset.loai.split(",").map(x => x.trim()).includes(loai);
        let tt = note.querySelector(".ap-dung-tt");
        if (!tt) { tt = document.createElement("span"); tt.className = "ap-dung-tt"; note.appendChild(tt); }
        tt.className = "ap-dung-tt " + (dung ? "ok" : "khong");
        tt.textContent = dung ? ` ✔ Loại đang chọn (${ten}): dùng được.` : ` ✖ Loại đang chọn (${ten}): không dùng được, hãy đổi loại đồ thị.`;
    });
}
