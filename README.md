<div align="center">

# 🕸️ Mô Phỏng Đồ Thị

**Ứng dụng web mô phỏng trực quan 5 loại đồ thị, ma trận, danh sách kề, chu trình Euler và bài toán người phát thư.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![SVG](https://img.shields.io/badge/SVG-FFB13B?style=for-the-badge&logo=svg&logoColor=black)

</div>

---

## 📑 Mục lục

1. [Tính năng nổi bật](#-tính-năng-nổi-bật)
2. [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
3. [Năm loại đồ thị](#-năm-loại-đồ-thị)
4. [Chi tiết từng file](#-chi-tiết-từng-file)
5. [Danh sách kề](#-danh-sách-kề)
6. [Chu trình Euler](#-chu-trình-euler)
7. [Bài toán người phát thư](#-bài-toán-người-phát-thư)
8. [Lưu và Reset](#-lưu-và-reset)
9. [Tối ưu hiệu năng](#-tối-ưu-hiệu-năng)
10. [Tìm nhanh trong code](#-tìm-nhanh-trong-code)

---

## ✨ Tính năng nổi bật

| Tính năng | Mô tả |
|-----------|-------|
| 🎯 **5 loại đồ thị** | Đơn / đa / giả đồ thị vô hướng và đơn / đa đồ thị có hướng |
| ✏️ **Chỉnh sửa cạnh** | Thêm, xóa, sửa cạnh (có hỗ trợ trọng số) |
| 🖱️ **Kéo thả đỉnh** | Vẽ bằng SVG, kéo đỉnh bằng chuột |
| 🔢 **Ma trận** | Ma trận kề và ma trận trọng số |
| 📋 **Danh sách kề** | Hiển thị dạng `[đỉnh] → [kề] → [kề] → NULL` |
| 🔤 **Nhãn số / chữ** | Nút “Nhãn số / Nhãn chữ” đổi cách hiện đỉnh và cạnh: `(0,1)` ⇄ `(A,B)` ở hình vẽ, bảng, lời giải |
| 🔄 **Chu trình Euler** | Kiểm tra, tìm và mô phỏng từng bước |
| 📮 **Người phát thư** | Tìm hành trình ngắn nhất qua mọi cạnh, mô phỏng từng bước và **🚶 đi hành trình ngay trong mục này** |
| 📌 **Lưu ý loại đồ thị** | Mỗi chức năng và bài tập có một dòng “Lưu ý” cho biết loại đồ thị nào dùng được, kèm trạng thái ✔ / ✖ theo loại đang chọn |
| 🌲 **Kruskal** | Cây khung nhỏ nhất: bảng cạnh đã sắp xếp, cạnh chọn/loại, xem từng bước, tô cây khung, nạp ví dụ 33 và bài tập 37 |
| 🌳 **Prim** | Cây khung nhỏ nhất: chọn đỉnh xuất phát, bảng cạnh ứng viên từng bước, xem từng bước, tô cây khung (xóa cạnh thừa), hủy mô phỏng |
| 🎨 **3 giao diện** | Light, Premium, Neon |
| 💾 **Tự động lưu** | Lưu vào `localStorage`, mở lại là có ngay |
| 🗂️ **Phiên đồ thị** | Mỗi phiên là 1 đồ thị riêng (➕ Phiên mới, ✏️ Đổi tên, 🗑️ Xóa); bấm vào phiên nào thì đồ thị đó hiện ra |

---

## 📁 Cấu trúc thư mục

```text
Dothi/
├── index.html              # Giao diện: màn hình chọn loại + màn hình chính
├── chu-thich.txt           # Bản chú thích gốc
├── css/
│   └── style.css           # Toàn bộ giao diện (3 theme: Light, Premium, Neon)
└── js/
    ├── chinh.js            # Khởi động (nạp sau cùng): khôi phục dữ liệu đã lưu
    ├── dung_chung/         # DÙNG CHUNG: mọi file khác đều dùng tới
    │   ├── cau_hinh.js     # Hằng số, tên 5 loại đồ thị, bảng màu
    │   ├── trang_thai.js   # Biến trạng thái dùng chung
    │   └── kiem_tra.js     # Kiểm tra dữ liệu nhập
    ├── giao_dien/          # GIAO DIỆN: theme, màu, hiệu ứng
    │   ├── doi_giao_dien.js      # Chọn loại, đổi theme, áp dụng màu
    │   ├── thanh_nut.js          # Thanh nút góc phải trên theo chức năng đang chọn
    │   ├── luu_y_loai.js         # Dòng “📌 Lưu ý”: chức năng / bài tập nào dùng được cho loại đồ thị nào
    │   ├── cuon_ket_qua.js       # Bấm chức năng ở khung trái -> khung phải tự cuộn tới kết quả (thuộc tính data-kq trong index.html)
    │   └── hieu_ung_phi_kiem.js  # Hiệu ứng nền phi kiếm bay (canvas)
    ├── loi/                # LÕI: dựng đồ thị, vẽ, lưu
    │   ├── chinh_sua_canh.js     # Tạo đồ thị, thêm / xóa / sửa cạnh
    │   ├── ve_do_thi.js          # Vẽ đồ thị bằng SVG, kéo đỉnh
    │   └── luu_tru.js            # Phiên đồ thị + tự động lưu / khôi phục / reset (localStorage)
    └── chuc_nang/          # CHỨC NĂNG: các bài toán và cách hiển thị
        ├── bieu_dien/
        │   ├── ma_tran.js        # Ma trận kề, ma trận trọng số
        │   ├── danh_sach_ke.js   # Danh sách kề
        │   └── thong_tin.js      # Danh sách đỉnh/cạnh, bậc của đỉnh
        ├── chu_trinh_euler.js    # Chu trình Euler (kiểm tra, tìm, mô phỏng)
        ├── nguoi_phat_thu.js     # Bài toán người phát thư
        ├── kruskal.js            # Thuật toán Kruskal (cây khung nhỏ nhất, vô hướng)
        ├── prim.js               # Thuật toán Prim (cây khung nhỏ nhất, vô hướng)
        ├── duong_di.js           # Đường đi & chu trình: tìm theo đỉnh xuất phát / đích, bấm kết quả để tô lên đồ thị
        └── cach_giai.js          # Cách giải chi tiết (khung bấm mới xổ ra) cho từng mục
```

> ⚠️ **Thứ tự nạp script trong `index.html` (không được đổi):**
>
> ```text
> cau_hinh → trang_thai → kiem_tra → doi_giao_dien → chinh_sua_canh → ve_do_thi → ma_tran → danh_sach_ke → chu_trinh_euler → nguoi_phat_thu → kruskal → cach_giai → thanh_nut → luu_y_loai → thong_tin → luu_tru → chinh
> ```

---

## 🧩 Năm loại đồ thị

Biến `loai` nhận giá trị từ `1` đến `5`.

| `loai` | Tên | Hướng | Vòng khuyên | Cạnh song song | Ghi chú |
|:------:|-----|:-----:|:-----------:|:--------------:|---------|
| **1** | Đơn đồ thị vô hướng | Vô hướng | ❌ | ❌ | Không mũi tên |
| **2** | Đa đồ thị vô hướng | Vô hướng | ❌ | ✅ | |
| **3** | Giả đồ thị vô hướng | Vô hướng | ✅ | ✅ | Nhiều vòng trên 1 đỉnh |
| **4** | Đơn đồ thị có hướng | Có hướng | ❌ | ❌ | `x→y` và `y→x` là 2 cạnh khác nhau, nhập được cả hai |
| **5** | Đa đồ thị có hướng | Có hướng | ❌ | ✅ (cùng chiều) | Có mũi tên |

> `loai` 1–3 là **vô hướng**, `loai` 4–5 là **có hướng** (hàm `coHuong()` trong `js/dung_chung/trang_thai.js`).

---

## 📚 Chi tiết từng file

<details>
<summary><b>📄 index.html</b></summary>

- `#chonLoai`: màn hình đầu, các nút chọn 1 trong 5 loại.
- `#manHinhChinh`: màn hình chính.
- Khung **Điều khiển** (bên trái): chọn loại, theme, màu đỉnh/cạnh, số đỉnh, số cạnh, nút *Tạo đồ thị*, thêm / xóa / sửa cạnh, sắp xếp lại.
- Khung **graph-area** (bên phải): `<svg id="svg">` để vẽ đồ thị và `<div id="thongTin">` để hiện danh sách, bậc, ma trận.

</details>

<details>
<summary><b>⚙️ js/dung_chung/cau_hinh.js</b></summary>

| Tên | Công dụng |
|-----|-----------|
| `$` | Viết tắt của `document.getElementById` |
| `TEN_LOAI` | Tên 5 loại đồ thị |
| `EMOJI` | Biểu tượng số trên nút chọn loại |
| `PALETTES` | Bảng màu cho 3 theme (node, border, edge, glow) |
| `COLOR_INPUTS` | Liên kết màu với các ô chọn màu |

</details>

<details>
<summary><b>🧠 js/dung_chung/trang_thai.js</b></summary>

| Biến / hàm | Công dụng |
|------------|-----------|
| `n` | Số đỉnh hiện tại |
| `edges` | Danh sách cạnh, mỗi cạnh dạng `{x, y}` hoặc `{x, y, w}` |
| `nodes` | Vị trí `(x, y)` của từng đỉnh trên màn hình |
| `draggingNode` | Đỉnh đang được kéo bằng chuột |
| `graphPalette` | Màu đang dùng để vẽ |
| `loaiHienTai()`, `coHuong()` | Loại đang chọn, có hướng hay không |

</details>

<details>
<summary><b>✅ js/dung_chung/kiem_tra.js</b></summary>

- `kiemTraDinh`: đỉnh phải là số nguyên từ `0` đến `n-1`.
- `kiemTraCanh`: trả về chuỗi lỗi hoặc `null` nếu hợp lệ.
  - Vòng khuyên (`x = y`) chỉ cho phép ở `loai 3`.
  - Cạnh trùng chỉ bị chặn ở đơn đồ thị (`loai 1, 4`).
- `docTrongSo`: để trống → `undefined`, không phải số → `NaN`.
- `taoCanh`: tạo đối tượng cạnh (có hoặc không có trọng số).

</details>

<details>
<summary><b>🎛️ js/giao_dien/doi_giao_dien.js</b></summary>

- Tạo các nút chọn loại và danh sách chọn loại.
- `chonGiaoDien(mode)`: đổi theme `light` / `premium` / `dark`.
- `apDungMauDoThi()`: áp dụng 4 màu người dùng chọn.
- `chonLoaiDoThi(loai)`: vào màn hình chính với loại đã chọn.
- `hieuUng()`: hiệu ứng nhấp nháy khi bấm.

</details>

<details>
<summary><b>🔗 js/loi/chinh_sua_canh.js</b></summary>

- `taoDoThi()`: hỏi từng cạnh bằng hộp thoại (dạng `x y` hoặc `x y w`), kiểm tra, rồi dựng đồ thị mới.
- `capNhat()`: vẽ lại và cập nhật thông tin.
- `themCanh()`: thêm cạnh theo luật của loại đang chọn.
- `timCanh()`: tìm cạnh khớp đúng thứ tự `(x, y)`.
- `xoaCanh()`: xóa 1 cạnh. Đồ thị vô hướng phải nhập đúng thứ tự đã thêm (`x y`), nhập `y x` sẽ báo không tìm thấy.
- `suaCanh()`: đổi đỉnh / trọng số của cạnh (trọng số trống = giữ cũ).

</details>

<details>
<summary><b>🖌️ js/loi/ve_do_thi.js</b></summary>

- `sapXep()`: xếp các đỉnh đều trên một vòng tròn.
- `el()`: hàm tạo phần tử SVG.
- `veDoThi()`: xóa và vẽ lại toàn bộ (cạnh trước, đỉnh sau).
- `veCanh()`: vẽ 1 cạnh.
  - **Vòng khuyên**: elip phía trên đỉnh; vòng thứ 2, 3... to dần lên.
  - **Cạnh song song**: cong ra hai bên để không chồng nhau. Cạnh ngược chiều `(1,4)` và `(4,1)` cũng tách thành 2 đường cong riêng.
  - **Có hướng**: thêm mũi tên, đầu mũi tên nằm ngoài đỉnh.
  - **Nhãn**: `(x,y)` hoặc `(x,y) · w` ở giữa cạnh.
- `veDinh()`: vẽ hình tròn đỉnh + số hiệu, kéo được bằng chuột.
- Sự kiện `mousemove` / `mouseup`: kéo thả đỉnh.

</details>

<details>
<summary><b>🔢 js/chuc_nang/bieu_dien/ma_tran.js</b></summary>

- `bangMa()`: vẽ ma trận `n × n` thành bảng HTML.
- `htmlMaTranKe()`: ma trận kề, ô `[i][j]` = số cạnh nối `i` với `j`.
  - Vô hướng: đối xứng; vòng khuyên ghi `1` trên đường chéo.
  - Có hướng: hàng = đỉnh xuất phát, cột = đỉnh đích.
- `htmlMaTranTrongSo()`: `0` khi `i` trùng `j`; `w` nếu có cạnh; `∞` nếu không.
  - Cạnh không nhập trọng số tính `w = 1`.
  - Nhiều cạnh song song lấy trọng số nhỏ nhất.
  - Vòng khuyên bị bỏ qua.

</details>

<details>
<summary><b>ℹ️ js/chuc_nang/bieu_dien/thong_tin.js</b></summary>

- `htmlDinhCanh()`: liệt kê đỉnh và cạnh (`e1`, `e2`, ...).
- `htmlBac()`: bậc của đỉnh.
  - Vô hướng: vòng khuyên tính bậc 2; liệt kê đỉnh treo (bậc 1) và đỉnh cô lập (bậc 0).
  - Có hướng: `deg = deg⁻ + deg⁺`, kèm bảng bán bậc ra / bán bậc vào.
- `hienThiThongTin()`: ghép danh sách + bậc + 2 ma trận vào khung thông tin.

</details>

<details>
<summary><b>🎨 css/style.css</b></summary>

- Biến màu `:root` cho theme **Light**; `body.theme-premium` và `body.theme-dark` ghi đè cho 2 theme còn lại.
- Các nhóm: màn hình chọn loại, khung điều khiển, vùng vẽ SVG (`.node`, `.edge`, `.edge-label`), bảng ma trận, bảng bán bậc.

</details>

---

## 📋 Danh sách kề

Với **mỗi đỉnh**, lưu danh sách các đỉnh kề với nó.

```text
[0] → [1] → [2] → NULL
[1] → [0] → [2] → NULL
[2] → [0] → [1] → NULL
```

Hiển thị nằm giữa phần **Bậc** và **Ma trận kề**.

**File `js/chuc_nang/bieu_dien/danh_sach_ke.js`**

- `xayDanhSachKe()`: dựng dữ liệu từ mảng `edges` (xếp tăng dần).
- `htmlDanhSachKe()`: vẽ HTML + ghi chú giải thích theo loại đồ thị.

**Cách lưu theo loại**

| `loai` | Loại đồ thị | Cách lưu |
|:------:|-------------|----------|
| 1 | Đơn vô hướng | 2 chiều, không trùng |
| 2 | Đa vô hướng | 2 chiều, đỉnh kề lặp lại nếu có cạnh song song |
| 3 | Giả vô hướng | Như `loai 2`; vòng khuyên `x-x` ghi 2 lần (bậc 2) |
| 4 | Đơn có hướng | 1 chiều (`x→y` chỉ lưu `y` trong danh sách của `x`) |
| 5 | Đa có hướng | 1 chiều, đỉnh kề lặp lại nếu có cạnh song song |

> 💡 **Kiểm tra nhanh:** tổng phần tử = `2 × số cạnh` (vô hướng) hoặc `= số cạnh` (có hướng).
>
> Có trọng số: ô kề hiện thêm `w=...`; di chuột vào ô để xem đó là cạnh `e` mấy.

**CSS:** nhóm `.adj-list-wrap` / `.adj-row` / `.adj-head` / `.adj-node` / `.adj-arrow` / `.adj-null`.

---

## 🔄 Chu trình Euler

**Chu trình Euler:** đi qua **mỗi cạnh đúng 1 lần** rồi quay về đỉnh xuất phát.

**Điều kiện** (xét trên các đỉnh có cạnh, đỉnh cô lập bị bỏ qua):

| Loại | Điều kiện |
|------|-----------|
| `loai 1–3` (vô hướng) | Liên thông **và** mọi đỉnh có bậc chẵn (vòng khuyên tính bậc 2) |
| `loai 4–5` (có hướng) | Liên thông yếu **và** mọi đỉnh có `deg⁺ = deg⁻` |

**File `js/chuc_nang/chu_trinh_euler.js`**

| Hàm | Công dụng |
|-----|-----------|
| `phanTichEuler()` | Kiểm tra điều kiện; nếu thỏa thì tìm chu trình bằng thuật toán **Hierholzer** (đánh dấu cạnh đã dùng theo số thứ tự cạnh nên đúng với cạnh song song và vòng khuyên). Nếu không thỏa: trả về lý do, và báo thêm nếu có **đường đi Euler** (2 đỉnh bậc lẻ / lệch bậc ra-vào) |
| `htmlEuler()` | Vẽ phần kết quả (nằm cuối khung thông tin, sau ma trận trọng số) |
| `taoDKEuler()` | Đưa cho bộ điều khiển từng bước (`dieu_khien_buoc.js`) số bước và hàm dựng lại phần tô màu ở bước j. Điều khiển bằng 5 nút ⏮ Về đầu · ◀ Bước trước · Bước tiếp ▶ · ⏩ Tự chạy (0,8 giây/cạnh) · ⏸ Dừng. Lần đầu bấm sẽ **tự cuộn** lên chỗ đồ thị (`cuonDenDoThi`); lời giải thích từng bước hiện trên hình (góc trên trái) và ở khung thông tin |
| `hienEuler()` | Tô cả chu trình một lần |
| `huyEuler()` | Nút **✖ Hủy mô phỏng**: dừng chạy, bỏ tô màu, tự cuộn lên chỗ đồ thị |
| `doiDinhEuler()` | Chọn đỉnh bắt đầu (mặc định: đỉnh nhỏ nhất có cạnh) |
| `resetEuler()` | Dừng mô phỏng, bỏ tô màu (tự gọi khi thêm/xóa/sửa cạnh, tạo đồ thị mới) |

**Tô màu trên hình:** biến `eulerHL` (`trang_thai.js`), được `ve_do_thi.js` đọc trong `veCanh()` và `veDinh()`.

**CSS:** nhóm `.euler-wrap` / `.euler-yes` / `.euler-no` / `.euler-seq` / `.euler-v` / `.euler-e` / `.euler-btns`.

### 🚀 Euler = hành trình ngắn nhất

- **Đồ thị vô hướng** liên thông nhưng có đỉnh bậc lẻ: không chỉ báo "Không có chu trình Euler" nữa. Vẫn nêu lý do, rồi **tự tính hành trình ngắn nhất** đi qua mọi cạnh rồi quay về (dùng lại `tinhNguoiPhatThu()` của `nguoi_phat_thu.js`): hiện dãy đỉnh - cạnh (cạnh phải đi lặp có dấu `*`), độ dài = `Σw(e) + m(G)`.
- Bấm **Mô phỏng** / **Tô cả chu trình**: tự thêm các cạnh lặp (xanh lá) vào đồ thị (`apDungPhanHoach` của phân hoạch nhỏ nhất) rồi đi theo hành trình (`chuanBiEuler`). Bấm **Trả lại đồ thị gốc** ở mục Người phát thư để về đồ thị ban đầu.
- Đồ thị đã có chu trình Euler: hiện thêm độ dài hành trình = `Σw(e)` (cạnh không có `w` tính 1).
- **Đồ thị có hướng** không có chu trình Euler: vẫn chỉ báo lý do (chưa hỗ trợ hành trình ngắn nhất cho đồ thị có hướng).
- Giới hạn như người phát thư: không trọng số âm, tối đa 12 đỉnh bậc lẻ.

---

## 📮 Bài toán người phát thư

Tìm hành trình **ngắn nhất** đi qua mọi cạnh ít nhất 1 lần rồi quay về đỉnh đầu (đồ thị vô hướng, `loai 1–3`).

**Các bước hiển thị** (đúng như bài mẫu trên lớp):

| Bước | Nội dung |
|:----:|----------|
| 1 | `Σw(e)`: tổng trọng số (cạnh không có `w` tính `w = 1`) |
| 2 | `V_o(G)`: các đỉnh bậc lẻ. Rỗng → đã có chu trình Euler, `m(G) = 0` |
| 3 | `P = {P1, P2, ...}`: các phân hoạch cặp của `V_o(G)`; `d(Pi)` = tổng khoảng cách ngắn nhất của các cặp (**Floyd–Warshall**, có dựng lại đường đi: *"Nối qua: [a→b→c]"*) |
| 4 | `m(G) = min d(Pi)`; **Tổng chiều dài = Σw(e) + m(G)** |

**File `js/chuc_nang/nguoi_phat_thu.js`**

| Hàm | Công dụng |
|-----|-----------|
| `giaiNguoiPhatThu()` | Nút *"Phân tích & giải bài toán"* (khung Điều khiển), tự nhảy xuống bảng kết quả |
| `tinhNguoiPhatThu()` | Tính và lưu vào `npt` (`trang_thai.js`) |
| `cacPhanHoachCap()` | Ghép cặp |
| `apDungPhanHoach(i)` | Nút *"Xem Pi"* / *"Tự động thêm cạnh & vẽ lại đồ thị"*: đồ thị = gốc + các cạnh sao chép dọc đường đi ngắn nhất của từng cặp (vẽ màu **xanh lá**), rồi nhảy lên đồ thị. Cạnh thêm là cạnh song song nên `loai 1` tự đổi sang `loai 2`. Sau đó mọi đỉnh bậc chẵn → mục Chu trình Euler báo "Có" và mô phỏng được |
| `traLaiDoThiGoc()` | Khôi phục cạnh và loại đồ thị ban đầu |
| `resetNguoiPhatThu()` | Xóa kết quả (tự gọi khi thêm/xóa/sửa cạnh hoặc tạo đồ thị mới) |

**Giới hạn**

- Không có trọng số âm.
- Đồ thị phải liên thông.
- Tối đa 12 đỉnh bậc lẻ. Quá 6 đỉnh lẻ (hơn 15 phân hoạch) chỉ hiện phân hoạch nhỏ nhất.

**Mô phỏng từng bước** (nút **🎬 Mô phỏng từng bước** ở khung Điều khiển, hoặc 5 nút ⏮ ◀ ▶ ⏩ ⏸ trong bảng kết quả; `taoDKNPT()` kiểu `"npt"` trong `dieu_khien_buoc.js`):

| Bước | Nội dung |
|---|---|
| 0 | Đồ thị gốc, Σw(e) |
| 1 | Tô cam các đỉnh bậc lẻ V<sub>o</sub>(G) (không có đỉnh lẻ thì dừng ở đây: đã có chu trình Euler) |
| 2 | Chọn phân hoạch P<sub>i</sub> nhỏ nhất (hoặc phân hoạch đang xem) và d(P<sub>i</sub>) |
| 3 … K+2 | Ghép từng cặp: cặp đang ghép viền hồng, thêm các cạnh sao chép (hồng khi vừa thêm, sau đó xanh lá), đỉnh đã ghép xong viền xanh lá |
| K+3 | Xong: mọi đỉnh bậc chẵn, tổng = Σw(e) + m(G); bấm **🚶 Đi hành trình** ngay bên dưới để đi hành trình |

- Mỗi bước dựng lại đồ thị = gốc (`npt.goc`) + cạnh sao chép của các cặp đã ghép, nên đi lùi / về đầu đều đúng; bảng bậc, ma trận, Euler... đổi theo từng bước.
- Tô màu bằng biến `nptHL` (`trang_thai.js`), vẽ trong `ve_do_thi.js` (`mauVienNPT`, cạnh `vuaThem`). Lời giải thích hiện ở góc trên trái hình và dưới nút điều khiển.
- **✖ Hủy mô phỏng** trả lại đồ thị gốc. Chuyển sang mô phỏng Euler / Kruskal / Prim khi đang dở dang cũng tự trả về đồ thị gốc.

**🚶 Đi hành trình ngay trong mục này** (không cần sang mục Chu trình Euler): ở cuối khung Điều khiển của mục *Bài toán người phát thư* có khối **🚶 Đi hành trình** gồm ô chọn **đỉnh bắt đầu**, nút **Tô cả hành trình** và 5 nút ⏮ ◀ ▶ ⏩ ⏸ (kiểu `"hanhtrinh"` trong `dieu_khien_buoc.js`).

- Dùng lại thuật toán Hierholzer của `chu_trinh_euler.js` (`taoDKEuler("hanhtrinh")`, `hienEuler("hanhtrinh")`), nên hành trình giống hệt mục Euler; hai mục dùng chung đỉnh bắt đầu (`eulerStart`).
- Chưa thêm cạnh lặp thì tự thêm theo phân hoạch nhỏ nhất (cạnh xanh lá). Đã bấm *Xem Pi* thì đi theo đúng Pi đang xem; đổi sang Pi khác khi đang đi thì hành trình bắt đầu lại từ bước 0.
- Đồ thị đã có chu trình Euler (mọi đỉnh bậc chẵn) thì đi thẳng, không thêm cạnh. Đồ thị không liên thông, có trọng số âm hoặc quá 12 đỉnh lẻ thì khối này hiện lý do thay vì nút.
- Lời giải thích từng bước hiện ở `#htStatus` và ở góc trên trái hình (`eulerHL.kenh = "hanhtrinh"`). Kết quả bên phải có thêm **mục 5. Hành trình** (dãy đỉnh – cạnh, cạnh lặp có dấu `*`).
- Thanh nút góc phải trên của mục này có thêm **Tô cả hành trình**; **✖ Hủy mô phỏng** bỏ tô màu và trả đồ thị về gốc.
- Chỉ dùng cho `loai 1–3`.

**CSS:** nhóm `.npt-wrap` / `.npt-card` / `.npt-best` / `.npt-m` / `.npt-total` / `.npt-btns` / `.npt-ht`.

---

## 🛤️ Đường đi & chu trình

File: `js/chuc_nang/duong_di.js` (giao diện: mục “Đường đi & chu trình” ở khung Điều khiển; tô màu dùng biến `pathHL` trong `trang_thai.js`, vẽ ở `ve_do_thi.js`).

Chọn loại, nhập **đỉnh xuất phát** và **đỉnh đích** (số hoặc chữ), bấm **Tìm kiếm**. Danh sách kết quả hiện bên dưới (tối đa 100, sắp theo số cạnh tăng dần); **bấm vào một dòng** để tô đường đó lên đồ thị (màu cam, số `#k` trên cạnh là thứ tự đi), bấm **Xóa tô màu** để bỏ. Cạnh không có trọng số tính w = 1. Dùng được cho cả 5 loại đồ thị (đa đồ thị: các cạnh song song là các kết quả khác nhau, có ghi thêm `[e1,e4]`).

| Loại | Ý nghĩa | Thuật toán |
|------|---------|-----------|
| Đường đi sơ cấp / Chu trình sơ cấp | không lặp đỉnh (chu trình chỉ lặp đỉnh đầu = cuối) | DFS quay lui |
| Đường đi đơn / Chu trình đơn | không lặp cạnh (được lặp đỉnh) | DFS quay lui |
| Đường đi chung / Chu trình chung | cho phép lặp đỉnh và cạnh (có thể vô hạn, lấy 100 kết quả ngắn nhất) | BFS theo độ dài |
| Ngắn nhất theo số cạnh / theo tổng trọng số | mọi đường (chu trình) ngắn nhất; trọng số phải không âm | Dijkstra + liệt kê đường chặt |

Chu trình: chỉ cần nhập đỉnh xuất phát (đỉnh đích tự bằng đỉnh xuất phát). Đồ thị vô hướng: mỗi chu trình chỉ liệt kê một chiều. Sửa đồ thị thì kết quả cũ tự bị xóa (so bằng `ddSig()`); kiểu tô này không hiện cùng lúc với Euler / Kruskal / Prim.

---

## 💾 Lưu và Reset

**File `js/loi/luu_tru.js`** (khung Điều khiển, trên cùng: nút **💾 Lưu** và **↺ Reset**)

- **Tự động lưu** vào `localStorage` sau mỗi lần vẽ lại (`veDoThi`) / dựng lại thông tin (`hienThiThongTin`) và khi thoát trang.
- Dữ liệu được lưu: loại đồ thị, theme, 4 màu, số đỉnh/cạnh, vị trí đỉnh, phần tô màu Euler, cạnh thêm xanh lá, kết quả người phát thư.
- **Mở lại trang:** tự khôi phục (`khoiPhuc`) và vào thẳng màn hình chính. Mô phỏng Euler đang chạy dở được giữ nguyên phần đã tô nhưng không tự chạy tiếp.
- **💾 Lưu:** lưu ngay và báo giờ lưu.
- **↺ Reset** (`resetDoThi`): xác nhận rồi xóa đồ thị, màu, tô Euler, kết quả người phát thư và dữ liệu đã lưu, về theme Light mặc định.
- Dữ liệu nằm trong trình duyệt đang dùng (theo địa chỉ trang), khóa `moPhongDoThi.v1`.

---

## ⚡ Tối ưu hiệu năng

Giữ nguyên hiệu ứng **kiếm bay**.

**Kiếm** (`js/giao_dien/hieu_ung_phi_kiem.js`, canvas `#swordBg` trong `index.html`)

- Quầng sáng của kiếm vẽ sẵn 1 lần vào canvas phụ (hết `shadowBlur` mỗi khung hình).
- `COUNT = 8` kiếm ở màn hình chọn loại, `HCOUNT = 4` kiếm ở màn hình chính (muốn dày hơn thì tăng 2 hằng số này, bản gốc là 12 và 6).
- `TRAIL = 12` (gốc 16), bỏ đoạn đuôi quá mờ; độ phân giải canvas tối đa 1.5x.
- Dải bay ngang lưu sẵn, không đo layout mỗi khung hình.

**CSS**

- Bỏ `blur(30px)` ở nền aurora.
- Giảm `backdrop-filter` (22px → 10px, 20px → 8px), khung đồ thị vốn đã nền đặc.
- Bỏ các hiệu ứng lặp vô hạn trên khung chọn loại và tiêu đề (floaty, spin, shine).

**SVG đồ thị** (`js/loi/ve_do_thi.js`)

- Bỏ `drop-shadow` trên từng cạnh/đỉnh, thay bằng nét to mờ và vòng bóng nhẹ.
- Kéo đỉnh: gom các lần di chuột, mỗi khung hình chỉ vẽ lại 1 lần.

---

## 🔍 Tìm nhanh trong code

| Từ khóa | Tìm thấy |
|---------|----------|
| `loai ===` hoặc `coHuong()` | Chỗ xử lý riêng từng loại đồ thị |
| `x === y` | Xử lý vòng khuyên |
| `choPhepSongSong` | Luật cho phép cạnh song song |
| `veCanh` | Cách vẽ cạnh, mũi tên, vòng khuyên |
| `htmlMaTran` | Các bảng ma trận |
| `htmlBac` | Tính bậc của đỉnh |

---

<div align="center">

⭐ Nếu thấy dự án hữu ích, hãy để lại một **Star** nhé! ⭐

</div>


---

## 🌲 Thuật toán Kruskal

File: `js/chuc_nang/kruskal.js` (lời giải chi tiết: `giaiChiTietKruskal()` trong `cach_giai.js`). Chỉ dùng cho đồ thị **vô hướng** (`loai` 1–3).

> Trên giao diện, Kruskal và Prim nằm chung trong mục **“Thuật toán tìm cây khung nhỏ nhất”** ở khung điều khiển (`<details class="giai mst-menu">` trong `index.html`): bấm tiêu đề mới xổ ra, rồi chọn Kruskal hoặc Prim; hai nút nạp ví dụ dùng chung cho cả hai.

1. Bắt đầu từ đồ thị rỗng `T` có `n` đỉnh, `F = Ø`.
2. Sắp xếp cạnh theo trọng lượng tăng dần (bằng nhau thì giữ thứ tự nhập; cạnh không có `w` tính `w = 1`).
3. Xét từng cạnh: hai đầu ở hai cây khác nhau (kiểm tra bằng Union–Find) thì **chọn**, ngược lại **loại** (tạo chu trình).
4. Dừng khi đủ `n − 1` cạnh; trọng lượng nhỏ nhất = tổng các cạnh đã chọn.
   Đồ thị không liên thông thì cho rừng khung nhỏ nhất (`n − k` cạnh).

| Nút | Tác dụng |
|-----|----------|
| 🌲 Phân tích & giải Kruskal | Hiện bảng cạnh đã sắp xếp, cạnh chọn/loại, tổng trọng lượng |
| Nạp ví dụ (6 đỉnh) / Nạp bài tập (9 đỉnh) | Nạp đồ thị trong file Word (kết quả 33 và 37) |
| ▶ Xem từng bước | Mỗi giây xét một cạnh: chọn = xanh ngọc, loại = đỏ nét đứt |
| Tô cây khung | Tô các cạnh của cây khung và **xóa các cạnh thừa** khỏi hình |
| ✖ Hủy mô phỏng | Dừng chạy, hiện lại mọi cạnh, đồ thị trở về bình thường |

Trạng thái tô màu: biến `krHL` (`trang_thai.js`), được lưu cùng đồ thị; `ve_do_thi.js` đọc `krHL` khi vẽ cạnh. Khi `krHL.an = true` (đã ra kết quả cây khung) các cạnh không thuộc cây khung không được vẽ; dữ liệu đồ thị không bị sửa nên Hủy mô phỏng khôi phục lại ngay.

---

## 🌳 Thuật toán Prim

File: `js/chuc_nang/prim.js` (lời giải chi tiết: `giaiChiTietPrim()` trong `cach_giai.js`). Chỉ dùng cho đồ thị **vô hướng** (`loai` 1–3), dùng chung `krHL` và hai ví dụ của Kruskal.

1. Chọn đỉnh xuất phát `s` (ô “Đỉnh bắt đầu”), `V_T = {s}`, `F = Ø`.
2. Trong các cạnh có một đầu trong `V_T`, một đầu ngoài `V_T`, chọn cạnh có trọng lượng nhỏ nhất (bằng nhau thì lấy cạnh nhập trước), thêm đỉnh mới vào `V_T`.
3. Lặp đến khi đủ `n − 1` cạnh. Đồ thị không liên thông thì chỉ phủ được thành phần chứa `s`.

| Nút | Tác dụng |
|-----|----------|
| 🌳 Phân tích & giải Prim | Hiện bảng từng bước: `V_T`, cạnh ứng viên, cạnh chọn, tổng trọng lượng |
| ▶ Xem từng bước | Mỗi giây thêm một cạnh (xanh ngọc, đỉnh trong cây có viền xanh ngọc); xong thì xóa cạnh thừa |
| Tô cây khung | Tô ngay cây khung và xóa cạnh thừa |
| ✖ Hủy mô phỏng | Dừng chạy, hiện lại mọi cạnh, đồ thị trở về bình thường |

---

## 📌 Lưu ý loại đồ thị dùng được

**File `js/giao_dien/luu_y_loai.js`** + các dòng `<div class="note ap-dung" data-loai="...">` trong `index.html`. Mỗi chức năng và bài tập có một đoạn “📌 Lưu ý”; hàm `capNhatLuuY()` thêm dòng **✔ dùng được** (xanh) hoặc **✖ không dùng được** (đỏ) theo loại đang chọn, và chạy lại mỗi khi đổi loại.

| Chức năng / bài tập | Loại dùng được |
|---|---|
| Lưu / Reset, Phiên đồ thị, Giao diện & màu, Tạo đồ thị, Thêm / xóa / sửa cạnh | Cả 5 loại |
| 🔄 Chu trình Euler | Cả 5 loại (vô hướng: liên thông + bậc chẵn; có hướng: liên thông yếu + deg⁺ = deg⁻) |
| 🛤️ Đường đi & chu trình | Cả 5 loại (có hướng thì đi đúng chiều mũi tên) |
| 📮 Người phát thư (kể cả 🚶 Đi hành trình) | Chỉ loại 1, 2, 3 |
| 🌲 Kruskal, 🌳 Prim | Chỉ loại 1, 2, 3 |
| Ví dụ (6 đỉnh) / Bài tập (9 đỉnh) | Tự nạp thành loại 1 (có trọng số) nên dùng được với Kruskal, Prim, người phát thư, Euler, đường đi |

Thêm chức năng mới: viết một dòng `note ap-dung` có `data-loai` liệt kê các loại được dùng, không cần sửa JS.

---

## 🔤 Nhãn số / chữ

Nút **🔢 Nhãn số / 🔤 Nhãn chữ** (khung Điều khiển, dưới nút đổi giao diện) chỉ đổi cách **hiển thị** nhãn đỉnh và cạnh; dữ liệu đồ thị bên trong vẫn là số 0…n−1.

| | Nhãn số | Nhãn chữ |
|---|---|---|
| Đỉnh | `0, 1, 2, …` | `A, B, C, …, Z, AA, AB, …` |
| Nhãn cạnh | `(0,1) · 5` | `(A,B) · 5` |

- Áp dụng cho: hình vẽ, danh sách đỉnh/cạnh, bậc, danh sách kề, ma trận, Euler, người phát thư, Kruskal và các khung “Cách giải chi tiết”.
- Khi nhập đỉnh (Thêm / Xóa / Sửa cạnh, hộp thoại Tạo đồ thị) có thể gõ **số hoặc chữ** (`0 1` hay `A B`, gõ chữ hoa hay thường đều nhận) ở cả hai chế độ.
- Chế độ đang chọn được lưu cùng đồ thị; **Reset** đưa về Nhãn số. Đổi chế độ sẽ bỏ phần tô màu Euler/Kruskal đang chạy dở.
- Mã nguồn: `kieuNhan`, `nhanDinh()`, `docDinh()` trong `js/dung_chung/cau_hinh.js`; `chonKieuNhan()` trong `js/giao_dien/doi_giao_dien.js`.


## Bộ điều khiển từng bước (Euler · Kruskal · Prim · Người phát thư · Đi hành trình)

**File `js/loi/dieu_khien_buoc.js`** — 5 nút dùng chung: ⏮ Về đầu · ◀ Bước trước · Bước tiếp ▶ · ⏩ Tự chạy · ⏸ Dừng. Có dòng "Bước k/max" phía trên.

| Hàm | Công dụng |
|---|---|
| `htmlDieuKhienBuoc(kieu)` | Sinh khung 5 nút (`kieu` = `euler` / `kruskal` / `prim` / `npt` / `hanhtrinh`) |
| `dkLenh(kieu, act)` | Điểm vào của mọi nút (`dau` / `truoc` / `tiep` / `chay` / `dung`) |
| `dkDen(j)` | Đi tới bước j: gọi `ap(j)` dựng lại toàn bộ phần tô màu rồi vẽ lại |
| `dkHuy()` | Hủy mô phỏng (tự gọi từ `resetEuler()` / `resetKruskalHL()`, nên sửa đồ thị là tự dừng) |

Mỗi thuật toán chỉ cần cung cấp `taoDKEuler()` / `taoDKKruskal()` / `taoDKPrim()` trả về `{ max, delay, k0(), ap(j) }`. Vì `ap(j)` dựng lại từ đầu nên đi lùi hay nhảy về đầu đều dùng chung một hàm. Tự chạy khi đã xong sẽ chạy lại từ đầu; "Tô cả chu trình / Tô cây khung" đưa bộ đếm tới bước cuối. Nút cũ "Xem từng bước" / "Mô phỏng" đã được thay bằng bộ nút này.
