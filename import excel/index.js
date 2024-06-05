// Biến để lưu trữ tên sheet được chọn
let selectedSheet;

// Hàm xử lý khi người dùng chọn file Excel
function handleFile() {
    // Lấy các phần tử HTML cần thiết
    const fileInput = document.getElementById('fileInput');
    const sheetSelector = document.getElementById('sheetSelector');
    const outputDiv = document.getElementById('output');

    // Đọc file Excel được chọn
    const file = fileInput.files[0];
    const reader = new FileReader();

    // Khi đọc file thành công
    reader.onload = function(event) {
        // Đọc dữ liệu từ file Excel và chuyển thành định dạng workbook
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Lấy danh sách tên các sheet từ workbook và hiển thị lên dropdown
        const sheetNames = workbook.SheetNames;
        const sheetSelectorDropdown = document.getElementById('sheet');
        sheetSelectorDropdown.innerHTML = '';
        sheetNames.forEach(function(sheetName) {
            const option = document.createElement('option');
            option.value = sheetName;
            option.textContent = sheetName;
            sheetSelectorDropdown.appendChild(option);
        });
        // Hiển thị dropdown sheet
        sheetSelector.style.display = 'block';
    };

    // Đọc file Excel dưới dạng ArrayBuffer
    reader.readAsArrayBuffer(file);
}

// Hàm xử lý khi người dùng chọn sheet từ dropdown
function handleSheetSelection() {
    // Lấy tên sheet được chọn
    const selectedSheetName = document.getElementById('sheet').value;
    selectedSheet = selectedSheetName;

    // Lấy các phần tử HTML cần thiết
    const fileInput = document.getElementById('fileInput');
    const outputDiv = document.getElementById('output');

    // Đọc file Excel được chọn
    const file = fileInput.files[0];
    const reader = new FileReader();

    // Khi đọc file thành công
    reader.onload = function(event) {
        // Đọc dữ liệu từ file Excel và chuyển thành định dạng workbook
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Lấy sheet được chọn từ workbook
        const worksheet = workbook.Sheets[selectedSheet];

        // Chuyển sheet thành định dạng JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Tạo bảng HTML từ dữ liệu JSON
        const table = document.createElement('table');
        for (let i = 0; i < jsonData.length; i++) {
            const row = table.insertRow();
            for (let j = 0; j < jsonData[i].length; j++) {
                if (i === 0) {
                    // Tạo header cells
                    const th = document.createElement('th');
                    th.textContent = jsonData[i][j];
                    row.appendChild(th);
                } else {
                    // Tạo data cells
                    const cell = row.insertCell();
                    cell.textContent = jsonData[i][j];
                }
            }
        }

        // Hiển thị bảng HTML lên trang web
        outputDiv.innerHTML = '';
        outputDiv.appendChild(table);
    };

    // Đọc file Excel dưới dạng ArrayBuffer
    reader.readAsArrayBuffer(file);
}
