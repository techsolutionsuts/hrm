function loopNum(times, selectOption, value = '') {
    let i = 0
    $('#' + selectOption).html($("<option></option>").attr("value", '').text(''));
    if (value != '') {
        // console.log('Value => ', value);
        $('#' + selectOption).html($("<option></option>").attr("value", value).text(value));
    }
    while (times > i) {
        $('#' + selectOption).append($("<option></option>").attr("value", i).text(i));
        i++
    }
}

function loopOnce(times, selectOption, value = '') {
    $('#' + selectOption).html($("<option></option>").attr("value", '').text(''));
    if (value != '') {
        $('#' + selectOption).html($("<option></option>").attr("value", value).text(value));
    }
    let i = 1
    while (times > i) {
        $('#' + selectOption).append($("<option></option>").attr("value", i).text(i));
        i++
    }
}

function breakHTML() {
    let html = `<div class="form-group">
            <label for="breakHour">Break start hour</label>
            <select type="text" name="breakHour" id="breakHour">
            </select>
            <span id="error_breakHour" class="text-danger"></span>
            </div>

            <div class="form-group">
            <label for="breakMin">Break start minutes</label>
            <select type="text" name="breakMin" id="breakMin">
            </select>
            <span id="error_breakMin" class="text-danger"></span>
            </div>

            <div class="form-group">
            <label for="breakDuraMin">Break duration</label>
            <select type="text" name="breakDuraMin" id="breakDuraMin">
            </select>
            <span id="error_breakDuraMin" class="text-danger"></span>
        </div>`;
    return html
}

function overtimeHTML() {
    let html = `<div class="form-group">
                <label for="overtimeHour">Overtime hour</label>
                <select type="text" name="overtimeHour" id="overtimeHour">
                </select>
                <span id="error_overtimeHour" class="text-danger"></span>
                </div>

                <div class="form-group">
                <label for="overtimeMin">Overtime minutes</label>
                <select type="text" name="overtimeMin" id="overtimeMin">
                </select>
                <span id="error_overtimeMin" class="text-danger"></span>
                </div>

                <div class="form-group">
                <label for="overtimeRate">Overtime rate / hour</label>
                <input type="text" name="overtimeRate" id="overtimeRate">
                <span id="error_overtimeRate" class="text-danger"></span>
                </div>

            </div>`;
    return html
}

function fillList(data) {
    let emplyList = '<table>';
    if (data.length === 0) {
        $('#totalEmp').html(`${'0'}<hr class="hr">`)
        emplyList += `<td colspan="2" style="color: red;">No employee under this shift.</td>`;
    }
    if (data.length > 0) {
        emplyList += `<button type="button" style="float: right;" class="btn btn-danger removeAll btn-sm"><i class="fas fa-remove"></i> Remove All</button>`;
    }
    $.each(data, function(key, value) {
        // console.log('Remove => ', value.count);
        $('#totalEmp').html(`${value.count}<hr class="hr">`)
        emplyList += `
                                <tr>
                                <td hidden>${$('#selectID').val()}</td>
                                <td hidden>${value.id}</td>
                                <td hidden><input name="shifID[]" value="${$('#selectID').val()}"></td>
                                <td hidden><input name="employID" value="${value.id}"></td>
                                <th>${value.name}<hr class="hr"></th>
                                <td>${value.dept}<hr class="hr"></td>
                                <td>&emsp;<i style="color: red" class="fas fa-times removeEmply"></i><hr class="hr"></td>
                                </tr>`
    });

    emplyList += `</table>`;

    getNoShiftEmpls('adEmploy', '', '');

    $('#emplyList').html(emplyList);
}
function getShift() {
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
    html += '<h6 class="h3 mb-0 text-gray-800"><i class="fa fa-hard-hat"></i> Shift Information</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm getShift"><i';
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
    html += `<div class="panel-heading" style="font-size: 15px;"></div>`;
    // html += `<label class="user-message user-message--error" style="display: none;"></label>`;
    html += `<div class="panel-body" style="padding: 0px;">`;
    html += `<div class="card-header form-group" style="background-color: ;">
                        <input class="" id="myInput" type="text" placeholder="Search shift record by anything..">
                    </div>`;
    html += `<button style="float: right; margin: 0px;" class="btn btn-primary add-shift btn-sm"><i class="fas fa-plus"></i> Add Shift</button><br>`;

    html += '<table class="table mt-3 table-hover sticky" style="">';
    html += '<thead class="table-dark" style="background-color:#008a9f;">';
    html += '<tr>';

    html += '<th>Date</th>';
    html += '<th>Shift name</th>';
    html += '<th>Start</th>';
    html += '<th>Ends</th>';
    html += '<th>Hours</th>';
    html += '<th>Break</th>';
    html += '<th>Grace period</th>';
    html += '<th>Total employee</th>';
    html += '<th>Manage</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color: white;" class="myTable">';
    $.ajax({
        type: 'GET',
        url: 'getShifts',
        // processData: false,
        contentType: 'application/json',
        success: function(response) {

            // checkPoint('none', 'getDept');
            // console.log('Get department list');

            if (response.data.length === 0) {
                html += `<td colspan="9" style="color: red;">No shift data found</td>`;

            }
            $.each(response.data, function(key, value) {
                // console.log('Days => ', value.allwBreak);
                html += '<tr>';
                html += `<td>${value.date}</td>`;
                html += `<td>${value.name}</td>`;
                html += `<td>${value.start}</td>`;
                html += `<td>${value.end}</td>`;
                html += `<td>${value.duration}</td>`;
                html += `<td>${value.break}</td>`;
                html += `<td>${value.grace}</td>`;
                html += `<td>${value.totalEmply}</td>`;
                html += `<td hidden>${value.startH}</td>`;
                html += `<td hidden>${value.startM}</td>`;
                html += `<td hidden>${value.endH}</td>`;
                html += `<td hidden>${value.endM}</td>`;
                html += `<td hidden>${value.days}</td>`;
                html += `<td hidden>${value.allwBreak}</td>`;
                html += `<td hidden>${value.breakH}</td>`;
                html += `<td hidden>${value.breakM}</td>`;
                html += `<td hidden>${value.breakDu}</td>`;
                html += `<td hidden>${value.allwOverT}</td>`;
                html += `<td hidden>${value.overtimeH}</td>`;
                html += `<td hidden>${value.overtimeM}</td>`;
                html += `<td hidden>${value.overtimeRate}</td>`;

                html += `<td hidden>${value.id}</td>`;


                html += `<td><label style="cursor: pointer; color: blue;" class="editShift" id="${value.id}">Edit</label> | <label style="cursor: pointer; color: blue;" class="detailShift" id="${value.id}">Detail</label> | <label style="cursor: pointer; color: blue;" class="manageShift" id="${value.id}">Manage</label>`;


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
        }
    });

}

function shiftManager(id = '', shift) {
    $('title').html('Manage Shift');
    let html = '';

    html += `<link href="/css/employee-style.css" rel="stylesheet">`;

    $('.mainPage').html('');
    html += `<style>
     .hr {margin: 0px;}
     .lab {color: #000000;}
     .scroll-div {
    overflow-y: scroll;
    height: 319px;
    width: inherit;
}
    </style>`

    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800"><i class="fas fa-toolbox"></i> Manage Shift</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm getShift" id="<%= userDetails[0] %>"><i';
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Back Shift</a>';
    html += '</div>';


    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;

    html += `<div class="panel-heading" style="font-size: 15px; background: #008a9f; color: white"></div>`;

    // html += `<div class="panel-body">`;

    html += `<div class="modal-body" style="border: 2px solid gray;">
    <form action="add-employee-toshift" method="POST" id="addEmp" >
        <input type="hidden" name="_csrf" id="_csrf" value="${$('#crsf').val()}">

        <div class="row" style="background-color:899; border: 1px solid #778899;">
            <div class=" col-lg-4 col-md-4">
                <div class="form-group" style="background-color: #B0C4DE;">
                    <label for="">Shift list</label>
                    <select required multiple type="text" name="shift" id="shift" class="form-control">
                    
                    </select>
                    <input hidden id="selectID" name="selectID">
                    <input hidden id="selectShift">
                    <span id="error_shift" class="text-danger"></span>
                </div>

                <div id="shiftDetails" style="display: none; padding: 10px; border: 1px solid #778899;">
                </div>
                    
        </div>
      <div class=" col-lg-8 col-md-8">
            <div class="input-group form-group" style="background-color: #D3D3D3;">
                <label for="">Employee list</label>
                <select required type="text" multiple name="adEmploy" id="adEmploy" class="form-control">
                <!-- <option selected value="">Select to add employee</option> -->
                </select>
                <div class="input-group-append">
                <button class="btn btn-primary addThis" type="submit">
                <i class="fas fa-plus-circle fa-sm"></i>
                </button>
                </div>
            </div>
            <div>
            <span id="error_adEmploy" class="text-danger"></span>
            
            </div>


        <div id="emplyList" class="scroll-div" style="display: none; padding:10px; border: 1px solid #778899;">
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
        getShifts('shift', '', '');
        $('.addThis').prop('disabled', true);
    } else {
        $.ajax({
            type: 'GET',
            url: `getShift/${id}`,
            // processData: false,
            contentType: 'application/json',
            success: function(response) {

                // checkPoint('none', 'getDept');
                // console.log('Get shift list', response);

                // fill data for shift
                let shiftData = `
                <table>
                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Date created:</span><hr class="hr"></th>
                <td>${response.shift.date}<hr class="hr"></td>
                </tr>

                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Name:</span><hr class="hr"></th>
                <td>${response.shift.name}<hr class="hr"></td>
                </tr>

                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Start:</span><hr class="hr"></th>
                <td>${response.shift.start}<hr class="hr"></td>
                </tr>

                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Ends:</span><hr class="hr"></th>
                <td>${response.shift.end}<hr class="hr"></td>
                </tr>

                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Duration:</span><hr class="hr"></th>
                <td>${response.shift.duration} hours<hr class="hr"></td>
                </tr>

                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Grace period:</span><hr class="hr"></th>
                <td>${response.shift.grace} minutes<hr class="hr"></td>
                </tr>

                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Break:</span><hr class="hr"></th>
                <td>${response.shift.break}<hr class="hr"></td>
                </tr>

                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Break duration:</span><hr class="hr"></th>
                <td>${response.shift.breakDu} minutes<hr class="hr"></td>
                </tr>

                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Overtime:</span><hr class="hr"></th>
                <td>${response.shift.overtime}<hr class="hr"></td>
                </tr>

                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Rate:</span><hr class="hr"></th>
                <td>${response.shift.rate}<hr class="hr"></td>
                </tr>

                <tr>
                <th><span class="mr-2 d-none d-lg-inline text-dark text-dark-600 ">Total employees:</span><hr class="hr"></th>
                <td id="totalEmp">${response.shift.totalEmply}<hr class="hr"></td>
                </tr>
                </table>`;

                // fill data for employees
                html += `
                    </div>
                    </div>
                    </div>
                    </div>`

                $('.mainPage').html(html);
                $("#loader").hide();
                $('#selectID').val(response.shift.id);
                $('#selectShift').val(response.shift.name);

                fillList(response.data)
                getShifts('shift', id, shift);
                // getNoShiftEmpls('adEmploy', '', '');

                $('.addThis').prop('disabled', false);

                $('#shiftDetails').html(shiftData);
                // $('#emplyList').html(emplyList);

                $('#shiftDetails').show();
                $('#emplyList').show();

            },
            error: function(errors) {

                html += `
                    </div>
                    </div>
                    </div>
                    </div>`

                $('.mainPage').html(html);
                getShifts('shift', id, shift);
            }
        });
        // console.log('Inelse => ');


    }
}

$(document).ready(function() {

    $(document).on('click', '.getShift', function() {
        $('title').html('Shift list');

        unactive();
        $(this).css("color", 'blue');

        $("#loader").show();
        getShift();
    });


    $(document).on('click', '.add-shift', function() {
        $('.shift-title').html('<i class="fas fa-plus"></i> Add Shift');
        $('.user-message').css({
            'border-color': '',
            'color': 'white',
            'background-color': '',
            'display': 'none'
        });
        $('#shiftName').val('');
        loopNum(24, 'startHour', '');
        loopNum(60, 'startMin', '');
        loopNum(24, 'endHour', '');
        loopNum(60, 'endMin', '');
        loopOnce(25, 'shiftDuration', '');
        loopNum(121, 'gracePeriod', '');

        $('#sunday').prop('checked', false)
        $('#monday').prop('checked', false)
        $('#tuesday').prop('checked', false)
        $('#wednesday').prop('checked', false)
        $('#thursday').prop('checked', false)
        $('#friday').prop('checked', false)
        $('#saturday').prop('checked', false)

        $('#break').prop('checked', false)
        $('#overtime').prop('checked', false)

        $('.break').hide();
        $('.overtime').hide();


        logUIAccess('View add shift modal', '.add-shift');

        $('#shiftMode').val('addShift');
        $('#shiftID').val('');
        $('#shiftModal').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    });

    $(document).on('click', '#break', function() {
        if ($(this).prop("checked") == true) {
            // alert("Checkbox is checked.");
            if ($('#shiftMode').val() == 'editShift') {
                $('.break').show();
            } else {
                const html = breakHTML();
                $('.break').html(html);
                loopNum(24, 'breakHour', '');
                loopNum(60, 'breakMin', '');
                loopOnce(121, 'breakDuraMin', '');
                $('#breakHour').prop("required", true);
                $('#breakMin').prop("required", true);
                $('#breakDuraMin').prop("required", true);

                $('.break').show();
            }

        } else if ($(this).prop("checked") == false) {
            if ($('#shiftMode').val() == 'editShift') {
                // alert("False");
                $('.break').hide();
            } else {
                $('#breakHour').prop("required", false);
                $('#breakMin').prop("required", false);
                $('#breakDuraMin').prop("required", false);

                $('.break').html('');
                $('.break').hide();
            }
        }
    })

    $(document).on('click', '#overtime', function() {
        if ($(this).prop("checked") == true) {
            if ($('#shiftMode').val() == 'editShift') {
                // alert("True");
                $('.overtime').show();
            } else {
                const html = overtimeHTML();

                $('.overtime').html(html);
                loopNum(24, 'overtimeHour', '');
                loopNum(60, 'overtimeMin', '');

                $('#overtimeHour').prop("required", true);
                $('#overtimeMin').prop("required", true);
                $('#overtimeRate').prop("required", true);

                $('.overtime').show();
            }

        } else if ($(this).prop("checked") == false) {
            if ($('#shiftMode').val() == 'editShift') {
                // alert("False");
                $('.overtime').hide();
            } else {
                $('#overtimeHour').prop("required", false);
                $('#overtimeMin').prop("required", false);
                $('#overtimeRate').prop("required", false);

                $('.overtime').html('');
                $('.overtime').hide();
            }
        }
    })

    $(document).on('submit', '#addShift', function(e) {
        e.preventDefault();

        let form = $(this)[0];
        let data = new FormData(form);

        let saveshift = submit(data, $(this).attr('action'), 'POST');

        saveshift.done(function(response) {
            // console.log('In success');
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
                $('#shiftModal').modal('hide');
                $("#loader").show();
                getShift();
                $('.getShift').css("color", 'blue');

            }, 1000);
        })
    });

    // Edit shift
    $(document).on('click', '.editShift', function() {
        $tr = $(this).closest('tr');
        let data = $tr.children("td").map(function() {
            return $(this).text();
        }).get();

        let days = [];
        days = data[12].split(',');
        if (!days.length) {
            days.push(data[12]);
        }
        $('#shiftName').val(data[1]);

        loopNum(24, 'startHour', data[8]);
        loopNum(60, 'startMin', data[9]);
        loopNum(24, 'endHour', data[10]);
        loopNum(60, 'endMin', data[11]);
        loopOnce(25, 'shiftDuration', data[4]);
        loopNum(121, 'gracePeriod', data[6]);

        // console.log('Days => ', days);

        (days.includes('Sunday')) ? $('#sunday').prop('checked', true): '';
        (days.includes('Monday')) ? $('#monday').prop('checked', true): '';
        (days.includes('Tuesday')) ? $('#tuesday').prop('checked', true): '';
        (days.includes('Wednesday')) ? $('#wednesday').prop('checked', true): '';
        (days.includes('Thursday')) ? $('#thursday').prop('checked', true): '';
        (days.includes('Friday')) ? $('#friday').prop('checked', true): '';
        (days.includes('Saturday')) ? $('#saturday').prop('checked', true): '';

        (data[13] == 'true') ? $('#break').prop("checked", true): $('#break').prop("checked", false)

        if (data[13] == 'true') {
            // console.log('Break => ', data[13]);
            const html = breakHTML();
            $('.break').html(html);
            loopNum(24, 'breakHour', data[14]);
            loopNum(60, 'breakMin', data[15]);
            loopOnce(121, 'breakDuraMin', data[16]);
            $('#breakHour').prop("required", true);
            $('#breakMin').prop("required", true);
            $('#breakDuraMin').prop("required", true);

            $('.break').show();
        } else {
            const html = breakHTML();
            $('.break').html(html);
            loopNum(24, 'breakHour', '');
            loopNum(60, 'breakMin', '');
            loopOnce(121, 'breakDuraMin', '');
            $('#breakHour').prop("required", false);
            $('#breakMin').prop("required", false);
            $('#breakDuraMin').prop("required", false);

            $('.break').hide();
        }

        (data[17] == 'true') ? $('#overtime').prop("checked", true): $('#overtime').prop("checked", false);

        if (data[17] == 'true') {
            // console.log('Break => ', data[17]);
            const html = overtimeHTML();
            $('.overtime').html(html);
            loopNum(24, 'overtimeHour', data[18]);
            loopNum(60, 'overtimeMin', data[19]);

            $('#overtimeRate').val(data[20]);

            $('#overtimeHour').prop("required", true);
            $('#overtimeMin').prop("required", true);
            $('#overtimeRate').prop("required", true);

            $('.overtime').show();
        } else {
            const html = overtimeHTML();
            $('.overtime').html(html);
            loopNum(24, 'overtimeHour', '');
            loopNum(60, 'overtimeMin', '');

            $('#overtimeRate').val('');

            $('#overtimeHour').prop("required", false);
            $('#overtimeMin').prop("required", false);
            $('#overtimeRate').prop("required", false);

            $('.overtime').hide();
        }

        logUIAccess('View add shift modal', '.add-shift');

        $('.shift-title').html('<i class="fas fa-plus"></i> Add Shift');
        $('.user-message').css({
            'border-color': '',
            'color': 'white',
            'background-color': '',
            'display': 'none'
        });

        $('#shiftMode').val('editShift');
        $('#shiftID').val(data[21]);
        $('#shiftModal').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    });

    $(document).on('click', '.detailShift', function() {
        $tr = $(this).closest('tr');
        let data = $tr.children("td").map(function() {
            return $(this).text();
        }).get();

        let days = [];
        days = data[12].split(',');
        if (!days.length) {
            days.push(data[12]);
        }

        let html = `<h2 style="text-align: center;">${data[1]} </h2> <hr class="">
                    <div class="row" style="background-color:899;">
                    <div class=" col-lg-4 col-md-4">

                    <label class="lab"><i class="fa fa-clock"></i> Shift start:</label><hr class="hr">
                    <label>${data[2]}</label> <hr class="hr">   

                    <label class="lab"> <i class="fa fa-clock"></i> Grace period:</label><hr class="hr">
                    <label>${data[6]} Min(s)</label> <hr class="hr">   

                    <label class="lab"><i class="fa fa-clock"></i> Overtime hour</label><hr class="hr">
                    <label id="">${(data[17] == 'true')? data[18] : 'N/A'}</label><hr class="hr"> 

                    </div> 

                    <div class=" col-lg-4 col-md-4">

                    <label class="lab"><i class="fa fa-clock"></i> Shift ends</label><hr class="hr">
                    <label>${data[3]}</label> <hr class="hr">   

                    <label class="lab"><i class="fa fa-clock"></i> Break start:</label><hr class="hr">
                    <label>${(data[17] == 'true')? data[5] : 'N/A'}</label> <hr class="hr">   

                    <label class="lab"><i class="fa fa-clock"></i> Overtime minutes</label><hr class="hr">
                    <label>${(data[17] == 'true')? data[19] : 'N/A'}</label> <hr class="hr"> 

                    </div> 

                    <div class=" col-lg-4 col-md-4">

                    <label class="lab"><i class="fa fa-bell"></i> Shift duration</label><hr class="hr">
                    <label>${data[4]} hour(s)</label> <hr class="hr">   

                    <label class="lab"><i class="fa fa-bell"></i> Break duration</label><hr class="hr">
                    <label>${(data[13] == 'true')? data[16]: 'N/A'} Mins</label> <hr class="hr">   

                    <label class="lab"><i class="fa fa-weight"></i> Overtime rate</label><hr class="hr">
                    <label>${(data[17] == 'true')? data[20] : 'N/A'}</label> <hr class="hr"> 
                    </div> 

                    <hr>
                    
                    <span style="color: black;">Working days: </span><hr style="margin: 0px;">
                    <div class="form-check">`;

        if (days.includes('Sunday')) {
            html += ` <label class="radio-inline">
                        <input style="border: 0px solid white;" checked disabled type="checkbox" name="days[]" id="sunday" value="Sunday">
                        Sunday
                        </label>`;
        }
        if (days.includes('Monday')) {
            html += ` <label class="radio-inline">
                        <input style="border: 0px solid white;" checked disabled type="checkbox" name="days[]" id="monday" value="Monday">
                        Monday
                        </label>`;
        }

        if (days.includes('Tuesday')) {
            html += ` <label class="radio-inline">
                        <input style="border: 0px solid white;" checked disabled type="checkbox" name="days[]" id="tuesday" value="Tuesday">
                        Tuesday
                        </label>`;
        }
        if (days.includes('Wednesday')) {
            html += ` <label class="radio-inline">
                        <input style="border: 0px solid white;" checked disabled type="checkbox" name="days[]" id="wednesday" value="Wednesday">
                        Wednesday
                        </label>`;
        }
        if (days.includes('Thursday')) {
            html += ` <label class="radio-inline">
                        <input style="border: 0px solid white;" checked disabled type="checkbox" name="days[]" id="thursday" value="Thursday">
                        Thursday
                        </label>`;
        }
        if (days.includes('Friday')) {
            html += ` <label class="radio-inline">
                        <input style="border: 0px solid white;" checked disabled type="checkbox" name="days[]" id="friday" value="Friday">
                        Friday
                        </label>`;
        }
        if (days.includes('Saturday')) {
            html += ` <label class="radio-inline">
                        <input style="border: 0px solid white;" checked disabled type="checkbox" name="days[]" id="saturday" value="Saturday">
                        Saturday
                        </label>
                            `;
        }
        html += ` <br><label class="radio-inline">
                    <span style="color: black;">Total employees: ${data[7]} </span><hr style="margin: 0px;">
                  </label>
                    </div>
                    </div>`;
        $('.appendContent').html(html);

        $('#shiftDetailModal').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    });

    $(document).on('click', '.shiftManager', function() {

        $("#loader").show();
        shiftManager('');
        unactive();
        $(this).css("color", 'blue');

    });

    $(document).on('click', '.manageShift', function() {

        $tr = $(this).closest('tr');
        const data = $tr.children('td').map(function() {
            return $(this).text();
        }).get();

        $("#loader").show();
        shiftManager(data[21], data[1]);
    });

    $(document).on('change', '#shift', function() {
        $("#loader").show();
        shiftManager($(this).val(), $('#shift option:selected').text());
    });

    $(document).on('click', '.removeEmply', function() {
        $tr = $(this).closest('tr');
        const data = $tr.children("td").map(function() {
            return $(this).text();
        }).get();

        if (confirm('Are you sure to remove employee from this shift?')) {
            // alert('Work in progress !!!');
            let removeEmployee = getSubmit(`${$('#nyanzi').val()}/remove-from-shift/${data[0]}/${data[1]}`, 'GET');

            removeEmployee.done(function(response) {
                // console.log('In success');
                fillList(response.data);
            })

        }

    });

    $(document).on('click', '.removeAll', function() {

        let form = $('#addEmp')[0];
        let data = new FormData(form);

        // console.log('Data => ', data);


        if (confirm('Are you sure to remove ALL employees from this shift?')) {
            // alert('Work in progress !!!');

            let addEmployee = submit(data, 'remove-all', 'POST');
            addEmployee.done(function(response) {
                // console.log('In success');
                fillList(response.data);
            })
        }

    });

    $(document).on('submit', '#addEmp', function(e) {
        e.preventDefault();

        if ($('#shift').val() == '') {
            alert('Please select a shift');
            return false;
        }

        if ($('#adEmploy').val() == '') {
            alert('Please select a employee(s) to add');
            return false;
        }

        let form = $(this)[0];
        let data = new FormData(form);

        // console.log('Data => ', data);

        let addEmployee = submit(data, $(this).attr('action'), 'POST');

        addEmployee.done(function(response) {
            // console.log('In success');
            fillList(response.data);
        })

    });

})