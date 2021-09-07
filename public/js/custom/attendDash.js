// const moment = require('moment');
let tdToday = new Date();
let month = tdToday.getMonth();
let day = tdToday.getDate();
let year = tdToday.getFullYear();

const getDigits = (dig) => {
    if (dig.toString().length == 1) {
        return `0${dig}`;
    }
    return dig;
}

function getAttndReport(data = '') {
    let html = '';
    $('.mainPage').html('');
    html += `<link href="/css/employee-style.css" rel="stylesheet">`;

    html += `<style>
        body {
        font: normal medium/1.4 sans-serif;
        }
        table {
        border-collapse: collapse;
        width: 100%;
        padding-right: 15px;
        }
        th, td {
        padding: 0.25rem;
        text-align: center;
        border: 1px solid #ccc;
        }

        thead tr {
        background: #008a9f;
        }

        .bcolor{
        background: #F0F8FF;
        border-color: white;
        color: black;  
        }

        .hide_column{
        display: none;
        }
</style>`;

    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800"><i class="fas fa-list-alt"></i> Attendance Report</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm getAttndReport"><i';
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Reload Page</a>';
    html += '</div>';

    // html += '<div class="container" style="padding: 0px;">';

    // html += `< div class = "tab-content" style = "margin-top:16px; ">`;
    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;
    html += `<div class="panel-heading" style="font-size: 15px;">Attendance Report</div>`;
    html += `<div class="panel-body">`;
    html += `<form action="getAttendReport" method="POST" enctype="multipart/form-data" id="attendReport">`;
    html += `<label class="user-message user-message--error" style="display: none;"></label>`;
    html += `
        <span id="error_report" class="text-danger"></span><br>
        <label><span class="mr-2 d-none d-lg-inline text-info text-info-600 ">From:</span></label>
                    <input type="date" required name="repFromDate" id="repFromDate" value="">
        <label><span class="mr-2 d-none d-lg-inline text-info text-info-600 ">To:</span></label>
                    <input type="date" required name="repToDate" id="repToDate" value="">
                    <br><br>
                    <center>
                    
                    <input type="hidden" name="_csrf" value="${$('#crsf').val()}">
                    <input hidden name="change" id="change" value="change">
                    <input hidden name="" id="totals" value="">

                      <select name="getdept" id="getdept" style="float: left; margin-left: 150px; margin-right:20px;">
                        <option value="">Select Detpartment.</option>
                    </select><br><br> 

                    <button style="float: left; margin-left: 150px; margin-right:20px;" value="add" class="btn btn-primary btn-sm"><i class="fas fa-plus-circle"></i> Submit</button>

                    <button style="float: left;" value="add" class="btn btn-danger getAttndReport btn-sm"><i class="fas fa-del"></i> Reset</button>
                    
                    </center><br>
                    
                </form>`;

    html += `<div style="float:left; border: 2px solid #008a9f; margin-bottom: 10px; padding: 10px; display:none;" id="daterang"></div>`;
    html += `<hr>`

    html += '<table id="datatable">';
    html += '<thead class="table-dark" style="background-color:#008a9f; ">';
    html += '<tr>';
    html += '<th scope="col">Photo</th>';
    html += '<th scope="col">Name</th>';
    html += '<th scope="col">Dept</th>';
    html += '<th scope="col">ID</th>';
    html += '<th scope="col">Days</th>';
    html += '<th scope="col">Clock in</th>';
    html += '<th scope="col">Clock out</th>';
    html += '<th scope="col">Late (H)</th>';
    html += '<th scope="col">CloseBT (H)</th>';
    html += '<th scope="col">Overtime (H)</th>';

    html += '<th hidden scope="col">fdate</th>';
    html += '<th hidden scope="col">tdate</th>';
    html += '<th hidden scope="col">Id</th>';
    html += '<th hidden scope="col">email</th>';
    html += '<th hidden scope="col">phone</th>';
    html += '<th hidden scope="col">date</th>';
    html += '<th hidden scope="col">photo</th>';
    // html += '<th hidden scope="col">total</th>';

    html += '<th scope="col">Manage</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color: white;">';
    html += `<td colspan="8" style="color: red;"></td>`;

    $('.mainPage').html(html);
    $("#loader").hide();
    getDeparts('getdept', '', '');

    // let dat = new Date(date);
    if (data) {
        // console.log('Data =====> ', data);
        // alert($('#repFromDate').val());
        $("#loader").show();
        $.ajax({
            type: 'POST',
            enctype: 'multipart/form-data',
            url: 'get-attend-report-bydate',
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            success: function(response) {
                // checkPoint('none', 'getAttndReport');
                let mesg = '<center><span id="timeEx" class="text-danger">Sorry this attendance cannot be changed sicne time passed is more than an hour</span></center>';
                if (response === 0) {
                    html += `<td colspan="8" style="color: red;">No attendance data found for this date</td>`;
                    mesg = ''
                        // $('#timeEx').hide();

                }
                // let timepass = false;

                html += '</tbody>';
                html += '</table>';

                html += '<label>Clock in: correct punch before grace period, excluding late punch, Clock out: closing time, includes overtime puch Abs: Absent, percentage average: clockin / clockout * 100</label>';

                html += `</div>`;
                html += `</div>`;
                html += `</div>`;

                $('.mainPage').html(html);
                $("#loader").hide();
                $('title').html($('#compDetails').val());
                $('#daterang').html(response.date);
                $('#daterang').show();
                $('#totals').val(response.total);

                $('#datatable').dataTable({
                    dom: 'Bfrtip',
                    data: response.data,
                    columns: [
                        { 'data': 'photo' },
                        { 'data': 'fullname' },
                        { 'data': 'dept' },
                        { 'data': 'staffID' },
                        { 'data': 'days' },
                        { 'data': 'clockIn' },
                        { 'data': 'clockOut' },
                        { 'data': 'late' },
                        { 'data': 'closeBT' },
                        { 'data': 'overTime' },

                        { 'data': 'fdate', className: "hide_column" },
                        { 'data': 'tdate', className: "hide_column" },
                        { 'data': 'id', className: "hide_column" },
                        { 'data': 'email', className: "hide_column" },
                        { 'data': 'phone', className: "hide_column" },
                        { 'data': 'date', className: "hide_column" },
                        { 'data': 'image', className: "hide_column" },
                        // { 'data': 'totals', className: "hide_column" },

                        { 'data': 'manage' }
                    ],
                    buttons: [{
                            extend: 'excel',
                            className: 'btn btn-success btn-sm',
                            text: '<i class="fas fa-file-excel"> Excel</i>',
                            messageTop: 'Name: N/A.\n Email: adamu@gmail.com',
                            exportOptions: {
                                stripHtml: true,
                                columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                                    // columns: ':visible'
                            }
                        },
                        {
                            extend: 'pdf',
                            // titleAttr: 'Print this dem file',
                            className: 'btn btn-warning btn-sm',
                            text: '<i class="fas fa-file-pdf"> PDF</i>',
                            messageTop: 'Name: N/A.\n Email: na@gmail.com',
                            exportOptions: {
                                stripHtml: true,
                                columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                            }
                        },
                        {
                            extend: 'print',
                            className: 'btn btn-info btn-sm',
                            text: '<i class="fas fa-print"> Print</i>',
                            messageTop: 'Name: N/A.\n Email: na@gmail.com',
                            exportOptions: {
                                stripHtml: false,
                                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                            }
                        }
                    ]
                })
                getDeparts('getdept', '', '');
            },
            error: function(error) {
                console.log('here', error);
                if (error.status === 422) {
                    console.log(error.responseJSON.errorMessage);
                    $('#error_report').html(error.responseJSON.errorMessage);
                } else {
                    errorPage('getAttndReport');

                }
                $("#loader").hide();
            }
        });

    }
}


function dataTable(date) {
    let html = '';
    $('.mainPage').html('');
    html += `<link href="/css/employee-style.css" rel="stylesheet">`;

    html += `<style>
        body {
        font: normal medium/1.4 sans-serif;
        }
        table {
        border-collapse: collapse;
        width: 100%;
        padding-right: 15px;
        }
        th, td {
        padding: 0.25rem;
        text-align: center;
        border: 1px solid #ccc;
        }

        thead tr {
        background: #008a9f;
        }

        .bcolor{
        background: #F0F8FF;
        border-color: white;
        color: black;  
        }
        .hr {margin: 0px;}
    </style>`;
    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800"><i class="fas fa-fingerprint"></i> Attendance Sheet</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm getAttedSheet"><i';
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Reload Page</a>';
    html += '</div>';

    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;
    html += `<div class="panel-heading" style="font-size: 15px;">Mark Employee Attendance</div>`;
    html += `<div class="panel-body">`;
    html += `<form action="markAttend" method="POST" enctype="multipart/form-data" id="markAttend">`;
    html += `<label class="user-message user-message--error" style="display: none;"></label>`;

    html += `
        <center><label><span class="mr-2 d-none d-lg-inline text-info text-info-600 ">Date:</span></label>      
        <input type="date" required name="selectDate" id="selectDate"><br>
        <span id="error_selectDate" class="text-danger"></span>
        </center>
                    <input type="hidden" name="_csrf" value="${$('#crsf').val()}">
                    <input hidden name="change" id="change" value="add">
                    <input hidden name="by_date" id="by_date" value="${new Date(date)}">
                    <button style="float: right; margin-right: 20px;" value="add" class="btn btn-info showSheet btn-sm"><i class="fas fa-edit"></i> Manual Clocking</button>`;
    html += `<br><caption><label>Date: ${new Date(date).toDateString()}</label></caption><hr class="hr">`
    html += '<table id="datatable">';
    html += '<thead class="table-dark" style="background-color:#008a9f; ">';
    html += '<tr>';
    html += '<th scope="col">Photo</th>';
    html += '<th scope="col">Name</th>';
    html += '<th scope="col">Dept</th>';
    html += '<th scope="col">Staff ID</th>';
    html += '<th scope="col">Clock in</th>';
    html += '<th scope="col">Clock out</th>';
    html += '<th scope="col" data-toggle="tooltip" data-placement="top" title="A negative value means late and positive means no not late">Late (Mins)</th>';
    html += '<th scope="col" data-toggle="tooltip" data-placement="top" title="Close before the time">CloseBT (Mins)</th>';
    html += '<th scope="col">Overtime (Hours)</th>';
    html += '<th scope="col">Shift</th>';
    html += '<th scope="col">Leave type</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color: white;">';
    $.ajax({
        type: 'GET',
        url: 'get-attendbydate/' + date, // get-attendbydate
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            checkPoint('none', 'getAttedSheet');
            // console.log('Get employees list');
            // console.log('Data => ', response.data);
            if (response.data.length == 0) {
                html += `<td colspan="10" style="color: red;">No employee data found</td>`;
            }
            html += '</tbody>';
            html += '</table>';
            html += '<label>Red: Absent, Brown: late</label>'
            html += `</form>`;

            html += `</div>`;
            html += `</div>`;
            html += `</div>`;
            $('.mainPage').html(html);
            $("#loader").hide();

            $('title').html(`Attendance for ${new Date(date).toDateString()}`);

            $('#datatable').dataTable({
                dom: 'Bfrtip',
                border: '1',
                data: response.data,
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
                        messageTop: 'Name: N/A.\n Email: na@gmail.com',
                        exportOptions: {
                            stripHtml: true,
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                                // columns: ':visible'
                        }
                    },
                    {
                        extend: 'pdf',
                        // titleAttr: 'Print this dem file',
                        className: 'btn btn-warning btn-sm',
                        text: '<i class="fas fa-file-pdf"> PDF</i>',
                        messageTop: 'Name: N/A.\n Email: na@gmail.com',
                        exportOptions: {
                            stripHtml: true,
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                        }
                    },
                    {
                        extend: 'print',
                        className: 'btn btn-info btn-sm',
                        text: '<i class="fas fa-print"> Print</i>',
                        messageTop: 'Name: N/A.\n Email: na@gmail.com',
                        exportOptions: {
                            stripHtml: false,
                            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                        }
                    }
                ]
            })
        },
        error: function(error) {}
    });

}

function manualClocking() {

    $('title').html('Manual Clocking');
    let html = '';

    html += `<link href="/css/employee-style.css" rel="stylesheet">`;

    $('.mainPage').html('');
    html += `<style>
     .hr {margin: 0px;}
     .lab {color: #000000;}
     .scroll-div {
    overflow-y: scroll;
    height: 200px;
    width: 100%;
}
    </style>`

    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800">Employee Manual Clocking</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm getAttedSheet" id="<%= userDetails[0] %>"><i';
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Back Attendance</a>';
    html += '</div>';

    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;

    html += `<div class="panel-heading" style="font-size: 15px; background: #008a9f; color: white"></div>`;

    html += `<div class="panel-body">`;

    html += `<center><label id="headposi" style="text-align: center; color: #00008B; font-size: 20px;"> Manual clocking for employee unable to punch at the terminal due to unforseen situations</label></center> <hr>`;

    // html += `<div style="width: 800px;">`
    html += `<form action="clockMan" method="POST" id="clockMan" enctype="multipart/form-data">`;

    html += `<div class="row" style="background-color:white;">`;

    html += `<div class="col-lg-12 col-md-12" id="appoint">`;

    // html += `<label style="color: blue; background-color:; font-size: 20px">Complete this form </label> <hr class="hr">`;

    html += `
                <div style="border-color: red; background-color: ; border: 3px solid gray; margin: 0px 100px 0px 100px; padding: 10px;"> 
                <div class="form-group">  
                        <input type="hidden" name="_csrf" value="${$('#crsf').val()}">              
                        <label for="">Date</label>
                        <input required type="date" name="date" id="date">
                        <span id="error_date" class="text-danger"></span>
                        </div>

                <div class="form-group">
                        <label for="">Terminals</label>
                        <select required type="text" name="getterminals" id="getterminals">
                            <option value="">Select a terminal</option>
                        </select>
                        <span id="error_getterminals" class="text-danger"></span>
                        </div>
                <div class="form-group">
                        <label for="">Employee</label>
                        <select required type="text" name="unpunched" id="unpunched">
                        </select> 
                        <span id="error_unpunched" class="text-danger"></span>
                </div>

                <div class="form-group">
                        <label for="">Approved by</label>
                        <select required type="text" name="approveby" id="approveby">
                            <option value=""></option>
                        </select> 
                        <span id="error_approveby" class="text-danger"></span>
                </div>

                <div class="form-group">
                        <label for="">Form</label>
                        <input required type="file" name="fillform" id="fillform" class="checkfilePDF"> 
                        <span id="error_fillform" class="text-danger"></span>
                </div>

                <div class="form-group">
                        <label for="">Session</label>
                        <select required type="text" name="session" id="session">
                            <option value="">Select session</option>
                            <option value="CI">Clock in</option>
                            <option value="CO">Clock out</option>
                            <option value="A">All</option>
                        </select> 
                        <span id="error_session" class="text-danger"></span>
                </div>

                <div id="appendClock">
                
                </div>
                
                <div>
                    <button type="submit" class="btn btn-success btn-sm">Submit</button>
                </div>
                </div>`;

    html += `</div>
    </form>`;

    //Employee details

    html += `</div>`;
    html += `</div>`;

    html += `</div>`;
    html += `</div>`;

    $('.mainPage').html(html);
    fetchTerminals('getterminals', '', '');

    $('.user-message').css({
        'border-color': '',
        'color': 'white',
        'background-color': '',
        'display': 'none'
    });

    // getEmployees()
}

$(document).ready(function() {

    // Department page
    $(document).on('click', '.getAttedSheet', function() {

        const dat = new Date().toLocaleDateString("en-US");
        const date = `${getDigits(dat.split('/')[2])}-${getDigits(dat.split('/')[0])}-${getDigits(dat.split('/')[1])}`;

        $('title').html('Attendance Sheet');
        unactive();
        // getAttendShest(date);
        $("#loader").show();
        dataTable(date);

        logUIAccess('Clicked mark attendance', '.getAttedSheet');

        $('.getAttedSheet').css("color", 'blue');
    });

    $(document).on('change', '#selectDate', function() {
        const date = Math.floor(new Date() / 1000);
        const selectDate = Math.floor(new Date($(this).val()) / 1000);
        if (selectDate > date) {
            $('#error_selectDate').html("Please select date not more than today's date");
            // $(this).val('');
            // alert(`${$(this).val()} 23:59:59`)

        } else {
            $('#error_selectDate').html('')
            const dat = new Date($(this).val()).toLocaleDateString("en-US");
            const date = `${getDigits(dat.split('/')[2])}-${getDigits(dat.split('/')[0])}-${getDigits(dat.split('/')[1])}`;
            $("#loader").show();
            dataTable($(this).val());
            logUIAccess('Clicked mark attendance', '.getAttedSheet');
            // alert(`${$(this).val()} 23:59:59`)
        }
    });

    $(document).on('submit', '#markAttend', function(e) {
        e.preventDefault();
        // alert('All set for now');

        let form = $(this)[0];
        let data = new FormData(form);
        const preAb_val = []
            // alert($('#change').val())
        if ($('#change').val() === 'add') {
            $('.emID').each(function() {
                let preAb_ = document.getElementsByName(`preAb_${$(this).val()}`)[0]
                    // console.log('=======> ', $(this).val());
                if (preAb_.checked) {
                    preAb_val.push(`${preAb_.value}`);
                } else {
                    preAb_val.push(0);
                }
            })
            data.append('preAb_[]', preAb_val)

        } else {
            // alert($('#change').val())
            $('.attendID').each(function() {
                let preAb_ = document.getElementsByName(`preAb_${$(this).val()}`)[0]
                    // console.log('=======> ', $(this).val());
                if (preAb_.checked) {
                    preAb_val.push(`${preAb_.value}`);
                } else {
                    preAb_val.push(0);
                }
            });

            data.append('preAb_[]', preAb_val)

        }

        data.append('preAb_[]', preAb_val)
        const arrayAllwInpt = ['emattdID', 'startTime', 'leavTypId', 'selectDate'];

        // console.log(preAb_val);
        $("#loader").show();
        $.ajax({
            type: 'POST',
            enctype: 'multipart/form-data',
            url: $(this).attr('action'),
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            success: function(response) {
                console.log('In success');
                checkPoint('none', 'getAttedSheet');

                $('.user-message').css('display', 'flex')
                $('.user-message').html('A moment please.....');
                $('.user-message').css({
                    'border-color': 'blue',
                    'color': 'white',
                    'background-color': 'green'
                });

                setTimeout(function() {
                    $('.user-message').css('display', 'none')
                    $('.user-message').html('');
                    unactive();
                    // modal_form('', 'Salary Structure', '');
                    // $('#addSalary').modal('hide');
                    unactive();
                    $('.getAttedSheet').css("color", 'blue');
                    if ($('#change').val() === 'add') {
                        // getAttendShest();
                    } else {
                        let dat = new Date($('#selectDateChange').val())
                        getAttndMarked(dat)
                    }
                }, 1000);
                $("#loader").hide();
            },
            error: function(error) {
                console.log('In error');
                console.log(error)
                if (error.status === 422) {

                    // $('#allwErrors').text('');
                    let errors = '';

                    $.each(error.responseJSON.validationErrors, function(key, value) {

                        if (arrayAllwInpt.includes(value.param)) {
                            errors += `<p> ${value.msg}</p>`;
                        } else {
                            // arrayB.slice
                            $('#error_' + value.param).text(value.msg);
                            // $('#' + value.param).addClass('has-error');
                            $('#' + value.param).addClass(`invalid`);
                            $('.invalid').css({
                                'border-color': 'red',
                                'color': 'red'
                            });
                        }
                    });
                    // clearError(arrayB); // from add-employee form

                    if (errors) {
                        $('.user-message').css('display', 'flex')
                        $('.user-message').html(errors);
                        $('.user-message').css({
                            'border-color': 'red',
                            'color': 'white',
                            'background-color': 'red'
                        });
                    } else {
                        $('.user-message').css('display', 'flex')
                        $('.user-message').html('');
                        $('.user-message').css({
                            'border-color': '',
                            'color': '',
                            'background-color': ''
                        });
                    }
                } else if (error.status == 500) {
                    $('.user-message').css('display', 'flex');
                    $('.user-message').html(error.responseJSON.error);
                    $('.user-message').addClass('danger');
                    $('.user-message').css({ 'border-color': '', 'color': 'white', 'background-color': '' });

                    setTimeout(function() {
                        $('.user-message').css('display', 'none');
                        $('user-message').html('');
                        $('.leaveDash').css('color', 'blue');
                        // leaveDash('Pending');

                    }, 2000)
                    return false;
                } else {
                    errorPage('getAttedSheet');
                }
                $("#loader").hide();
            }

        });
    });

    $(document).on('click', '.showSheet', function() {
        logUIAccess(`Clicked manual clocking sheet`, '.showSheet')
        manualClocking();
        // $('#showSheet').modal('show');
    });

    $(document).on('change', '#session', function() {
        const value = $(this).val();

        if (value == '') {
            $('#appendClock').html('');
        } else {
            if (value == 'CI') {
                $('#appendClock').html(`
                    <div class="form-group">
                        <label for="">Clock in</label>
                        <input required type="time" name="clockInTime" id="clockInTime"> 
                        <span id="error_clockInTime" class="text-danger"></span>
                    </div>
                `);
            } else if (value == 'CO') {
                $('#appendClock').html(`
                    <div class="form-group">
                        <label for="">Clock out</label>
                        <input required type="time" name="clockOutTime" id="clockOutTime"> 
                        <span id="error_clockOutTime" class="text-danger"></span>
                    </div>
                `);
            } else if (value == 'A') {
                $('#appendClock').html(`
                    <div class="form-group">
                        <label for="">Clock in</label>
                        <input required type="time" name="clockInTime" id="clockInTime"> 
                        <span id="error_clockInTime" class="text-danger"></span>
                    </div>

                    <div class="form-group">
                        <label for="">Clock out</label>
                        <input required type="time" name="clockOutTime" id="clockOutTime"> 
                        <span id="error_clockOutTime" class="text-danger"></span>
                    </div>
                `);
            } else {
                $('#appendClock').html('');
            }
        }
    });

    $(document).on('change', '#getterminals', function() {
        const value = $(this).val();
        const today = Math.floor(new Date() / 1000);
        const date = Math.floor(new Date($('#date').val()) / 1000);
        console.log('Date => ', date);
        if (!date) {
            $('#error_date').html(`Please select date.`);
            return false;
        }

        if (date > today) {
            $('#error_date').html(`Date cannot be more than today's date`);
            return false;
        }

        if (value == '') {
            $('#unpunched').html($("<option></option>").attr("value", '').text(`Select employee`));
            return false;
        }

        if (value !== '') {
            $("#loader").show();
            const getTerminalEmp = getSubmit('/getTerminal/' + value, 'GET');
            getTerminalEmp.done(function(response) {
                $('#unpunched').html($("<option></option>").attr("value", '').text(`Select employee`));
                $.each(response.employees, function(key, value) {
                    $('#unpunched').append($("<option></option>").attr("value", value.employeeId).text(`${value.name} || ${value.dept}`));
                });

                $('#error_date').html('');
                $("#loader").hide();
            })
        }
    });

    $(document).on('change', '#unpunched', function() {
        const value = $(this).val();

        if (value !== '') {
            getDeptHead('approveby');
        } else {
            $('#approveby').html('')
        }
    })

    $(document).on('change', '#fillform', function() {

        checkPDF($(this).attr('id'));

    });

    $(document).on('submit', '#clockMan', function(e) {
        e.preventDefault();

        let form = $(this)[0];
        let data = new FormData(form);

        $("#loader").show();
        let saveClock = submit(data, $(this).attr('action'), 'POST');
        saveClock.done(function(response) {
            console.log('In success', response.data);
            dataTable($('#date').val());
            $("#loader").hide();
        })
    })

    $(document).on('submit', '#showAttendSheet', function(e) {
        e.preventDefault();
        // alert('Hi!');
        getAttndMarked($('#markedDate').val());
        // $('#showSheet').modal('hide');
        $('#markedDate').val('')
    });

    $(document).on('change', '#selectDateChange', function() {
        // let moment = moment();
        if ($(this).val() != '') {
            // alert($(this).val())
            const date = Math.floor(new Date() / 1000);
            const selectDate = Math.floor(new Date($(this).val()) / 1000);
            if (selectDate > date) {
                $('#error_selectDateChange').html("Please select date not more than today's date");
                // $('#timeEx').hide();
                // $(this).val('');
                // alert(`${$(this).val()} 23:59:59`)

            } else {
                $('#error_selectDateChange').html('')
                    // let date = new Date($('#selectDateChange').val());
                getAttndMarked($('#selectDateChange').val());
                // alert(`${$(this).val()} 23:59:59`)
            }
        }
    });

    // Reports 

    $(document).on('click', '.getAttndReport', function () {
        $('title').html('Employees Attendance Report');
        $("#loader").show();
        getAttndReport('');
        unactive();
        $('.getAttndReport_blue').css("color", 'blue');
        logUIAccess('Clicked attendance report', '.getAttndReport');
    });

    $(document).on('submit', '#attendReport', function(e) {
        e.preventDefault();
        let from = Math.floor(new Date($('#repFromDate').val()) / 1000);
        let to = Math.floor(new Date($('#repToDate').val()) / 1000);

        if (from > to) {
            console.log('From to ==>', from, to);
            $('#error_report').html('Please select date in a correct order');
            return false;
        }
        console.log('After ');
        let form = $(this)[0];
        let data = new FormData(form);
        // console.log('Data1 ===> ', data);
        $("#loader").show();
        getAttndReport(data);
        // console.log('');
        $('#daterang').html(`${'From: ', $('#repFromDate').val() || ''} ${'To: ', $('#repToDate').val() || ''}`)
    });

    $(document).on('click', '.getAllAtt', function() {
        $tr = $(this).closest('tr');
        let data = $tr.children("td").map(function() {
            return $(this).text();
        }).get();

        // console.log('Data => ', data);

        let html = '';
        html += `<a href="#" class="list-group-item list-group-item-action disabled"><div style="margin-bottom: 70px; text-align: left; color: black;">
            Name: ${data[1]}<br>
            Phone: ${data[14]}<br>
            Department: ${data[2]}<br>
            Email: ${data[13]}<br>
            Staff ID: ${data[3]}<br>
            <!-- ${$('#totals').val()}<br> -->
            Date: ${data[15]}<br><hr>
            </div><div style="margin-top: -140px; text-align: right;"><img style="width: 10%; height: 5%; padding-left: 10px;" class="img-profile rounded-circle" src="/${data[16] || 'img/avatar.svg'}"> </div></a>
            `;
        $("#loader").show();
        $.ajax({
            type: 'GET',
            url: `getEmplyAttendMarked/${data[10]}/${data[11]}/${data[12]}`,
            contentType: 'application/json',
            success: function(response) {
                checkPoint('none', 'getAttndReport');

                function getDate(date) {
                    let formt_date = new Date(date);
                    return formt_date.toLocaleDateString("en-US");
                }
                html += `<table id="datatableD">
                                <thead class="table-dark" style="background-color:#008a9f; ">
                                    <tr>
                                        <th>Date</th>
                                        <th>Shift</th>
                                        <th>Clock in</th>
                                        <th>Clock out</th>
                                        <th scope="col">Late (Mins)</th>
                                        <th scope="col">CloseBT (Mins)</th>
                                        <th scope="col">Overtime (Hours)</th>
                                        <th scope="col">Leave type</th>
                                        
                                    </tr>
                                </thead>
                                <tbody style="background-color: white;">`;

                if (response.data.length === 0) {
                    html += `<td colspan="6" style="color: red;">No attendance data found this employee</td>`;
                }

                // $.each(response.data, function(key, value) {
                //     html += `<tr><td><label>${value.date}</label></td>`;
                //     html += `<td><label>${(value.startTime)? value.startTime:'N/A'}</label></td>`;
                //     html += `<td><label>${(value.closeTime)? value.closeTime:'N/A'}</label></td>`;
                //     html += `<td><label>${(value.attend_status)? 'P':'A'}</label></td>`;
                //     html += `<td><label>${(value.leaveIds)? 'Yes':'No'}</label></td>`;
                //     html += `<td><label>${(value.leaveType)? value.leaveType:'N/A'}</label></td> </tr>`;
                // })
                html += `</tbody></table>`;
                $('.appendAttDetails').html(html);
                $('#datatableD').dataTable({
                    dom: 'Bfrtip',
                    data: response.data,
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
                            messageTop: `Name: ${data[1]} || Phone: ${data[14]} || Department: ${data[2]} || Email: ${data[13]} || Staff ID: ${data[3]} || Date: ${data[15]}`,
                            exportOptions: {
                                stripHtml: true,
                                columns: [1, 2, 3, 4, 5, 6, 7]
                                    // columns: ':visible'
                            }
                        },
                        {
                            extend: 'pdf',
                            // titleAttr: 'Print this dem file',
                            className: 'btn btn-warning btn-sm',
                            text: '<i class="fas fa-file-pdf"> PDF</i>',
                            messageTop: 'Name: N/A.\n Email: na@gmail.com',
                            exportOptions: {
                                stripHtml: true,
                                columns: [1, 2, 3, 4, 5, 6, 7]
                            }
                        },
                        {
                            extend: 'print',
                            className: 'btn btn-info btn-sm',
                            text: '<i class="fas fa-print"> Print</i>',
                            messageTop: 'Name: N/A.\n Email: na@gmail.com',
                            exportOptions: {
                                stripHtml: false,
                                columns: [0, 1, 2, 3, 4, 5, 6, 7]
                            }
                        }
                    ]
                })
                $("#loader").hide();
            },
            error: function(error) {
                console.log('here', error);
                if (error.status === 422) {
                    console.log(error.responseJSON.errorMessage);
                    $('#error_report').html(error.responseJSON.errorMessage);
                } else if (error.status == 500) {
                    $('.user-message').css('display', 'flex');
                    $('.user-message').html(error.responseJSON.error);
                    $('.user-message').addClass('danger');
                    $('.user-message').css({ 'border-color': '', 'color': 'white', 'background-color': '' });

                    setTimeout(function() {
                        $('.user-message').css('display', 'none');
                        $('user-message').html('');
                        $('.leaveDash').css('color', 'blue');
                        // leaveDash('Pending');

                    }, 2000)
                    return false;
                } else {
                    errorPage('getAttndReport');
                    return false;
                }
                $("#loader").hide();
            }
        });
        $('#attDetails').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    })

});