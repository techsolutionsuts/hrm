function getCompanys() {
    let html = '';
    $('.mainPage').html('');
    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800">Company Information</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#addCompany" class="d-none  d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i';
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Add Company</a>';
    html += '</div>';

    // html += '<div class="container" style="padding: 0px;">';
    html += '<table class="table mt-3">';
    html += '<thead class="table-dark" style="background-color:cadetblue;">';
    html += '<tr>';
    // html += '<th>#</th>';
    html += '<th>Name</th>';
    html += '<th>Date Inc</th>';
    html += '<th>Director/Mgr</th>';
    html += '<th>Contact</th>';
    html += '<th>Comp Type</th>';
    html += '<th>HRCH</th>';
    html += '<th>Departments</th>';
    html += '<th>Employee</th>';
    html += '<th>Manage</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color: white;">';

    $.ajax({
        type: 'GET',
        url: '/company',
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            console.log('Get companies list');
            console.log(response.comp);

            function getDate(date) {
                let formt_date = new Date(date);
                return formt_date.toLocaleDateString("en-US");
            }

            if (!response.comp) {
                html += `<td colspan="7" style="color: red;">No company data found</td>`;
            } else {
                // $.each(response.comp, function(key, value) {
                html += '<tr>';
                html += `<td>${response.comp.name}</td>`;
                html += `<td>${getDate(response.comp.dateInco)}</td>`;
                html += `<td>${response.comp.ceo}</td>`;
                html += `<td>${response.comp.phone}</td>`;
                html += `<td>${response.comp.compType}</td>`;
                html += `<td>${response.comp.level}</td>`;
                html += `<td>0</td>`;
                html += `<td>0</td>`;
                html += `<td><a href="#" class="detailsComp" id="${response.comp.id}">Details</a> | <a href="#" class="editComp" id="${response.comp.id}">Edit</a></td>`;
            }
            html += `</tr>`;
            // });

            html += '</tbody>';
            html += '</table>';
            // html += '</div>';
            $('.mainPage').html(html);

        },
        error: function(error) {
            console.log(error);
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
                errorPage('getAllComp');
                return false;
            }
        }

    });

}

function companyProfile() {
    let html = '';
    $('.mainPage').html('');
    html += `<link href="/css/employee-style.css" rel="stylesheet">`;
    html += `<style>
     .hr {margin: 0px;}
    .colr{color: black;}
    .scroll-div_leavTyp{
    overflow-y: scroll;
    height: 800px;
    width: 100%;
    }
    </style>`;

    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800"> <i class="fas fa-building"></i> Company Profile</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm showCompProfile"><i';
    html += 'class = "fa fa-refresh fa-sm text-white-50"> </i> Reload Page</a>';
    html += '</div>';

    // html += '<div class="container" style="padding: 0px;">';


    // html += `< div class = "tab-content" style = "margin-top:16px; ">`;
    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;
    html += `<div class="panel-heading" style="font-size: 15px;">Brief information on your comapany
    </div>`;

    html += `<div class="panel-body">`;

    html += `<div class="user-message user-message--error" style="display: none;"></div>`;
    $.ajax({
        type: 'GET',
        url: '/get-comp-profile',
        // processData: false,
        contentType: 'application/json',
        success: function(response) {

            // checkPoint('none', 'showCompProfile');

            function getDate(date) {
                let formt_date = new Date(date);
                return formt_date.toLocaleDateString("en-US");
            }

            if (response.data === 0) {
                html += `<td colspan="7" style="color: red;">No data found for company</td>`;
                return false;
            }

            // $.each(response.leaves, function(key, value) {
            let data = response.data;
            html += `<div class="card" >
                            <div class="card-header" style="background-color: #008a9f; color: white;"> 
                                <img style="width: 4%; height: 1%; padding: 0px; background-color: white;" class="img-profile rounded-circle" src="/${(data.compImage) ? data.compImage : 'img/avatar.svg'}"><label style="color: white; text-decoration: underline; font-size: 30px"> ${data.name}</label>
                            </div>
                                <div class="card-body">

                                <div class="row">
                                <div class="col-lg-4 col-md-4">
                                <h4 style="color: #000080; text-decoration: underline;">${'Company Info'}</h4>
                                <label class="colr">Reg. Name: ${data.name}</label><hr class="hr"><br>

                                <label class="colr">Date Inco: ${data.dateInco}</label><hr class="hr"><br>

                                <label class="colr">CEO: ${data.ceo}</label><hr class="hr"><br>

                                <label class="colr">Company initials: ${data.initials}</label><hr class="hr"><br>

                                <label class="colr">Phone number: ${data.phone}</label><hr class="hr"><br>

                                <label class="colr">Email: ${data.email}</label><hr class="hr"><br>

                                <label class="colr">Website: ${data.website}</label><hr class="hr"><br>
                                
                                </div>
                                <div class="col-lg-4 col-md-4">
                                <h4 style="color: #000080; text-decoration: underline;">Company Size</h4>
                                <label class="colr">No. of employees: ${data.countEmp}</label><hr class="hr"><br>
                                <label class="colr">No. of system users: ${data.users}</label><hr class="hr"><br>
                                <label class="colr">No. of departments: ${data.countDept}</label><hr class="hr"><br>
                                <label class="colr">No. of job descriptions: ${data.jobs}</label><hr class="hr"><br>
                                <label class="colr">No. of salary grades: ${data.salaries}</label><hr class="hr"><br>
                                </div>
                                <div class="col-lg-4 col-md-4">
                                <h4 style="color: #4B0082; text-decoration: underline;">License Aggreement</h4>
                                <label class="colr">License date: ${data.os_x86}</label><hr class="hr"><br>
                                <label class="colr">License duration: ${data.os_count} months</label><hr class="hr"><br>

                                <label class="colr">license ends: ${data.os_64}</label><hr class="hr"><br>`;
                            if(data.ternumb){
                                html += `
                                <label class="colr" style="text-align: center;">No. of terminals: ${data.ternumb}</label>
                                <div class="img">
                                    <img src="/img/terminal.jpg">
                                </div>
                                <hr class="hr"><br>`;
                                }
                               html += ` 
                                <!-- <button class="btn btn-danger delLeave" value="Remove" id="" style="border-radius: 10px 10px 10px 10px;"><i class="fas fa-trash-alt"></i> Delete</button> -->

                                </div>
                                </div>
                                <input type="hidden" name="leaveMode" id="leaveMode" value="">
                                <input type="hidden" name="_csrf" id="_csrf" value="<%= csrfToken %>">

                            </div>
                        </div>`;
            // });

            html += '</div>';
            html += '</div>';
            html += '</div>';
            $('.mainPage').html(html);
            $("#loader").hide();
            // getEmployees('deptHead', '', ''); // called from general-funct.js
            unactive();
            $('.showCompProfile_blue').css("color", 'blue');
        },
        error: function(error) {
            // console.log(error);
            errorPage('showCompProfile');
            $("#loader").hide();
            // getEmployees('deptHead', '', ''); // called from general-funct.js
        }
    });
    // html += `</div>`;
}

$(document).ready(function() {

    // $('.getAllComp').on('click', function() {

    //     $('#companyFeat').modal('hide');
    //     getCompanys();

    //     $('.getAllComp').css("color", 'blue');

    // });

    $(document).on('click', '.showCompProfile', function() {
        $('title').html('Company Profile');

        // $('#companyFeat').modal('hide');
        $("#loader").show();
        companyProfile();

        $('.showCompProfile_blue').css("color", 'blue');

    });


    $(document).on('submit', '#createComp', function(e) {
        e.preventDefault();
        // console.log($(this).serialize());
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
                // console.log('Response =====> ', response);
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
                    // getCompanys();
                    // $('.getAllComp').css("color", 'blue');

                    // $('#addCompany').modal('hide');
                    if (response.message === 'continue') {
                        console.log('Was here ====> ');
                        window.location.replace("/create-user");
                    } else {
                        window.location.replace("index");
                    }
                    // window.location.replace("http://localhost:3000/${$('#nyanzi').val()}/index");

                }, 1000);

                // console.log(response)
            },
            error: function(error) {
                console.log('In error');
                console.log(error)
                if (error.status === 422) {
                    $('.user-message').css('display', 'flex')
                    $('.user-message').html(error.responseJSON.errorMessage);
                    // $('.user-message').addClasss("user-message user-message--error"); dose not continue so use it last.
                    $.each(error.responseJSON.validationErrors, function(key, value) {
                        $('#error_' + value.param).text(value.msg);
                        // $('#' + value.param).addClass('has-error');
                        $('#' + value.param).addClass(`invalid`);
                        $('.invalid').css({
                            'border-color': 'red',
                            'color': 'red'
                        })
                    });
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

    $(document).on('submit', '#createUser', function(e) {
        e.preventDefault();
        // console.log($(this).serialize());
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
                // console.log('Response =====> ', response);
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

                    if (response.message === 'continue') {
                        // console.log('Was here ====> ');
                        window.location.replace("login");
                    } else {
                        window.reload();
                    }
                }, 1000);

                // console.log(response)
            },
            error: function(error) {
                console.log('In error');
                console.log(error)
                if (error.status === 422) {
                    $('.user-message').css('display', 'flex')
                    $('.user-message').html(error.responseJSON.errorMessage);
                    // $('.user-message').addClasss("user-message user-message--error"); dose not continue so use it last.
                    $.each(error.responseJSON.validationErrors, function(key, value) {
                        $('#error_' + value.param).text(value.msg);
                        // $('#' + value.param).addClass('has-error');
                        $('#' + value.param).addClass(`invalid`);
                        $('.invalid').css({
                            'border-color': 'red',
                            'color': 'red'
                        })
                    });
                    // console.log(error.responseJSON.errorMessage)
                    // console.log(error.responseJSON.oldInput)
                    // console.log(error.responseJSON.validationErrors)
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

});