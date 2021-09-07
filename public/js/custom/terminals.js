function getTerminals() {
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

        :root {
    --dot-size: 1rem;
    --animation-duration: 2s;
    }

    .dot {
        width: var(--dot-size);
        height: var(--dot-size);
        background-color: green;
        border-radius: 50%;
    }

    /* --- Animation --- */

        /* Define animation keyframes */
        @keyframes blink {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
        }

        /* Minimal example */
        .dot--basic {
        animation: blink 2s infinite;
        }

        /* Run animation once */
        .dot--once {
        animation: blink 2s 1;
        /* animation-iteration-count: 1; */
        }

        /* Wait 4s before running the animation */
        .dot--delayed {
        animation: blink 2s infinite 4s;
        /* animation-delay: 4s; */
        }

        /* Use frames with "from" and "to" */
        @keyframes choppyBlink {
        from { opacity: 0; }
        to { opacity: 1; }
        }
        .dot--choppy {
        animation: choppyBlink 2s infinite;
        /* animation-name: choppyBlink; */
        }

        /* Animate multiple properties (transform and color) */
        @keyframes pulse {
        0%, 100% { 
            transform: scale(0) translateY(-75%);
            background-color: blue;
        }
        33% {
            background-color: orange;
        }
        50% { 
            transform: scale(1.125) translateY(0);
            background-color: red;
        }
        }
        .dot--pulse {
        animation: pulse 8s infinite;
        }

        /* Disable animation if user prefers reduced motion */
        @media (prefers-reduced-motion: reduce) {
        .dot {
            animation: none;
        }
        }

    .sample-item {
    --dot-size: 0.5rem;
    --offline-color: #999;
    --offline-text-color: #666;
    
    display: inline-flex;
    align-items: center;
    /* border: 2px solid red; */
    border-radius: 4px;
    padding: .5rem 1rem;
    }

    .sample-item .dot {
    margin-right: .5rem;
    }

    .sample-item--offline {
    border-color: var(--offline-color);
    color: var(--offline-text-color);
    }

    .sample-item--offline .dot {
    animation: none;
    background-color: var(--offline-color);
    }
    </style>`;

    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800"><i class="fa fa-network-wired"></i> Terminal Information</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm getTerminals"><i';
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Reload Page</a>';
    html += '</div>';
    html += `<div class="row">`;
    html += `<div class=" col-lg-12 col-md-12">`;

    // html += `<div class = "tab-content" style = "margin-top:16px; ">`;
    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;
    html += `<div class="panel-heading" style="font-size: 15px;">Terminals</div>`;
    // html += `<label class="user-message user-message--error" style="display: none;"></label>`;
    html += `<div class="panel-body" style="padding: 0px;">`;
    html += `<div class="card-header form-group" style="background-color: ;">
                        <input class="" id="myInput" type="text" placeholder="Search terminal record by anything..">
                    </div>`;
    html += `<button style="float: right; margin: 0px;" class="btn btn-primary add-terminal btn-sm"><i class="fas fa-plus"></i> Add Terminal</button><br>`;

    html += '<table class="table mt-3 table-hover sticky" style="">';
    html += '<thead class="table-dark" style="background-color:#008a9f;">';
    html += '<tr>';

    html += '<th>Date</th>';
    html += '<th>Term name</th>';
    html += '<th>Location</th>';
    html += '<th>Term number</th>';
    html += '<th>Serial number</th>';
    html += '<th>Total users</th>';
    html += '<th>Status</th>';
    html += '<th>Manage</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color: white;" class="myTable">';
    $.ajax({
        type: 'GET',
        url: '/getTerminals',
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            if (response.data.length === 0) {
                html += `<td colspan="7" style="color: red;">No terminal data found</td>`;
            }
            $.each(response.data, function(key, value) {
                html += '<tr>';
                html += `<td>${value.date}</td>`;
                html += `<td>${value.name}</td>`;
                html += `<td>${value.location}</td>`;
                html += `<td>${value.number}</td>`;
                html += `<td>${value.sNumber}</td>`;
                html += `<td>${value.totalUsers}</td>`;
                if (value.status == 'ONLINE') {
                    html += `<td><div class="sample-item">
                                    <div class="dot dot--basic" aria-hidden="true"></div>
                                    
                                </div></td>`;
                } else {

                    html += `<td><div class="sample-item sample-item--offline">
                                <div class="dot" aria-hidden="true"></div>
                                
                            </div></td>`;
                }

                html += `<td hidden>${value.id}</td>`;

                html += `<td><label hidden style="cursor: pointer; color: blue;" class="editTerm" id="${value.id}">Edit</label> <label style="cursor: pointer; color: blue;" class="manageTerm" id="${value.id}">Manage</label>`;
                // if (+value.nofEmply > 0) {
                //     html += ` | <label style="cursor: pointer; color: #008a9f;" class="manageHod" id="${value.id}">Manage HOD</label>`;
                // }
                // html += ` | <label style="cursor: pointer; color: #663399;" class="hodHistory" id="${value.id}">History</label>`;

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
            // getEmployees('deptHead', '', ''); // called from general-funct.js

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
                $("#loader").hide();
                return false;
            } else {
                errorPage('getDept');
                $("#loader").hide();
                // getEmployees('deptHead', '', ''); // called from general-funct.js
            }
            // }
        }

    });
}

function fillEmpList(data) {
    let emplyList = '<table>';
    if (data.length === 0) {
        // $('#totalEmp').html(`${'0'}<hr class="hr">`)
        emplyList += `<td colspan="2" style="color: red;">No employee for this terminal.</td>`;
    }
    if (data.length > 0) {
        emplyList += `<button type="button" style="float: right;" class="btn btn-danger unlinkAllEmp btn-sm"><i class="fas fa-remove"></i> Remove All</button>`;
    }
    $.each(data, function(key, value) {
        // console.log('Remove => ', value.count);
        // $('#totalEmp').html(`${value.count}<hr class="hr">`)
        emplyList += `
                                <tr>
                                <td hidden>${value.id}</td>
                                <td hidden><input name="termID[]" value="${value.id}"></td>
                                <th>${value.user_id}<hr class="hr"></th>
                                <th>${value.name}<hr class="hr"></th>
                                <td>${value.dept}<hr class="hr"></td>
                                <td>&emsp;<i style="color: red" class="fas fa-times unlinkEmply"></i><hr class="hr"></td>
                                </tr>`
    });

    emplyList += `</table>`;

    // getNoShiftEmpls('adEmploy', '', '');

    $('#employeeList').html(emplyList);
}

function terminalManager(id = '', terminal) {
    $('title').html('Manage Terminal');
    let html = '';

    html += `<link href="/css/employee-style.css" rel="stylesheet">`;

    $('.mainPage').html('');
    html += `<style>
     .hr {margin: 0px;}
     .lab {color: #000000;}
     .scroll-div {
    overflow-y: scroll;
    height: 300px;
    width: inherit;
}

:root {
    --dot-size: 1rem;
    --animation-duration: 2s;
    }

    .dot {
        width: var(--dot-size);
        height: var(--dot-size);
        background-color: green;
        border-radius: 50%;
    }

    /* --- Animation --- */

        /* Define animation keyframes */
        @keyframes blink {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
        }

        /* Minimal example */
        .dot--basic {
        animation: blink 2s infinite;
        }

        /* Run animation once */
        .dot--once {
        animation: blink 2s 1;
        /* animation-iteration-count: 1; */
        }

        /* Wait 4s before running the animation */
        .dot--delayed {
        animation: blink 2s infinite 4s;
        /* animation-delay: 4s; */
        }

        /* Use frames with "from" and "to" */
        @keyframes choppyBlink {
        from { opacity: 0; }
        to { opacity: 1; }
        }
        .dot--choppy {
        animation: choppyBlink 2s infinite;
        /* animation-name: choppyBlink; */
        }

        /* Animate multiple properties (transform and color) */
        @keyframes pulse {
        0%, 100% { 
            transform: scale(0) translateY(-75%);
            background-color: blue;
        }
        33% {
            background-color: orange;
        }
        50% { 
            transform: scale(1.125) translateY(0);
            background-color: red;
        }
        }
        .dot--pulse {
        animation: pulse 8s infinite;
        }

        /* Disable animation if user prefers reduced motion */
        @media (prefers-reduced-motion: reduce) {
        .dot {
            animation: none;
        }
        }

    .sample-item {
    --dot-size: 0.5rem;
    --offline-color: #999;
    --offline-text-color: #666;
    
    display: inline-flex;
    align-items: center;
    /* border: 2px solid red; */
    border-radius: 4px;
    padding: .5rem 1rem;
    }

    .sample-item .dot {
    margin-right: .5rem;
    }

    .sample-item--offline {
    border-color: var(--offline-color);
    color: var(--offline-text-color);
    }

    .sample-item--offline .dot {
    animation: none;
    background-color: var(--offline-color);
    }
    </style>`

    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800"><i class="fa fa-network-wired"></i> Manage Terminal</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm getTerminals" id="<%= userDetails[0] %>"><i';
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Back Terminal</a>';
    html += '</div>';


    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;

    html += `<div class="panel-heading" style="font-size: 15px; background: #008a9f; color: white"></div>`;

    // html += `<div class="panel-body">`;

    html += `<div class="modal-body" style="border: 2px solid gray;">
    <form action="/link-employee-toTerminal" method="POST" id="linkToTerminal" >
        <input type="hidden" name="_csrf" id="_csrf" value="${$('#crsf').val()}">

        <div class="row" style="background-color:899; border: 1px solid #778899;">
            <div class=" col-lg-4 col-md-4">
                <div class="form-group" style="background-color: #008B8B; color: white;">
                    <label for="" style="color: white;">Terminal list</label>
                    <select required multiple type="text" name="terminal" id="terminal" class="form-control">
                    
                    </select>
                    <input hidden id="terminalID" name="terminalID">
                    <input hidden id="selectTerminal">
                    <span id="error_terminal" class="text-danger"></span>
                </div>

                <div id="terminalDetails" style="display: none; padding: 10px; border: 1px solid #778899;">
                </div>
                    
        </div>
      <div class=" col-lg-8 col-md-8">
            <div class="input-group form-group" style="background-color: #008B8B; color: white;">
                <label for="" style="color: white">Unlink terminal users and employees</label>
                <select type="text" multiple name="newTerUserList" id="newTerUserList" class="form-control">
                <!-- <option selected value="">Select to add employee</option> -->
                </select>
                <select type="text" multiple name="unLinkEmploy" id="unLinkEmploy" class="form-control">
                <!-- <option selected value="">Select to add employee</option> -->
                </select>
                <div class="input-group-append">
                <button class="btn btn-primary linkUserEmp" type="submit">
                <i class="fas fa-plus-circle fa-sm"></i>
                </button>
                </div>
            </div>
            <div>
            <span id="error_unLinkEmploy" class="text-danger"></span>
            <span id="error_newTerUserList" class="text-danger"></span>
            <span id="error_terminalID" class="text-danger"></span>
            <span id="error_termID" class="text-danger"></span>
            
            </div>


        <div id="employeeList" class="scroll-div" style="display: none; padding:10px; border: 1px solid #778899;">
            </div>
      </div>
      </form>`;

    if (id == '') {
        html += `
      </div>
      </div>
      </div>
      </div>`

        $('.mainPage').html(html);
        $("#loader").hide();
        fetchTerminals('terminal', '', '');
        $('.linkUserEmp').prop('disabled', true);
    } else {
        $.ajax({
            type: 'GET',
            url: `/getTerminal/${id}`,
            // processData: false,
            contentType: 'application/json',
            success: function(response) {

                // checkPoint('none', 'getDept');
                // console.log('Get shift list', response);

                // fill data for shift
                let terminalData = `
                <table>
                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Date added:</span><hr class="hr"></th>
                <td>${response.dataBj.date}<hr class="hr"></td>
                </tr>

                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Online status:</span><hr class="hr"></th>`;

                if (response.dataBj.status == 'ONLINE') {
                    terminalData += `<td>
                    <div class="sample-item">
                        <div class="dot dot--basic" aria-hidden="true"></div>
                      </div>
                      <hr class="hr"></td></tr>`;

                } else {
                    terminalData += `<td>
                    <div class="sample-item sample-item--offline">
                        <div class="dot" aria-hidden="true"></div>
                    </div><hr class="hr"></td></tr>
                `;
                }

                if (response.dataBj.status == 'OFFLINE') {

                    terminalData += `<tr><th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Last online:</span><hr class="hr"></th>
                    <td>${response.dataBj.last_online}<hr class="hr"></td>
                </tr>`;
                }

                terminalData += `<tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Name:</span><hr class="hr"></th>
                <td>${response.dataBj.name}<hr class="hr"></td>
                </tr>

                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Location:</span><hr class="hr"></th>
                <td>${response.dataBj.location}<hr class="hr"></td>
                </tr>

                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Number:</span><hr class="hr"></th>
                <td>${response.dataBj.number}<hr class="hr"></td>
                </tr>

                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Serial number:</span><hr class="hr"></th>
                <td>${response.dataBj.sNumber}<hr class="hr"></td>
                </tr>

                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Total employee:</span><hr class="hr"></th>
                <td>${response.employees.length}<hr class="hr"></td>
                </tr>

                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Total unlink users:</span><hr class="hr"></th>
                <td>${response.newUser.length}<hr class="hr"></td>
                </tr>

                </table>
                <img class="img" width="80" height="100" src="/img/terminal.jpg">`;
                let newUsers = '';
                if (response.newUser.length === 0) {
                    newUsers += `<option value=""><label style="color: red;">No new users</label></option>`;
                }
                $.each(response.newUser, function(key, value) {
                    // console.log(
                    newUsers += `<option value="${value.id}=>${value.user}">${value.user}</option>`;
                });

                let newUsersunLinkEmployees = '';
                if (response.unLinkEmployees.length === 0) {
                    newUsersunLinkEmployees += `<option value=""><label style="color: red;">No employees to link</label></option>`;
                }
                $.each(response.unLinkEmployees, function(key, value) {
                    // console.log(
                    newUsersunLinkEmployees += `<option value="${value.id}=>${value.name}">${value.name} ${value.dept}</option>`;
                });

                // fill data for employees
                html += `
                    </div>
                    </div>
                    </div>
                    </div>`

                $('.mainPage').html(html);
                $("#loader").hide();

                $('#terminalID').val(response.dataBj.id);
                $('#selectTerminal').val(response.dataBj.name);

                fillEmpList(response.employees)
                fetchTerminals('terminal', id, terminal);
                // getNoShiftEmpls('adEmploy', '', '');

                $('.linkUserEmp').prop('disabled', false);

                $('#terminalDetails').html(terminalData);
                $('#newTerUserList').html(newUsers);
                $('#unLinkEmploy').html(newUsersunLinkEmployees);

                // $('#emplyList').html(emplyList);

                $('#terminalDetails').show();
                $('#employeeList').show();
            },
            error: function(errors) {
                html += `
                    </div>
                    </div>
                    </div>
                    </div>`

                $('.mainPage').html(html);
                $("#loader").hide();
                fetchTerminals('terminal', id, terminal);
            }
        });
        // console.log('Inelse => ');
    }
}

$(document).ready(function() {

    $(document).on('click', '.getTerminals', function() {
        $('title').html('Terminals');

        unactive();
        $(this).css("color", 'blue');
        $("#loader").show();
        getTerminals();
        // $("#loader").hide();

    });

    $(document).on('click', '.manageTerm', function() {

        $tr = $(this).closest('tr');
        const data = $tr.children("td").map(function() {
            return $(this).text();
        }).get();
        $("#loader").show();
        terminalManager(data[7], data[1]);
    });

    $(document).on('change', '#terminal', function() {
        terminalManager($(this).val(), $('#terminal option:selected').text());
    });

    $(document).on('submit', '#linkToTerminal', function(e) {
        e.preventDefault();
        // unLinkEmploy newTerUserList

        if ($('#terminal').val() == '') {
            alert('Please select a terminal');
            return false;
        }

        if ($('#newTerUserList').val() == '') {
            alert('Please select a terminal user');
            return false;
        }

        if ($('#unLinkEmploy').val() == '') {
            alert('Please select an employee');
            return false;
        }

        if ($('#unLinkEmploy').val().length !== $('#newTerUserList').val().length) {
            alert('Please select same number of entries from both sides');
            return false;
        }

        const users = $('#newTerUserList').val();
        const employees = $('#unLinkEmploy').val();
        let pair = '';

        // $('#newTerUserList option:selected').text()

        // console.log('newTerUserList => ', users);
        // console.log('unLinkEmploy => ', employees);

        for (let i = 0; i < users.length; i++) {
            pair += `${users[i].split('=>')[1]} => ${employees[i].split('=>')[1]}\n`;
        }

        if (confirm(`The Pairing\n ${pair}`)) {
            let form = $(this)[0];
            let data = new FormData(form);

            let linkEmply = submit(data, $(this).attr('action'), 'POST');

            linkEmply.done(function(response) {
                console.log('In success', response.data);
                // fillEmpList(response.data);
                terminalManager($('#terminalID').val(), $('#selectTerminal').val());
            })
        }
    });

    $(document).on('click', '.unlinkEmply', function() {
        $tr = $(this).closest('tr');
        const data = $tr.children("td").map(function() {
            return $(this).text();
        }).get();

        if (confirm('Are you sure to remove employee from terminal user?')) {
            // alert('Work in progress !!!');
            let unlinkEmployee = getSubmit(`/unlink-from-termuser/${data[0]}`, 'GET');

            unlinkEmployee.done(function(response) {
                // console.log('In success');
                terminalManager($('#terminalID').val(), $('#selectTerminal').val());
            })

        }

    });

    $(document).on('click', '.unlinkAllEmp', function() {

        let form = $('#linkToTerminal')[0];
        let data = new FormData(form);

        if (confirm('Are you sure to remove ALL employees from their respective terminal users?')) {

            let unlinkEmployee = submit(data, '/unlink-all', 'POST');
            unlinkEmployee.done(function(response) {
                terminalManager($('#terminalID').val(), $('#selectTerminal').val());
            })
        }

    });

    $(document).on('click', '.add-terminal', function() {
        $('.term-title').html('<i class="fas fa-plus"></i> Add Terminal');
        $('.user-message').css({
            'border-color': '',
            'color': 'white',
            'background-color': '',
            'display': 'none'
        });

        // getEmployees('deptHead', '', ''); // called from general-funct.js
        // $('#deptName').val('');
        // $('#deptDesc').val('');
        // $('#editMode').val('');

        // $('#editMode').val('addMode');
        // $('#cls').show();
        logUIAccess('View add terminal modal', '.add-terminal');

        $('#terminalModal').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});

    });

    $(document).on('submit', '#addTerminal', function(e) {
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
                    // $('.mainPage').html('');
                    $('#terminalModal').modal('hide');
                    getTerminals();
                    $('.getTerminals').css("color", 'blue');

                }, 1000);

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
            }
        });
    });

})