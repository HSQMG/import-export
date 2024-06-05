let myData = [];

// Function to fetch and display random user data
function getData() {
    const quantity = document.getElementById('quantity').value;
    $.ajax({
        url: `https://randomuser.me/api/?results=${quantity}`,
        dataType: 'json',
        success: function (data) {
            console.log('getData', data.results);
            showData(data.results);
        },
    });
}

// Function to show data in an HTML table
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
    let html = '<tr><th>Tên</th><th>Họ</th><th>Email</th><th>Phone</th><th>Income</th></tr>';
    $.each(myData, function (key, value) {
        html += '<tr>';
        html += '<td>' + value?.firstName + '</td>';
        html += '<td>' + value?.lastName + '</td>';
        html += '<td>' + value?.email + '</td>';
        html += '<td>' + value?.phone + '</td>';
        html += '<td>' + value?.income + '</td>';
        html += '</tr>';
    });
    document.getElementById('data').innerHTML = html;
}

// Function to export data to an Excel file
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

// Function to handle file selection and read the Excel file
function handleFile() {
    const fileInput = document.getElementById('fileInput');
    const sheetSelector = document.getElementById('sheetSelector');

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetNames = workbook.SheetNames;
        const sheetSelectorDropdown = document.getElementById('sheet');
        sheetSelectorDropdown.innerHTML = '';
        sheetNames.forEach(function (sheetName) {
            const option = document.createElement('option');
            option.value = sheetName;
            option.textContent = sheetName;
            sheetSelectorDropdown.appendChild(option);
        });
        sheetSelector.style.display = 'block';
    };

    reader.readAsArrayBuffer(file);
}

// Function to handle sheet selection and display its content
function handleSheetSelection() {
    const selectedSheetName = document.getElementById('sheet').value;

    const fileInput = document.getElementById('fileInput');

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const worksheet = workbook.Sheets[selectedSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const headers = jsonData[0];
        myData = jsonData.slice(1).map(row => {
            let rowData = {};
            headers.forEach((header, index) => {
                rowData[header] = row[index];
            });
            return rowData;
        });

        let html = '<tr>' + headers.map(header => `<th>${header}</th>`).join('') + '</tr>';
        jsonData.slice(1).forEach(row => {
            html += '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        });
        document.getElementById('data').innerHTML = html;
    };

    reader.readAsArrayBuffer(file);
}
