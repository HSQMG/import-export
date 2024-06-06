// Mảng để lưu trữ dữ liệu người dùng đã lấy được
let myData = [];

function getData() {
    // Lấy số lượng người dùng cần lấy từ trường nhập liệu là quantity
    const quantity = document.getElementById('quantity').value;
    // Thực hiện yêu cầu AJAX đến API randomuser
    $.ajax({
        url: `https://randomuser.me/api/?results=${quantity}`,
        dataType: 'json',
        success: function(data) {
            console.log('getData', data.results);
            // Gọi hàm showData để hiển thị dữ liệu đã lấy được
            showData(data.results);
        },
    });
}

// Hàm để hiển thị dữ liệu người dùng đã lấy được trong bảng
function showData(data) {
    // Ánh xạ dữ liệu đã lấy được sang định dạng yêu cầu và tạo thu nhập ngẫu nhiên
    myData = data.map((d) => {
        return {
            firstName: d?.name?.first,
            lastName: d?.name?.last,
            email: d?.email,
            phone: d?.phone,
            income: `$` + (Math.random() * 1000).toFixed(2), // Tạo thu nhập ngẫu nhiên
        };
    });
    //console.log('myData', myData);
    // Tạo HTML cho bảng
    let html = '<tr><td>Tên</td><td>Họ</td><td>Email</td><td>Phone</td><td>Income</td></tr>';
    // Thêm dữ liệu của từng người dùng vào bảng
    $.each(myData, function(key, value) {
        html += '<tr>';
        html += '<td>' + value?.firstName + '</td>';
        html += '<td>' + value?.lastName + '</td>';
        html += '<td>' + value?.email + '</td>';
        html += '<td>' + value?.phone + '</td>';
        html += '<td>' + value?.income + '</td>';
        html += '</tr>';
    });
    // Đặt nội dung HTML của bảng
    $('table tbody').html(html);
}

// Hàm để xuất dữ liệu người dùng hiển thị ra file Excel
function exportToExcel() {
    // Lấy tên file từ trường nhập liệu
    const fileName = document.getElementById('filename').value;
    // Kiểm tra dữ liệu có rỗng hay là không
    if (myData.length === 0) {
        console.error('Chưa có dữ liệu'); // Ghi log lỗi nếu không có dữ liệu
        return;
    }
    // Chuyển đổi dữ liệu sang định dạng Excel
    //Hàm này chuyển đổi một mảng dữ liệu JSON (myData) thành một đối tượng bảng (worksheet) Excel.
    const wb = XLSX.utils.json_to_sheet(myData);
    //Tạo workbook mới
    const wbout = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wbout, wb, 'Users');
    // Lưu file Excel
    XLSX.writeFile(wbout, `${fileName}.xlsx`);
}
