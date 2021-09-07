function userDetails(data) {
    let html = '';
    $('.mainPage').html('');
    html += `<link href="/css/employee-style.css" rel="stylesheet">`;

    html += `<style>
     .hr {margin: 0px;}
     .lab {color: #000000;}
     .scroll-div {
    overflow-y: scroll;
    height: 200px;
    width: 100%;
}
    </style>`;

    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800">Detailed info on user</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm showUserMag" id="<%= userDetails[0] %>"><i';
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Back Users</a>';
    html += '</div>';

    // html += '<div class="container" style="padding: 0px;">';

    // html += `<div class="tab-content" style="margin-top:16px; ">`;
    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;

    html += `<div class="panel-heading" style="font-size: 15px; background: #008a9f; color: white">Welcome: ${$('.getUsr').html()}</div>`;

    html += `<div class="panel-body">`;

    html += `<center><label style="text-align: center; color: #00008B; font-size: 20px;">${data[1]}</label></center> <hr>`;
    html += `<div class="row" style="background-color:white;">`;

    html += `<div class=" col-lg-4 col-md-4">`;
    html += `<label><img style="width: 50%; height: 20%; padding-left: 10px;" class="img-profile rounded-circle" src="/${data[11]}"></label>`
    html += `<table>
              <tr>
                <th><label class="lab">Staff ID</label> <hr class="hr"></th>
                <th><label class="lab">Phone</label> <hr class="hr"></th>
                
              </tr>

              <tr>
                <td><label> ${data[0]} </label> <hr class="hr"></td>
                <td><label> ${data[10]} </label> <hr class="hr"></td>
                
              </tr>
            </table> <br><br>`;
    html += `<label style="color: #00008B;">Added by: ${data[7]} </label> <hr class="hr"> <br>`;

    html += `</div>`;

    html += `<div class="col-lg-4 col-md-4">`;

    html += `<label class="lab">Username</label> <hr class="hr">`;
    html += `<label> ${data[3]} </label> <hr class="hr">`;

    html += `<label class="lab">Role</label> <hr class="hr">`;
    html += `<label> ${(data[4] === 'STDU')? 'Standard user':data[4]} </label> <hr class="hr">`;

    //html += `<button style="float: left;" class="btn btn-primary changePass btn-sm"><i class="fas fa-edit"></i> Change Password</button>`;


    html += `</div>`;

    html += `<div class="col-lg-4 col-md-4">`;

    html += `<label class="lab">Status</label> <hr class="hr">`;
    html += `<label> ${data[5]} </label> <hr class="hr">`;

    html += `<label class="lab">Last login</label> <hr class="hr">`;
    html += `<label> ${data[6]} </label> <hr class="hr"> <br>`;

    // html += `<button style="float: left;" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#logoutModal"><i class="fas fa-sign-out-alt"></i> Logout</button>`;
    html += `</div>`;

    html += `</div> <br>`;

    //Employee details
    html += `<div class="tab-pane active" id="basic_info" style="margin: 0px;">`;
    html += `<div class="panel panel-default">`;
    html += `<div class="panel-heading" style="font-size: 15px; text-align: center; background: #A9A9A9; color: white">User logs</div>`;
    html += `<div class="panel-body ">`;

    html += `<style>
    td a{
        color: #739931;
        }
        .page{
        max-width: 60em;
        margin: 0 auto;
        }
        table {
        border-collapse: collapse;
        width: 100%;
        }
        th, td {
            padding: 0.25rem;
            text-align: left;
            border: 1px solid #ccc;
        }
        tbody tr:nth-child(odd) {
            background: #eee;
        }
        tbody tr:hover {
        background: #F8F8FF;
        }
        table.responsive-table{
        box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
        }
    </style>`;

    html += `<center><label style="text-align: center; color: #00008B;">Most recent logs</label></center> <hr>`;
    html += `<div class="form-group"><input class="" id="filterLogs" type="text" placeholder="Search user logs by anything.."></div>`;

    // html += `<div class="row" style="background-color:white;">`;
    //ajax to get log file
    html += '<div class="scroll-div"><table class="layout display responsive-table">';
    html += '<thead class="table-dark" style="background-color:#B0C4DE;">';
    html += '<tr>';
    html += `<th>Date</th>`;
    html += '<th>Action</th>';
    html += '<th>IP</th>';
    html += '<th>Browser</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color: white;" id="filterLogsTable">';

    $.ajax({
        type: 'GET',
        url: `/getUserLogs/${data[13]}`,
        contentType: 'application/json',

        success: function(response) {
            console.log('Response ==> ', response);
            if (response.data.length == 0) {
                html += `<td colspan="4" style="color: red">No log entry</td>`;
                // return false
            }
            $.each(response.data, function(key, value) {
                // console.log('..', value.id);
                html += `<tr>`;
                html += `<td>${new Date(value.createdAt).toUTCString()}</td>`
                html += `<td>${value.action}</td>`
                html += `<td>${value.ip}</td>`
                html += `<td>${value.browser}</td>`
                html += `</tr>`;
            });
            html += '</tbody>';
            html += '</table>';
            html += `</div>`;
            html += `</div>`;

            html += `</div>`;
            html += `</div>`;
            html += `</div>`;
            html += `</div>`;
            // html += `</div>`;

            html += `</div>`;
            // html += `</div>`;
            $('.mainPage').html(html);
            $("#loader").hide();
        },
        error: function(error) {
            console.log(error);
            html += `<td colspan="4" style="color: red">${error.responseJSON.error}</td>`;
            // errorPage('showUserMag');

            html += '</tbody>';
            html += '</table>';

            // html += `</div>`;
            html += `</div>`;

            html += `</div>`;
            html += `</div>`;
            html += `</div>`;
            html += `</div>`;
            // html += `</div>`;

            html += `</div>`;
            // html += `</div>`;
            $('.mainPage').html(html);
        }
    });

}

function resetUserPass(data) {
    $('title').html('Reset User Password');
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
    html += '<h6 class="h3 mb-0 text-gray-800">Reset User Password</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm showUserMag" id="<%= userDetails[0] %>"><i';
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Back Users</a>';
    html += '</div>';


    // html += '<div class="container" style="padding: 0px;">';

    // html += `<div class="tab-content" style="margin-top:16px; ">`;
    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;


    html += `<div class="panel-heading" style="font-size: 15px; background: #008a9f; color: white">Welcome: ${$('.getUsr').html()}</div>`;

    html += `<div class="panel-body">`;

    html += `<center><label style="text-align: center; color: #00008B; font-size: 20px;">${data[1]}</label></center> <hr>`;
    html += `<div class="row" style="background-color:white;">`;

    html += `<div class=" col-lg-4 col-md-4">`;
    html += `<label><img style="width: 50%; height: 20%; padding-left: 10px;" class="img-profile rounded-circle" src="/${data[11]}"></label>`
    html += `<table>
              <tr>
                <th><label class="lab">Staff ID</label> <hr class="hr"></th>
                <td>&emsp;</td>
                <th><label class="lab">Phone</label> <hr class="hr"></th>
                <td>&emsp;</td>
                
              </tr>

              <tr>
                <td><label> ${data[0]} </label> <hr class="hr"></td>
                <td>&emsp;</td>
                <td><label> ${data[10]} </label> <hr class="hr"></td>
                <td>&emsp;</td>
                
              </tr>
            </table>`;
    html += `<label style="color: #00008B;">Added by: ${data[7]} </label> <hr class="hr">`;
    html += `<label style="color: #00008B;">Created At: ${data[14]} </label> <hr class="hr"> <br>`;

    html += `</div>`;

    html += `<div class="col-lg-4 col-md-4">`;

    html += `<label class="lab">Username</label> <hr class="hr">`;
    html += `<label> ${data[3]} </label> <hr class="hr">`;
    html += `<input hidden id="dcheck" readonly value="${data[12]}">`;

    html += `<label class="lab">Role</label> <hr class="hr">`;
    html += `<label> ${(data[4] === 'STDU')? 'Standard user (STDU)':data[4]} </label> <hr class="hr"> <br>`;

    html += `<label style="color: white; background-color: #4B0082;">Reset Password </label> <hr class="hr">`;
    html += `<label style="color: red;">${(data[15] === 'true')? 'Has requested for password resest':''} </label>`;


    html += `<form action="/forceResetUserPass" method="POST" id="forceUserPass">
                <div style="border-color: red; background-color: #F8F8FF; border: 1px solid transparent;"> <div class="form-group">
                        <label for="">New Password for User</label>
                        <input required type="text" name="force_resetpass" id="force_resetpass" value="${data[12]}" readonly>
                        <input required hidden type="number" name="ussaid" id="ussaid" value="${data[13]}" readonly>

                        <span id=""></span>
                        <span id="error_force_resetpass" class="text-danger"></span>

                        <label for="">Your Password</label>
                        <input required type="password" placeholder="Enter your password to reset user password" name="adminpass" id="adminpass"> 
                        <span id="error_adminpass" class="text-danger"></span>

                </div>
                <input type="hidden" name="_csrf" value="${$('#crsf').val()}">

                <button type="submit" class="btn btn-danger btn-sm">Reset</button><br>

                <label style="color: #8B008B;">Kindly write down the password and press the Reset button, communicate this password to the respected employee.</label>
                </div>
            </form>`;

    html += `</div>`;

    html += `<div class="col-lg-4 col-md-4">`;

    html += `<label class="lab">Status</label> <hr class="hr">`;
    html += `<label> ${data[5]} </label> <hr class="hr">`;

    html += `<label class="lab">Last login</label> <hr class="hr">`;
    html += `<label> ${data[6]} </label> <hr class="hr"> <br>`;
    
    // Force logout a user
    html += `<label style="color: white; background-color: #4B7782;">Force Log User Out </label> <hr class="hr">`;
    html += `<label style="color: red;">${(data[15] === 'true')? 'Has requested for password resest':''} </label>`;


    html += `<form action="/forceLogUserOut" method="POST" id="forceUserOut">
                <div style="border-color: red; background-color: #F8F8DD; border: 1px solid transparent;"> <div class="form-group">
                        <label for="">Current session expire at:</label>
                        <input required type="text" name="expiredAt" id="expiredAt" value="${data[16]}" readonly>
                        <input required hidden type="text" name="usuuid" id="usuuid" value="${data[17]}" readonly>

                        <span id=""></span>
                        <span id="error_force_expiredAt" class="text-danger"></span>

                        <label for="">Your Password</label>
                        <input required type="password" placeholder="Enter your password to log user out" name="adminpwd" id="adminpwd"> 
                        <span id="error_adminpwd" class="text-danger"></span>

                </div>
                <input type="hidden" name="_csrf" value="${$('#crsf').val()}">

                <button type="submit" class="btn btn-danger btn-sm">Logout</button><br>

                <label style="color: blue;">Perform this action if a user is unable to login due to being logged on other device, this will expire older sessions.</label>
                </div>
            </form>`;

    html += `</div>`;


    html += `</div> <br>`;

    //Employee details

    html += `</div>`;
    // html += `</div>`;

    html += `</div>`;
    // html += `</div>`;
    $('.mainPage').html(html);

}

function user_manage() {
    let html = '';
    $('.mainPage').html('');
    html += `<link href="/css/employee-style.css" rel="stylesheet">`;

    html += `<style>
        td a{
        color: #739931;
        }
        .page{
        max-width: 60em;
        margin: 0 auto;
        }
        table {
        border-collapse: collapse;
        width: 100%;
        }
        th, td {
            padding: 0.25rem;
            text-align: left;
            border: 1px solid #ccc;
        }
        tbody tr:nth-child(odd) {
            background: #eee;
        }
        tbody tr:hover {
        background: #F8F8FF;
        }
        table.responsive-table{
        box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 30em){
            table.responsive-table{
            box-shadow: none;  
            }
            table.responsive-table thead{
            display: none; 
            }
        table.display th,
        table.display td{
            padding: .5em;
        }
        
        table.responsive-table td:nth-child(1):before{
            content: 'Staff ID';
        }
        table.responsive-table td:nth-child(2):before{
            content: 'Name';
        }
        table.responsive-table td:nth-child(3):before{
            content: 'Department';
        }
        
        table.responsive-table td:nth-child(7):before{
            content: 'Username';
        }
        table.responsive-table td:nth-child(8):before{
            content: 'Role';
        }
        table.responsive-table td:nth-child(9):before{
            content: 'Status';
        }
        table.responsive-table td:nth-child(10):before{
            content: 'Last login';
        }
        table.responsive-table td:nth-child(10):before{
            content: 'Added By';
        }
        
        
        table.responsive-table td:nth-child(1),
        table.responsive-table td:nth-child(2),
        table.responsive-table td:nth-child(3),
        table.responsive-table td:nth-child(4),
        table.responsive-table td:nth-child(5),
        table.responsive-table td:nth-child(6),
        table.responsive-table td:nth-child(7),
        table.responsive-table td:nth-child(8),
        {
            padding-left: 35%;
        }

        table.responsive-table td:nth-child(1):before,
        table.responsive-table td:nth-child(2):before,
        table.responsive-table td:nth-child(3):before,
        table.responsive-table td:nth-child(4):before,
        table.responsive-table td:nth-child(5):before,
        table.responsive-table td:nth-child(6):before,
        table.responsive-table td:nth-child(7):before,
        table.responsive-table td:nth-child(8):before,
        {
            position: absolute;
            left: .2em;
            font-weight: bold;
        }
        
            table.responsive-table tr,
            table.responsive-table td{
                display: block;
            }
            table.responsive-table tr{
                position: relative;
                margin-bottom: 1em;
            box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
            }
            table.responsive-table td{
                border-top: none;
            }
            table.responsive-table td.organisationnumber{
                background: #D5E0CC;
                border-top: 1px solid #B3BFAA;
            }
            table.responsive-table td.actions{
                position: absolute;
                top: 0;
                right: 0;
                border: none;
                background: none;
            }
        }
        }
    </style>`;

    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800"><i class="fas fa-users"></i> User Management Dashboard</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm showUserMag" id="<%= userDetails[0] %>"><i';
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Reload Page</a>';
    html += '</div>';

    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;
    html += `<div class="panel-heading" style="font-size: 15px; background: #008a9f; color: white" id="<%= userDetails[1] %>" >Welcome: ${$('.getUsr').html()}</div>`;
    html += `<div class="panel-body">`;

    html += `<center><label style="text-align: center; color: #00008B;">System Users</label></center> 
    <hr>
    
    <button style="float: right;" class="btn btn-primary addSystUser btn-sm"><i class="fas fa-edit"></i> Add System User</button>
    <br>`;
    html += `<div class="form-group"><input class="" id="filterUser" type="text" placeholder="Search user record by anything.."></div>`;

    html += '<table class="layout display responsive-table">';
    html += '<thead class="table-dark" style="background-color:008a9f;">';
    html += '<tr>';
    html += '<th>StaffID</th>';
    html += '<th>Name</th>';
    html += '<th>Department</th>';
    // html += '<th>Job Title</th>';
    // html += '<th>Phone</th>';
    html += '<th>Username</th>';
    html += '<th>Role</th>';
    html += '<th>Status</th>';
    html += '<th>Last login</th>';
    html += '<th>Added By</th>';
    html += '<th>Manage</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color: white;" id="filterUserTable">';

    // const id = $('.showUserMag').attr('id');
    // console.log('id ===> ', id);
    $.ajax({
        type: 'GET',
        url: `/getSystemUser`,
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            // console.log('Response ===> ', response);
            // console.log('Data ==> ', response.data);

            if (response.data.length === 0) {
                html += `<td colspan="11" style="color: red;">No data found</td>`;
            }

            $.each(response.data, function(key, value) {
                html += `<tr style="color: ${(value.request)? '#000000':''}">`;
                html += `<td class="organisationnumber">${value.staffID}</td>`;
                html += `<td>${value.name}</td>`;
                html += `<td>${value.dept}</td>`;
                html += `<td>${value.usermname}</td>`
                html += `<td>${value.role}</td>`
                html += `<td>${value.status}</td>`
                html += `<td>${value.lastLog}</td>`
                html += `<td>${value.addedBy}</td>`

                html += `<td class="actions">
            <select class="getUserOptions" id="${value.id}">
                <option value="">Select option</option>
                <option value="details_${value.id}">Details</option>
                <option value="edit_${value.id}">Edit</option>
                <option value="resetpass_${value.id}">Reset User Password</option>`;
                if (value.staffID == 'N/A') {
                    html += `<option value="link_${value.id}">Link account</option>`;
                }
                html += `
            </select>
            </td>`;

                html += `<td hidden>${value.job}</td>`
                html += `<td hidden>${value.phone}</td>`
                html += `<td hidden>${value.image}</td>`
                html += `<td hidden>${value.getCode}</td>`
                html += `<td hidden>${value.id}</td>`
                html += `<td hidden>${value.created}</td>`
                html += `<td hidden>${value.request}</td>`
                html += `<td hidden>${value.expiredAt}</td>`
                html += `<td hidden>${value.uuid}</td>`

                html += `</tr>`;
            });

            html += '</tbody>';
            html += '</table>';
            html += '</div>';
            html += '</div>';
            $('.mainPage').html(html);
            $("#loader").hide();

        },
        error: function(error) {
            console.log('In error mode');
            errorPage('showUserMag');
            $("#loader").hide();

        }
    });
}

function changeSelectOption() {
    if ($('#emplytoadd').val() && $('#user_role').val()) {
        const emplyID = $('#emplytoadd').val();
        const role = $('#user_role').val();

        const inputArray = ['role', 'emplyID'];

        $.each(inputArray, function(key, value) {
            $('#' + value).val('')
            $('#error_' + value).text('');
            // $('#' + value).addClass(`invalid`);
            $('.invalid').css({
                'border-color': 'black',
                'color': 'black'
            });
        });
        $('#showSummary').css('display', 'none');
        $('#showSummary').html('');
        $('#gen_pass').val('');

        $.ajax({
            type: 'GET',
            url: `/getEmplyToAdd/${emplyID}/${role}`,
            // processData: false,
            contentType: 'application/json',
            success: function(response) {
                // console.log('Response ===> ', response);
                // console.log('Data ==> ', response.data);
                let summary = '';
                if (response.data.length != 0) {
                    summary = `<label>Name: ${response.data.name}</label><hr>
                            <label>Department: ${response.data.dept}</label><hr>
                            <label>Position: ${response.data.jobDesc}</label><hr>
                            <label>Assigned role: ${response.data.role}</label><hr>
                            <label style="color: red">Username: ${response.data.email}<br>Password: ${response.data.password}</label><hr>
                            <label style="color: #8B008B;">Kindly write down the username and password and press the submit button, communicate these credentials to the respected employee.</label>`;
                    $('#gen_pass').val(response.data.password);
                } else {
                    summary = `<label style="color: red;">Sorry something went wrong, please start the process again</label>`;
                }
                $('#showSummary').css('display', 'block');
                $('#showSummary').html(summary);

            },
            error: function(error) {
                console.log('In error');
                console.log(error)
                if (error.status === 422) {

                    $.each(error.responseJSON.validationErrors, function(key, value) {

                        // arrayB.slice
                        $('#error_' + value.param).text(value.msg);
                        // $('#' + value.param).addClass('has-error');
                        $('#' + value.param).addClass(`invalid`);
                        $('.invalid').css({
                            'border-color': 'red',
                            'color': 'red'
                        });
                    });
                    // clearError(arrayB); // from add-employee form

                } else {
                    $('#showSummary').css('display', 'block');
                    $('#showSummary').html(`<label style="color: red;">Sorry something went wrong, please start the process again</label>`);
                }
            }
        });
    } else {
        $('#showSummary').html('');
    }
}

$(document).ready(function() {

    $(document).on('keyup', "#filterUser", function() {
        var value = $(this).val().toLowerCase();
        $("#filterUserTable tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $(document).on('keyup', "#filterLogs", function() {
        var value = $(this).val().toLowerCase();
        $("#filterLogsTable tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $(document).on('click', '.showUserMag', function() {
        $('title').html('User Management');

        $("#loader").show();
        user_manage();
        unactive();
        $('.showUserMag').css("color", 'blue');
    });

    $(document).on('click', '.addSystUser', function() {
        logUIAccess(`Clicked add system user`, '.addSystUser')

        getNonUserEmply('emplytoadd', '', '', '');

        $('#addSystUserModal').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    });

    $(document).on('change', '#emplytoadd', function() {
        changeSelectOption()
    })

    $(document).on('change', '#user_role', function() {
        changeSelectOption()
    });

    $(document).on('submit', '#addSystUser', function(e) {
        e.preventDefault();
        // alert('All set for now');
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
                checkPoint('none', 'showUserMag');

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

                    $('#addSystUserModal').modal('hide');

                    $("#loader").show();
                    user_manage();
                }, 1000);
            },
            error: function(error) {
                console.log('In error');
                console.log(error)
                if (error.status === 422) {

                    $.each(error.responseJSON.validationErrors, function(key, value) {

                        // arrayB.slice
                        $('#error_' + value.param).text(value.msg);
                        // $('#' + value.param).addClass('has-error');
                        $('#' + value.param).addClass(`invalid`);
                        $('.invalid').css({
                            'border-color': 'red',
                            'color': 'red'
                        });
                    });
                    // clearError(arrayB); // from add-employee form

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

                    errorPage('showUserMag');
                }
            }
        });
    });

    $(document).on('submit', '#createpassword', function(e) {
        e.preventDefault();
        // alert($(this).attr('action'));
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
                // checkPoint('none', 'showUserMag');

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
                    if (response.data === 'ok') {
                        // console.log('Was here ====> ');
                        window.location.replace("login");
                    } else {
                        window.location.reload();
                    }
                }, 1000);
            },
            error: function(error) {
                console.log('In error');
                console.log(error)
                if (error.status === 422) {

                    $.each(error.responseJSON.validationErrors, function(key, value) {

                        // arrayB.slice
                        $('#error_' + value.param).text(value.msg);
                        // $('#' + value.param).addClass('has-error');
                        $('#' + value.param).addClass(`invalid`);
                        $('.invalid').css({
                            'border-color': 'red',
                            'color': 'red'
                        });
                    });
                    // clearError(arrayB); // from add-employee form

                } else {
                    $('.user-message').css('display', 'flex')
                    $('.user-message').html(error.responseJSON.error);
                    $('.user-message').css({
                        'border-color': 'red',
                        'color': 'white',
                        'background-color': 'red'
                    });
                    // errorPage('showUserMag');
                }
            }
        });
    });

    $(document).on('submit', '#resetpassword', function(e) {
        e.preventDefault();
        // alert('All set for now');
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
                // console.log('response ====> ', response);
                // checkPoint('none', 'showUserMag');

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
                    if (response.data === 'ok') {
                        // console.log('Was here ====> ');
                        window.location.replace("login");
                    } else {
                        window.reload();
                    }
                }, 1000);
                $("#loader").hide();
            },
            error: function(error) {
                console.log('In error');
                // console.log(error)
                if (error.status === 422) {
                    $.each(error.responseJSON.validationErrors, function(key, value) {

                        // arrayB.slice
                        $('#error_' + value.param).text(value.msg);
                        // $('#' + value.param).addClass('has-error');
                        $('#' + value.param).addClass(`invalid`);
                        $('.invalid').css({
                            'border-color': 'red',
                            'color': 'red'
                        });
                    });
                    $("#loader").hide();
                    // clearError(arrayB); // from add-employee form

                } else {
                    $('.user-message').css('display', 'flex')
                    $('.user-message').html(error.responseJSON.error);
                    $('.user-message').css({
                        'border-color': 'red',
                        'color': 'white',
                        'background-color': 'red'
                    });
                    $("#loader").hide();
                    // errorPage('showUserMag');
                }
            }
        });
    });

    $(document).on('change', '.getUserOptions', function() {
        // alert($(this).val());
        const inputArray = ['edit_user_role', 'active', 'unactive'];

        $.each(inputArray, function(key, value) {
            $('#' + value).val('')
            $('#error_' + value).text('');
            // $('#' + value).addClass(`invalid`);
            $('.invalid').css({
                'border-color': 'black',
                'color': 'black'
            });
        });

        if ($(this).val()) {
            // alert($(this).val());
            const actions = $(this).val().split('_');
            const action = actions[0];

            logUIAccess(`Selected ${action} option`, '.getUserOptions');

            $tr = $(this).closest('tr');
            let data = $tr.children("td").map(function() {
                return $(this).text();
            }).get();

            if (action === 'edit') {
                // show edit modal
                $('#fulname').val(data[1]);
                $('#curstatus').val(data[5]);
                $('#currole').val(data[4]);
                $('#user_ID').val($(this).attr('id'));
                // $('#edit_user_role').append($("<option selected></option>").attr("value", data[4]).text(`HOD/Supervisor`));


                if (data[5] === 'Active') {
                    // alert(data[5]);
                    $('#active').val(1);
                    $('#unactive').val(0);
                    $('#active').prop('checked', true);
                } else {
                    // alert(data[5]);
                    $('#active').val(1);
                    $('#unactive').val(0);
                    $('#unactive').prop('checked', true);
                }

                $('#editUserRoleModal').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
            }

            if (action === 'details') {
                $("#loader").show();
                userDetails(data);
            }

            if (action === 'resetpass') {
                resetUserPass(data);
            }

            if (action === 'link') {
                $('#linkUserModal').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
                getEmployees('user_empl', '', '', '');
            }
        }
    });

    $(document).on('submit', '#editUserRole', function(e) {
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
                checkPoint('none', 'showUserMag');

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

                    $('#editUserRoleModal').modal('hide');
                    // window.location.reload();

                    $("#loader").show();
                    user_manage();
                }, 1000);
            },
            error: function(error) {
                console.log('In error');
                console.log(error)
                if (error.status === 422) {

                    $.each(error.responseJSON.validationErrors, function(key, value) {

                        // arrayB.slice
                        $('#error_' + value.param).text(value.msg);
                        $('#' + value.param).addClass(`invalid`);
                        $('.invalid').css({
                            'border-color': 'red',
                            'color': 'red'
                        });
                    });
                    // clearError(arrayB); // from add-employee form

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
                    errorPage('showUserMag');
                }
            }
        });
    });

    $(document).on('submit', '#forceUserPass', function(e) {
        e.preventDefault();
        // alert($(this).attr('action'));

        if (confirm('Are you sure you want to rest the password for this employee?')) {
            const dcheck = $('#dcheck').val();
            // if (dcheck !== $('#force_resetpass').val()) {
            //     $('#error_force_resetpass').text('Wrong system password, please start the process again');
            //     // $('#' + value.param).addClass('has-error');
            //     $('#force_resetpass').addClass(`invalid`);
            //     $('.invalid').css({
            //         'border-color': 'red',
            //         'color': 'red'
            //     });

            //     return false;
            // }

            let form = $(this)[0];
            let data = new FormData(form);
            data.append('dcheck', dcheck);

            $.ajax({
                type: 'POST',
                enctype: 'multipart/form-data',
                url: `${$(this).attr('action')}`,
                data: data,
                processData: false,
                contentType: false,
                cache: false,

                success: function(response) {
                    $('.user-message').css('display', 'flex');
                    $('.user-message').html('Password reset successufully');
                    $('.user-message').css({ 'border-color': 'blue', 'color': 'white', 'background-color': 'green' });

                    setTimeout(function() {
                        $('.user-message').css('display', 'none');
                        $('user-message').html('');
                        $('title').html('User Management');
                        $("#loader").show();
                        user_manage();
                        unactive();
                        $('.showUserMag').css("color", 'blue');

                    }, 1000);
                },
                error: function(error) {
                    console.log(error);
                    if (error.status == 422) {
                        $.each(error.responseJSON.validationErrors, function(key, value) {

                            $('#error_' + value.param).text(value.msg);
                            $('#' + value.param).addClass('invalid');
                            $('.invalid').css({
                                'border-color': 'red',
                                'color': 'red'
                            });
                        })
                        return false;

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
                        errorPage('showUserMag');
                    }

                }
            })

        }

    })

    $(document).on('submit', '#forceUserOut', function(e) {
        e.preventDefault();
        // alert($(this).attr('action'));

        if (confirm('Are you sure you want to log user out?')) {
            let form = $(this)[0];
            let data = new FormData(form);
            aMoment();
            $.ajax({
                type: 'POST',
                enctype: 'multipart/form-data',
                url: `${$(this).attr('action')}`,
                data: data,
                processData: false,
                contentType: false,
                cache: false,

                success: function(response) {
                    $('.user-message').css('display', 'flex');
                    $('.user-message').html('Password reset successufully');
                    $('.user-message').css({ 'border-color': 'blue', 'color': 'white', 'background-color': 'green' });
                    console.log('response => ', response);

                    setTimeout(function() {
                        endMoment();
                        $('title').html('User Management');
                        $("#loader").show();
                        user_manage();
                        unactive();
                        $('.showUserMag').css("color", 'blue');

                    }, 1000);
                },
                error: function(error) {
                    console.log(error);
                    if (error.status == 422) {
                        $.each(error.responseJSON.validationErrors, function(key, value) {

                            $('#error_' + value.param).text(value.msg);
                            $('#' + value.param).addClass('invalid');
                            $('.invalid').css({
                                'border-color': 'red',
                                'color': 'red'
                            });
                        })
                        return false;

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
                        errorPage('showUserMag');
                    }

                }
            })

        }

    })


    // $(document).on('mouseover', '.getUserOptions', function() {

    //     $(this).open();

    // })

    // $(document).on('click', '.changePas', function() {
    //     const inputArray = ['old_pass', 'new_pass', 'conf_pass'];

    //     $.each(inputArray, function(key, value) {
    //         $('#' + value).val('')
    //         $('#error_' + value).text('');
    //         // $('#' + value).addClass(`invalid`);
    //         $('.invalid').css({
    //             'border-color': 'black',
    //             'color': 'black'
    //         });
    //     })

    // });



});