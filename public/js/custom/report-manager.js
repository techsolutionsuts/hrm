function reportManager() {
    let html = '';
    $('.mainPage').html('');
    html += `<link href="/css/employee-style.css" rel="stylesheet">`;
    html += `<style>
     .hr {margin: 0px;}
    .colr{color: black;}

    .scroll-div_empAll{
    overflow-y: scroll;
    height: 550px;
    width: 100%;
    }

    input {
            display: inline-block;
            width: 120px;
            vertical-align: top;
        }
    .required {
            color: red;
        }

    </style>`;

    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800"> <i class="fas fa-download fa-sm text-black-50"></i> Report Manager</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm reportManager"><i';
    html += 'class = "fa fa-refresh fa-sm text-black-50"> </i> Reload Page</a>';
    html += '</div>';

    // html += '<div class="container" style="padding: 0px;">';


    // html += `< div class = "tab-content" style = "margin-top:16px; ">`;
    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;
    html += `<div class="panel-heading" style="font-size: 15px;">One place to generate all reports
    </div>`;

    html += `<div class="panel-body appendReport">`;

    // html += `<div class="user-message user-message--error" style="display: none;"></div>`;
    html += `<div class="card">
                <div class="card-header" style="background-color: #008a9f; color: white;"></div>
                    <div class="card-body">
                        <form action="report-manager" method="POST" id="querySystem">
                        <div class="row">
                        <div class="col-lg-4 col-md-4">
                        <h4 style="color: #000080; text-decoration: underline;">Report Type</h4>

                        <div class="form-group reportType">
                        <label class="colr">Report type<span class="required">*</span></label>
                        <select type="text" name="reportType" id="reportType">
                        <option value="">Select report type</option>
                        <option value="employees">Employees</option>
                        <option hidden value="departments">Departments</option>
                        <option hidden value="job description">Job description</option>
                        <option hidden value="salary grades">Salary grades</option>
                        <option value="leaves">Leave</option>
                        <option value="attendance">Attendance</option>

                        </select>
                        <span id="error_reportType" class="text-danger"></span>
                        </div>

                        <div class="form-group subtypeOne" style="display: none;">
                        
                        </div>

                        <div class="form-group subtypeTwo" style="display: none;">
                        <label class="colr">Subtype two</label>
                        <select type="text" name="subtypeTwo" id="subtypeTwo">

                        </select>
                        <span id="error_" class="text-danger"></span>
                        </div>
                        </div>

                        <div class="col-lg-4 col-md-4">
                        <h4 style="color: #000080; text-decoration: underline;">From date</h4>
                        <div class="form-group fromdate">
                        <label class="colr">From</label>
                        <input type="date" name="fromDate" id="fromDate">
                        <span id="error_fromDate" class="text-danger"></span>
                        </div>
                        </div>

                        <div class="col-lg-4 col-md-4 todate">
                        <h4 style="color: #000080; text-decoration: underline;">To date</h4>
                        <div class="form-group">
                        <label class="colr">To</label>
                        <input type="date" name="toDate" id="toDate">
                        <span id="error_toDate" class="text-danger"></span>
                        </div>
                        </div>
                        </div>

                        <hr class="hr"><br>

                        <input type="hidden" name="leaveMode" id="leaveMode" value="">
                        <input type="hidden" name="_csrf" id="_csrf" value="${$('#crsf').val()}">

                        <button type="submit" class="btn btn-success" value="" id="" style="float: right; border-radius: 10px 10px 10px 10px;"><i class="fas fa-progress-success"></i> Process</button>

                        <button class="btn btn-dark reportManager" value="" id="" style="float: right; border-radius: 10px 10px 10px 10px; margin-right: 20px;"><i class="fas fa-ui-icon-cancel"></i> Reset</button>
                        <label style="color: chocolate;" >NOTE:  <br> * means required <br>If no date is entered, today's date will be applied</label><br>
                </form>
                
                <div id="reportContent" class="scroll-div_empAll" style="display: none;">
                
                </div>
                </div>
            </div>`;
    html += '</div>';
    html += '</div>';
    html += '</div>';
    $('.mainPage').html(html);
    $("#loader").hide();
    // getEmployees('deptHead', '', ''); // called from general-funct.js
    unactive();
    $('.reportManager_blue').css("color", 'blue');

    // html += `</div>`;
}

function Clickheretoprint() {
    var disp_setting = "toolbar=yes,location=no,directories=yes,menubar=yes,";
    disp_setting += "scrollbars=yes,width=800, height=400, left=100, top=25";
    var content_vlue = document.getElementById("print_content").innerHTML;

    var docprint = window.open("", "", disp_setting);
    docprint.document.open();
    docprint.document.write('</head><body onLoad="self.print()" style="width: 800px; font-size: 13px; font-family: arial;">');
    docprint.document.write(content_vlue);
    docprint.document.close();
    docprint.focus();
}

function empAll(data, date, file) {
    let html = '<hr>';
    // html += `<a href="${file}" target="_blank"><button style="float: right; margin-right: 20px;" value="add" class="btn btn-warning btn-sm"><i class="fas fa-file-pdf"></i> PDF</button></a><br>`;

    // html += `<a href="${file}" target="_blank">PDF File</a>`;
    // const print = Clickheretoprint;
    // html += `<div class="pull-right" style="margin-right:100px;">
    // 	<a href="#" onclick="return Clickheretoprint();" style="font-size:20px; position:absolute; margin-top: 40px; left: 800px"><button class="btn btn-success btn-large"><i class="icon-print"></i> Print</button></a>
    // 	</div>`;

    html += `<div class="content" id="print_content">`;
    html += `<center><span style="color: black; font-size: 20px; text-decoration: underline;">${date}</span></center>`
    html += '<table border="1" cellpadding="4" cellspacing="0" style="font-family: arial; font-size: 13px;text-align:left;width : 100%;" id="datatable">';
    html += '<thead class="table-dark" style="font-size:15px">';

    html += '<tr>';
    html += '<th scope="col">Staff ID</th>';
    html += '<th scope="col">Date Emply</th>';
    html += '<th scope="col">Name</th>';
    html += '<th scope="col">Dept</th>';
    html += '<th scope="col">Phone</th>';
    html += '<th scope="col">Email</th>';
    html += '<th scope="col">HOD</th>';
    html += '<th scope="col">Supervisor</th>';
    html += '<th scope="col">Job title</th>';
    html += '<th scope="col">Leave status</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color:; color:black;">';
    html += `<td colspan="8" style="color: red;"></td>`;
    if (data.length === 0) {
        html += `<td colspan="10" style="color: red;">No employee found</td>`;
        $('#reportContent').html(html);
        $('#reportContent').show();
    }

    html += '</tbody>';
    html += '</table>';
    html += '</div>';

    $('#reportContent').html(html);
    $('title').html(`${date}`);
    $('#reportContent').show();
    $('#datatable').dataTable({
        dom: 'Bfrtip',
        data: data,
        columns: [
            { 'data': 'staffID' },
            { 'data': 'dateEmplyed' },
            { 'data': 'fullname' },
            { 'data': 'dept' },
            { 'data': 'phone' },
            { 'data': 'email' },
            { 'data': 'hod' },
            { 'data': 'superVise' },
            { 'data': 'job' },
            { 'data': 'leavTyp' },
        ],
        buttons: [{
                extend: 'excel',
                className: 'btn btn-success btn-sm',
                text: '<i class="fas fa-file-excel"> Excel</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    // columns: ':visible'
                }
            },
            {
                extend: 'pdf',
                // titleAttr: 'Print this dem file',
                className: 'btn btn-warning btn-sm',
                text: '<i class="fas fa-file-pdf"> PDF</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            },
            {
                extend: 'print',
                className: 'btn btn-info btn-sm',
                text: '<i class="fas fa-print"> Print</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        ]
    })
}

function deptAll(data, date) {
    let html = '<hr>';
    // html += `<style>
    //     body {
    //     font: normal medium/1.4 sans-serif;
    //     } table {
    //     border-collapse: collapse;
    //     padding-right: 15px;
    //     }
    //     th, td {
    //     padding: 0.25rem;
    //     text-align: center;
    //     border: 1px solid #ccc;
    //     }

    //     thead tr {
    //     background: #008a9f;
    //     }
    //     </style>`;
    // html += `
    //     <button type="submit" target="_blank" style="float: right; margin-right: 20px;" value="add" class="btn btn-warning btn-sm"><i class="fas fa-file-pdf"></i> PDF</button>
    //     <br>`;
    html += `<center><span style="color: black; font-size: 20px; text-decoration: underline;">${date}</span></center>`
    html += '<table border="1" cellpadding="4" cellspacing="0" style="font-family: arial; font-size: 13px;text-align:left;width : 100%;" id="datatable">';
    html += '<thead class="table-dark" style="font-size:15px">';
    html += '<tr>';
    html += '<th scope="col">Date</th>';
    html += '<th scope="col">Department</th>';
    html += '<th scope="col">Description</th>';
    html += '<th scope="col">HOD</th>';
    html += '<th scope="col">Total Employees</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="color: black;">';
    if (data.length === 0) {
        html += `<td colspan="5" style="color: red;">No department found</td>`;
        $('#reportContent').html(html);
        $('#reportContent').show();
    }

    html += '</tbody>';
    html += '</table>';

    $('#reportContent').html(html);
    $('title').html(`${date}`);
    $('#reportContent').show();
    $('#datatable').dataTable({
        dom: 'Bfrtip',
        data: data,
        columns: [
            { 'data': 'date' },
            { 'data': 'deptName' },
            { 'data': 'description' },
            { 'data': 'deptHead' },
            { 'data': 'nofEmply' },
        ],
        buttons: [{
                extend: 'excel',
                className: 'btn btn-success btn-sm',
                text: '<i class="fas fa-file-excel"> Excel</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    // columns: ':visible'
                }
            },
            {
                extend: 'pdf',
                // titleAttr: 'Print this dem file',
                className: 'btn btn-warning btn-sm',
                text: '<i class="fas fa-file-pdf"> PDF</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            },
            {
                extend: 'print',
                className: 'btn btn-info btn-sm',
                text: '<i class="fas fa-print"> Print</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        ]
    })
}

function employUD(dept, data) {
    let html = '';

    html += `<link href="/css/employee-style.css" rel="stylesheet">`;

    $('#reportContent').html('');
    html += `<style>
     .hr {margin: 0px;}
     .lab {color: #000000;}
     .scroll-div {
    overflow-y: scroll;
    height: 200px;
    width: 100%;
}
    </style>`

    // html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    // html += '<h6 class="h3 mb-0 text-gray-800">HOD Change History</h6>';
    // html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm getDept" id="<%= userDetails[0] %>"><i';
    // html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Back Department</a>';
    // html += '</div>';


    // html += '<div class="container" style="padding: 0px;">';

    // html += `<div class="tab-content" style="margin-top:16px; ">`;
    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;

    html += `<div class="panel-heading" style="font-size: 15px; background: black; color: white"></div>`;

    html += `<div class="panel-body">`;

    html += `<center><label id="headposi" style="text-align: center; color: #00008B; font-size: 20px;">${dept.name} Department</label></center> <hr class="hr">`;

    html += `<h5 style="text-decoration: underline; color: black">Current Head of Department</h5>`
    html += `<label id="headname" style="text-align: center; color: black; font-size: 20px;">${'Head:'} </label> ${dept.head} <br>`;

    html += `<label id="headjob" style="text-align: center; color: black; font-size: 20px;">${'Job Title:'} </label> ${dept.job}<br>`;

    html += `<label id="headsince" style="text-align: center; color: black; font-size: 20px;">${'Since:'} </label> ${dept.since}<br> <hr class="hr">`;

    html += `<center><span style="color: black; font-size: 20px; text-decoration: underline;">${dept.date}</span></center>`;

    html += '<table border="1" cellpadding="4" cellspacing="0" style="font-family: arial; font-size: 13px;text-align:left;width : 100%;" id="datatable">';
    html += '<thead class="table-dark" style="font-size:15px">';
    html += '<tr>';
    html += '<th>Date employed</th>';
    html += '<th>StaffID</th>';
    html += '<th>Name</th>';
    html += '<th>Phone</th>';
    html += '<th>Email</th>';
    html += '<th>Supervisor</th>';
    html += '<th>Job Title</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="color: black" class="myTable">';

    if (data.length === 0) {
        html += `<td colspan="7" style="color: red;">No employee found</td>`;
        $('#reportContent').html(html);
        $('#reportContent').show();
    }

    html += '</tbody>';
    html += '</table>';
    html += `</div>`;
    html += `</div>`;
    html += `</div>`;
    $('#reportContent').html(html);
    $('title').html(`${dept.date}`);
    $('#reportContent').show();

    $('#datatable').dataTable({
        dom: 'Bfrtip',
        data: data,
        columns: [
            { 'data': 'date' },
            { 'data': 'staffID' },
            { 'data': 'name' },
            { 'data': 'phone' },
            { 'data': 'email' },
            { 'data': 'super' },
            { 'data': 'jobTitle' },
        ],
        buttons: [{
                extend: 'excel',
                className: 'btn btn-success btn-sm',
                text: '<i class="fas fa-file-excel"> Excel</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    // columns: ':visible'
                }
            },
            {
                extend: 'pdf',
                // titleAttr: 'Print this dem file',
                className: 'btn btn-warning btn-sm',
                text: '<i class="fas fa-file-pdf"> PDF</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            },
            {
                extend: 'print',
                className: 'btn btn-info btn-sm',
                text: '<i class="fas fa-print"> Print</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        ]
    })

}

function jobAll(data, date) {
    let html = '<hr>';
    // html += `<style>
    //     body {
    //     font: normal medium/1.4 sans-serif;
    //     } table {
    //     border-collapse: collapse;
    //     padding-right: 15px;
    //     }
    //     th, td {
    //     padding: 0.25rem;
    //     text-align: left;
    //     border: 1px solid #ccc;
    //     }

    //     thead tr {
    //     background: #008a9f;
    //     }
    //     </style>`;
    // html += `
    //     <button type="submit" target="_blank" style="float: right; margin-right: 20px;" value="add" class="btn btn-warning btn-sm"><i class="fas fa-file-pdf"></i> PDF</button>
    //     <br>`;
    html += `<center><span style="color: black; font-size: 20px; text-decoration: underline;">${date}</span></center>`

    html += '<table border="1" cellpadding="4" cellspacing="0" style="font-family: arial; font-size: 13px;text-align:left;width : 100%;" id="datatable">';
    html += '<thead class="table-dark" style="font-size:15px">';
    html += '<tr>';
    html += '<th scope="col">Date</th>';
    html += '<th scope="col">Job title</th>';
    html += '<th scope="col">Job description</th>';
    html += '<th scope="col">Total Employees</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="color: black;">';
    if (data.length === 0) {
        html += `<td colspan="4" style="color: red;">No job description found</td>`;
        $('#reportContent').html(html);
        $('#reportContent').show();
    }

    html += '</tbody>';
    html += '</table>';

    $('#reportContent').html(html);
    $('title').html(`${date}`);
    $('#reportContent').show();
    $('#datatable').dataTable({
        dom: 'Bfrtip',
        data: data,
        columns: [
            { 'data': 'date' },
            { 'data': 'jobTitle' },
            { 'data': 'jobDescription' },
            { 'data': 'total' },
        ],
        buttons: [{
                extend: 'excel',
                className: 'btn btn-success btn-sm',
                text: '<i class="fas fa-file-excel"> Excel</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    // columns: ':visible'
                }
            },
            {
                extend: 'pdf',
                // titleAttr: 'Print this dem file',
                className: 'btn btn-warning btn-sm',
                text: '<i class="fas fa-file-pdf"> PDF</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            },
            {
                extend: 'print',
                className: 'btn btn-info btn-sm',
                text: '<i class="fas fa-print"> Print</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        ]
    })
}

function jobBy(job, data) {
    let html = '';

    html += `<link href="/css/employee-style.css" rel="stylesheet">`;

    $('#reportContent').html('');
    //     html += `<style>
    //      .hr {margin: 0px;}
    //      .lab {color: #000000;}
    //      .scroll-div {
    //     overflow-y: scroll;
    //     height: 200px;
    //     width: 100%;
    // }
    //     </style>`;

    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;

    html += `<div class="panel-heading" style="font-size: 15px; background: black; color: white"></div>`;

    html += `<div class="panel-body">`;

    html += `<center>
    <label id="headposi" style="text-align: center; color: #00008B; font-size: 20px;">${job.title}</label>  <br>  
    <label id="headposi" style="text-align: center; color: #00008B; font-size: 15px;">${job.des}</label>    

    </center> <hr class="hr">`;

    html += `<h5 style="text-decoration: underline; color: black">Job Details</h5>`
    html += `<label id="headname" style="text-align: center; color: black; font-size: 20px;">${'Date:'} </label> ${job.date} <br>`;

    html += `<label id="headjob" style="text-align: center; color: black; font-size: 20px;">${'Total employee:'} </label> ${job.total}<br>`;

    html += `<center><span style="color: black; font-size: 20px; text-decoration: underline;">${job.range}</span></center>`

    html += '<table border="1" cellpadding="4" cellspacing="0" style="font-family: arial; font-size: 13px;text-align:left;width : 100%;" id="datatable">';
    html += '<thead class="table-dark" style="font-size:15px">';
    html += '<tr>';
    html += '<th>Date employed</th>';
    html += '<th>StaffID</th>';
    html += '<th>Name</th>';
    html += '<th>Phone</th>';
    html += '<th>Email</th>';
    html += '<th>Supervisor</th>';
    html += '<th>Department</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="color: black; class="myTable">';

    if (data.length === 0) {
        html += `<td colspan="7" style="color: red;">No employee found</td>`;
        $('#reportContent').html(html);
        $('#reportContent').show();
    }

    html += '</tbody>';
    html += '</table>';
    html += `</div>`;
    html += `</div>`;
    html += `</div>`;

    $('#reportContent').html(html);
    $('title').html(`${job.date}`);
    $('#reportContent').show();
    $('#datatable').dataTable({
        dom: 'Bfrtip',
        data: data,
        columns: [
            { 'data': 'date' },
            { 'data': 'staffID' },
            { 'data': 'name' },
            { 'data': 'phone' },
            { 'data': 'email' },
            { 'data': 'super' },
            { 'data': 'dept' },
        ],
        buttons: [{
                extend: 'excel',
                className: 'btn btn-success btn-sm',
                text: '<i class="fas fa-file-excel"> Excel</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    // columns: ':visible'
                }
            },
            {
                extend: 'pdf',
                // titleAttr: 'Print this dem file',
                className: 'btn btn-warning btn-sm',
                text: '<i class="fas fa-file-pdf"> PDF</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            },
            {
                extend: 'print',
                className: 'btn btn-info btn-sm',
                text: '<i class="fas fa-print"> Print</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        ]
    })
}

function salaryAll(data, date) {
    let html = '<hr>';
    // html += `<style>
    //     body {
    //     font: normal medium/1.4 sans-serif;
    //     } table {
    //     border-collapse: collapse;
    //     padding-right: 15px;
    //     }
    //     th, td {
    //     padding: 0.25rem;
    //     text-align: left;
    //     border: 1px solid #ccc;
    //     }

    //     thead tr {
    //     background: #008a9f;
    //     }
    //     </style>`;
    // html += `
    //     <button type="submit" target="_blank" style="float: right; margin-right: 20px;" value="add" class="btn btn-warning btn-sm"><i class="fas fa-file-pdf"></i> PDF</button>
    //     <br>`;
    html += `<center><span style="color: black; font-size: 20px; text-decoration: underline;">${date}</span></center>`

    html += '<table border="1" cellpadding="4" cellspacing="0" style="font-family: arial; font-size: 13px;text-align:left;width : 100%;" id="datatable">';
    html += '<thead class="table-dark" style="font-size:15px">';
    html += '<tr>';
    html += '<th scope="col">Date</th>';
    html += '<th scope="col">Grade</th>';
    html += '<th scope="col">Description</th>';
    html += '<th scope="col">Base salary</th>';
    html += '<th scope="col">Total allowance</th>';
    html += '<th scope="col">Total Employees</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color:; color:black;">';
    html += `<td colspan="8" style="color: red;"></td>`;

    html += '</tbody>';
    html += '</table>';

    $('#reportContent').html(html);
    $('title').html(`${date}`);
    $('#reportContent').show();
    $('#datatable').dataTable({
        dom: 'Bfrtip',
        data: data,
        columns: [
            { 'data': 'date' },
            { 'data': 'grade' },
            { 'data': 'description' },
            { 'data': 'basic' },
            { 'data': 'totalAllw' },
            { 'data': 'totalEmp' },
        ],
        buttons: [{
                extend: 'excel',
                className: 'btn btn-success btn-sm',
                text: '<i class="fas fa-file-excel"> Excel</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    // columns: ':visible'
                }
            },
            {
                extend: 'pdf',
                // titleAttr: 'Print this dem file',
                className: 'btn btn-warning btn-sm',
                text: '<i class="fas fa-file-pdf"> PDF</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            },
            {
                extend: 'print',
                className: 'btn btn-info btn-sm',
                text: '<i class="fas fa-print"> Print</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        ]
    })
}

function salaryBy(salary, data) {
    let html = '';

    html += `<link href="/css/employee-style.css" rel="stylesheet">`;

    $('#reportContent').html('');
    //     html += `<style>
    //      .hr {margin: 0px;}
    //      .lab {color: #000000;}
    //      .scroll-div {
    //     overflow-y: scroll;
    //     height: 200px;
    //     width: 100%;
    // }
    //     </style>`;

    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;

    html += `<div class="panel-heading" style="font-size: 15px; background: black; color: white"></div>`;

    html += `<div class="panel-body">`;

    html += `<center>
    <label id="headposi" style="text-align: center; color: #00008B; font-size: 20px;">${salary.grade} Salary grade</label>  <br>  
    <label id="headposi" style="text-align: center; color: #00008B; font-size: 15px;">${salary.des}</label>    

    </center> <hr class="hr">`;

    html += `<h5 style="text-decoration: underline; color: black">Salary Details</h5>`

    html += '<table border="1">'

    html += `<tr> <td><label id="headname" style="text-align: center; color: black; font-size: 20px;">${'Date:'} </label> ${salary.date} </td>`

    html += `<td><label id="headjob" style="text-align: center; color: black; font-size: 20px;">${'Total employee:'} </label> ${salary.total}</td></tr>`;

    html += `<tr><td><label id="headjob" style="text-align: center; color: black; font-size: 20px;">${'Base:'} </label> ${salary.basic}`;

    html += `<td><label id="headjob" style="text-align: center; color: black; font-size: 20px;">${'Total base:'} </label> ${salary.totalGross}</td></tr>`;

    html += `<tr><td><label id="headjob" style="text-align: center; color: black; font-size: 20px;">${'No. of allowance:'} </label> ${salary.totalAllw}`;

    html += `<td><label id="headjob" style="text-align: center; color: black; font-size: 20px;">${'Total allowance:'} </label> ${salary.allwAmount}</td></tr>`;

    html += `</table>`

    html += `<center><span style="color: black; font-size: 20px; text-decoration: underline;">${salary.range}</span></center>`

    html += '<table border="1" cellpadding="4" cellspacing="0" style="font-family: arial; font-size: 13px;text-align:left;width : 100%;" id="datatable">';
    html += '<thead class="table-dark" style="font-size:15px">';
    html += '<tr>';
    html += '<th>Date employed</th>';
    html += '<th>StaffID</th>';
    html += '<th>Name</th>';
    html += '<th>Phone</th>';
    html += '<th>Email</th>';
    html += '<th>Supervisor</th>';
    html += '<th>Department</th>';
    html += '<th>Job title</th>';
    html += '<th>Leave</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="color: black; class="myTable">';

    if (data.length === 0) {
        html += `<td colspan="7" style="color: red;">No employee found</td>`;
        $('#reportContent').html(html);
        $('#reportContent').show();
    }

    html += '</tbody>';
    html += '</table>';
    html += `</div>`;
    html += `</div>`;
    html += `</div>`;

    $('#reportContent').html(html);
    $('title').html(`${salary.date}`);
    $('#reportContent').show();
    $('#datatable').dataTable({
        dom: 'Bfrtip',
        data: data,
        columns: [
            { 'data': 'date' },
            { 'data': 'staffID' },
            { 'data': 'name' },
            { 'data': 'phone' },
            { 'data': 'email' },
            { 'data': 'super' },
            { 'data': 'dept' },
            { 'data': 'job' },
            { 'data': 'leave' },
        ],
        buttons: [{
                extend: 'excel',
                className: 'btn btn-success btn-sm',
                text: '<i class="fas fa-file-excel"> Excel</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    // columns: ':visible'
                }
            },
            {
                extend: 'pdf',
                // titleAttr: 'Print this dem file',
                className: 'btn btn-warning btn-sm',
                text: '<i class="fas fa-file-pdf"> PDF</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            },
            {
                extend: 'print',
                className: 'btn btn-info btn-sm',
                text: '<i class="fas fa-print"> Print</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        ]
    })
}

function leaveTypes(data, date) {
    let html = '<hr>';
    // html += `
    //     <button type="submit" target="_blank" style="float: right; margin-right: 20px;" value="add" class="btn btn-warning btn-sm"><i class="fas fa-file-pdf"></i> PDF</button>
    //     <br>`;
    html += `<center><span style="color: black; font-size: 20px; text-decoration: underline;">${date}</span></center>`

    html += '<table border="1" cellpadding="4" cellspacing="0" style="font-family: arial; font-size: 13px;text-align:left;width : 100%;" id="datatable">';
    html += '<thead class="table-dark" style="font-size:15px">';
    html += '<tr>';
    html += '<th scope="col">Date</th>';
    html += '<th scope="col">Leave policy</th>';
    html += '<th scope="col">Description</th>';
    html += '<th scope="col">Days</th>';
    html += '<th scope="col">Gender</th>';
    html += '<th scope="col">Carry on</th>';
    html += '<th scope="col">Linked employees</th>';
    html += '<th scope="col">On leave</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color:; color:black;">';
    html += `<td colspan="8" style="color: red;"></td>`;

    html += '</tbody>';
    html += '</table>';

    $('#reportContent').html(html);
    $('title').html(`${date}`);
    $('#reportContent').show();
    $('#datatable').dataTable({
        dom: 'Bfrtip',
        data: data,
        columns: [
            { 'data': 'date' },
            { 'data': 'type' },
            { 'data': 'des' },
            { 'data': 'days' },
            { 'data': 'gender' },
            { 'data': 'carryon' },
            { 'data': 'linked' },
            { 'data': 'onLeave' },
        ],
        buttons: [{
                extend: 'excel',
                className: 'btn btn-success btn-sm',
                text: '<i class="fas fa-file-excel"> Excel</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    // columns: ':visible'
                }
            },
            {
                extend: 'pdf',
                // titleAttr: 'Print this dem file',
                className: 'btn btn-warning btn-sm',
                text: '<i class="fas fa-file-pdf"> PDF</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            },
            {
                extend: 'print',
                className: 'btn btn-info btn-sm',
                text: '<i class="fas fa-print"> Print</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        ]
    })
}

function onLeave(data, date) {
    let html = '<hr>';
    // html += `
    //     <button type="submit" target="_blank" style="float: right; margin-right: 20px;" value="add" class="btn btn-warning btn-sm"><i class="fas fa-file-pdf"></i> PDF</button>
    //     <br>`;
    html += `<center><span style="color: black; font-size: 20px; text-decoration: underline;">${date}</span></center>`

    html += '<table border="1" cellpadding="4" cellspacing="0" style="font-family: arial; font-size: 13px;text-align:left;width : 100%;" id="datatable">';
    html += '<thead class="table-dark" style="font-size:15px">';
    html += '<tr>';
    html += `<th>Applied date</th>
            <th>Name</th>
            <th>Department</th>
            <th>Job title</th>
            <th>Approved by</th>
            <th>From</th>
            <th>Reporting</th>
            <th>Status</th>
            <th>Days</th>
            <th>Leave type</th>
            <th>Reason</th>
            `;
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color:; color:black;">';
    html += `<td colspan="8" style="color: red;"></td>`;

    html += '</tbody>';
    html += '</table>';

    $('#reportContent').html(html);
    $('title').html(`${date}`);
    $('#reportContent').show();
    $('#datatable').dataTable({
        dom: 'Bfrtip',
        data: data,
        columns: [
            { 'data': 'date' },
            { 'data': 'name' },
            { 'data': 'dept' },
            { 'data': 'job' },
            { 'data': 'approvEmpl' },
            { 'data': 'from' },
            { 'data': 'to' },
            { 'data': 'status' },
            { 'data': 'days' },
            { 'data': 'leaveType' },
            { 'data': 'reason' },
        ],
        buttons: [{
                extend: 'excel',
                className: 'btn btn-success btn-sm',
                text: '<i class="fas fa-file-excel"> Excel</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    // columns: ':visible'
                }
            },
            {
                extend: 'pdf',
                // titleAttr: 'Print this dem file',
                className: 'btn btn-warning btn-sm',
                text: '<i class="fas fa-file-pdf"> PDF</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            },
            {
                extend: 'print',
                className: 'btn btn-info btn-sm',
                text: '<i class="fas fa-print"> Print</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        ]
    })
}

function approve(data, date) {
    let html = '<hr>';
    // html += `
    //     <button type="submit" target="_blank" style="float: right; margin-right: 20px;" value="add" class="btn btn-warning btn-sm"><i class="fas fa-file-pdf"></i> PDF</button>
    //     <br>`;
    html += `<center><span style="color: black; font-size: 20px; text-decoration: underline;">${date}</span></center>`

    html += '<table border="1" cellpadding="4" cellspacing="0" style="font-family: arial; font-size: 13px;text-align:left;width : 100%;" id="datatable">';
    html += '<thead class="table-dark" style="font-size:15px">';
    html += '<tr>';
    html += `<th>Applied date</th>
            <th>Name</th>
            <th>Department</th>
            <th>Job title</th>
            <th>Approved by</th>
            <th>From</th>
            <th>Reporting</th>
            <th>status</th>
            <th>Days</th>
            <th>Leave type</th>
            <th>Reason</th>
            `;
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color:; color:black;">';
    html += `<td colspan="8" style="color: red;"></td>`;

    html += '</tbody>';
    html += '</table>';

    $('#reportContent').html(html);
    $('title').html(`${date}`);
    $('#reportContent').show();
    $('#datatable').dataTable({
        dom: 'Bfrtip',
        data: data,
        columns: [
            { 'data': 'date' },
            { 'data': 'name' },
            { 'data': 'dept' },
            { 'data': 'job' },
            { 'data': 'approvEmpl' },
            { 'data': 'from' },
            { 'data': 'to' },
            { 'data': 'status' },
            { 'data': 'days' },
            { 'data': 'leaveType' },
            { 'data': 'reason' },
        ],
        buttons: [{
                extend: 'excel',
                className: 'btn btn-success btn-sm',
                text: '<i class="fas fa-file-excel"> Excel</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    // columns: ':visible'
                }
            },
            {
                extend: 'pdf',
                // titleAttr: 'Print this dem file',
                className: 'btn btn-warning btn-sm',
                text: '<i class="fas fa-file-pdf"> PDF</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            },
            {
                extend: 'print',
                className: 'btn btn-info btn-sm',
                text: '<i class="fas fa-print"> Print</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        ]
    })
}

function pending(data, date) {
    let html = '<hr>';
    // html += `
    //     <button type="submit" target="_blank" style="float: right; margin-right: 20px;" value="add" class="btn btn-warning btn-sm"><i class="fas fa-file-pdf"></i> PDF</button>
    //     <br>`;
    html += `<center><span style="color: black; font-size: 20px; text-decoration: underline;">${date}</span></center>`

    html += '<table border="1" cellpadding="4" cellspacing="0" style="font-family: arial; font-size: 13px;text-align:left;width : 100%;" id="datatable">';
    html += '<thead class="table-dark" style="font-size:15px">';
    html += '<tr>';
    html += `<th>Applied date</th>
            <th>Name</th>
            <th>Department</th>
            <th>Job title</th>
            <th>Approved by</th>
            <th>From</th>
            <th>Reporting</th>
            <th>Status</th>
            <th>Days</th>
            <th>Leave type</th>
            <th>Reason</th>
            `;
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color:; color:black;">';
    html += `<td colspan="8" style="color: red;"></td>`;

    html += '</tbody>';
    html += '</table>';

    $('#reportContent').html(html);
    $('title').html(`${date}`);
    $('#reportContent').show();
    $('#datatable').dataTable({
        dom: 'Bfrtip',
        data: data,
        columns: [
            { 'data': 'date' },
            { 'data': 'name' },
            { 'data': 'dept' },
            { 'data': 'job' },
            { 'data': 'approvEmpl' },
            { 'data': 'from' },
            { 'data': 'to' },
            { 'data': 'status' },
            { 'data': 'days' },
            { 'data': 'leaveType' },
            { 'data': 'reason' },
        ],
        buttons: [{
                extend: 'excel',
                className: 'btn btn-success btn-sm',
                text: '<i class="fas fa-file-excel"> Excel</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    // columns: ':visible'
                }
            },
            {
                extend: 'pdf',
                // titleAttr: 'Print this dem file',
                className: 'btn btn-warning btn-sm',
                text: '<i class="fas fa-file-pdf"> PDF</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            },
            {
                extend: 'print',
                className: 'btn btn-info btn-sm',
                text: '<i class="fas fa-print"> Print</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        ]
    })
}

function rejected(data, date) {
    let html = '<hr>';
    // html += `
    //     <button type="submit" target="_blank" style="float: right; margin-right: 20px;" value="add" class="btn btn-warning btn-sm"><i class="fas fa-file-pdf"></i> PDF</button>
    //     <br>`;
    html += `<center><span style="color: black; font-size: 20px; text-decoration: underline;">${date}</span></center>`

    html += '<table border="1" cellpadding="4" cellspacing="0" style="font-family: arial; font-size: 13px;text-align:left;width : 100%;" id="datatable">';
    html += '<thead class="table-dark" style="font-size:15px">';
    html += '<tr>';
    html += `<th>Applied date</th>
            <th>Name</th>
            <th>Department</th>
            <th>Job title</th>
            <th>Approved by</th>
            <th>From</th>
            <th>Reporting</th>
            <th>Days</th>
            <th>Leave type</th>
            <th>Reason</th>
            `;
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color:; color:black;">';
    html += `<td colspan="8" style="color: red;"></td>`;

    html += '</tbody>';
    html += '</table>';

    $('#reportContent').html(html);
    $('title').html(`${date}`);
    $('#reportContent').show();
    $('#datatable').dataTable({
        dom: 'Bfrtip',
        data: data,
        columns: [
            { 'data': 'date' },
            { 'data': 'name' },
            { 'data': 'dept' },
            { 'data': 'job' },
            { 'data': 'approvEmpl' },
            { 'data': 'from' },
            { 'data': 'to' },
            { 'data': 'days' },
            { 'data': 'leaveType' },
            { 'data': 'reason' },
        ],
        buttons: [{
                extend: 'excel',
                className: 'btn btn-success btn-sm',
                text: '<i class="fas fa-file-excel"> Excel</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    // columns: ':visible'
                }
            },
            {
                extend: 'pdf',
                // titleAttr: 'Print this dem file',
                className: 'btn btn-warning btn-sm',
                text: '<i class="fas fa-file-pdf"> PDF</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            },
            {
                extend: 'print',
                className: 'btn btn-info btn-sm',
                text: '<i class="fas fa-print"> Print</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        ]
    })
}

function allLeave(data, date) {
    let html = '<hr>';
    // html += `
    //     <button type="submit" target="_blank" style="float: right; margin-right: 20px;" value="add" class="btn btn-warning btn-sm"><i class="fas fa-file-pdf"></i> PDF</button>
    //     <br>`;
    html += `<center><span style="color: black; font-size: 20px; text-decoration: underline;">${date}</span></center>`

    html += '<table border="1" cellpadding="4" cellspacing="0" style="font-family: arial; font-size: 13px;text-align:left;width : 100%;" id="datatable">';
    html += '<thead class="table-dark" style="font-size:15px">';
    html += '<tr>';
    html += `<th>Applied date</th>
            <th>Name</th>
            <th>Department</th>
            <th>Job title</th>
            <th>Approved by</th>
            <th>From</th>
            <th>Reporting</th>
            <th>Status</th>
            <th>Days</th>
            <th>Leave type</th>
            <th>Reason</th>
            `;
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color:; color:black;">';
    html += `<td colspan="8" style="color: red;"></td>`;

    html += '</tbody>';
    html += '</table>';

    $('#reportContent').html(html);
    $('title').html(`${date}`);
    $('#reportContent').show();
    $('#datatable').dataTable({
        dom: 'Bfrtip',
        data: data,
        columns: [
            { 'data': 'date' },
            { 'data': 'name' },
            { 'data': 'dept' },
            { 'data': 'job' },
            { 'data': 'approvEmpl' },
            { 'data': 'from' },
            { 'data': 'to' },
            { 'data': 'status' },
            { 'data': 'days' },
            { 'data': 'leaveType' },
            { 'data': 'reason' },
        ],
        buttons: [{
                extend: 'excel',
                className: 'btn btn-success btn-sm',
                text: '<i class="fas fa-file-excel"> Excel</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    // columns: ':visible'
                }
            },
            {
                extend: 'pdf',
                // titleAttr: 'Print this dem file',
                className: 'btn btn-warning btn-sm',
                text: '<i class="fas fa-file-pdf"> PDF</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            },
            {
                extend: 'print',
                className: 'btn btn-info btn-sm',
                text: '<i class="fas fa-print"> Print</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        ]
    })
}

function attendancebydate(data, date) {
    let html = '<hr>';
    // html += `
    //     <button type="submit" target="_blank" style="float: right; margin-right: 20px;" value="add" class="btn btn-warning btn-sm"><i class="fas fa-file-pdf"></i> PDF</button>
    //     <br>`;
    html += `<center><span style="color: black; font-size: 20px; text-decoration: underline;">${date}</span></center>`

    html += '<table border="1" cellpadding="4" cellspacing="0" style="font-family: arial; font-size: 13px;text-align:left;width : 100%;" id="datatable">';
    html += '<thead class="table-dark" style="font-size:15px">';
    html += '<tr>';
    html += '<th scope="col">Photo</th>';
    html += '<th scope="col">Name</th>';
    html += '<th scope="col">Dept</th>';
    html += '<th scope="col">Staff ID</th>';
    html += '<th scope="col">Clock in</th>';
    html += '<th scope="col">Clock out</th>';
    html += '<th scope="col">Late (Mins)</th>';
    html += '<th scope="col">CloseBT (Mins)</th>';
    html += '<th scope="col">Overtime (Hours)</th>';
    html += '<th scope="col">Shift</th>';
    html += '<th scope="col">Leave type</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color:; color:black;">';
    html += `<td colspan="8" style="color: red;"></td>`;

    html += '</tbody>';
    html += '</table>';

    $('#reportContent').html(html);
    $('title').html(`${date}`);
    $('#reportContent').show();
    $('#datatable').dataTable({
        dom: 'Bfrtip',
        data: data,
        columns: [
            { 'data': 'photo' },
            { 'data': 'fullname' },
            { 'data': 'dept' },
            { 'data': 'staffID' },
            { 'data': 'startTime' },
            { 'data': 'closeTime' },
            { 'data': 'late' },
            { 'data': 'left_earl' },
            { 'data': 'overtime' },
            { 'data': 'shift' },
            { 'data': 'leavTyp' }
        ],
        buttons: [{
                extend: 'excel',
                className: 'btn btn-success btn-sm',
                text: '<i class="fas fa-file-excel"> Excel</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    // columns: ':visible'
                }
            },
            {
                extend: 'pdf',
                // titleAttr: 'Print this dem file',
                className: 'btn btn-warning btn-sm',
                text: '<i class="fas fa-file-pdf"> PDF</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            },
            {
                extend: 'print',
                className: 'btn btn-info btn-sm',
                text: '<i class="fas fa-print"> Print</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: false,
                    // columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        ]
    })
}

function attendancebydaterange(data, date) {
    let html = '<hr>';
    // html += `
    //     <button type="submit" target="_blank" style="float: right; margin-right: 20px;" value="add" class="btn btn-warning btn-sm"><i class="fas fa-file-pdf"></i> PDF</button>
    //     <br>`;
    html += `<center><span style="color: black; font-size: 20px; text-decoration: underline;">${date}</span></center>`

    html += '<table border="1" cellpadding="4" cellspacing="0" style="font-family: arial; font-size: 13px;text-align:left;width : 100%;" id="datatable">';
    html += '<thead class="table-dark" style="font-size:15px">';
    html += '<tr>';
    html += '<th scope="col">Date</th>';
    html += '<th scope="col">Shift</th>';
    html += '<th scope="col">Clock In</th>';
    html += '<th scope="col">Clock Out</th>';
    html += '<th scope="col">Late(Mins)</th>';
    html += '<th scope="col">CloseBT(Mins)</th>';
    html += '<th scope="col">Overtime (Hours)</th>';
    html += '<th scope="col">Leave type</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color:; color:black;">';
    html += `<td colspan="8" style="color: red;"></td>`;

    html += '</tbody>';
    html += '</table>';

    $('#reportContent').html(html);
    $('title').html(`${date}`);
    $('#reportContent').show();
    $('#datatable').dataTable({
        dom: 'Bfrtip',
        data: data,
        columns: [
            { 'data': 'date' },
            { 'data': 'shift' },
            { 'data': 'startTime' },
            { 'data': 'closeTime' },
            { 'data': 'late' },
            { 'data': 'left_earl' },
            { 'data': 'overtime' },
            { 'data': 'leavTyp' }
        ],
        buttons: [{
                extend: 'excel',
                className: 'btn btn-success btn-sm',
                text: '<i class="fas fa-file-excel"> Excel</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    // columns: ':visible'
                }
            },
            {
                extend: 'pdf',
                // titleAttr: 'Print this dem file',
                className: 'btn btn-warning btn-sm',
                text: '<i class="fas fa-file-pdf"> PDF</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            },
            {
                extend: 'print',
                className: 'btn btn-info btn-sm',
                text: '<i class="fas fa-print"> Print</i>',
                messageTop: '',
                exportOptions: {
                    stripHtml: true,
                    // columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        ]
    })
}

$(document).ready(function() {

    $(document).on('click', '.reportManager', function() {
        $('title').html('Report Manager');
        $("#loader").show();
        reportManager();
    })

    $(document).on('change', '#reportType', function() {
        const reportType = $('#reportType').val();
        if (!reportType) {
            $("#loader").show();
            reportManager();
            // $('#error_reportType').html('Please select report type');
            // $('#subtypeOne').val('');
            // $('#subtypeTwo').val('');
            return false;
        }
        if (reportType == 'employees') {

            const html = `<label class="colr">Subtype one</label>
                                <select type="text" name="subtypeOne" id="subtypeOne">
                                <option value="">Select subtype one</option>
                                <option value="all">All</option>
                                <option value="department">Department</option>
                                <option value="job description">Job title</option>
                                <option value="salary grades">Salary grades</option>
                                <option hidden value="leave status">Leave status</option>
                                <option hidden value="system users">System users</option>
                                <option hidden value="SSNIT">SSNIT</option>
                                <option hidden value="banking">Banking</option>
                                <option hidden value="gender & family">Gender & family</option>
                                </select>
                                <span id="error_" class="text-danger"></span>`;
            $('.subtypeOne').html(html);
            $('.subtypeOne').show();
            $('.todate').show();

            $('#subtypeTwo').val('');
            $('.subtypeTwo').hide();

            $('#error_reportType').html('');
            return false;
        }

        if (reportType == 'departments') {

            const html = `<label class="colr">Subtype one</label>
                                <select type="text" name="subtypeOne" id="subtypeOne">
                                
                                </select>
                                <span id="error_subtypeOne" class="text-danger"></span>`;
            $('.subtypeOne').html(html);
            getDeparts('subtypeOne', '', '');
            $('.subtypeOne').show();

            const htmlstt = `<label class="colr">Subtype two</label>
                                <select type="text" name="subtypeTwo" id="subtypeTwo">
                                <option value="all">All</option>
                                <option value="heads">Heads</option>
                                <option value="vacants">Vacants</option>
                                </select>
                                <span id="error_subtypeTwo" class="text-danger"></span>`;
            $('.subtypeTwo').html(htmlstt);
            $('.subtypeTwo').show();
            $('.todate').show();
            $('#error_reportType').html('');
            return false;
        }

        if (reportType == 'job description') {
            const html = `<label class="colr">Subtype one</label>
                            <select type="text" name="subtypeOne" id="subtypeOne">
                                <option value="all">All</option>
                                <option value="with employees">With employees</option>
                                <option value="without employees">Without employees</option>
                            </select>
                            <span id="error_subtypeOne" class="text-danger"></span>`;
            $('.subtypeOne').html(html);
            $('.subtypeOne').show();

            $('#subtypeTwo').val('');
            $('.subtypeTwo').hide();
            $('.todate').show();
            $('#error_reportType').html('');

            return false;
        }

        if (reportType == 'salary grades') {
            const html = `<label class="colr">Subtype one</label>
                            <select type="text" name="subtypeOne" id="subtypeOne">
                                <option value="grades">Grades</option>
                                <option value="allowance">Allowance</option>
                            </select>
                            <span id="error_subtypeOne" class="text-danger"></span>`;
            $('.subtypeOne').html(html);
            $('.subtypeOne').show();

            $('#subtypeTwo').val('');
            $('.subtypeTwo').hide();
            $('.todate').show();
            $('#error_reportType').html('');

            return false;
        }

        if (reportType == 'leaves') {
            const html = `<label class="colr">Subtype one</label>
                            <select type="text" name="subtypeOne" id="subtypeOne">
                                <option value="leaves">Leave policies</option>
                                <option value="on leave">On leave</option>
                                <option value="approve leave">Approved leave</option>
                                <option value="pending leave">Pending leave</option>
                                <option value="rejected leave">Rejected leave</option>
                                <option value="all">All leave</option>
                            </select>
                            <span id="error_subtypeOne" class="text-danger"></span>`;
            $('.subtypeOne').html(html);
            $('.subtypeOne').show();

            $('#subtypeTwo').val('');
            $('.subtypeTwo').hide();
            $('.todate').show();
            $('#error_reportType').html('');

            return false;
        }

        if (reportType == 'attendance') {
            const html = `<label class="colr">Subtype one</label>
                            <select type="text" name="subtypeOne" id="subtypeOne">
                                <option value="">Select date</option>
                                <option value="bydate">Date</option>
                                <option value="daterange">Date range</option>
                            </select>
                            <span id="error_subtypeOne" class="text-danger"></span>`;
            $('.subtypeOne').html(html);
            $('.subtypeOne').show();

            $('#subtypeTwo').val('');
            $('.subtypeTwo').hide();
            $('.todate').show();
            $('#error_reportType').html('');

            return false;
        }

    })

    $(document).on('change', '#subtypeOne', function() {
        const subtypeOne = $('#subtypeOne').val();
        const reportType = $('#reportType').val();
        const alls = ['employees'];

        if (!subtypeOne) {
            $('#error_subtypeOne').html('Please select an option');
            $("#loader").show();
            reportManager();
            return false;
        }
        if (subtypeOne == 'department' && reportType == 'employees') {
            const html = `<label class="colr">Subtype two</label>
                                <select type="text" name="subtypeTwo" id="subtypeTwo">
                                
                                </select>
                                <span id="error_" class="text-danger"></span>`;
            $('.subtypeTwo').html(html);
            getDeparts('subtypeTwo', '', '');
            $('.subtypeTwo').show();
            return false;
        }

        if (subtypeOne == 'job description' && reportType == 'employees') {
            const html = `<label class="colr">Subtype two</label>
                                <select type="text" name="subtypeTwo" id="subtypeTwo">
                                
                                </select>
                                <span id="error_" class="text-danger"></span>`;
            $('.subtypeTwo').html(html);
            getJobTs('subtypeTwo', '', '');
            $('.subtypeTwo').show();
            return false;
        }

        if (subtypeOne == 'salary grades' && reportType == 'employees') {
            const html = `<label class="colr">Subtype two</label>
                                <select type="text" name="subtypeTwo" id="subtypeTwo">
                                
                                </select>
                                <span id="error_" class="text-danger"></span>`;
            $('.subtypeTwo').html(html);
            getSalaries('subtypeTwo', '', '');
            $('.subtypeTwo').show();
            return false;
        }

        if (subtypeOne == 'leave status' && reportType == 'employees') {
            const html = `<label class="colr">Subtype two</label>
                                <select type="text" name="subtypeTwo" id="subtypeTwo">
                                <option value="all">All</option>
                                <option value="on leave">On leave</option>
                                <option value="off leave">Off leave</option>
                                </select>
                                <span id="error_" class="text-danger"></span>`;
            $('.subtypeTwo').html(html);
            // getSalaries('subtypeTwo', '', '');
            $('.subtypeTwo').show();
            return false;
        }

        if (subtypeOne == 'system users' && reportType == 'employees') {
            const html = `<label class="colr">Subtype two</label>
                                <select type="text" name="subtypeTwo" id="subtypeTwo">
                                <option value="all">All</option>
                                <option value="system users">System users</option>
                                <option value="non system users">Non system users</option>
                                </select>
                                <span id="error_" class="text-danger"></span>`;
            $('.subtypeTwo').html(html);
            // getSalaries('subtypeTwo', '', '');
            $('.subtypeTwo').show();
            return false;
        }

        if (subtypeOne == 'SSNIT' && reportType == 'employees') {
            const html = `<label class="colr">Subtype two</label>
                                <select type="text" name="subtypeTwo" id="subtypeTwo">
                                <option value="all">All</option>
                                <option value="contributors">Contributors</option>
                                <option value="non contributors">Non contributors</option>
                                </select>
                                <span id="error_" class="text-danger"></span>`;
            $('.subtypeTwo').html(html);
            // getSalaries('subtypeTwo', '', '');
            $('.subtypeTwo').show();
            return false;
        }

        if (subtypeOne == 'banking' && reportType == 'employees') {
            const html = `<label class="colr">Subtype two</label>
                                <select type="text" name="subtypeTwo" id="subtypeTwo">
                                <option value="all">All</option>
                                <option value="account holders">Account holders</option>
                                <option value="non account holders">Non account holders</option>
                                </select>
                                <span id="error_" class="text-danger"></span>`;
            $('.subtypeTwo').html(html);
            // getSalaries('subtypeTwo', '', '');
            $('.subtypeTwo').show();
            return false;
        }

        if (subtypeOne == 'gender & family' && reportType == 'employees') {
            const html = `<label class="colr">Subtype two</label>
                            <select type="text" name="subtypeTwo" id="subtypeTwo">
                            <option value="males">Males</option>
                            <option value="Females">Females</option>
                            <option value="singles">Singles</option>
                            <option value="married">Married</option>
                            <option value="dependants">Dependants</option>
                            </select>
                            <span id="error_" class="text-danger"></span>`;
            $('.subtypeTwo').html(html);
            // getSalaries('subtypeTwo', '', '');
            $('.subtypeTwo').show();
            return false;
        }

        if (reportType == 'departments' && subtypeOne != '') {
            $('#subtypeTwo').val('');
            $('.subtypeTwo').hide();
            $('.todate').show();
            return false;
        }

        if (subtypeOne == 'bydate' && reportType == 'attendance') {
            getDeparts('subtypeTwo', '', '');
            $('.todate').hide();
            $('.subtypeTwo').show();
            return false;
        }

        if (subtypeOne == 'daterange' && reportType == 'attendance') {
            // getDeparts('subtypeTwo', '', '');
            getEmployees('subtypeTwo', '', '');
            $('.todate').show();
            $('.subtypeTwo').show();
            return false;
        }
    });

    $(document).on('click', '.process', function() {

        const html = 'Report here';
        $('.appendReport').html(html);
    });

    $(document).on('submit', '#querySystem', function(e) {
        e.preventDefault();

        let form = $(this)[0];
        let data = new FormData(form);

        if ($('#reportType').val() == 'attendance' && $('#subtypeOne').val() == 'daterange' && $('subtypeTwo').val() !== '') {
            // alert('All set for now');
            const action = `getEmplyAttendMarked/${$('#fromDate').val()}/${$('#toDate').val()}/${$('#subtypeTwo').val()}`;
            // console.log(action);
            $("#loader").show();
            let getReport = getSubmit(action, 'GET');
            getReport.done(function(response) {
                // if (response.key == 'attendbyd') {
                console.log('Data => ', response);
                attendancebydaterange(response.data, response.date);
                $("#loader").hide();
                // }

            })
            return false;
        }

        $("#loader").show();
        let getReport = submit(data, $(this).attr('action'), 'POST');
        getReport.done(function(response) {
            // console.log('In success', response);
            if (response.key == 'employees all') {
                // if (response.data.length == 0) {
                //     $('#reportContent').html('');
                //     $('#reportContent').hide();
                //     return false;
                // } else {
                // window.open(`${response.datafile}`, '_blank');
                empAll(response.data, response.date, response.datafile);
                $("#loader").hide();
                // }
            }
            if (response.key == 'dept all') {
                // if (response.data.length == 0) {
                //     $('#reportContent').html('');
                //     $('#reportContent').hide();
                //     return false;
                // } else {
                deptAll(response.data, response.date);
                $("#loader").hide();
                // }
            }

            if (response.key == 'employUD') {
                employUD(response.dept, response.data);
                $("#loader").hide();
            }

            if (response.key == 'job all') {
                jobAll(response.data, response.date);
                $("#loader").hide();
            }

            if (response.key == 'jobbyID') {
                jobBy(response.job, response.data);
                $("#loader").hide();
            }

            if (response.key == 'salary all') {
                salaryAll(response.data, response.date);
                $("#loader").hide();
            }

            if (response.key == 'salaryByID') {
                salaryBy(response.salary, response.data);
                $("#loader").hide();
            }

            if (response.key == 'leavesType') {
                leaveTypes(response.data, response.date);
                $("#loader").hide();
            }

            if (response.key == 'onLeave') {
                onLeave(response.data, response.date);
                $("#loader").hide();
            }

            if (response.key == 'approve') {
                approve(response.data, response.date);
                $("#loader").hide();
            }

            if (response.key == 'pending') {
                pending(response.data, response.date);
                $("#loader").hide();
            }

            if (response.key == 'rejected') {
                rejected(response.data, response.date);
                $("#loader").hide();
            }

            if (response.key == 'all') {
                allLeave(response.data, response.date);
                $("#loader").hide();
            }

            if (response.key == 'attendbydate') {
                attendancebydate(response.data, response.date);
                $("#loader").hide();
            }
            // fillEmpList(response.data);
            // terminalManager($('#terminalID').val(), $('#selectTerminal').val());
        })

        // alert('All to for now !!');
    })

});