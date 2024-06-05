let myData = [];

function getData() {
    const quantity = document.getElementById('quantity').value;
    $.ajax({
        url: `https://randomuser.me/api/?results=${quantity}`,
        dataType: 'json',
        success: function(data) {
            console.log('getData', data.results);
            showData(data.results);
        },
    });
}

function showData(data) {
    myData = data.map((d) => {
        return {
            firstName: d?.name?.first,
            lastName: d?.name?.last,
            email: d?.email,
            phone: d?.phone,
            income: `$` + (Math.random() * 1000).toFixed(2),
        };
    });
    console.log('myData', myData);
    let html = '<tr><td>Tên</td><td>Họ</td><td>Email</td><td>Phone</td><td>Income</td></tr>';
    $.each(myData, function(key, value) {
        html += '<tr>';
        html += '<td>' + value?.firstName + '</td>';
        html += '<td>' + value?.lastName + '</td>';
        html += '<td>' + value?.email + '</td>';
        html += '<td>' + value?.phone + '</td>';
        html += '<td>' + value?.income + '</td>';
        html += '</tr>';
    });
    $('table tbody').html(html);
}

function exportToExcel() {
    const fileName = document.getElementById('filename').value;
    if (myData.length === 0) {
        console.error('Chưa có dữ liệu');
        return;
    }
    console.log('exportToExcel', myData);

    const wb = XLSX.utils.json_to_sheet(myData);
    const wbout = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wbout, wb, 'Users');
    XLSX.writeFile(wbout, `${fileName}.xlsx`);
}
