function leaveDash(showTab) {
    let html = '';
    $('.mainPage').html('');
    html += `<link href="/css/employee-style.css" rel="stylesheet">`;
    html += `<link href="/css/leave-dash-style.css" rel="stylesheet">`;

    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800"><i class="fa fa-chart-line"></i> Leave Dashboard</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm leaveDash"><i';
    html += 'class = "fa fa-refresh fa-sm text-white-50"> </i> Reload Page</a>';
    html += '</div>';
    html += `
        <div class="row " >
            <div class="col-md-12">

                <div class="card" >
                    <div class="card-header addHeaderl" style="background-color: ; color: blue;">
                    </div>
                    <div class="user-message user-message--error" style="display: none;"></div>

                </div>
            </div>
        </div>`;

    // html += `</div>`;

    html += `<div class="row">`;
    html += `<div class="col-md-12">`;

    // html += `<div class = "tab-content" style = "margin-top:16px; ">`;
    html += `<div class="card scroll-di">`;
    html += `<div class="card-header" style="background-color: ;">`;
    // html += `<div class="card-body" style="background-color: ; margin: 0px;">`;

    html += `<div class="show-contentl" style="height: 100%; border: 2px solid #4682B4; border-radius: 20px 20px 0px 0px; padding: 10px;">
                    
              </div>
                    
              <div class="tabl">
                    <button class="btn btn-primary tablinksl ${(showTab === 'Pending') ? 'active' :''}" value="Pending"><i class="fas fa-hand-holding-usd"></i> Pending Leave</button>
                    <button class="btn btn-primary tablinksl ${(showTab === 'Approved') ? 'active' :''}" value="Approved"><i class="fas fa-balance-scale"></i> Approved Leave</button>
                    <button class="btn btn-primary tablinksl ${(showTab === 'Rejected') ? 'active' :''}" value="Rejected"><i class="fas fa-shield-alt"></i> Rejected Leave</button>

                    <button class="btn btn-primary tablinksl ${(showTab === 'Leave') ? 'active' :''}" value="Leave"><i class="fas fa-shield-alt"></i> On Leave</button>
              </div>`;


    $.ajax({
        type: 'GET',
        url: `${$('#nyanzi').val()}/getAllLeaves`,
        // processData: false,
        contentType: 'application/json',
        success: function(response) {

            // checkPoint('none', 'leaveDash');

            // console.log('Get department list');

            function getDate(date) {
                let formt_date = new Date(date);
                return formt_date.toLocaleDateString("en-US");
            }

            // $.each(response.compiledData, function(key, value) {

            html += `<div id="Pending" class="tabcontentl ${(showTab === 'Pending') ? 'active' :''}" style="display:${(showTab === 'Pending') ? 'block' :'none'};">
                          <h6>Pending Leave</h6>
                            <div class="user-message user-message--error" style="display: none;"></div>
                          <button style="float: right;" value="add" class="btn btn-primary applyLeave btn-sm"><i class="fas fa-pencil-alt"></i> Appy leave</button><br>
                          <div class="form-group"><input class="form-form-group" id="salaryInput" type="text" placeholder="Search record by anything.."></div>
                          <div class="scroll-div" style="height: ${(response.leaves.length >= 5)? '400px' : '200px'}">
                          <table class="layout display responsive-table">
                            <thead class="table-dark" style="background-color:#008a9f;">
                              <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Days</th>
                                <th>Leave type</th>
                                <th>Action</th>
                                </tr>
                                </thead>
                            <tbody style="background-color: white;" class="salaryTable">`;
            if (response.leaves.length === 0) {
                html += `<td colspan="8" style="color: red;">No data found</td>`;
            }

            $.each(response.leaves, function(key, value) {
                // console.log('');
                if (value.status === 'Pending') {
                    html += `<tr >
                        <td hidden>${value.id}</td>
                        <td>${getDate(value.date)}</td>
                        <td>${value.name}</td>
                        <td>${value.dept}</td>
                        <td>${getDate(value.from)}</td>
                        <td>${getDate(value.to)}</td>
                        <td>${value.days}</td>
                        <td>${value.leaveType}</td>
                        <td hidden>${value.exp}</td>
                        <td hidden>${value.reason}</td>
                        <td hidden>${value.employeeId}</td>
                        <td hidden>${value.approvEmpl}</td>
                        <td hidden>${value.employId}</td>
                        <td><a style="cursor: pointer;" href="#" ><label id="${value.id}" value="pend" class="pend"><i class="fas fa-edit"></i> Details</label></a>`;
                    if ($('#userRole').val() === 'Admin' || $('#userRole').val() === 'HOD') {
                        html += ` <a style="cursor: pointer;" href="#" ><label id="${value.id}" value="delLeaveApply" class="btn-danger delLeaveApply"> <i class="fas fa-trash-alt"></i> Delete</label></a>`;
                    }
                    html += `</td>
                        </tr>`;
                }
            });

            html += `
                  </tbody>
                  </table>
                </div>
                </div>`;

            html += `<div id="Approve" class="tabcontentl ${(showTab === 'Approved') ? 'active' :''}" style="display: ${(showTab === 'Approved') ? 'block' :'none'};">
                 <h6>Approved Leaves</h6>
                  <button style="float: right;" value="add" class="btn btn-primary applyLeave btn-sm"><i class="fas fa-pencil-alt"></i> Appy leave</button><br>
                  <div class="form-group"><input class="form-form-group" id="salaryInput" type="text" placeholder="Search record by anything.."></div>
                          <div class="scroll-div" style="height: ${(response.leaves.length >= 5)? '300px' : '100px'}">
                          <table class="layout display responsive-table">
                            <thead class="table-dark" style="background-color:#008a9f;">
                              <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Days</th>
                                <th>Leave type</th>
                                <th>Action</th>
                                </tr>
                                </thead>
                            <tbody style="background-color: white;" class="salaryTable">`;
            if (response.leaves.length === 0) {
                html += `<td colspan="6" style="color: red;">No data found</td>`;
            }
            $.each(response.leaves, function(key, value) {
                if (value.status === 'Approved') {
                    html += `<tr>
                        <td hidden>${value.id}</td>
                        <td>${getDate(value.date)}</td>
                        <td>${value.name}</td>
                        <td>${value.dept}</td>
                        <td>${getDate(value.from)}</td>
                        <td>${getDate(value.to)}</td>
                        <td>${value.days}</td>
                        <td>${value.leaveType}</td>
                        <td hidden>${value.exp}</td>
                        <td hidden>${value.reason}</td>
                        <td hidden>${value.remark}</td>
                        <td hidden>${value.employeeId}</td>
                        <td><a style="cursor: pointer;" href="#" ><label id="${value.id}" value="approve" class="approve"><i class="fas fa-edit"></i> Details</label></a></td>
                        </tr>`;
                }
            });
            html += `
                  </tbody>
                  </table>
                </div>
                </div>`;

            html += `<div id="Reject" class="tabcontentl ${(showTab === 'Rejected') ? 'active' :''}" style="display: ${(showTab === 'Rejected') ? 'block' :'none'};">
                 <h6>Rejected Leaves</h6>
                  <button style="float: right;" value="add" class="btn btn-primary applyLeave btn-sm"><i class="fas fa-pencil-alt"></i> Appy leave</button><br>
                  <div class="form-group"><input class="form-form-group" id="salaryInput" type="text" placeholder="Search record by anything.."></div>
                          <div class="scroll-div" style="height: ${(response.leaves.length >= 5)? '300px' : '50px'}">
                          <table class="layout display responsive-table">
                            <thead class="table-dark" style="background-color:#008a9f;">
                              <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Days</th>
                                <th>Leave type</th>
                                <th>Action</th>
                                </tr>
                                </thead>
                            <tbody style="background-color: white;" class="salaryTable">`;
            if (response.leaves.length === 0) {
                html += `<td colspan="8" style="color: red;">No data found</td>`;
            }
            $.each(response.leaves, function(key, value) {
                if (value.status === 'Rejected') {
                    html += `<tr >
                        <td hidden>${value.id}</td>
                        <td>${getDate(value.date)}</td>
                        <td>${value.name}</td>
                        <td>${value.dept}</td>
                        <td>${getDate(value.from)}</td>
                        <td>${getDate(value.to)}</td>
                        <td>${value.days}</td>
                        <td>${value.leaveType}</td>
                        <td hidden>${value.exp}</td>
                        <td hidden>${value.reason}</td>
                        <td hidden>${value.remark}</td>
                        <td hidden>${value.employeeId}</td>
                        <td><a style="cursor: pointer;" href="#" ><label id="${value.id}" value="reject" class="reject"><i class="fas fa-edit"></i> Details</label></a></td>
                        </tr>`;
                }
            });
            html += `
                  </tbody>
                  </table>
                </div>
                </div>`;

            html += `<div id="Reject" class="tabcontentl ${(showTab === 'Leave') ? 'active' :''}" style="display: ${(showTab === 'Leave') ? 'block' :'none'};">
                 <h6>On Leave</h6>
                  <button style="float: right;" value="add" class="btn btn-primary applyLeave btn-sm"><i class="fas fa-pencil-alt"></i> Appy leave</button><br>
                  <div class="form-group"><input class="form-form-group" id="salaryInput" type="text" placeholder="Search record by anything.."></div>
                          <div class="scroll-div" style="height: ${(response.leaves.length >= 5)? '300px' : '50px'}">
                          <table class="layout display responsive-table">
                            <thead class="table-dark" style="background-color:#008a9f;">
                              <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>From</th>
                                <th>Reporting</th>
                                <th>Days</th>
                                <th>Leave type</th>
                                <th>Action</th>
                                </tr>
                                </thead>
                            <tbody style="background-color: white;" class="salaryTable">`;
            if (response.leaves.length === 0) {
                html += `<td colspan="8" style="color: red;">No data found</td>`;
            }
            let date = Math.floor(new Date());


            $.each(response.leaves, function(key, value) {
                let from = Math.floor(new Date(value.from));
                let to = Math.floor(new Date(value.to));
                if ((date >= from) && (date <= to) && (value.status === 'Approved')) {
                    html += `<tr >
                        <td hidden>${value.id}</td>
                        <td>${getDate(value.date)}</td>
                        <td>${value.name}</td>
                        <td>${value.dept}</td>
                        <td>${getDate(value.from)}</td>
                        <td>${getDate(value.to)}</td>
                        <td>${value.days}</td>
                        <td>${value.leaveType}</td>
                        <td hidden>${value.exp}</td>
                        <td hidden>${value.reason}</td>
                        <td hidden>${value.remark}</td>
                        <td hidden>${value.employeeId}</td>
                        <td><a style="cursor: pointer;" href="#" ><label id="${value.id}" value="reject" class="reject"><i class="fas fa-edit"></i> Details</label></a></td>
                        </tr>`;
                }
            });
            html += `
                  </tbody>
                  </table>
                </div>
                </div>`;

            html += '</div>';
            html += '</div>';
            html += '</div>';

            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            html += '</div>';

            html += '</div>';
            html += '</div>';
            html += '<br>';
            $('.mainPage').html(html);
            $("#loader").hide();
            $('#employeeFeat').modal('hide');
        },
        error: function(error) {
            errorPage('leaveDash');
            $("#loader").hide();
            getEmployees('deptHead', '', ''); // called from general-funct.js
        }

    });

}

function applyLeave() {
    let html = '';
    $('.mainPage').html('');
    html += `<link href="/css/employee-style.css" rel="stylesheet">`;
    html += `<link href="/css/salary-dashboard-style.css" rel="stylesheet">`;

    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800"><i class="fa fa-edit"></i> Leave Application</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm applyLeave"><i';
    html += 'class = "fa fa-refresh fa-sm text-white-50"> </i> Reload Page</a>';
    html += '</div>';

    // html += '<div class="container" style="padding: 0px;">';
    checkPoint('none', 'leaveDash');

    // html += `< div class = "tab-content" style = "margin-top:16px; ">`;
    html += `<div class="card scroll-di">`;
    html += `<div class="card-header" style="background-color: ;">`;

    html += `
        <div class="row " >
            <div class="col-md-12">

                <div class="card" >
                    <div class="card-header addHeader" style="background-color: ; color: blue;">
                        Initiate leave application process for an employee.
                    </div>
                </div>
            </div>
        </div>`;

    html += `<div class="show-content" style="height: 100%; border: 1px solid #4682B4; border-radius: 0px 0px 0px 0px; padding: 10px;">
        <form action="${$('#nyanzi').val()}/applyLeave" id="submitLeave" method="POST" enctype="multipart/form-data" id="">
        <div class="row">
                      <div class="col-md-12">
                        <div class="card" >
                          <div class="card-header" style="background-color: #008a9f; color: blue;">
                      </div>
                    </div>
                </div>

                <div class=" col-lg-6 col-md-6">
                <input type="hidden" name="_csrf" value="${$('#crsf').val()}">

                <div class="form-group">
                    <label for="emply_id">Select Employee</label>
                    <select required name="emply_id" id="emply_id">
                      
                    </select>
                    <span style="font-size:12px;" id="error_emply_id" class="text-warning"></span>
                  <input type="number" hidden name="nof" id="nof">
                  <input type="number" hidden name="nofid" id="nofid">
                  </div>

                  <div class="form-group">
                    <label for="leave_id">Select Leave Type</label>
                    <select required name="leave_id" id="leave_id">
                      
                    </select>
                    <span id="error_leave_id" class="text-danger"></span>
                  </div>

                  <div class="emplDet" style="display: none;">
                  <div class="form-group">
                    <label for="empd" id="empd"></label>
                  </div>

                  <div class="form-group">
                    <label for="jobt" id="jobt"></label>
                  </div>

                  </div>

                  <div class="form-group">
                    <label style="color: blue;" for="approvedBy">To be approved by</label>
                    <select required name="approvedBy" id="approvedBy">
                      
                    </select>
                    <span style="font-size:12px;" id="error_approvedBy" class="text-warning"></span>
                    </div>
                </div>

                <div class=" col-lg-6 col-md-6 appLeave">
                
                
                </div>
                
                </div>
                </form>
                </div>
                    
              </div></div>`;

    $('.mainPage').html(html);
    getEmployees('emply_id', '', '', '');

    if ($('#userRole').val() === 'Admin') {
        getDeptHead('approvedBy', '', '', '')
            // getEmployees('approvedBy', '', '', '');

    } else {
        getDeptHead('approvedBy', '', '', '')
    }

}

function getLeaveType() {
    let html = '';
    $('.mainPage').html('');
    html += `<link href="/css/employee-style.css" rel="stylesheet">`;
    html += `<style>
    .scroll-div_leavTyp{
    overflow-y: scroll;
    height: 800px;
    width: 100%;
    }
    </style>`;

    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800"><i class="fa fa-briefcase"></i> Leave Policies</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm leaveType"><i';
    html += 'class = "fa fa-refresh fa-sm text-white-50"> </i> Reload Page</a>';
    html += '</div>';

    // html += '<div class="container" style="padding: 0px;">';


    // html += `< div class = "tab-content" style = "margin-top:16px; ">`;
    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;
    html += `<div class="panel-heading" style="font-size: 15px;">List of leave policies
    <a style="float: right" href="#" class="d-none d-sm-inline-block btn btn-sm btn-warning shadow-sm showLeaveTypeModal">
   <i class = "fas fa-plus fa-sm text-white-50"> </i> Create New</a>
    </div>`;

    html += `<div class="panel-body scroll-div_leavTyp">`;

    html += `<div class="user-message user-message--error" style="display: none;"></div>`;
    $.ajax({
        type: 'GET',
        url: `${$('#nyanzi').val()}/getLeaveTypes`,
        // processData: false,
        contentType: 'application/json',
        success: function(response) {

            checkPoint('none', 'leaveType');

            function getDate(date) {
                let formt_date = new Date(date);
                return formt_date.toLocaleDateString("en-US");
            }

            if (response.leaves.length === 0) {
                html += `<td colspan="7" style="color: red;">No leave type data found</td>`;
            }

            $.each(response.leaves, function(key, value) {

                html += `<div class="card" >
                            <div class="card-header" style="background-color: #008a9f; color: white;"> 
                                ${value.leaveType} Policy
                            </div>
                                <div class="card-body">

                                <div class="row">
                                <div class="col-lg-4 col-md-4">
                                <h4 style="color: #000080">${value.leaveType}</h4>
                                <label>${value.description}</label>
                                
                                </div>
                                <div class="col-lg-4 col-md-4">
                                <h4 style="color: #000000">Carry on</h4>
                                <div class="form-check">
                                <label class="radio-inline">
                                <input style="border: 0px solid white;" type="radio" name="carry_no" disabled value="0" > ${ (value.carryon)? 'Yes' : 'No'}
                                </label>
                                </div>
                                
                                <h4 style="color: #4B0082;">No. of days</h4>
                                <div class="form-check">
                                <label class="radio-inline">
                                <input style="border: 0px solid white;" type="radio" name="carry_no" disabled value="0"> ${value.nofdays}
                                </label>
                                </div>
                                </div>
                                <div class="col-lg-4 col-md-4">
                                <h4 style="color: #4B0082">Gender based</h4>
                                <div class="form-check">
                                <label class="radio-inline">
                                <input type="radio" disabled name="gender_based" value=""  checked> ${value.genderBased}
                                </label>
                                </div><br><br>
                                <button class="btn btn-danger delLeave" value="Remove" id="${value.id}" style="border-radius: 10px 10px 10px 10px;"><i class="fas fa-trash-alt"></i> Delete</button> 

                                <button class="btn btn-info updateLeave" value="Edit" id="${value.id}[]${value.leaveType}[]${value.genderBased}[]${value.carryon}[]${value.nofdays}[]${value.description}" style="border-radius: 10px 10px 10px 10px;"><i class="fas fa-edit"></i> Update</button>

                                <button class="btn btn-success applyLeave" value="apply" id="${value.id}" style="border-radius: 10px 10px 10px 10px;"><i class="fas fa-pencil-alt"></i> Apply</button>
                                
                                </div>
                                </div>
                                <input type="hidden" name="leaveMode" id="leaveMode" value="">
                                <input type="hidden" name="_csrf" id="_csrf" value="<%= csrfToken %>">

                            </div>
                        </div>`;
            });

            html += '</div>';
            html += '</div>';
            html += '</div>';
            $('.mainPage').html(html);
            $("#loader").hide();
            // getEmployees('deptHead', '', ''); // called from general-funct.js
            unactive();
            $('.leaveType_blue').css("color", 'blue');
        },
        error: function(error) {
            // console.log(error);
            errorPage('leaveType');
            $("#loader").hide();
            // getEmployees('deptHead', '', ''); // called from general-funct.js
        }
    });
    // html += `</div>`;
}

$(document).ready(function() {

    $(document).on('click', '.leaveType', function() {
        $('title').html('Leave types');
        $("#loader").show();
        getLeaveType();
        unactive();
        logUIAccess('Clicked leave type', '.leaveType');

        $('.leaveType_blue').css("color", 'blue');
    });

    $(document).on('click', '.leaveDash', function() {
        $('title').html('Leave Dashboard');        
        $("#loader").show();
        leaveDash('Pending');
        unactive();
        logUIAccess('Clicked leave dashboard', '.leaveDash');

        $('.leaveDash').css("color", 'blue');
    });

    $(document).on('click', '.tablinksl', function() {
        $('.show-contentl').html('');
        let tabValue = $(this).val();
        $('title').html(tabValue + ' Leaves');
        logUIAccess(`Clicked ${tabValue} leave tab`, '.tablinksl');

        if (tabValue === 'Pending') {
            $('.addHeaderl').html(tabValue + ' Leaves');
        } else if (tabValue === 'Approved') {
            $('.addHeaderl').html('Approved Leaves');
        } else if (tabValue === 'Rejected') {
            $('.addHeaderl').html('Rejected Leaves');
        } else if (tabValue === 'Leave') {
            $('title').html('On leave');
            $('.addHeaderl').html('On Leave');
        } else {
            $('.addHeaderl').html(tabValue)
        }

        $('.tablinksl, tabs div.tabcontentl').removeClass('active');
        $('.tabcontentl').hide();
        $('#' + tabValue).show();
        $(this).addClass('active');
        $("#loader").show();
        leaveDash(tabValue);

    });

    function modal_form(title, header, mode) {
        $('#leaveType').val('');
        $('#error_leaveType').html('');
        $('#genderbased').val('');
        $('#error_genderbased').html('');
        $('#carryon').val('');
        $('#error_carryon').html('');
        $('#nofdays').val('');
        $('#error_nofdays').html('');
        $('#leaveDesc').val('');
        $('#error_leaveDesc').html('');
        $('#leaveID').val('');
        $('#leaveMode').val(mode);
        $('.invalid').css({
            'border-color': 'gray',
            'color': 'black'
        });
        $('h5').html(header);
        $('title').html(title);
    }

    $(document).on('click', '.showLeaveTypeModal', function() {
        // alert('All Set ......');
        modal_form('Create leave type', '<i class="fas fa-plus-circle"></i> Create New Leave Type', 'add');
        $('#addLeaveType-form').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    });

    $(document).on('submit', '#add-updateLeaveType', function(e) {
        e.preventDefault();

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
                checkPoint('none', 'leaveType');

                $('.user-message').css('display', 'flex')
                $('.user-message').html('A moment please.....');
                $('.user-message').css({
                    'border-color': 'blue',
                    'color': 'white',
                    'background-color': 'green'
                });

                // getTaxData = [];
                setTimeout(function() {
                    $('.user-message').css('display', 'none')
                    $('.user-message').html('');
                    unactive();
                    // modal_form('', 'Salary Structure', '');
                    $('#addLeaveType-form').modal('hide');
                    unactive();
                    $('.leaveType_blue').css("color", 'blue');
                    getLeaveType();
                }, 1000);
            },
            error: function(error) {
                console.log('In error');
                // console.log(error)
                if (error.status === 422) {
                    $.each(error.responseJSON.validationErrors, function(key, value) {

                        $('#error_' + value.param).text(value.msg);
                        // $('#' + value.param).addClass('has-error');
                        $('#' + value.param).addClass(`invalid`);
                        $('.invalid').css({
                            'border-color': 'red',
                            'color': 'red'
                        });
                    });

                } else if (error.status == 500) {
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
                    errorPage('leaveDash');
                }
            }
        });
    });

    $(document).on('click', '.delLeave', function() {
        // e.preventDefault();
        logUIAccess('Clicked delete leave type', '.delLeave');

        if (confirm('Are you SURE you want to delete this leave policy' + '\n' +
                'Once deleted, cannot be recovered.')) {

            const id = $(this).attr('id');
            let url = `${$('#nyanzi').val()}/removeLeaveType/${id}`;
            // alert($(this).attr('id'));
            // console.log('Form data');
            $.ajax({
                type: 'GET',
                url: url,
                contentType: 'application/json',
                success: function(response) {
                    console.log('In success');
                    checkPoint('none', 'add-salary-form');

                    $('.user-message').css('display', 'flex')
                    $('.user-message').html('A moment please ... Deleting leave policy');
                    $('.user-message').css({
                        'border-color': 'blue',
                        'color': 'white',
                        'background-color': 'green'
                    });

                    setTimeout(function() {
                        $('.user-message').css('display', 'none')
                        $('.user-message').html('');
                        // unactive();
                        // modal_form('', 'Salary Structure', '');
                        // $('#addSalary').modal('hide');
                        unactive();
                        $('.leaveType_blue').css("color", 'blue');
                        getLeaveType();
                    }, 1000);
                },
                error: function(error) {
                    console.log('In error');
                    // console.log(error)
                    if (error.status === 500) {

                        alert(error.responseJSON.error);
                    } else {
                        errorPage('leaveType');
                    }
                }

            });
        }
    })

    $(document).on('click', '.updateLeave', function() {
        logUIAccess('Clicked update leave type', '.updateLeave');

        const data = $(this).attr('id').split('[]');
        // alert(data[5]);
        $('#leaveType').val(data[1]);
        $('#error_leaveType').html('');
        getGenderLeave('genderbased', data[2])
        $('#error_genderbased').html('');
        getCarryon('carryon', data[3]);
        $('#error_carryon').html('');
        $('#nofdays').val(data[4]);
        $('#error_nofdays').html('');
        $('#leaveDesc').val(data[5]);
        $('#error_leaveDesc').html('');
        $('#leaveID').val(data[0]);
        $('#leaveMode').val('edit');
        $('.invalid').css({
            'border-color': 'gray',
            'color': 'black'
        });
        $('h5').html('<i class="fas fa-edit"></i> Update Leave Type');
        $('title').html('Update leave type');

        $('#addLeaveType-form').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    });
    

    $(document).on('click', '.applyLeave', function() {
        $('title').html('Leave application');
        applyLeave();
        unactive()
        logUIAccess('Clicked apply leave', '.applyLeave');

        $('.applyLeave_blue').css("color", 'blue');
    });

    $(document).on('change', '#emply_id', function() {
        let employgender;

        if ($(this).val() != '') {
            $.ajax({
                type: 'GET',
                url: `${$('#nyanzi').val()}/getEmployee/${$(this).val()}`,
                // processData: false,
                contentType: 'application/json',
                success: function(response) {
                    console.log('Response', response);
                    if (response.status) {
                        $('#error_emply_id').html('This employee is currently on leave, till current leave is exhausted, any leave application will be pending.')
                    } else { $('#error_emply_id').html(''); }

                    employgender = response.employee[0].gender;
                    $('#nof').val(response.employee[6].nofdays);
                    $('#nofid').val(response.employee[6].id);
                    $('#empd').html('Department: ' + response.employee[2].deptName);
                    $('#jobt').html('Job title: ' + response.employee[1].jobTitle);
                    $('.emplDet').css('display', 'block');
                    const leavetype = response.employee[6].leaveType;
                    const leavetypeId = `${response.employee[6].id}_${response.employee[6].nofdays}`;
                    // alert(employgender);

                    function leaveType() {
                        return $.ajax({
                            type: 'GET',
                            url: `${$('#nyanzi').val()}/getLeaveTypes`,
                            // processData: false,
                            contentType: 'application/json',
                            success: function(response) {
                                // console.log('Leave type', response);
                            },
                            error: function(error) {
                                console.log(error);
                                alert(error.responseJSON.error);

                            }
                        });
                    }
                    let result = leaveType();
                    result.done(function(response) {

                        $('#leave_id').html($("<option></option>").attr("value", "").text("Select data"));
                        $('#leave_id').append($("<option></option>").attr("value", leavetypeId).text(leavetype));
                        const anl = /ANNUAL/;
                        $.each(response.leaves, function(key, value) {
                            if ((employgender === value.genderBased) || (value.genderBased === 'All')) {
                                if (!anl.test(value.leaveType.toUpperCase())) {
                                    $('#leave_id').append($("<option></option>").attr("value", `${value.id}_${value.nofdays}`).text(`${value.leaveType}`));
                                }
                            }
                        });
                    });
                },

                error: function(error) {
                    console.log('Error', error);
                    alert(error.responseJSON.error);
                }
            });
        } else {
            $('#error_emply_id').html('');
            $('#leave_id').html('');
            $('#error_leave_id').html('');
            $('.appLeave').html('');
            $('.emplDet').css('display', 'none');
        }
    });

    $(document).on('change', '#leave_id', function() {
        // alert(response);
        const id = $(this).val().split('_');
        const emply_id = $('#emply_id').val();
        let daysLeft;

        function takenLeaves(id) {
            // console.log('emply_id', emply_id);
            return $.ajax({
                type: 'GET',
                url: `${$('#nyanzi').val()}/getLeaves/${id}/${emply_id}`,
                // processData: false,
                contentType: 'application/json',
                success: function(response) {
                    // console.log('Leave type', response);
                },
                error: function(error) {
                    console.log(error);
                    alert(error.responseJSON.error);
                }
            });
        }

        let anu = /ANNUAL/;
        let cas = /CASUAL/;
        let comp = /COMPASSIONATE/;

        function getTotal(total) {
            if (total) {
                return total;
            } else { return 0 }
        }

        let leaveType = $('#leave_id option:selected').text();
        // anu.test(leaveType.toUpperCase())
        if (+id[0] == +$('#nofid').val()) {
            // alert(`${+id[0]} == ${+$('#nofid').val()}`);
            // $.each(response.leaves, function(key, value) {})
            let result = takenLeaves(id[0]);
            result.done(function(response) {
                // if (!response.getAll) {
                // alert(response.getAll.length);
                const leaveLeft = Number(id[1]) - getTotal(response.getAll);
                if (leaveLeft) {
                    daysLeft = +leaveLeft;
                    // console.log('Days left', leaveLeft, daysLeft, response.getAll);
                    $('.appLeave').html(`
                    <div class="form-group">
                    <label style="color: blue;">Leave type: ${leaveType}</label>
                    <label style="color: blue;">Days left: ${leaveLeft} ${(leaveLeft > 1)? 'days': 'day'}</label>
                    </div>

                    <table border="0" style="border: none;">
                    <tr>
                        <td colspan="2">
                        </td>
                        </tr>
                    <td>
                        <div class="form-group">
                            <label for="fromDate">From</label>
                            <input type="date" required name="fromDate" id="fromDate">
                            <span id="error_fromDate" class="text-danger"></span>
                        </div>
                    </td>
                    <td>
                    <div class="form-group">
                        <label for="toDate">To</label>
                        <input type="date" required name="toDate" id="toDate">
                        <span id="error_toDate" class="text-danger"></span>
                    </div>
                    </td>
                        <tr>
                        <td colspan="2">
                        <span id="error_days" class="text-danger"></span>
                        </td>
                        </tr>

                    </table>
                    <div class="form-group">
                        <label id="days" for="days">Days: </label>
                    </div>
                    <div class="form-group">
                        <label for="reason">Reason</label>
                        <textarea required type="text" name="reason" id="reason" placeholder="Enter reason">${leaveType}</textarea>
                        <span id="error_reason" class="text-danger"></span>
                    </div>

                    <div class="form-group">
                        <label for="attFile">Attached file</label>
                        <input type="file" name="attFile" id="attFile" class="checkfilePDF">
                        <span id="error_attFile" class="text-danger"></span>
                    </div>

                    <span id="applyLeaErrors"></span>

                    <button class="btn btn-primary hidbtn"><i class="fas fa-plus"></i> Submit</button>
                    
                    `);
                    $('#error_leave_id').html('');

                } else {
                    $('#error_leave_id').html('Employee has exhausted annual leave');
                    $('.appLeave').html('');
                }
                // }
            })
        } else if (cas.test(leaveType.toUpperCase())) {
            let result = takenLeaves($('#leave_id').val());
            result.done(function(response) {
                // if (!response.getAll.length) {
                // alert(response.getAll);
                const leaveLeft = Number($('#nof').val()) - getTotal(response.getAll);
                if (leaveLeft) {
                    daysLeft = +leaveLeft;
                    $('.appLeave').html(`
                    <div class="form-group">
                    <label style="color: blue;">Leave type: ${leaveType}</label>
                    <label style="color: blue;">Expected days for ${leaveType} is ${id[1]} days</label>
                    </div>

                    <table border="0" style="border: none;">
                    <tr>
                        <td colspan="2">
                        </td>
                        </tr>
                    <td>
                        <div class="form-group">
                            <label for="fromDate">From</label>
                            <input type="date" required name="fromDate" id="fromDate">
                            <span id="error_fromDate" class="text-danger"></span>
                        </div>
                    </td>
                    <td>
                    <div class="form-group">
                        <label for="toDate">To</label>
                        <input type="date" required name="toDate" id="toDate">
                        <span id="error_toDate" class="text-danger"></span>
                    </div>
                    </td>
                        <tr>
                        <td colspan="2">
                        <span id="error_days" class="text-danger"></span>
                        </td>
                        </tr>

                    </table>
                    <div class="form-group">
                        <label id="days" for="days">Days: </label>
                    </div>
                    <div class="form-group">
                        <label for="reason">Reason</label>
                        <textarea required type="text" name="reason" id="reason" placeholder="Enter reason"></textarea>
                        <span id="error_reason" class="text-danger"></span>
                    </div>

                    <div class="form-group">
                        <label for="attFile">Attached file</label>
                        <input type="file" name="attFile" id="attFile" class="checkfilePDF">
                        <span id="error_attFile" class="text-danger"></span>
                    </div>

                    <span id="applyLeaErrors"></span>

                    <button class="btn btn-primary hidbtn"><i class="fas fa-plus"></i> Submit</button>
                    
                    `);
                    $('#error_leave_id').html('');

                } else {
                    $('#error_leave_id').html('Employee has exhausted casual leave, kindly apply for other leave');
                    $('.appLeave').html('');
                }
                // }
            });
        } else if (comp.test(leaveType.toUpperCase())) {
            let result = takenLeaves($('#leave_id').val());
            result.done(function(response) {
                // if (!response.getAll.length) {
                // alert(response.getAll.length);
                const leaveLeft = Number($('#nof').val()) - getTotal(response.getAll);
                if (!leaveLeft) {
                    daysLeft = +leaveLeft;
                    $('.appLeave').html(`
                    <div class="form-group">
                    <label style="color: blue;">Leave type: ${leaveType}</label>
                    <label style="color: blue;">Expected days for ${leaveType} is ${id[1]} days</label>
                    </div>

                    <table border="0" style="border: none;">
                    <tr>
                        <td colspan="2">
                        </td>
                        </tr>
                    <td>
                        <div class="form-group">
                            <label for="fromDate">From</label>
                            <input type="date" required name="fromDate" id="fromDate">
                            <span id="error_fromDate" class="text-danger"></span>
                        </div>
                    </td>
                    <td>
                    <div class="form-group">
                        <label for="toDate">To</label>
                        <input type="date" required name="toDate" id="toDate">
                        <span id="error_toDate" class="text-danger"></span>
                    </div>
                    </td>
                        <tr>
                        <td colspan="2">
                        <span id="error_days" class="text-danger"></span>
                        </td>
                        </tr>

                    </table>
                    <div class="form-group">
                        <label id="days" for="days">Days: </label>
                    </div>
                    <div class="form-group">
                        <label for="reason">Reason</label>
                        <textarea required type="text" name="reason" id="reason" placeholder="Enter reason"></textarea>
                        <span id="error_reason" class="text-danger"></span>
                    </div>

                    <div class="form-group">
                        <label for="attFile">Attached file</label>
                        <input type="file" name="attFile" id="attFile" class="checkfilePDF">
                        <span id="error_attFile" class="text-danger"></span>
                    </div>

                    <span id="applyLeaErrors"></span>

                    <button class="btn btn-primary hidbtn"><i class="fas fa-plus"></i> Submit</button>
                    
                    `);
                    $('#error_leave_id').html('');

                } else {
                    $('#error_leave_id').html('Employee has not exhausted annual leave, kindly apply for annual or casual leave ');
                    $('.appLeave').html('');
                }
                // }
            });
        } else {
            const sk = /SICK/;
            const sab = /SABBATICAL/
            let result = takenLeaves(id[0]);
            result.done(function(response) {
                // if (!response.getAll.length) {
                // alert(response.getAll.length);
                // const leaveLeft = Number($('#nof').val()) - getTotal(response.getAll.total);
                if (!response.getAll) {
                    // daysLeft = +leaveLeft;
                    // console.log('response.getAll.length ', response.getAll);
                    $('.appLeave').html(`
                    <div class="form-group">
                    <label style="color: blue;">Leave type: ${leaveType}</label>
                    <label style="color: blue;">Expected days for ${leaveType} is ${id[1]} days</label>
                    </div>

                    <table border="0" style="border: none;">
                    <tr>
                        <td colspan="2">
                        </td>
                        </tr>
                    <td>
                        <div class="form-group">
                            <label for="fromDate">From</label>
                            <input type="date" required name="fromDate" id="fromDate">
                            <span id="error_fromDate" class="text-danger"></span>
                        </div>
                    </td>
                    <td>
                    <div class="form-group">
                        <label for="toDate">To</label>
                        <input type="date" required name="toDate" id="toDate">
                        <span id="error_toDate" class="text-danger"></span>
                    </div>
                    </td>
                        <tr>
                        <td colspan="2">
                        <span id="error_days" class="text-danger"></span>
                        </td>
                        </tr>

                    </table>
                    <div class="form-group">
                        <label id="days" for="days">Days: </label>
                    </div>
                    <div class="form-group">
                        <label for="reason">Reason</label>
                        <textarea required type="text" name="reason" id="reason" placeholder="Enter reason"></textarea>
                        <span id="error_reason" class="text-danger"></span>
                    </div>

                    <div class="form-group">
                        <label for="attFile">Attached file</label>
                        <input ${(sk.test(leaveType.toUpperCase()) || sab.test(leaveType.toUpperCase())) ? 'required' : ''} type="file" name="attFile" id="attFile" class="checkfilePDF">
                        <span id="error_attFile" class="text-danger"></span>
                    </div>

                    <span id="applyLeaErrors"></span>

                    <button class="btn btn-primary hidbtn"><i class="fas fa-plus"></i> Submit</button>
                    
                    `);
                    $('#error_leave_id').html('');

                } else {
                    $('#error_leave_id').html(`Employee has exhausted ${leaveType}, kindly apply for other leave `);
                    $('.appLeave').html('');
                }
                // }
            });
        }

        $(document).on('change', '#toDate', function() {
            // $('#error_days').html('');
            if ($('#fromDate').val() && $(this).val()) {
                let fr = new Date($('#fromDate').val());
                let to = new Date($('#toDate').val());
                // let today1 = new Date() //.toLocaleDateString("en-US");
                // const today = Math.floor(today1 / 1000);
                // alert(today)
                const ttl = Math.floor(fr / 1000);
                const ttl2 = Math.floor(to / 1000);

                // console.log("Dates ====> ", today, fr, to);
                const days = ttl2 - ttl;
                if (days < 1) {
                    $('#error_days').removeClass('text-warning');
                    $('#error_days').addClass('text-danger');
                    $('#error_days').html('Ensure date is entered in a correct order.');
                    $('#days').html('Days: ');
                    $('.hidbtn').css('display', 'none');
                    return false;
                }

                // if (fr < today || to < today) {
                //     $('#error_days').removeClass('text-warning');
                //     $('#error_days').addClass('text-danger');
                //     $('#error_days').html('Ensure date is entered is in future or today date.');
                //     $('#days').html('Days: ');
                //     $('.hidbtn').css('display', 'none');
                //     return false;
                // }

                if (+id[0] == +$('#nofid').val()) {
                    console.log(days, daysLeft);
                    if (+days == (86400 * daysLeft)) {
                        console.log('log2');
                        $('#error_days').html('');
                        $('#days').html('Days: ' + ((days / 1440) / 60));
                        $('.hidbtn').css('display', 'block');
                    } else if (+days < (86400 * daysLeft)) {
                        console.log('log3');
                        $('#error_days').removeClass('text-danger');
                        $('#error_days').addClass('text-warning');
                        $('#error_days').html('Warning: Number of days given is less than expected days for annual leave, you can ignore it if you wish');
                        $('#days').html('Days: ' + ((days / 1440) / 60));
                        // $('.hidbtn').css('display', 'none');
                    } else {
                        $('#error_days').html('Sorry date entered is more than annual leave left.');
                        $('#days').html('Days: ' + ((days / 1440) / 60));
                        $('.hidbtn').css('display', 'none');
                    }
                    return false;
                } else if (cas.test(leaveType.toUpperCase())) {
                    if (+days == (86400 * id[1]) && days < (86400 * daysLeft)) {
                        console.log('log4');
                        $('#error_days').html('');
                        $('#days').html('Days: ' + ((days / 1440) / 60));
                        $('.hidbtn').css('display', 'block');
                    } else if (+days < (86400 * id[1]) && days < (86400 * daysLeft)) {
                        console.log('log5');
                        $('#error_days').removeClass('text-danger');
                        $('#error_days').addClass('text-warning');
                        $('#error_days').html(`Warning: Number of days given is less than expected days for casual leave, you can ignore it if you wish`);
                        $('#days').html('Days: ' + ((days / 1440) / 60));
                        $('.hidbtn').css('display', 'block');
                    } else {
                        if (+days > (86400 * id[1]) && days > (86400 * daysLeft)) {
                            $('#error_days').html('Sorry date entered is more than annual leave left.');
                            $('#days').html('Days: ' + ((days / 1440) / 60));
                            $('.hidbtn').css('display', 'none');
                        } else {
                            console.log('log5b');
                            $('#error_days').removeClass('text-danger');
                            $('#error_days').addClass('text-warning');
                            $('#error_days').html('Warning: Number of days given is more than expected days for casual leave, you can ignore it if you wish');
                            $('#days').html('Days: ' + ((days / 1440) / 60));
                            $('.hidbtn').css('display', 'block');
                        }
                    }
                    return false;
                } else if (comp.test(leaveType.toUpperCase()) || !cas.test(leaveType.toUpperCase())) {
                    if (+days == (86400 * id[1])) {
                        console.log('log4');
                        $('#error_days').html('');
                        $('#days').html('Days: ' + ((days / 1440) / 60));
                        $('.hidbtn').css('display', 'block');
                    } else if (+days < (86400 * id[1])) {
                        console.log('log5');
                        $('#error_days').removeClass('text-danger');
                        $('#error_days').addClass('text-warning');
                        $('#error_days').html(`Warning: Number of days given is less than expected days for ${leaveType}, you can ignore it if you wish.`);
                        $('#days').html('Days: ' + ((days / 1440) / 60));
                        $('.hidbtn').css('display', 'block');
                    } else if (+days > (86400 * id[1])) {
                        console.log('log5');
                        $('#error_days').removeClass('text-danger');
                        $('#error_days').addClass('text-warning');
                        $('#error_days').html(`Warning: Number of days given is more than expected days for ${leaveType}, you can ignore it if you wish.`);
                        $('#days').html('Days: ' + ((days / 1440) / 60));
                        $('.hidbtn').css('display', 'block');
                    } else {
                        $('#error_days').html('Ensure date is entered in a correct order.');
                        $('#days').html('Days: ' + ((days / 1440) / 60));
                        $('.hidbtn').css('display', 'none');
                    }
                }
                return false;
                // alert(ttl2);
            }
        });

    });

    $(document).on('submit', '#submitLeave', function(e) {
        e.preventDefault();
        // alert('All set for now .....');
        let form = $(this)[0];
        let data = new FormData(form);
        $('#loader').show();
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
                checkPoint('none', 'applyLeave');

                $('.user-message').css('display', 'flex')
                $('.user-message').html('A moment please.....');
                $('.user-message').css({
                    'border-color': 'blue',
                    'color': 'white',
                    'background-color': 'green'
                });

                // getTaxData = [];
                setTimeout(function() {
                    $('.user-message').css('display', 'none')
                    $('.user-message').html('');
                    unactive();
                    $('.leaveDash').css("color", 'blue');
                    $("#loader").show();
                    leaveDash('Pending');
                }, 1000);
                $('#loader').hide();

            },
            error: function(error) {
                console.log('In error');
                // console.log(error)
                if (error.status === 422) {
                    $.each(error.responseJSON.validationErrors, function(key, value) {

                        $('#error_' + value.param).text(value.msg);
                        // $('#' + value.param).addClass('has-error');
                        console.log("value.param ===> ", value.param, value.msg);
                        $('#' + value.param).addClass(`invalid`);
                        $('.invalid').css({
                            'border-color': 'red',
                            'color': 'red'
                        });
                    });
                $('#loader').hide();
                } else if (error.status == 500) {

                    $('.user-message').css('display', 'flex');
                    $('.user-message').html(error.responseJSON.error);
                    $('.user-message').addClass('danger');
                    $('.user-message').css({ 'border-color': '', 'color': 'white', 'background-color': '' });

                    setTimeout(function() {
                        $('.user-message').css('display', 'none');
                        $('user-message').html('');
                    }, 2000)
                    $('#loader').hide();
                    return false;
                } else {
                    errorPage('leaveType');
                    $('#loader').hide();
                }
            }
        });
    });

    function clearErr() {
        $('#error_fromDateLev').html('')
        $('#error_toDateLev').html('')
        $('#error_reasonLev').html('')
        $('#error_remarkLev').html('')
        $('#error_statusLev').html('')
        $('.invalid').css({
            'border-color': 'black',
            'color': 'black'
        });
    }

    $(document).on('click', '.pend', function() {
        // alert('All set is now');
        logUIAccess(`Clicked pending leave details`, '.pend');

        $tr = $(this).closest('tr');
        let data = $tr.children("td").map(function() {
            return $(this).text();
        }).get();
        clearErr()
        $('#leaveAppID').val(data[0]);
        $('#emID').val(data[10]);
        $('#leaType').html(`Leave type: ${data[7]}`);
        $('#leaExp').html(`Expected days for ${data[7]} is ${data[8]} days`);
        $('#daysLev').html(`Days: ${data[6]}`);
        $('#fromDateLev').val(data[4]);
        $('#toDateLev').val(data[5]);
        $('#reasonLev').html(data[9]);
        $('#remarkLev').val('');
        $('.statusLev').css('display', 'block');
        $('#remarkLev').prop("readonly", false);
        $('.modal-footer').css('display', 'block');
        $('#apprBy').html(`Approved By: ${data[11]}`);
        $('#leaveDetails').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});

    });

    $(document).on('submit', '#approveLev', function(e) {
        e.preventDefault();

        let form = $(this)[0];
        let data = new FormData(form);

        $.ajax({
            type: 'POST',
            enctype: 'multipart/form-data',
            url: `${$('#nyanzi').val()}/`+ $(this).attr('action'),
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            success: function(response) {
                console.log('In success');
                checkPoint('none', 'leaveDash');

                $('.user-message').css('display', 'flex')
                $('.user-message').html('A moment please.....');
                $('.user-message').css({
                    'border-color': 'blue',
                    'color': 'white',
                    'background-color': 'green'
                });

                // getTaxData = [];
                setTimeout(function() {
                    $('.user-message').css('display', 'none')
                    $('.user-message').html('');
                    modal_form('', 'Salary Structure', '');
                    $('#leaveDetails').modal('hide');
                    unactive();
                    $('.leaveDash').css("color", 'blue');
                    leaveDash($('#statusLev').val());
                }, 1000);
            },
            error: function(error) {
                console.log('In error');
                // console.log(error)
                if (error.status === 422) {
                    $.each(error.responseJSON.validationErrors, function(key, value) {

                        $('#error_' + value.param).text(value.msg);
                        // $('#' + value.param).addClass('has-error');
                        $('#' + value.param).addClass(`invalid`);
                        $('.invalid').css({
                            'border-color': 'red',
                            'color': 'red'
                        });
                    });

                } else if (error.status == 500) {

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
                    errorPage('leaveDash');
                }
            }
        });
    });

    $(document).on('click', '.approve', function() {
        // alert('All set is now');
        logUIAccess(`Clicked approved leave details`, '.approve');

        $tr = $(this).closest('tr');
        let data = $tr.children("td").map(function() {
            return $(this).text();
        }).get();
        clearErr()
        $('#leaveAppID').val(data[0]);
        $('#emID').val(data[11]);
        $('#leaType').html(`Leave type: ${data[7]}`);
        $('#leaExp').html(`Expected days for ${data[7]} is ${data[8]} days`);
        $('#daysLev').html(`Days: ${data[6]}`);
        $('#fromDateLev').val(data[4]);
        $('#toDateLev').val(data[5]);
        $('#reasonLev').html(data[9]);
        $('#remarkLev').html(data[10]);
        $('.statusLev').css('display', 'none');
        $('.modal-footer').css('display', 'none');
        $('#remarkLev').prop("readonly", true);
        $('#leaveDetails').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    });

    $(document).on('click', '.reject', function() {
        // alert('All set is now');
        logUIAccess(`Clicked rejected leave details`, '.reject');

        $tr = $(this).closest('tr');
        let data = $tr.children("td").map(function() {
            return $(this).text();
        }).get();
        clearErr()
        $('#leaveAppID').val(data[0]);
        $('#emID').val(data[11]);
        $('#leaType').html(`Leave type: ${data[7]}`);
        $('#leaExp').html(`Expected days for ${data[7]} is ${data[8]} days`);
        $('#daysLev').html(`Days: ${data[6]}`);
        $('#fromDateLev').val(data[4]);
        $('#toDateLev').val(data[5]);
        $('#reasonLev').html(data[9]);
        $('#remarkLev').html(data[10]);
        $('.statusLev').css('display', 'none');
        $('.modal-footer').css('display', 'none');
        $('#remarkLev').prop("readonly", true);
        $('#leaveDetails').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    });

    $(document).on('click', '.delLeaveApply', function() {
        // alert('All set for now');
        if (confirm('Are you sure you want to delete? \n Once deleted cannot be recovered !!')) {
            const leaveId = $(this).attr('id');

            $.ajax({
                type: 'GET',
                url: `${$('#nyanzi').val()}/deleteLeaveApply/${leaveId}`,
                contentType: 'application/json',

                success: function(response) {
                    // alert('all set for now');
                    $('.user-message').css('display', 'flex');
                    $('.user-message').html('Leave deleted ...');
                    $('.user-message').css({ 'border-color': 'blue', 'color': 'white', 'background-color': 'green' });

                    setTimeout(function() {
                        $('.user-message').css('display', 'none');
                        $('user-message').html('');
                        $('.leaveDash').css('color', 'blue');
                        leaveDash('Pending');

                    }, 1000);
                },
                error: function(error) {
                    console.log(error);
                    let errors = '';
                    if (error.status == 422) {
                        $.each(error.responseJSON.validationErrors, function(key, value) {
                            errors += `<p>${value.msg}</p>`
                        });
                    } else if (error.status == 500) {
                        $('.user-message').css('display', 'flex');
                        $('.user-message').html(error.responseJSON.error);
                        $('.user-message').addClass('danger');
                        $('.user-message').css({ 'border-color': '', 'color': 'white', 'background-color': '' });

                        setTimeout(function() {
                            $('.user-message').css('display', 'none');
                            $('user-message').html('');
                            $('.leaveDash').css('color', 'blue');
                            leaveDash('Pending');

                        }, 1000)
                    } else {
                        // alert('Error');
                        errorPage('leaveDash');
                        // console.log('Error ===> ', error);
                    }

                    if (errors != '') {
                        $('.user-message').css('display', 'flex');
                        $('.user-message').html(errors);
                        $('.user-message').addClass('danger');
                        $('.user-message').css({ 'border-color': '', 'color': 'white', 'background-color': '' });

                        setTimeout(function() {
                            $('.user-message').css('display', 'none');
                            $('user-message').html('');
                            $('.leaveDash').css('color', 'blue');
                            leaveDash('Pending');

                        }, 1000)

                    }
                }
            })
        }
    })
});