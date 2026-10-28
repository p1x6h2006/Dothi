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
| 🔄 **Chu trình Euler** | Kiểm tra, tìm và mô phỏng từng bước |
| 📮 **Người phát thư** | Tìm hành trình ngắn nhất qua mọi cạnh |
| 🎨 **3 giao diện** | Light, Premium, Neon |
| 💾 **Tự động lưu** | Lưu vào `localStorage`, mở lại là có ngay |

---

## 📁 Cấu trúc thư mục

```text
Dothi/
├── index.html          # Giao diện: màn hình chọn loại + màn hình chính
├── chu-thich.txt       # Bản chú thích gốc
├── css/
│   └── style.css       # Toàn bộ giao diện (3 theme: Light, Premium, Neon)
└── js/
    ├── config.js       # Hằng số, tên 5 loại đồ thị, bảng màu
    ├── state.js        # Biến trạng thái dùng chung
    ├── validate.js     # Kiểm tra dữ liệu nhập
    ├── ui.js           # Chọn loại, đổi theme, áp dụng màu
    ├── edges.js        # Tạo đồ thị, thêm / xóa / sửa cạnh
    ├── draw.js         # Vẽ đồ thị bằng SVG, kéo đỉnh
    ├── matrix.js       # Ma trận kề, ma trận trọng số
    ├── list.js         # Danh sách kề
    ├── euler.js        # Chu trình Euler (kiểm tra, tìm, mô phỏng)
    ├── postman.js      # Bài toán người phát thư
    ├── giai.js         # Cách giải chi tiết (khung bấm mới xổ ra) cho từng mục
    ├── info.js         # Danh sách đỉnh/cạnh, bậc của đỉnh
    └── storage.js      # Tự động lưu / khôi phục / reset (localStorage)
```

> ⚠️ **Thứ tự nạp script trong `index.html` (không được đổi):**
>
> ```text
> config → state → validate → ui → edges → draw → matrix → list → euler → postman → giai → info → storage
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

> `loai` 1–3 là **vô hướng**, `loai` 4–5 là **có hướng** (hàm `coHuong()` trong `state.js`).

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
<summary><b>⚙️ js/config.js</b></summary>

| Tên | Công dụng |
|-----|-----------|
| `$` | Viết tắt của `document.getElementById` |
| `TEN_LOAI` | Tên 5 loại đồ thị |
| `EMOJI` | Biểu tượng số trên nút chọn loại |
| `PALETTES` | Bảng màu cho 3 theme (node, border, edge, glow) |
| `COLOR_INPUTS` | Liên kết màu với các ô chọn màu |

</details>

<details>
<summary><b>🧠 js/state.js</b></summary>

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
<summary><b>✅ js/validate.js</b></summary>

- `kiemTraDinh`: đỉnh phải là số nguyên từ `0` đến `n-1`.
- `kiemTraCanh`: trả về chuỗi lỗi hoặc `null` nếu hợp lệ.
  - Vòng khuyên (`x = y`) chỉ cho phép ở `loai 3`.
  - Cạnh trùng chỉ bị chặn ở đơn đồ thị (`loai 1, 4`).
- `docTrongSo`: để trống → `undefined`, không phải số → `NaN`.
- `taoCanh`: tạo đối tượng cạnh (có hoặc không có trọng số).

</details>

<details>
<summary><b>🎛️ js/ui.js</b></summary>

- Tạo các nút chọn loại và danh sách chọn loại.
- `chonGiaoDien(mode)`: đổi theme `light` / `premium` / `dark`.
- `apDungMauDoThi()`: áp dụng 4 màu người dùng chọn.
- `chonLoaiDoThi(loai)`: vào màn hình chính với loại đã chọn.
- `hieuUng()`: hiệu ứng nhấp nháy khi bấm.

</details>

<details>
<summary><b>🔗 js/edges.js</b></summary>

- `taoDoThi()`: hỏi từng cạnh bằng hộp thoại (dạng `x y` hoặc `x y w`), kiểm tra, rồi dựng đồ thị mới.
- `capNhat()`: vẽ lại và cập nhật thông tin.
- `themCanh()`: thêm cạnh theo luật của loại đang chọn.
- `timCanh()`: tìm cạnh khớp đúng thứ tự `(x, y)`.
- `xoaCanh()`: xóa 1 cạnh. Đồ thị vô hướng phải nhập đúng thứ tự đã thêm (`x y`), nhập `y x` sẽ báo không tìm thấy.
- `suaCanh()`: đổi đỉnh / trọng số của cạnh (trọng số trống = giữ cũ).

</details>

<details>
<summary><b>🖌️ js/draw.js</b></summary>

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
<summary><b>🔢 js/matrix.js</b></summary>

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
<summary><b>ℹ️ js/info.js</b></summary>

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

**File `js/list.js`**

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

**File `js/euler.js`**

| Hàm | Công dụng |
|-----|-----------|
| `phanTichEuler()` | Kiểm tra điều kiện; nếu thỏa thì tìm chu trình bằng thuật toán **Hierholzer** (đánh dấu cạnh đã dùng theo số thứ tự cạnh nên đúng với cạnh song song và vòng khuyên). Nếu không thỏa: trả về lý do, và báo thêm nếu có **đường đi Euler** (2 đỉnh bậc lẻ / lệch bậc ra-vào) |
| `htmlEuler()` | Vẽ phần kết quả (nằm cuối khung thông tin, sau ma trận trọng số) |
| `chayEuler()` | Mô phỏng từng bước (0,8 giây/cạnh): cạnh đã đi tô cam, ghi số thứ tự. Bấm là **tự cuộn** lên chỗ đồ thị (`cuonDenDoThi`); lời giải thích từng bước hiện ngay trên hình (góc trên trái) và ở khung thông tin |
| `hienEuler()` | Tô cả chu trình một lần |
| `boEuler()` | Bỏ tô màu, tự cuộn lên chỗ đồ thị |
| `doiDinhEuler()` | Chọn đỉnh bắt đầu (mặc định: đỉnh nhỏ nhất có cạnh) |
| `resetEuler()` | Dừng mô phỏng, bỏ tô màu (tự gọi khi thêm/xóa/sửa cạnh, tạo đồ thị mới) |

**Tô màu trên hình:** biến `eulerHL` (`state.js`), được `draw.js` đọc trong `veCanh()` và `veDinh()`.

**CSS:** nhóm `.euler-wrap` / `.euler-yes` / `.euler-no` / `.euler-seq` / `.euler-v` / `.euler-e` / `.euler-btns`.

### 🚀 Euler = hành trình ngắn nhất

- **Đồ thị vô hướng** liên thông nhưng có đỉnh bậc lẻ: không chỉ báo "Không có chu trình Euler" nữa. Vẫn nêu lý do, rồi **tự tính hành trình ngắn nhất** đi qua mọi cạnh rồi quay về (dùng lại `tinhNguoiPhatThu()` của `postman.js`): hiện dãy đỉnh - cạnh (cạnh phải đi lặp có dấu `*`), độ dài = `Σw(e) + m(G)`.
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

**File `js/postman.js`**

| Hàm | Công dụng |
|-----|-----------|
| `giaiNguoiPhatThu()` | Nút *"Phân tích & giải bài toán"* (khung Điều khiển), tự nhảy xuống bảng kết quả |
| `tinhNguoiPhatThu()` | Tính và lưu vào `npt` (`state.js`) |
| `cacPhanHoachCap()` | Ghép cặp |
| `apDungPhanHoach(i)` | Nút *"Xem Pi"* / *"Tự động thêm cạnh & vẽ lại đồ thị"*: đồ thị = gốc + các cạnh sao chép dọc đường đi ngắn nhất của từng cặp (vẽ màu **xanh lá**), rồi nhảy lên đồ thị. Cạnh thêm là cạnh song song nên `loai 1` tự đổi sang `loai 2`. Sau đó mọi đỉnh bậc chẵn → mục Chu trình Euler báo "Có" và mô phỏng được |
| `traLaiDoThiGoc()` | Khôi phục cạnh và loại đồ thị ban đầu |
| `resetNguoiPhatThu()` | Xóa kết quả (tự gọi khi thêm/xóa/sửa cạnh hoặc tạo đồ thị mới) |

**Giới hạn**

- Không có trọng số âm.
- Đồ thị phải liên thông.
- Tối đa 12 đỉnh bậc lẻ. Quá 6 đỉnh lẻ (hơn 15 phân hoạch) chỉ hiện phân hoạch nhỏ nhất.

**CSS:** nhóm `.npt-wrap` / `.npt-card` / `.npt-best` / `.npt-m` / `.npt-total` / `.npt-btns`.

---

## 💾 Lưu và Reset

**File `js/storage.js`** (khung Điều khiển, trên cùng: nút **💾 Lưu** và **↺ Reset**)

- **Tự động lưu** vào `localStorage` sau mỗi lần vẽ lại (`veDoThi`) / dựng lại thông tin (`hienThiThongTin`) và khi thoát trang.
- Dữ liệu được lưu: loại đồ thị, theme, 4 màu, số đỉnh/cạnh, vị trí đỉnh, phần tô màu Euler, cạnh thêm xanh lá, kết quả người phát thư.
- **Mở lại trang:** tự khôi phục (`khoiPhuc`) và vào thẳng màn hình chính. Mô phỏng Euler đang chạy dở được giữ nguyên phần đã tô nhưng không tự chạy tiếp.
- **💾 Lưu:** lưu ngay và báo giờ lưu.
- **↺ Reset** (`resetDoThi`): xác nhận rồi xóa đồ thị, màu, tô Euler, kết quả người phát thư và dữ liệu đã lưu, về theme Light mặc định.
- Dữ liệu nằm trong trình duyệt đang dùng (theo địa chỉ trang), khóa `moPhongDoThi.v1`.

---

## ⚡ Tối ưu hiệu năng

Giữ nguyên hiệu ứng **kiếm bay**.

**Kiếm** (`index.html`, cuối file)

- Quầng sáng của kiếm vẽ sẵn 1 lần vào canvas phụ (hết `shadowBlur` mỗi khung hình).
- `COUNT = 8` kiếm ở màn hình chọn loại, `HCOUNT = 4` kiếm ở màn hình chính (muốn dày hơn thì tăng 2 hằng số này, bản gốc là 12 và 6).
- `TRAIL = 12` (gốc 16), bỏ đoạn đuôi quá mờ; độ phân giải canvas tối đa 1.5x.
- Dải bay ngang lưu sẵn, không đo layout mỗi khung hình.

**CSS**

- Bỏ `blur(30px)` ở nền aurora.
- Giảm `backdrop-filter` (22px → 10px, 20px → 8px), khung đồ thị vốn đã nền đặc.
- Bỏ các hiệu ứng lặp vô hạn trên khung chọn loại và tiêu đề (floaty, spin, shine).

**SVG đồ thị** (`js/draw.js`)

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
