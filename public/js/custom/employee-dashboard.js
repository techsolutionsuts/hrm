function displayDashboard() {
    let html = '';
    // $('.mainPage').html('');
    html += `<link href="/css/employee-style.css" rel="stylesheet">`;
    html += `<style type="text/css">
      .thback{ backround-color: #D3D3D3;}

      .custStyleNav
            {
              font-size: 16px;
              padding: 0px;
              margin: 0px;
              border: 1px solid #778899;
              border-radius: 20px 20px 0px 0px;
              background-color: #097586;
            }

            .custStyleNav ul
            {
              padding: 5px;
              /*margin: 5px;*/
              /*border: 1px solid;*/
              /*border-radius: 16px;*/
            }

            .custStyleNav ul button
            {
              border-radius: 16px;
              color: black;
            }

            .breadcrumb{
              border-radius: 0px 0px 0px 0px;
              margin: 0px;
            }
            .cbody{
              margin-bottom: 0px;
              border: 3px solid #696969;
            }

            .cd{
              padding: 0px;
              margin: 0px;
              border-radius: 0px 0px 20px 20px;
            }

            .scroll-div {
              overflow-y: scroll;
              height: 600px;
              width: 100%;
            }

            .scroll-div-recent {
              overflow-y: scroll;
              height: 280px;
              width: 100%;
              padding: 12px;
              margin: 0px;
            }

            .scroll-div-recent-alert {
              overflow-y: scroll;
              height: 90px;
              width: 100%;
              padding: 12px;
              margin: 0px;
            }

            .padd{
            padding-left: 5px;
            }
    </style>`;

    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800"><i class="fa fa-user-tie" aria-hidden="true"></i> Employees Dashboard</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm employeeDash">';
    html += '<i class="fa fa-loading-bar"> </i> Reload Page</a>';
    html += '</div>';

    // html += '<div class="container" style="padding: 0px;">';
    // html += `< div class = "tab-content" style = "margin-top:16px; ">`;

    html += `
        <div class="row " >
            <div class="col-md-12">

                <div class="card" >
                    <div class="card-header form-group" style="background-color: ;">
                        <input class="" id="myInput" type="text" placeholder="Search employee record by anything..">
                    <div class="user-message user-message--error" style="display: none;"></div>
                    </div>
                </div>
            </div>
        </div>`;

    // html += `</div>`;

    html += `<div class="row">`;
    html += `<div class="col-lg-8 col-md-8">`;

    // html += `<div class="modal-busy" id="loader" style="display: flex;">
    //             <div class="center-busy" id="test-git">
    //                 <img alt="" src="/img/loader2.gif"/>
    //             </div>
    //         </div>`;

    // html += `<div class = "tab-content" style = "margin-top:16px; ">`;
    html += `<div class="card scroll-div">`;
    html += `<div class="card-header" style="background-color: ;">`;
    // $("#loader").show();
    $.ajax({
        type: 'GET',
        url: `${$('#nyanzi').val()}/employees`,
        // processData: false,
        contentType: 'application/json',
        success: function(response) {

            checkPoint('none', 'employeeDash');

            // console.log('Get department list');

            function getDate(date) {
                let formt_date = new Date(date);
                return formt_date.toLocaleDateString("en-US");
            }

            if (response.employees.length === 0) {
                html += `<div class="tab-pane active" id="basic_info">`;
                html += `<div class="panel panel-warning">`;
                html += `<div class="panel-heading" style="font-size: 15px;">No Data</div>`;
                html += `<div class="panel-body" style="padding: 0px;">`;

                html += `<div style="color: red;">No employee data found</div>`;
                html += '</div>';
                html += '</div>';
                html += '</div>';

            }
            $.each(response.employees, function(key, value) {
                html += `<div class="tab-pane active myTable" id="basic_info">`;
                html += `<div class="panel panel-info">`;
                html += `<div class="panel-heading" style="font-size: 15px;">${value.fullname}</div>`;
                html += `<div class="panel-body" style="padding: 0px;"> <br>`;

                html += `<div class="row"><div class="col-lg-6 col-md-6">
                <div><img style="width: 15%; height: 5%; padding-left: 10px;" class="img-profile rounded-circle" src="/${(value.photo)? value.photo : 'img/avatar.svg'}"><br><br>

                <span class="mr-2 d-none d-lg-inline text-gray-600 small padd"> <i class="fas fa-id-card"></i> ${value.staffID}</span><br>

                <span class="mr-2 d-none d-lg-inline text-gray-600 small padd"> <i class="fas fa-envelope"></i> ${value.email}</span><br>

                <span class="mr-2 d-none d-lg-inline text-gray-600 small padd"> <i class="fas fa-phone"></i> ${value.phone}</span>
                
                </div></div>`;

                { /* <div class="text-xs font-weight-bold text-info text-uppercase mb-1"> */ }

                html += `<div class="col-lg-6 col-md-6">
                <div>
                <table>
                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-info text-info-600 ">Date Employed</span><hr class="hr"</th>
                <td>${value.dateEmplyed}<hr class="hr"></td>
                </tr>
                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-info text-info-600 ">Department</span><hr class="hr"></th>
                <td><input hidden id="ashead" value="${value.deptHOD}">${value.deptHOD}<hr class="hr"></td>
                </tr>
                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-info text-info-600 ">HOD</span><hr class="hr"></th>
                <td>${value.hod}<hr class="hr"></td>
                </tr>
                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-info text-info-600 ">Supervisor</span><hr class="hr"></th>
                <td>${value.superVise}<hr class="hr"></td>
                </tr>
                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-info text-info-600 ">Job title</span><hr class="hr"></th>
                <td>${value.job}<hr class="hr"></td>
                </tr>
                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-info text-info-600 ">Leave status</span><hr class="hr"></th>
                <td>${(value.status) ? 'Yes':'No'}<hr class="hr"></td>
                </tr>
                </table>

                <!--<span class="mr-2 d-none d-lg-inline text-info-600 ">Supervisor &emsp; &emsp; &emsp;</span><br> -->
                </div> </div></div>`;

                html += `<hr>`;
                html += `<div style="width: inherit;" class="padd">`;
                if ($('#userRole').val() === 'Admin') {

                    html += `<button style="cursor: pointer; color: white; border-radius: 10px;" class="btn btn-info btn-sm editEmployee" id="${value.id}"><i class="fas fa-edit"> Edit</i></button> 

                <button style="cursor: pointer; color: white; border-radius: 10px;" class="btn btn-primary btn-sm emplyDetails" id="${value.id}_${value.fullname}"><i class="fas fa-print"> Report</i></button>`;

                    html += `
                <button style="cursor: pointer; color: white; border-radius: 10px;" class="btn ${(value.hasHistory)? 'btn-warning':'btn-danger'} btn-sm delEmply" id="${value.id}_${(value.hasHistory)? 'terminate':'delete'}"><i class="fas ${(value.hasHistory)?'fa-stop-circle':'fa-trash-alt'}"> ${(value.hasHistory)? 'Terminate':'Delete'}</i></button>&emsp;`;
                }

                // html += ` <button style="cursor: pointer; color: white; border-radius: 10px;" class="btn btn-success btn-sm emplyBasic" id="${value.id}"><i class="fas fa-info-circle"> Basic Info</i></button>`;

                // html += `<button style="cursor: pointer; color: white; border-radius: 10px;" class="btn btn-info btn-sm emplyAddress" id="${value.id}"><i class="fas fa-map-marker-alt"> Address</i></button>`; 

                // html += `<button style="cursor: pointer; color: white; border-radius: 10px;" class="btn btn-primary btn-sm emplyAddress" id="${value.id}"><i class="fas fa-briefcase"> Jobs</i></button>`;

                // html += `<button style="cursor: pointer; color: white; border-radius: 10px;" class="btn btn-success btn-sm emplyAddress" id="${value.id}"><i class="fas fa-money-check"> Bank</i></button>`;

                // html += `<button style="cursor: pointer; color: white; border-radius: 10px;" class="btn btn-info btn-sm emplyAddress" id="${value.id}"><i class="fas fa-university"> Education</i></button>`;

                html += `</div><hr>`;

                html += '</div>';
                html += '</div>';
                html += '</div>';
            });

            html += '</div>';
            html += '</div>';
            html += '</div>';

            html += `<div class=" col-lg-4 col-md-4">`;
            // html += `<div class="group">`;
            html += `<div class="tab-pane active">`;
            html += `<div class="panel panel-default">`;
            html += `<div class="panel-heading" style="border: 2px solid #A52A2A;
              border-radius: 0px; font-size: 15px; color: black;"> System alerts!</div>`;
            html += `<div class="panel-body scroll-div-recent-alert" style="border: 1px solid #A52A2A;">`;
            if (!response.alert.length) {
                html += `<li style = "color: red; font-size: 15px; list-style: square;">${'No alert'} </li>`;
            }

            for (let i = 0; i < response.alert.length; i++) {

                html += `<li style = "color: red; font-size: 15px; list-style: square;">${response.alert[i]} </li><hr style="margin: 0px; width: inherit">`;
            }
            html += '</div>';
            html += '</div>';
            html += '</div>';

            // html += `<label style="color: black;"></label>`
            html += `<div class="tab-pane active">`;
            html += `<div class="panel panel-default">`;
            html += `<div class="panel-heading" style="border: 2px solid #7B68EE;
              border-radius: 0px; font-size: 15px;">Employee for the month (${new Date(new Date().getFullYear(), (new Date().getMonth()) - 1, 1).toLocaleString('en-US', { month: 'long' })}, ${new Date().getFullYear()})</div>`;
            html += `<div class="panel-body" style="border: 1px solid #7B68EE;">`;
            html += `<div class="">
            <li style = "color: red; font-size: 15px; list-style: square;">${'No employee'} </li>
            </div>`

            html += '</div>';
            html += '</div>';
            html += '</div>';

            
            html += `<div class="tab-pane active">`;
            html += `<div class="panel panel-default">`;
            html += `<div class="panel-heading" style="font-size: 15px;">Recent Employment</div>`;
            html += `<div class="panel-body scroll-div-recent">`;
            html += `<div class="">`

            if (!response.newStaff.length) {
                html += `<li style = "color: red; font-size: 15px; list-style: square;">${'No recent employment'} </li>`;
            }

            for (let i = 0; i < response.newStaff.length; i++) {

                html += `<li style = "color: #000000; font-size: 15px; list-style: square;">${response.newStaff[i]} </li><hr style="margin: 0px; width: inherit">`;
            }
            // html += `</div>`;
            html += '</div>';
            html += '</div>';
            html += '</div>';


            // here
            // html += '</div>';
            html += '</div>';

            html += '</div>';

            html += '</div>';

            html += '</div>';
            html += '</div>';
            $('.mainPage').html(html);
            $('#employeeFeat').modal('hide');
            $("#loader").hide();
        },
        error: function(error) {
            // console.log(error);
            if (error.status == 500) {
                $('.user-message').css('display', 'flex');
                $('.user-message').html(error.responseJSON.error);
                $('.user-message').addClass('danger');
                $('.user-message').css({ 'border-color': '', 'color': 'white', 'background-color': '' });

                setTimeout(function() {
                    $('.user-message').css('display', 'none');
                    $('.user-message').html('');

                }, 2000)
                $("#loader").hide();
                return false;
            } else {
                $("#loader").hide();
                errorPage('employeeDash');
                getEmployees('deptHead', '', ''); // called from general-funct.js
            }
        }
    });
}

$(document).ready(function() {
    $(document).on('keyup', "#myInput", function() {
        var value = $(this).val().toLowerCase();
        $(".myTable").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    // Show the employee feature modal
    $(document).on('click', '.employeeFeat', function() {
        $('title').html('Employees Features');
        $('#employeeFeat').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
        logUIAccess('Clicked all employee features', '.employeeFeat');
        unactive();
        $('.employeeFeat').css("color", 'blue');

    })

    // Department page
    $(document).on('click', '.employeeDash', function() {

        $('title').html('Employee Dashboard');

        // $('#employeeFeat').modal('hide');
        $("#loader").show();
        backgroundImage();
        displayDashboard();
        logUIAccess('Clicked employee dashboard', '.employeeDash');

        unactive();
        $('.employeeDash').css("color", 'blue');

    });

    $(document).on('click', '.delEmply', function() {
        const idValue = $(this).attr('id').split('_');
        const delMsg = 'Are you SURE you want to delete this Employee' + '\n' +
            'Once deleted, cannot be recovered' + '\n' +
            'and all information related to this employee will be lost as well.' + '\n' + 'Such as address, dependant info etc, and all files.';

        const termiMsg = 'Are you SURE you want to terminate this Employee' + '\n' +
            'Once terminated, cannot be recovered' + '\n' +
            'and all information related to this employee will continue to show on reports before the employee was terminated.' + '\n' + 'If employee is a system user, his/her account will be terminated as well.';
        let msg = '';
        if (idValue[1] == 'delete') {
            msg = delMsg;
        } else {
            msg = termiMsg
        }

        logUIAccess(`Clicked employee ${idValue[1]}`, '.delEmply');

        if (confirm(msg)) {

            $.ajax({
                type: 'GET',
                url: 'getDeleteEmploy/' + idValue[0],
                // processData: false,
                contentType: 'application/json',
                success: function(response) {
                    console.log(response.errorMessage);
                    $('.user-message').css('display', 'flex')
                    $('.user-message').html('A moment please..... deleting data');
                    $('.user-message').css({
                        'border-color': 'blue',
                        'color': 'white',
                        'background-color': 'green'
                    });

                    setTimeout(function() {
                        $('.user-message').css('display', 'none')
                        $('.user-message').html('');
                        unactive();
                        $('.employeeDash').css("color", 'blue');
                        displayDashboard();
                    }, 1000);

                },
                error: function(error) {
                    if (error.status == 422) {
                        alert(error.responseJSON.errorMessage);
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
                        return false;
                    } else {
                        errorPage('employeeDash');
                    }
                }
            });
        }
    });

    $(document).on('click', '.emplyDetails', function() {
        // alert($(this).attr('id'));
        const id = $(this).attr('id').split('_');
        console.log('Id, Name ====> ', id);
        $("#loader").show();
        displayDetails(id[0], id[1]);
        logUIAccess('Clicked employee report', '.emplyDetails');
    });
});