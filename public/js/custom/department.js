function getDepartments() {
    let html = '';
    $('.mainPage').html('');
    html += `<link href="/css/employee-style.css" rel="stylesheet">`;
    html += `<style>
    .scroll-div {
              overflow-y: scroll;
              height: 400px;
              width: 100%;
            }
    .table.sticky th{
            position: sticky;
            top: 60px;}
    </style>`;

    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800"><i class="fa fa-building fa-1x text-black-300"></i> Departments Information</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm getDept"><i';
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Reload Page</a>';
    html += '</div>';

    // html += '<div class="container" style="padding: 0px;">';

    // html += `< div class = "tab-content" style = "margin-top:16px; ">`;
    // from here .......
    // html += `</div>`;

    html += `<div class="row">`;
    html += `<div class=" col-lg-12 col-md-12">`;

    // html += `<div class = "tab-content" style = "margin-top:16px; ">`;
    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;
    html += `<div class="panel-heading" style="font-size: 15px;">Departments</div>`;
    // html += `<label class="user-message user-message--error" style="display: none;"></label>`;
    html += `<div class="panel-body" style="padding: 0px;">`;
    html += `<div class="card-header form-group" style="background-color: ;">
                        <input class="" id="myInput" type="text" placeholder="Search department record by anything..">
                    </div>`;
    html += `<button style="float: right; margin: 0px;" class="btn btn-primary add-dept-form btn-sm"><i class="fas fa-plus"></i> Create Department</button><br>`;

    html += '<table class="table mt-3 table-hover sticky" style="">';
    html += '<thead class="table-dark" style="background-color:#008a9f;">';
    html += '<tr>';

    html += '<th>Sytem Date</th>';
    html += '<th>Department</th>';
    html += '<th>Description</th>';
    html += '<th>HOD</th>';
    html += '<th>No. Employees</th>';
    html += '<th>Manage</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color: white;" class="myTable">';
    $.ajax({
        type: 'GET',
        url: 'departments',
        // processData: false,
        contentType: 'application/json',
        success: function(response) {

            // checkPoint('none', 'getDept');
            // console.log('Get department list');

            function getDate(date) {
                let formt_date = new Date(date);
                return formt_date.toLocaleDateString("en-US");
            }

            if (response.deptData.length === 0) {
                html += `<td colspan="6" style="color: red;">No department data found</td>`;

            }
            $.each(response.deptData, function(key, value) {
                html += '<tr>';
                html += `<td>${value.date}</td>`;
                html += `<td>${value.deptName}</td>`;
                html += `<td>${value.description}</td>`;
                html += `<td>${value.deptHead}</td>`;
                html += `<td>${value.nofEmply}</td>`;
                html += `<td hidden>${value.emplID}</td>`;
                html += `<td hidden>${value.id}</td>`;
                html += `<td><label style="cursor: pointer; color: blue;" class="editDept" id="${value.id}">Edit</label>`;
                if (+value.nofEmply > 0) {
                    html += ` | <label style="cursor: pointer; color: #008a9f;" class="manageHod" id="${value.id}">Manage HOD</label>`;
                }
                html += ` | <label style="cursor: pointer; color: #663399;" class="hodHistory" id="${value.id}">History</label>`;

                html += `</tr>`;
            });

            html += '</tbody>';
            html += '</table>';
            html += '</div>';
            // html += '</div>';

            html += '</div>';
            html += '</div>';
            html += '</div>';

            html += '</div>';

            html += '</div>';

            html += '</div>';
            html += '</div>';
            $('.mainPage').html(html);
            $("#loader").hide();
            getEmployees('deptHead', '', ''); // called from general-funct.js

        },
        error: function(error) {
            // console.log(error.status);
            if (error.status == 500) {
                $('.user-message').css('display', 'flex');
                $('.user-message').html(error.responseJSON.error);
                $('.user-message').addClass('danger');
                $('.user-message').css({ 'border-color': '', 'color': 'white', 'background-color': '' });

                setTimeout(function() {
                    $('.user-message').css('display', 'none');
                    $('user-message').html('');

                }, 2000)
                return false;
            } else {

                errorPage('getDept');

                getEmployees('deptHead', '', ''); // called from general-funct.js
            }
            // }
        $("#loader").hide();
        }

    });

}

function manageHOD(data) {
    $('title').html('Manage HOD');
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
    html += '<h6 class="h3 mb-0 text-gray-800">Manage HOD Position</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm getDept" id="<%= userDetails[0] %>"><i';
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Back Department</a>';
    html += '</div>';

    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;

    html += `<div class="panel-heading" style="font-size: 15px; background: #008a9f; color: white"></div>`;

    html += `<div class="panel-body">`;

    html += `<center><label id="headposi" style="text-align: center; color: #00008B; font-size: 20px;">${data[1]} (${data[4]} Employee(s))</label></center> <hr>`;


    html += `<form action="appoint-hod" method="POST" id="changeDeptHead" enctype="multipart/form-data">`;

    html += `<div class="row" style="background-color:white;">`;

    html += `<div class="col-lg-6 col-md-6" id="appoint">`;

    html += `<label style="color: blue; background-color:; font-size: 20px">Current/Outgoing Head of Department </label> <hr class="hr">`;

    html += `
                <div style="border-color: red; background-color: #F8F8FF; border: 1px solid transparent;"> 
                <div class="form-group">
                <input type="hidden" name="_csrf" value="${$('#crsf').val()}">

                        <label for="">Select Employee</label>
                        <select required type="text" name="employID" id="employID">
                        </select>
                        <input required hidden type="number" name="deptID" id="deptID" value="${data[6]}" readonly>
                        <span id="error_employID" class="text-danger"></span>
                        </div>
                <div class="form-group">
                        <label for="">Status As</label>
                        <select required type="text" name="headStatus" id="headStatus">`;
    if (data[5] == 'null') {
        html += `
                        <option value="Permanent">Permanent</option>
                        <option value="Interim">Interim</option>`;
    }
    if (data[5] !== 'null') {
        html += `<option value="Promotion">Promotion</option>
                        <option value="Transfer">Transfer</option>
                        <option value="Terminated">Terminated</option>
                        <option value="Others">Others</option>`;
    }
    html += `</select> 
                        <span id="error_headStatus" class="text-danger"></span>
                </div>

                <div class="form-group">
                        <label for="">Date</label>
                        <input required type="date" name="appointTerDate" id="appointTerDate"> 
                        <span id="error_appointTerDate" class="text-danger"></span>
                </div>

                <div class="form-group">
                        <label for="">Remarks</label>
                        <textarea required type="text" name="remarks" id="remarks"> </textarea>
                        <span id="error_remarks" class="text-danger"></span>
                </div>

                <div class="form-group">
                        <label for="">Supporting document</label>
                        <input type="file" name="supportDocument" id="supportDocument" class="checkfilePDF"> 
                        <span id="error_supportDocument" class="text-danger"></span>
                </div>
                
                </div>
<div style="float: right" id="btn1">
    <button type="submit" class="btn btn-success btn-sm">Submit</button>
</div>`;

    html += `</div>`;

    html += `<div class="col-lg-6 col-md-6" id="">`;

    html += `<label class="help" class="appointIN" style = "color: black; background-color:; font-size: 20px" > Guide </label> ${(data[5] === 'null')? '<hr class="hr">':''}`;

    html += `<div class="help"> 

    <li style="color: #000000;list-style: square;">
    This department does not have a Head, please select the person whom is to occupied this position.
    </li><br>

    <li style="color: #000000; list-style: square;">
    Select status which could be permanent or interim and enter a date of this appointment as it appears on appointment letter.
    </li><br>

    <li style="color: #000000; list-style: square;">
    Provide any remarks for this appointment
    </li><br>

    <li style="color: #000000; list-style: square;">
    Attach any supporting document for this appointment and when done please submit this form for the system to capture this changes
    </li>
    </div>`;

    html += `<label class="appointIN" style = "color: blue; background-color:; font-size: 20px" > New Head of Department <a href="#" class="btn-info readme">Readme</a></label> <hr class="hr">`;

    html += `<div class="appointIN" style="border-color: red; background-color: #F8F8FF; border: 1px solid transparent;"> 
                    <div class="form-group">
                        <label for="">Select Employee</label>
                        <select type="text" name="employIDIN" id="employIDIN">
                        </select>
                        <input hidden type="number" name="deptIDIN" id="deptIDIN" value="${data[6]}" readonly>
                        <span id="error_employIDIN" class="text-danger"></span>
                    </div>

                    <div class="form-group">
                        <label for="">Status As</label>
                        <select type="text" name="headStatusIN" id="headStatusIN"> 
                         <option value="Permanent">Permanent</option>
                        <option value="Interim">Interim</option>
                        
                        </select>
                        <span id="error_headStatusIN" class="text-danger"></span>
                    </div>

                    <div class="form-group">
                        <label for="">Date</label>
                        <input type="date" name="appointTerDateIN" id="appointTerDateIN"> 
                        <span id="error_appointTerDateIN" class="text-danger"></span>
                    </div>

                    <div class="form-group">
                        <label for="">Remarks</label>
                        <textarea type="text" name="remarksIN" id="remarksIN"> </textarea>
                        <span id="error_remarksIN" class="text-danger"></span>
                    </div>
                    <div class="form-group">
                        <label for="">Supporting document</label>
                        <input type="file" name="supportDocumentIN" id="supportDocumentIN" class="checkfilePDF"> 
                        <span id="error_supportDocumentIN" class="text-danger"></span>
                    </div>

                </div>
    </div>`;

    html += ` 
</div> 
<div style="float: right" id="btn2">
    <button type="submit" class="btn btn-success btn-sm">Submit</button>
</div>
    <div style="width: inherit;" class="user-message user-message--error" style="display: none;"></div>
</form> <br>`;

    //Employee details

    html += `</div>`;
    // html += `</div>`;

    html += `</div>`;
    // html += `</div>`;

    $('.mainPage').html(html);

    $('.user-message').css({
        'border-color': '',
        'color': 'white',
        'background-color': '',
        'display': 'none'
    });

    if (data[5] !== 'null') {
        // console.log('ID => ', $('#appointIN'));
        // getDeptEmployees('employID', data[5], data[3], '', data[6]); // called from general-funct.js

        $('#employID').append($("<option></option>").attr("value", data[5]).text(`${data[3]}`));

        getDeptEmployees('employIDIN', '', '', '', data[6]); // called from general-funct.js
        $('#btn1').hide();
        $('.help').hide();


    } else {
        getDeptEmployees('employID', '', '', '', data[6]); // called from general-funct.js
        $('.appointIN').hide();
        $('#btn2').hide();

    }

}

function hodHistory(data) {
    $('title').html('Manage HOD');
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
    html += '<h6 class="h3 mb-0 text-gray-800">HOD Change History</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm getDept" id="<%= userDetails[0] %>"><i';
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Back Department</a>';
    html += '</div>';


    // html += '<div class="container" style="padding: 0px;">';

    // html += `<div class="tab-content" style="margin-top:16px; ">`;
    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;

    html += `<div class="panel-heading" style="font-size: 15px; background: #008a9f; color: white"></div>`;

    html += `<div class="panel-body">`;

    html += `<center><label id="headposi" style="text-align: center; color: #00008B; font-size: 20px;">${data[1]} (${data[4]} Employee(s))</label></center> <hr>`;

    html += `<h5 style="text-decoration: underline; color: black">Current Head of Department</h5>`
    if (data[3] !== 'Vacant') {
        html += `<label id="headname" style="text-align: center; color: ; font-size: 15px;">${'Head:'} ${data[3].split(' => ')[0]}</label> <br>`;

        html += `<label id="headjob" style="text-align: center; color: ; font-size: 15px;">${'Job Title:'} ${data[3].split(' => ')[1]}</label> <br>`;

        html += `<label id="headsince" style="text-align: center; color: ; font-size: 15px;">${'Since:'} ${data[0]} to Date</label><br> <hr class="hr">`;

    } else {
        html += `<label id="headname" style="text-align: center; color: ; font-size: 15px;">${'Head:'} N/A</label><br>`;

        html += `<label id="headjob" style="text-align: center; color: ; font-size: 15px;">${'Job Title:'} N/A</label><br>`;

        html += `<label id="headsince" style="text-align: center; color: ; font-size: 15px;">${'Since:'} N/A</label> <br> <hr class="hr">`;

    }

    let headName,
        headJob,
        headSince;
    html += `<div class="card-header form-group" style="background-color: ;">
                        <input class="" id="myInput" type="text" placeholder="Search history record by anything..">
                    </div>`;


    html += '<table class="table mt-3 table-hover sticky" style="">';
    html += '<thead class="table-dark" style="background-color:#008a9f;">';
    html += '<tr>';

    html += '<th>Name</th>';
    html += '<th>Job Title</th>';
    html += '<th>Remarks</th>';
    html += '<th>Status</th>';
    html += '<th>From</th>';
    html += '<th>To</th>';
    html += '<th>Supported Document</th>';
    // html += '<th>Manage</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color: white; color: black" class="myTable">';
    $.ajax({
        type: 'GET',
        url: `${$('#nyanzi').val()}/getHODHistory/${data[6]}`,
        // processData: false,
        contentType: 'application/json',
        success: function(response) {

            // checkPoint('none', 'getDept');
            // console.log('Get department list');

            function getDate(date) {
                let formt_date = new Date(date);
                return formt_date.toLocaleDateString("en-US");
            }

            if (response.data.length === 0) {
                html += `<td colspan="8" style="color: red;">No HOD history data found</td>`;

            }

            $.each(response.data, function(key, value) {
                html += '<tr>';
                html += `<td>${value.name}</td>`;
                html += `<td>${value.position}</td>`;
                html += `<td>${value.remarks}</td>`;
                html += `<td>${value.status}</td>`;
                html += `<td>${value.from}</td>`;
                html += `<td>${value.to}</td>`;
                if (value.qty > 1) {
                    if (value.files.split('=>')[0] !== 'null' && value.files.split('=>')[1] !== 'null') {
                        html += `<td><a href="/${value.files.split('=>')[0]}" target="_blank">View file</a> | <a href="/${value.files.split('=>')[1]}" target="_blank">View file</a></td>`;
                    } else if (value.files.split('=>')[0] !== 'null' || value.files.split('=>')[1] !== 'null') {
                        html += `<td><a href="/${(value.files.split('=>')[0] !== 'null')? value.files.split('=>')[0]:''}${(value.files.split('=>')[1] !== 'null')? value.files.split('=>')[1]:''}" target="_blank">View file</a></td>`;
                    } else {
                        html += `<td></td>`;
                    }

                } else if (value.qty == 1) {
                    headSince = value.from + ' to ' + value.to
                    if (value.files !== 'null') {
                        html += `<td><a href="/${value.files}" target="_blank">View file</a></td>`;
                    } else {
                        html += `<td></td>`;
                    }
                }
                html += `<td hidden>${value.qty}</td>`;
                html += `<td hidden>${value.trackCode}</td>`;
                // html += `<td><label style="cursor: pointer; color: blue;" class="editDept" id="${value.trackCode}">Edit</label>`;

                html += `</tr>`;
            });

            html += '</tbody>';
            html += '</table>';
            html += `</div>`;
            html += `</div>`;
            $('.mainPage').html(html);
            $("#loader").hide();
            if (headSince !== undefined) {
                $('#headsince').html('Since: ' + headSince);
            }
            getEmployees('deptHead', '', ''); // called from general-funct.js
        },
        error: function(error) {
            // console.log(error.status);
            if (error.status == 422) {
                $('.user-message').css('display', 'flex');
                $('.user-message').html(error.responseJSON.errorMessage);
                $('.user-message').addClass('danger');
                $('.user-message').css({ 'border-color': '', 'color': 'white', 'background-color': '' });

                setTimeout(function() {
                    $('.user-message').css('display', 'none');
                    $('user-message').html('');

                }, 2000)
                $("#loader").hide();
                return false;
            } else if (error.status == 500) {
                $('.user-message').css('display', 'flex');
                $('.user-message').html(error.responseJSON.error);
                $('.user-message').addClass('danger');
                $('.user-message').css({ 'border-color': '', 'color': 'white', 'background-color': '' });

                setTimeout(function() {
                    $('.user-message').css('display', 'none');
                    $('user-message').html('');

                }, 2000)
                $("#loader").hide();
                return false;
            } else {

                errorPage('getDept');

                getEmployees('deptHead', '', ''); // called from general-funct.js
                $("#loader").hide();
            }
            // }
        }

    });

    // $('.mainPage').html(html);

    // if (data[5] !== 'null') {
    //     // console.log('ID => ', $('#appointIN'));
    //     // getDeptEmployees('employID', data[5], data[3], '', data[6]); // called from general-funct.js

    //     $('#employID').append($("<option></option>").attr("value", data[5]).text(`${data[3]}`));

    //     getDeptEmployees('employIDIN', '', '', '', data[6]); // called from general-funct.js
    //     $('#btn1').hide();
    //     $('.help').hide();


    // } else {
    //     getDeptEmployees('employID', '', '', '', data[6]); // called from general-funct.js
    //     $('.appointIN').hide();
    //     $('#btn2').hide();

    // }

}

$(document).ready(function() {
    $(document).on('keyup', "#myInput", function() {
        var value = $(this).val().toLowerCase();
        $(".myTable tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    // Department page
    $(document).on('click', '.getDept', function() {

        $('title').html('Departmets Info');
        unactive();
        $('#employeeFeat').modal('hide');
        $("#loader").show();
        getDepartments();

        logUIAccess('Clicked departmets', '.getDept');

        $('.getDept').css("color", 'blue');

    });

    // To clear the add dept form
    $(document).on('click', '#cls', function() {
        getEmployees('deptHead', '', ''); // called from general-funct.js
        $('#deptName').val('');
        $('#deptDesc').val('');
        $('#editMode').val('');
    })

    $(document).on('click', '.add-dept-form', function() {
        $('.dept-title').html('<i class="fas fa-plus"></i> Create Department');
        $('.user-message').css({
            'border-color': '',
            'color': 'white',
            'background-color': '',
            'display': 'none'
        });

        // getEmployees('deptHead', '', ''); // called from general-funct.js
        $('#deptName').val('');
        $('#deptDesc').val('');
        $('#editMode').val('');

        $('#editMode').val('addMode');
        $('#cls').show();
        logUIAccess('View add department modal', '.add-dept-form');

        $('#departmentModal').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});

    });

    // Edit dept option
    $(document).on('click', '.editDept', function() {
        $('.dept-title').html('<i class="fas fa-edit"></i> Edit Department');
        $('.user-message').css({
            'border-color': '',
            'color': 'white',
            'background-color': '',
            'display': 'none'
        });
        $('#editMode').val('editMode');
        $('#cls').hide();
        logUIAccess('View edit department modal', '.editDept');

        $('#departmentModal').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});

        $.ajax({
            type: 'GET',
            url: 'department/' + $(this).attr('id'),
            // processData: false,
            contentType: 'application/json',
            success: function(response) {
                console.log('Get department details');
                console.log(response);

                function getDate(date) {
                    let formt_date = new Date(date);
                    return formt_date.toLocaleDateString("en-US");
                }

                if (response) {

                    $('#deptName').val(response.deptInfo.deptName);
                    $('#deptDesc').val(response.deptInfo.description);
                    $('#deptId').val(response.deptInfo.id);
                    $('#editMode').val('editMode');

                    if (response.deptInfo.headByEmployeeId) {

                        const name = `${response.emplyInfo.fName || ''} ${response.emplyInfo.mName || ''} ${response.emplyInfo.lName || ''}`;
                        // getEmployees('deptHead', response.emplyInfo.id, name); // called from general-funct.js

                    } else {
                        getEmployees('deptHead', '', ''); // called from general-funct.js

                    }

                }
            },
            error: function(error) {
                console.log(error);
                $('.deptDetails').html('<label style="color:red;">something went wrong, please refreash the page to continue.</label>');
            }

        });

    });

    // manage HODs
    $(document).on('click', '.manageHod', function() {
        $('title').html('Manage HOD');

        $tr = $(this).closest('tr');
        let data = $tr.children("td").map(function() {
            return $(this).text();
        }).get();
        if (data[4] <= 0) {
            alert('Sorry this department has no employee to be made Head.')
            return false;
        } else {

            logUIAccess('View change HOD page', '.manageHod');

            manageHOD(data);

        }

    })

    // Dept details
    $(document).on('click', '.detpDetails', function() {
        // alert($(this).attr('id'))
        $.ajax({
            type: 'GET',
            url: 'department/' + $(this).attr('id'),
            // processData: false,
            contentType: 'application/json',
            success: function(response) {
                console.log('Get department details');
                console.log(response);

                function getDate(date) {
                    let formt_date = new Date(date);
                    return formt_date.toLocaleDateString("en-US");
                }

                if (response) {

                    $('.deptDetails').html('');
                    let html = `<label style="color: blue;">Detailed Information on Department</label><br>`
                    html += `<label>Department: ${response.deptInfo.deptName}</label><br>`
                    html += `<label>Description: ${response.deptInfo.description}</label><br>`
                    if (response.deptInfo.headByEmployeeId) {
                        html += `<label>Head of Department: ${response.emplyInfo.fName || ''} ${response.emplyInfo.mName || ''} ${response.emplyInfo.lName || ''}</label><br>`
                    } else {
                        html += `<label>Head of Department: </label><br>`;
                    }
                    html += `<label>No. of Employees: ${response.totalEmp}</label><br>`
                    $('.deptDetails').html(html);

                }
            },
            error: function(error) {
                console.log(error);
                $('.deptDetails').html('<label style="color:red;">something went wrong, please refreash the page to continue.</label>');
            }

        });
    });


    $(document).on('submit', '#addDept', function(e) {
        e.preventDefault();
        // alert('All set')
        let form = $(this)[0];
        let data = new FormData(form);

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
                    $('.mainPage').html('');
                    $('#deptName').val('');
                    $('#deptDesc').val('');
                    $('#departmentModal').modal('hide');
                    getDepartments();
                    $('.getDept').css("color", 'blue');

                    // $('#addCompany').modal('hide');

                    // window.location.replace("http://localhost:3000${$('#nyanzi').val()}/index");

                }, 1000);

                console.log(response)
            },
            error: function(error) {
                console.log('In error');
                console.log(error)
                if (error.status === 422) {
                    // $('.user-message').css('display', 'flex')
                    // $('.user-message').html(error.responseJSON.errorMessage);
                    // $('.user-message').addClasss("user-message user-message--error"); dose not continue so use it last.
                    $.each(error.responseJSON.validationErrors, function(key, value) {
                        $('#error_' + value.param).text(value.msg);
                        $('#' + value.param).addClass(`invalid`);
                        $('.invalid').css({
                            'border-color': 'red',
                            'color': 'red'
                        });
                    })

                    setTimeout(function() {
                        $.each(error.responseJSON.validationErrors, function(key, value) {

                            $('#error_' + value.param).text('');
                            $('.invalid').css({
                                'border-color': 'black',
                                'color': 'black'
                            });
                            $('#' + value.param).removeClass(`invalid`);
                        });

                    }, 20000)

                } else {
                    console.log(error);
                    $('.user-message').css('display', 'flex');
                    $('.user-message').html(error.responseJSON.error);
                    $('.user-message').addClass('danger');
                    $('.user-message').css({ 'border-color': '', 'color': 'white', 'background-color': '' });

                    setTimeout(function() {
                        $('.user-message').css('display', 'none');
                        $('user-message').html('');
                    }, 2000)
                    return false;
                }
            }
        });
    });

    // readme on dept head position
    $(document).on('click', '.readme', function() {
        $('.deptposi-title').html($('#headposi').html())
        logUIAccess('View readme modal', '.readme');

        $('#readmeDeptModal').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    });

    $(document).on('change', '.checkfilePDF', function() {
        logUIAccess('Attempted to upload wrong file', '.checkfilePDF');

        checkPDF($(this).attr('id'));
    }).change();


    $(document).on('submit', '#changeDeptHead', function(e) {
        e.preventDefault();
        // alert('All set')
        let form = $(this)[0];
        let data = new FormData(form);
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
                    $('.mainPage').html('');
                    $('#deptName').val('');
                    $('#deptDesc').val('');
                    $('#departmentModal').modal('hide');
                    getDepartments();
                    $('.getDept').css("color", 'blue');
                }, 1000);
                $("#loader").hide();
                // console.log(response)
            },
            error: function(error) {
                console.log('In error');
                console.log(error)
                if (error.status === 422) {
                    $.each(error.responseJSON.validationErrors, function(key, value) {
                        $('#error_' + value.param).text(value.msg);
                        $('#' + value.param).addClass(`invalid`);
                        $('.invalid').css({
                            'border-color': 'red',
                            'color': 'red'
                        });
                    })

                    setTimeout(function() {
                        $.each(error.responseJSON.validationErrors, function(key, value) {

                            $('#error_' + value.param).text('');
                            $('.invalid').css({
                                'border-color': 'black',
                                'color': 'black'
                            });
                            $('#' + value.param).removeClass(`invalid`);
                        });

                    }, 20000)

                } else {
                    console.log(error);
                    $('.user-message').css('display', 'flex');
                    $('.user-message').html(error.responseJSON.error);
                    $('.user-message').addClass('danger');
                    $('.user-message').css({ 'border-color': '', 'color': 'white', 'background-color': '' });

                    setTimeout(function() {
                        $('.user-message').css('display', 'none');
                        $('user-message').html('');
                    }, 2000)
                    return false;
                }
                $("#loader").hide();
            }
        });
    });

    $(document).on('click', '.hodHistory', function() {
        $('title').html('HOD History');
        $tr = $(this).closest('tr');
        let data = $tr.children("td").map(function() {
            return $(this).text();
        }).get();
        logUIAccess('View HOD change history', '.hodHistory');
        $("#loader").show();
        hodHistory(data);
    })

});