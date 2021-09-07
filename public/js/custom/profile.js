function profile() {
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

    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800">Profile</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm showProfile" id="<%= userDetails[0] %>"><i';
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Reload Page</a>';
    html += '</div>';

    // html += '<div class="container" style="padding: 0px;">';

    // html += `<div class="tab-content" style="margin-top:16px; ">`;
    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;

    const id = $('.showProfile').attr('id');
    console.log('id ===> ', id);
    $.ajax({
        type: 'GET',
        url: `/getUser/${id}`,
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            console.log('Response ===> ', response);
            console.log('Data ==> ', response.employee);

            function getFulName(mName, lName) {
                if (mName) {
                    return `${mName} ${lName}`;
                }
                return `${lName}`;
            }
            html += `<div class="panel-heading" style="font-size: 15px; background: #00008B; color: white">Welcome: ${response.employee[0].title} ${response.employee[0].fName} ${getFulName(response.employee[0].mName, response.employee[0].lName)}</div>`;

            html += `<div class="panel-body">`;

            html += `<center><label style="text-align: center; color: #00008B;">User Account Info</label></center> <hr>`;
            html += `<div class="row" style="background-color:white;">`;

            html += `<div class=" col-lg-4 col-md-4">`;
            html += `<label><img id="getOldImage" style="width: 50%; height: 20%; padding-left: 10px;" class="img-profile rounded-circle" src="/${(response.employee[0].photo)? response.employee[0].photo : 'img/avatar.svg'}"></label>`
            html += `<table>
              <tr>
                <th><label class="lab">Staff ID</label> <hr class="hr"></th>
                <td>&emsp;</td>
                <th><label class="lab">SSNIT No.</label> <hr class="hr"></th>
                <td>&emsp;</td>
                
              </tr>

              <tr>
                <td><label> ${response.employee[0].staffID} </label> <hr class="hr"></td>
                <td>&emsp;</td>
                <td><label> ${response.employee[0].ssnitNo} </label> <hr class="hr"></td>
                <td>&emsp;</td>
                
              </tr>

              <tr>
                
                <th><label class="lab">Phone No.</label> <hr class="hr"></th>
                <td>&emsp;</td>
                <th><label class="lab">Email Address</label> <hr class="hr"></th>
                <td>&emsp;</td>
              </tr>

              <tr>
                
                <td><label> ${response.employee[0].phone} </label> <hr class="hr"></td>
                <td>&emsp;</td>
                <td><label> ${response.employee[0].email} </label> <hr class="hr"></td>
                <td>&emsp;</td>
              </tr>
            </table>`;
            html += `</div>`;

            html += `<div class="col-lg-4 col-md-4">`;

            html += `<label class="lab">Username</label> <hr class="hr">`;
            html += `<label> ${response.user.email} </label> <hr class="hr">`;

            html += `<label class="lab">Role</label> <hr class="hr">`;
            html += `<label> ${response.user.role} </label> <hr class="hr"><br>`;

            html += `<button style="float: left;" class="btn btn-info changeImage btn-sm"><i class="fas fa-upload"></i> Upload new image</button> <br>`;
            html += `<div class="form-group">
                <label style="color:blue;">Idle timeout duration</label>
                <select type="text" id="timeout" class="form-controll">
                        <option value="${$('#timeoutsecond').val()}">${$('#timeoutsecond').val()} minutes</option>
                        <option value="10">10 minutes</option>
                        <option value="15">15 minutes</option>
                        <option value="20">20 minutes</option>
                        <option value="25">25 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="35">35 minutes</option>
                        <option value="40">40 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="50">50 minutes</option>
                        <option value="55">55 minutes</option>
                        <option value="60">60 minutes</option>
                </select>
                    <span id="done_info" class="text-info"></span>
                </div>`
            html += `</div>`;

            html += `<div class="col-lg-4 col-md-4">`;

            html += `<label class="lab">Status</label> <hr class="hr">`;
            html += `<label> ${(response.user.status)? 'Active':'Inactive'} </label> <hr class="hr">`;

            html += `<label class="lab">Last login</label> <hr class="hr">`;
            html += `<label> ${new Date(response.user.updatedAt).toUTCString()} </label> <hr class="hr"> <br>`;

            html += `<button style="float: left;" class="btn btn-primary changePass btn-sm"><i class="fas fa-edit"></i> Change Password</button> &emsp;&emsp;`;
            
            html += `<button style="float: left;" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#logoutModal"><i class="fas fa-sign-out-alt"></i> Logout</button>`;
            html += `</div>`;

            html += `</div> <br>`;

            //Employee details
            html += `<div class="tab-pane active" id="basic_info" style="margin: 0px;">`;
            html += `<div class="panel panel-default">`;
            html += `<div class="panel-heading" style="font-size: 15px; text-align: center; background: #9932CC; color: white">Employee Details</div>`;
            html += `<div class="panel-body scroll-div">`;
            html += `<center><label style="text-align: center; color: #00008B;">Basic Info</label></center> <hr>`;


            html += `<div class="row" style="background-color:white;">`;

            html += `<div class=" col-lg-3 col-md-3">`;

            html += `<label class="lab">Full Name</label> <hr class="hr">`;
            html += `<label> ${response.employee[0].title} ${response.employee[0].fName} ${getFulName(response.employee[0].mName, response.employee[0].lName)} </label> <hr class="hr">`;

            html += `<label class="lab">Date Employed</label> <hr class="hr">`;
            html += `<label> ${getDate(response.employee[0].dateEmplyed) || ''} </label> <hr class="hr">`;
            html += `</div>`;

            html += `<div class="col-lg-3 col-md-3">`;

            html += `<label class="lab">Birth Date</label> <hr class="hr">`;
            html += `<label> ${getDate(response.employee[0].dob) || ''} </label> <hr class="hr">`;

            html += `<label class="lab">Job Description</label> <hr class="hr">`;
            html += `<label> ${(response.employee[1])? response.employee[1].jobTitle : ''} </label> <hr class="hr">`;
            html += `</div>`;

            html += `<div class="col-lg-3 col-md-3">`;

            html += `<label class="lab">Gender</label> <hr class="hr">`;
            html += `<label> ${response.employee[0].gender || ''} </label> <hr class="hr">`;

            html += `<label class="lab">Department</label> <hr class="hr">`;
            html += `<label> ${(response.employee[2]) ? response.employee[2].deptName : ''} </label> <hr class="hr">`;
            html += `</div>`;

            html += `<div class="col-lg-3 col-md-3">`;

            html += `<label class="lab">Marital Status</label> <hr class="hr">`;
            html += `<label> ${response.employee[0].maritalStatus || ''} </label> <hr class="hr">`;

            html += `<label class="lab">Supervisor</label> <hr class="hr">`;
            html += `<label> ${(response.employee[5]) ? response.employee[5].name : '' || ''} </label> <hr class="hr">`;
            html += `</div>`;

            html += `</div>`;

            html += `</div>`;
            html += `</div>`;
            html += `</div>`;

            // User logs start
            html += `
            <div class="accordion" id="accordionExample">
          <div class="card">
        <div class="card-header" id="headingLogs">
          <h2 class="mb-0">
            <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse"
              data-target="#collapseLogs" aria-expanded="false" aria-controls="collapseLogs">

              <h5 class="" style="margin:0px; color: blue;">Activities and logs</h5>
              </button>
          </h2>
        </div>
        <div id="collapseLogs" class="collapse" aria-labelledby="headingLogs" data-parent="#accordionExample">
          <div class="card-body" id="#logs">
            `;
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
            if (response.logs.length == 0) {
                html += `<td colspan="4" style="color: red">No log activities entry</td>`;
                // return false
            }

            $.each(response.logs, function(key, value) {
                html += `<tr>`;
                html += `<td>${new Date(value.createdAt).toUTCString()}</td>`
                html += `<td>${value.action}</td>`
                html += `<td>${value.ip}</td>`
                html += `<td>${value.browser}</td>`
                html += `</tr>`;
            });

            html += '</tbody>';
            html += '</table>';

            html += `</div>

            </div>
      </div>
      </div>`;
            html += `</div>`;
            html += `</div>`;

            html += `</div>`;
            // html += `</div>`;
            $('.mainPage').html(html);
            $("#loader").hide();
        },
        error: function(error) {
            console.log('In error');
            console.log(error)
            if (error.status === 422) {
                $('#userProfile_errors').text('');
                let errors = '';

                $.each(error.responseJSON.validationErrors, function(key, value) {
                    if (value.msg == 'null') {
                        // console.log('Null ====> ', value.msg);
                        const msg = 'This account is not link to an employee information, kindly use the popup to select an employee to this account or contact system administrator.'
                        $('#linkUserModal').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
                        validationError('showProfile', 'Validation Error has Occurred', msg);

                        getEmployees('user_empl', '', '', '');
                        $("#loader").hide();
                        return false;
                    } else {
                        // console.log('else ====> ', value.msg);
                        errors += `<p> ${value.msg}</p>`;
                    }
                });

                if (errors) {
                    $('#userProfile_errors').html('<div class="alert alert-danger">' + errors + '</div>');
                    // $('#userProfileErrorModal').modal('show');
                    validationError('showProfile', 'Validation Error has Occurred', errors);
                    $("#loader").hide();
                    return false;
                }
                // linkUserModal
            } else if (error.status == 500) {

                errorPage('showProfile');
                $("#loader").hide();
                return false;
            } else {
                errorPage('showProfile');
                $("#loader").hide();
            }
        }
    });
}

$(document).ready(function() {

    $(document).on('click', '.showProfile', function() {
        $("#loader").show();
        profile();
        // logUIAccess('View profile page', '.showProfile');
    });

    $(document).on('submit', '#link_account', function(e) {
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
                checkPoint('none', 'showProfile');

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

                    $('#linkUserModal').modal('hide');
                    $("#loader").show();
                    profile();
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
                    errorPage('showProfile');
                }
            }
        });
    });

    $(document).on('click', '.changePass', function() {
        const inputArray = ['old_pass', 'new_pass', 'conf_pass'];
        logUIAccess('Clicked change password', '.changePass');
        $.each(inputArray, function(key, value) {
            $('#' + value).val('')
            $('#error_' + value).text('');
            // $('#' + value).addClass(`invalid`);
            $('.invalid').css({
                'border-color': 'black',
                'color': 'black'
            });
        })

        $('#changePasswordModal').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    });

    $(document).on('click', '.changeImage', function(e) {
        const inputArray = ['image'];
        logUIAccess('Clicked change profile image', '.changeImage');
        $.each(inputArray, function(key, value) {
            $('#' + value).val('')
            $('#error_' + value).text('');
            // $('#' + value).addClass(`invalid`);
            $('.invalid').css({
                'border-color': 'black',
                'color': 'black'
            });
        })

        const property = $('#getOldImage');
            $('#oldpic').attr('src', '');
    		$('#oldpic').attr('src', property[0].attributes.src.nodeValue);
    		$( '#oldpic' ).animate({
    	    width: "50%",
    	    height: "20%"
    	   },);

        $('#changeImageModal').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    });

    $(document).on('change', '#image', function (e) {
        // alert('All set for now');
        const oldImage = $('#getOldImage');
        const property = $(this)[0].files[0]
        const image_name = property.name;
        const extension = image_name.split('.').pop().toLowerCase();
        const image_size = property.size;

        if ($.inArray(extension, ['png', 'jpeg', 'gif', 'jpg', 'jfif']) == -1) {
            alert('Please select a valid image file');
            $('#oldpic').attr('src', '');
            $('#oldpic').attr('src', oldImage[0].attributes.src.nodeValue);
            $('#oldpic').animate({
                width: "50%",
                height: "20%"
            });
            $(this).val('');
            return false;
        }

        if (image_size > 1000000) {
            alert('Please image file should be 1 Mb of size');
            $('#oldpic').attr('src', '');
            $('#oldpic').attr('src', oldImage[0].attributes.src.nodeValue);
            $('#oldpic').animate({
                width: "50%",
                height: "20%"
            });
            $(this).val('');
            return false;
        }
        else {
            $('#oldpic').attr('src', '');
            $('#oldpic').attr('src', URL.createObjectURL(e.target.files[0]));
            $('#oldpic').animate({
                width: "50%",
                height: "20%"
            });
        }
    });

    $(document).on('submit', '#changepassword', function(e) {

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
                checkPoint('none', 'showProfile');

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

                    $('#userProfileErrorModal').modal('hide');
                    window.location.reload();

                    // profile();
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
                    errorPage('showProfile');
                }
            }
        });
    })

    $(document).on('submit', '#uploadImage', function(e) {

        e.preventDefault();
        let form = $(this)[0];
        let data = new FormData(form);

        aMoment();
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
                checkPoint('none', 'showProfile');
                endMoment();
                $('#userProfileErrorModal').modal('hide');
                window.location.reload();
            },
            error: function(error) {
                console.log('In error');
                console.log(error)
                endMoment();
                if (error.status === 422) {
                console.log('In error 422');

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
                    console.log('In error 500');
                    $('.user-message').css('display', 'flex');
                    $('.user-message').html(error.responseJSON.error);
                    $('.user-message').addClass('danger');
                    $('.user-message').css({ 'border-color': '', 'color': 'white', 'background-color': '' });

                    setTimeout(function() {
                        endMoment();
                    }, 2000)
                    return false;
                } else {
                    errorPage('showProfile');
                }
            }
        });
    })

    $(document).on('change', '#timeout', function () {
        const time = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
        const selVal = $(this).val();
        const currentTimeout = $('#timeoutsecond').val();
        if (time.includes(+selVal)) {
            if (confirm(`You are about to change Idle timeout from ${currentTimeout} minutes to ${selVal} minutes`)) {
                const update = getSubmit('/changeIdleTimeout/' + selVal);
                update.done(function (response) {
                    if (response.data === 'ok') {
                        $('#timeoutsecond').val(selVal);
                        $('#done_info').addClass('text-info');
                        $('#done_info').html('Update was successful');
                        setTimeout(function () {
                        $('#done_info').html('');
                        }, 50000)
                    }
                    else {
                        $('#done_info').addClass('text-danger');
                        $('#done_info').html(response.data);
                        setTimeout(function () {
                        $('#done_info').html('');
                        }, 50000)
                    }
                })
            }
        }        
    })
});