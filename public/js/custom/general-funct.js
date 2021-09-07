function aMoment() {
    $('.user-message').css('display', 'flex')
    $('.user-message').html('A moment please.....');
    $('.user-message').css({
        'border-color': 'blue',
        'color': 'white',
        'background-color': 'green'
    });
}
function endMoment() {
    $('.user-message').css('display', 'none')
    $('.user-message').html('');
}
function logUIAccess(action, path) {
    let data = new FormData();
    data.append('_csrf', $('#crsf').val());
    data.append('action', action);
    data.append('path', path);

    $.ajax({
        type: 'POST',
        url: '/log',
        data: data,
        processData: false,
        contentType: false,
        cache: false,

        success: function(response) {
            console.log('(Response =>', Response);
        },
        error: function(error) {
            console.log('Error =>', error);
        }
    })
}
function backgroundImage() {
    $('.mainPage').html(`
    <div class="" style="">
        <div class="" id="test-git">
            <img style="margin: 0%; padding: 0%; height: 800px;
            width: 1600px;" alt="Loading ........" id="" src="/img/IMG_6339.JPG"/>
        </div>
    </div> `);
}
//Submit forms using this function
function submit(data, action, method) {
    return $.ajax({
        type: method,
        enctype: 'multipart/form-data',
        url: action,
        data: data,
        // responseType: 'arraybuffer',
        processData: false,
        contentType: false,
        cache: false,
        success: function(response) {

            // console.log('response => ', response)
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
                $("#loader").hide();

            } else {
                console.log(error);
                $('.user-message').css('display', 'flex');
                $('.user-message').html(error.responseJSON.error);
                $('#error_adEmploy').html(error.responseJSON.error);
                $('.user-message').addClass('danger');
                $('.user-message').css({ 'border-color': '', 'color': 'white', 'background-color': '' });

                setTimeout(function() {
                    $('.user-message').css('display', 'none');
                    $('user-message').html('');
                    $('#error_adEmploy').html('');

                }, 2000)
                $("#loader").hide();
                return false;
            }
        }
    });
}

// getPastYearsEvents
function getPastYearsEvents(selectOption, year) {
    $.ajax({
        type: 'GET',
        url: `${$('#nyanzi').val()}/getpast-years-events/${year}`,
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            // console.log('Get data from any table');
            console.log(response);

            $.each(response.data, function(key, value) {
                console.log('key => ', key);
                if (key == 0) {
                    $('#' + selectOption).html($("<option></option>").attr("value", value.id).text(`${value.event}  ${value.date}`));
                } else {
                    $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.event}  ${value.date}`));

                }

            });

        },
        error: function(error) {
            // console.log(error);
            $('#' + selectOption).html($("<option></option>").attr("value", "").text("Sorry something went wrong"));

        }
    });
}

// For get with parameters and not
function getSubmit(action, method='GET') {
    return $.ajax({
        type: method,
        url: action,
        contentType: 'application/json',
        success: function(response) {

            // console.log('response => ', response)
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
                $('#error_adEmploy').html(error.responseJSON.error);
                $('.user-message').addClass('danger');
                $('.user-message').css({ 'border-color': '', 'color': 'white', 'background-color': '' });

                setTimeout(function() {
                    $('.user-message').css('display', 'none');
                    $('user-message').html('');
                    $('#error_adEmploy').html('');

                }, 2000)
                return false;
            }
        }
    });
}
// Call this func for any drop down for employee data
function getEmployees(selectOption, empId = '', empName = '', except = '') {
    let resp
        // console.log('Here ====>å ', selectOption);
    $.ajax({
        type: 'GET',
        url: `${$('#nyanzi').val()}/employees`,
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            // console.log('Get data from any table');
            // console.log(s);

            if (empId) {
                $('#' + selectOption).html($("<option></option>").attr("value", empId).text(empName));
                $.each(response.employees, function(key, value) {
                    if (+except !== value.id) {
                        $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.fullname} ${value.dept} department`));
                    }

                });
            } else {
                // console.log('In else');
                $('#' + selectOption).html($("<option></option>").attr("value", "").text("Select data")); //$("<option></option>").attr("value", "").text("Select....")
                $.each(response.employees, function(key, value) {
                    $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.fullname} ${value.dept} department`));
                });
            }
        },
        error: function(error) {
            // console.log(error);
            $('#' + selectOption).html($("<option></option>").attr("value", "").text("Sorry something went wrong"));

        }
    });
}

// Call this func for any drop down for employee data
function getDeptEmployees(selectOption, empId = '', empName = '', except = '', deptId) {
    let resp
        // console.log('Here ====>å ', selectOption);
    $.ajax({
        type: 'GET',
        url: `${$('#nyanzi').val()}/getDeptEmployees/${deptId}`,
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            // console.log('Get data from any table');
            // console.log(s);

            if (empId) {
                $('#' + selectOption).html($("<option></option>").attr("value", empId).text(empName));
                $.each(response.data, function(key, value) {
                    if (+except !== value.id) {
                        $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.fullname}`));
                    }

                });
            } else {
                // console.log('In else');
                $('#' + selectOption).html($("<option></option>").attr("value", "").text("Select data")); //$("<option></option>").attr("value", "").text("Select....")
                $.each(response.data, function(key, value) {
                    $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.fullname}`));
                });
            }
        },
        error: function(error) {
            // console.log(error);
            $('#' + selectOption).html($("<option></option>").attr("value", "").text("Sorry something went wrong"));

        }
    });
}

// Call this func for any drop down for dept head data
function getDeptHead(selectOption, empId = '', empName = '', except = '') {
    let resp
        // console.log('Here ====>å ', selectOption);
    $.ajax({
        type: 'GET',
        url: `${$('#nyanzi').val()}/getAllDeptHead`,
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            // console.log('Get data from any table');
            // console.log(s);

            if (empId) {
                $('#' + selectOption).html($("<option></option>").attr("value", empId).text(empName));
                $.each(response.data, function(key, value) {
                    if (+except !== value.id) {
                        $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.name} || ${value.dept}`));
                    }

                });
            } else {
                // console.log('In else');
                $('#' + selectOption).html($("<option></option>").attr("value", "").text("Select data")); //$("<option></option>").attr("value", "").text("Select....")
                $.each(response.data, function(key, value) {
                    $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.name} || ${value.dept}`));
                });
            }
        },
        error: function(error) {
            // console.log(error);
            $('#' + selectOption).html($("<option></option>").attr("value", "").text("Sorry something went wrong"));

        }
    });
}

// Call this func for any drop down for employee data
function getNonUserEmply(selectOption, empId = '', empName = '', except = '') {
    let resp
        // console.log('Here ====>å ', selectOption);
    $.ajax({
        type: 'GET',
        url: '/getNonUserEmply',
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            // console.log('Get data from any table');
            // console.log(s);

            if (empId) {
                $('#' + selectOption).html($("<option></option>").attr("value", empId).text(empName));
                $.each(response.data, function(key, value) {
                    if (+except !== value.id) {
                        $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.fullname}`));
                    }

                });
            } else {
                // console.log('In else');
                $('#' + selectOption).html($("<option></option>").attr("value", "").text("Select data")); //$("<option></option>").attr("value", "").text("Select....")
                $.each(response.data, function(key, value) {
                    $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.fullname}`));
                });
            }
        },
        error: function(error) {
            // console.log(error);
            $('#' + selectOption).html($("<option></option>").attr("value", "").text("Sorry something went wrong"));

        }
    });
}


function getJobTs(selectOption, jobId = '', jobTitle = '') {
    let resp
    $.ajax({
        type: 'GET',
        url: 'jobTitleDescs',
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            console.log('Get data from table');
            // console.log(s);

            if (jobId) {
                $('#' + selectOption).html($("<option></option>").attr("value", jobId).text(jobTitle));
                $.each(response.jobTitleDesc, function(key, value) {
                    $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.jobTitle}`));
                });
            } else {
                console.log('In else');
                $('#' + selectOption).html($("<option></option>").attr("value", "").text("Select job description")); //$("<option></option>").attr("value", "").text("Select....")
                $.each(response.jobTitleDesc, function(key, value) {
                    $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.jobTitle}`));
                });
            }
        },
        error: function(error) {
            // console.log(error);
            $('#' + selectOption).html($("<option></option>").attr("value", "").text("Sorry something went wrong"));

        }
    });

}

function getDeparts(selectOption, deptId = '', dept = '') {
    let resp
    $.ajax({
        type: 'GET',
        url: `${$('#nyanzi').val()}/departments`,
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            console.log('Get data from table');
            // console.log(s);

            if (deptId) {
                $('#' + selectOption).html($("<option></option>").attr("value", deptId).text(dept));
                $.each(response.deptData, function(key, value) {
                    $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.deptName}`));
                });
            } else {
                console.log('In else');
                $('#' + selectOption).html($("<option></option>").attr("value", "").text("Select department")); //$("<option></option>").attr("value", "").text("Select....")
                $.each(response.deptData, function(key, value) {
                    $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.deptName}`));
                });
            }
        },
        error: function(error) {
            // console.log(error);
            $('#' + selectOption).html($("<option></option>").attr("value", "").text("Sorry something went wrong"));
        }
    });
}

function getSalaries(selectOption, salaryId = '', salary = '') {
    $.ajax({
        type: 'GET',
        url: `${$('#nyanzi').val()}/salaryStructures`,
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            console.log('Get data Salary structure.');
            // console.log(s);
            if (salaryId) {
                $('#' + selectOption).html($("<option></option>").attr("value", salaryId).text(salary));
                $.each(response.compiledData, function(key, value) {
                    $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.grade} | ${value.basic} | ${value.description || ''}`));
                });
            } else {
                console.log('In else');
                $('#' + selectOption).html($("<option></option>").attr("value", "").text("Select salary grade")); //$("<option></option>").attr("value", "").text("Select....")
                $.each(response.compiledData, function(key, value) {
                    $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.grade} | ${value.basic} | ${value.description || ''}`));
                });
            }
        },
        error: function(error) {
            // console.log(error);
            $('#' + selectOption).html($("<option></option>").attr("value", "").text("Sorry something went wrong"));
        }
    });
}

function getCountries(selectOption, country = '') {
    $.ajax({
        type: 'GET',
        url: 'countries',
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            console.log('Get countries.');
            // console.log(response.data);
            if (country) {
                $('#' + selectOption).html($("<option></option>").attr("value", country).text(country));
                $.each(response.data, function(key, value) {
                    $('#' + selectOption).append($("<option></option>").attr("value", value.name).text(`${value.name}`));
                });
            } else {
                console.log('In else');
                $('#' + selectOption).html($("<option></option>").attr("value", "").text("Select data")); //$("<option></option>").attr("value", "").text("Select....")
                $.each(response.data, function(key, value) {
                    $('#' + selectOption).append($("<option></option>").attr("value", value.name).text(`${value.name}`));
                });
            }
        },
        error: function(error) {
            // console.log(error);
            $('#' + selectOption).html($("<option></option>").attr("value", "").text("Sorry something went wrong"));
        }
    });
}

function getCompany(id) {
    $.ajax({
        type: 'GET',
        url: '/company',
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            // console.log('Get company.');
            // console.log(response.staffID);
            if (response.staffID) {
                // console.log(response);
                $('#' + id).val(response.staffID);
                $('#' + id).prop("readonly", true);
            }
        },
        error: function(error) {
            // console.log(error);
            $('#' + id).val('');
        }
    });
}

function getAnnualLeaves(selectOption, leaveId = '', leave = '') {
    $.ajax({
        type: 'GET',
        url: `${$('#nyanzi').val()}/getLeaveTypes`,
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            console.log('Get data Annual leaves.');
            console.log('Annual leave', response.leaves);
            // console.log(s);
            let anu = /ANNUAL/;
            if (leaveId) {
                $('#' + selectOption).html($("<option></option>").attr("value", leaveId).text(leave));
                $.each(response.leaves, function(key, value) {
                    if (anu.test(value.leaveType.toUpperCase())) {
                        $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.leaveType} | ${value.nofdays} days`));
                    }

                });
            } else {
                console.log('In else');
                $('#' + selectOption).html($("<option></option>").attr("value", "").text("Select data")); //$("<option></option>").attr("value", "").text("Select....")
                $.each(response.leaves, function(key, value) {
                    // console.log('Anu1', anu);

                    if (anu.test(value.leaveType.toUpperCase())) {
                        $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.leaveType} || ${value.nofdays} days`));
                    }
                });
            }
        },
        error: function(error) {
            // console.log(error);
            $('#' + selectOption).html($("<option></option>").attr("value", "").text("Sorry something went wrong"));
        }
    });
}

function getShifts(selectOption, shiftId = '', shift = '') {
    let resp
    $.ajax({
        type: 'GET',
        url: 'getShifts',
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            // console.log('Get data from table');
            // console.log('response.data => ', response.data);

            // special case
            $.each(response.data, function(key, value) {
                if (shiftId == value.id) {
                    $('#' + selectOption).append($("<option selected></option>").attr("value", value.id).text(`${value.name}`));
                } else {
                    $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.name}`));
                }
            });
        },
        error: function(error) {
            // console.log(error);
            $('#' + selectOption).html($("<option></option>").attr("value", "").text("Sorry something went wrong"));
        }
    });
}

function getNoShiftEmpls(selectOption, employID = '', name = '') {
    let resp
    $.ajax({
        type: 'GET',
        url: 'getNoShiftEmployees',
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            // console.log('Get data from table');
            // console.log('response.data => ', response);

            if (response.data.length == 0) {

                $('#' + selectOption).html($("<option disabled></option>").attr("value", '').text(`All employees are under shifts`));

                return false;
            }

            if (employID) {
                $('#' + selectOption).html($("<option></option>").attr("value", employID).text(name));
                $.each(response.data, function(key, value) {
                    $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.name}`));
                });
            } else {
                console.log('In else');
                $.each(response.data, function(key, value) {
                    if (key == 0) {
                        $('#' + selectOption).html($("<option></option>").attr("value", value.id).text(`${value.name}${value.dept}`));
                    } else {
                        $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.name}${value.dept}`));
                    }
                });
            }
        },
        error: function(error) {
            // console.log(error);
            $('#' + selectOption).html($("<option></option>").attr("value", "").text("Sorry something went wrong"));
        }
    });
}

function getEmpUnderDept(selectOption, deptId, employID, name) {
    console.log('response.employee[0].departmentId =>2 ', deptId);
    $.ajax({
        type: 'GET',
        url: 'get-emp-underDept/' + deptId,
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            // console.log('Get data from table');
            // console.log('response.data => ', response);

            if (employID) {
                $('#' + selectOption).html($("<option></option>").attr("value", employID).text(name));
                $.each(response.data, function(key, value) {
                    $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.name}`));
                });
            } else {
                console.log('In else');
                $('#' + selectOption).html($("<option></option>").attr("value", "").text("Select immediate supervisor"));
                $.each(response.data, function(key, value) {
                    $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.name}`));
                });
            }
        },
        error: function(error) {
            // console.log(error);
            $('#' + selectOption).html($("<option></option>").attr("value", "").text("Sorry something went wrong"));
        }
    });
}

function fetchTerminals(selectOption, termId = '', terminal = '') {
    let resp
    $.ajax({
        type: 'GET',
        url: '/getTerminals',
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            // console.log('Get data from table');
            console.log('response.data => ', response.data);

            // special case
            $.each(response.data, function(key, value) {
                if (termId == value.id) {
                    $('#' + selectOption).append($("<option selected></option>").attr("value", value.id).text(`${value.number} ${value.name}`));
                } else {
                    $('#' + selectOption).append($("<option></option>").attr("value", value.id).text(`${value.number} ${value.name}`));
                }
            });
        },
        error: function(error) {
            // console.log(error);
            $('#' + selectOption).html($("<option></option>").attr("value", "").text("Sorry something went wrong"));
        }
    });
}

// Restrict characters
function requiredText(maxChar, txtAreaId, divId) {
    const textArea = $('#' + txtAreaId).val();
    const remaining = maxChar - textArea.length;

    const color = remaining < maxChar * 0.1 ? 'red' : '#333333';
    // const css = ;
    $('#' + divId).html(`${remaining} characters remaining`);
    $('#' + divId).css({
        'color': color,
        'font-size': '14px',
        'font-weight': 'bold',
        'margin-top': '3px',
        'text-align': 'right',
        'display': 'flex',
    });
}

// remove the active from all a
function unactive() {
    $('.employeeFeat').css("color", '');
    $('.getDept').css("color", '');
    $('.jobTitleDecs').css("color", '');
    $('.add-employee-form').css("color", '');
    $('.employeeDash').css("color", '');
    $('.salaryDash').css("color", '');
    $('.applyLeave_blue').css("color", '');
    $('.leaveDash').css("color", '');
    $('.leaveType_blue').css("color", '');
    $('.getAttedSheet').css("color", '');
    $('.getAttndReport_blue').css("color", '');
    $('.reportManager_blue').css("color", '');
    $('.getTerminals').css("color", '');
    $('.getShift').css("color", '');
    $('.shiftManager').css("color", '');
    $('.calendManager_blue').css("color", '');
    $('.settings').css("color", '');
    $('.settings_blue').css("color", '');

}

function checkImage(imageId) {
    // console.log($(imageId));
    let property = $('#' + imageId)[0].files[0];
    let image_name = property.name;
    let extension = image_name.split('.').pop().toLowerCase();
    let image_size = property.size;

    if ($.inArray(extension, ['png', 'jpeg', 'gif', 'jpg', 'jfif']) == -1) {

        alert('Please select a valid image file');
        $('#' + imageId).val('');
        return false;
    }

    if (image_size > 1000000) {

        alert('Please image file should be 1 Mb of size');
        $('#' + imageId).val('');
        return false;
    }
}

function checkPDF(imageId) {
    // console.log($(imageId));
    let property = $('#' + imageId)[0].files[0];
    let image_name = property.name;
    let extension = image_name.split('.').pop().toLowerCase();
    let image_size = property.size;

    if ($.inArray(extension, ['png', 'jpeg', 'gif', 'jpg', 'pdf', 'jfif']) == -1) {

        alert('Please select a valid image file or pdf file');
        $('#' + imageId).val('');
        return false;
    }

    if (image_size > 1000000) {

        alert('Please image file should be 1 Mb of size');
        $('#' + imageId).val('');
        return false;
    }
}

function hTML(mesg) {
    let html = '';
    $('.mainPage').html('');
    html += `<link href="/css/employee-style.css" rel="stylesheet">`;
    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800">System Setup Incomplete</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm add-employee-form"><i';
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Reload Page</a>';
    html += '</div>';

    // html += '<div class="container" style="padding: 0px;">';

    // html += `< div class = "tab-content" style = "margin-top:16px; ">`;
    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;
    html += `<div class="panel-heading" style="font-size: 20px;">The following infomation are needed before you can use the system.</div>`;
    html += `<div class="panel-body">`;
    html += `${mesg}`;
    html += `</div>`;
    html += `</div>`;
    html += `</div>`;
    // html += `</div>`;
    $('.mainPage').html(html);
}

function errorPage(id) {
    let html = '';
    $('.mainPage').html('');
    html += `<link href="/css/employee-style.css" rel="stylesheet">`;
    html += `<script src="https://kit.fontawesome.com/a076d05399.js"></script>`;
    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800">System Error</h6>';
    html += `<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm ${id}"><i`;
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Reload Page</a>';
    html += '</div>';

    html += '<div class="container" style="padding: 0px;">';

    // html += `< div class = "tab-content" style = "margin-top:16px; ">`;
    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;
    html += `<div class="panel-heading" style="font-size: 20px;">System Error occured</div>`;
    html += `<div class="panel-body">`;
    html += `<p style="color: red;">Sorry!! something went wrong, this could be server error.<a href="#" class="${id}">Click here to try again.</a></p>`;
    html += `<center><h2>OR</h2></center>`;
    html += `<p style="color: red;">This could be due to not connected to the SERVER or INTERNET.<a href="./index">Click here refresh the page</a></p>`;
    html += `</div>`;
    html += `</div>`;
    html += `</div>`;
    html += `</div>`;
    $('.mainPage').html(html);
}

function validationError(id, headTitle, errors) {
    let html = '';
    $('.mainPage').html('');
    html += `<link href="/css/employee-style.css" rel="stylesheet">`;
    html += `<script src="https://kit.fontawesome.com/a076d05399.js"></script>`;
    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += `<h6 class="h3 mb-0 text-gray-800">${headTitle}</h6>`;
    html += `<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm ${id}"><i`;
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Reload Page</a>';
    html += '</div>';

    html += '<div class="container" style="padding: 0px;" >';

    // html += `< div class = "tab-content" style = "margin-top:16px; ">`;
    html += `<div class="tab-pane active" id="basic_info" style="height: 480px;">`;
    html += `<div class="panel panel-default">`;
    html += `<div class="panel-heading" style="font-size: 20px;">${headTitle}</div>`;
    html += `<div class="panel-body">`;
    html += `<div class="alert alert-danger">
    ${errors}
    </div>`;
    html += `</div>`;
    html += `</div>`;
    html += `</div>`;
    html += `</div>`;
    $('.mainPage').html(html);
}

function checkPoint(mode, id) {
    $.ajax({
        type: 'GET',
        url: '/check-point', // in the company route and controller.
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            console.log(response.data[0]);
            let mesg = '';
            if (response.data[0] === 0) {
                mesg += `<p style="color: red;">Please add company info before adding employee info. <a href="./company-setup">Click here.</a></p>`;
                // return false;
            }
            if (response.data[1] === 0) {
                mesg += `<p style="color: red;">Please add job description info before adding employee info. <a href="#" class="jobTitleDecs">Click here.</a></p>`;
                // return false;
            }
            if (response.data[2] === 0) {
                mesg += `<p style="color: red;">Please add department info before adding employee info. <a href="#" class="getDept">Click here.</a></p>`;
                // return false;
            }
            if (response.data[3] === 0) {
                mesg += `<p style="color: red;">Please add salary structure before adding employee info. <a href="#" class="add-salary-form">Click here.</a></p>`;
                // return false;
            }
            if (mesg !== '') {
                hTML(mesg);
                $("#loader").hide();                    
                // return false;
            } else {
                if (mode === 'add') {
                    // $("#loader").show();                    
                    addForm();
                    $('#mode').val('add');
                    // $('#empID').val('')
                    getJobTs('jobTitle', '', '');
                    getDeparts('dept', '', '');
                    getEmployees('immediatesuper', '', '', '');
                    getEmployees('diimmediatesuper', '', '', '');
                    getAnnualLeaves('leavtype', '', '', '');
                    getSalaries('salaryStruct', '', '');
                    getCountries('instCountry_1', '');
                    getCompany('staffID');
                    // hide or show spouse detail section based on marriage status
                    const mStatus = $('#mStatus').val();
                    if (mStatus != 'Married') {
                        $('.hasSpouse').hide();
                    } else {
                        $('.hasSpouse').show();
                    }

                    const ssnitNo = $('#ssnitNo').val();
                    if (ssnitNo === '') {
                        $('.hasSSNIT').hide();
                    } else {
                        $('.hasSSNIT').show();
                    }

                    $('title').html('Add Employees');
                    unactive();
                    $('.add-employee-form').css("color", 'blue');
                    $('#employeeFeat').modal('hide');

                    logUIAccess('Clicked add new employee', '.add-employee-form');

                }

                // return true;
            }
        },
        error: function(error) {
            // console.log(error);
            if (error.status == 500) {
                const mesg = `<p style="color: red;">${error.responseJSON.error}</p>`;
                hTML(mesg, id);
                $("#loader").hide();
                return false;
            } else {
                $("#loader").hide();
                errorPage(id);
            }
        }
    });
}

function getDate(date, option) {
    const options = { month: 'long', year: 'numeric' };
    let formt_date = new Date(date);
    if (option && date) { return formt_date.toLocaleDateString("en-US", options); } else { return formt_date.toLocaleDateString("en-US") }
    // const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
}

function getType(val, type) {
    if (val) {
        return 'text';
    } else {
        return type
    }
}

function changeType(id, vlu) {
    // console.log('ID', id, type);
    $('#' + id).prop("type", "month");
    const oldValues = [];
    oldValues.push(vlu);
    setTimeout(function() {
        if ($('#' + id).val() === '') {
            if (oldValues[0]) {
                $('#' + id).prop("type", "text");
                $('#' + id).val(`${oldValues[0]}`);
            } else {
                $('#' + id).prop("type", "month");
                // $('#' + id).val(`${oldValues[0]}`);
            }

        }
    }, 10000);
}

function changeTyp(id, vlu) {
    // console.log('ID', id, type);
    $('#' + id).prop("type", "date");
    const oldValues = [];
    oldValues.push(vlu);
    setTimeout(function() {
        if ($('#' + id).val() === '') {
            if (oldValues[0]) {
                $('#' + id).prop("type", "text");
                $('#' + id).val(`${oldValues[0]}`);
            } else {
                $('#' + id).prop("type", "date");
                // $('#' + id).val(`${oldValues[0]}`);
            }

        }
    }, 10000);
}

function marigeStatus(option, val = '') {
    if (val) {
        $('#' + option).html($("<option></option>").attr("value", val).text(val));
        $('#' + option).append($("<option></option>").attr("value", "Single").text("Single"));
        $('#' + option).append($("<option></option>").attr("value", "Married").text("Married"));
        $('#' + option).append($("<option></option>").attr("value", "Divorce").text("Divorce"));
    } else {
        $('#' + option).html($("<option></option>").attr("value", "Single").text("Single"));
        $('#' + option).append($("<option></option>").attr("value", "Married").text("Married"));
        $('#' + option).append($("<option></option>").attr("value", "Divorce").text("Divorce"));
    }
}

function getTitle(option, val = '') {
    if (val) {
        $('#' + option).html($("<option></option>").attr("value", val).text(val));
        $('#' + option).append($("<option></option>").attr("value", "Mr").text("Mr"));
        $('#' + option).append($("<option></option>").attr("value", "Miss").text("Miss"));
        $('#' + option).append($("<option></option>").attr("value", "Mrs").text("Mrs"));
        $('#' + option).append($("<option></option>").attr("value", "Dr").text("Dr"));
    } else {
        $('#' + option).html($("<option></option>").attr("value", "Mr").text("Mr"));
        $('#' + option).append($("<option></option>").attr("value", "Miss").text("Miss"));
        $('#' + option).append($("<option></option>").attr("value", "Mrs").text("Mrs"));
        $('#' + option).append($("<option></option>").attr("value", "Dr").text("Dr"));
    }
}

async function getGender(option, val = '') {
    await
    console.log();
    if (val) {
        $('#' + option).html($("<option></option>").attr("value", val).text(val));
        $('#' + option).append($("<option></option>").attr("value", "Male").text("Male"));
        $('#' + option).append($("<option></option>").attr("value", "Female").text("Female"));
    } else {
        $('#' + option).html($("<option></option>").attr("value", "Male").text("Male"));
        $('#' + option).append($("<option></option>").attr("value", "Female").text("Female"));
    }
}

async function getGenderLeave(option, val = '') {
    await
    console.log();
    if (val) {
        $('#' + option).html($("<option></option>").attr("value", val).text(val));
        $('#' + option).append($("<option></option>").attr("value", "All").text("All"));
        $('#' + option).append($("<option></option>").attr("value", "Male").text("Male"));
        $('#' + option).append($("<option></option>").attr("value", "Female").text("Female"));
    } else {
        $('#' + option).html($("<option></option>").attr("value", "All").text("All"));
        $('#' + option).append($("<option></option>").attr("value", "Male").text("Male"));
        $('#' + option).append($("<option></option>").attr("value", "Female").text("Female"));
    }
}

async function getCarryon(option, val = '') {
    await
    console.log();
    if (val) {
        $('#' + option).html($("<option></option>").attr("value", (val) ? '1' : '0').text((val) ? 'Yes' : 'No'));
        $('#' + option).append($("<option></option>").attr("value", "0").text("No"));
        $('#' + option).append($("<option></option>").attr("value", "1").text("Yes"));
    } else {
        $('#' + option).append($("<option></option>").attr("value", "0").text("No"));
        $('#' + option).append($("<option></option>").attr("value", "1").text("Yes"));
    }
}

async function getCardType(option, val = '') {
    await
    console.log();
    if (val) {
        $('#' + option).html($("<option></option>").attr("value", val).text(val));
        $('#' + option).append($("<option></option>").attr("value", "Ghana Card").text("Ghana Card"));
        $('#' + option).append($("<option></option>").attr("value", "Voter's ID Card").text("Voter's ID Card"));
        $('#' + option).append($("<option></option>").attr("value", "Driver Licence").text("Driver Licence"));
        $('#' + option).append($("<option></option>").attr("value", "NHIS Card").text("NHIS Card"));
        $('#' + option).append($("<option></option>").attr("value", "Passport").text("Passport"));
    } else {
        $('#' + option).html($("<option></option>").attr("value", '').text("Select card type"));
        $('#' + option).append($("<option></option>").attr("value", "Ghana Card").text("Ghana Card"));
        $('#' + option).append($("<option></option>").attr("value", "Voter's ID Card").text("Voter's ID Card"));
        $('#' + option).append($("<option></option>").attr("value", "Driver Licence").text("Driver Licence"));
        $('#' + option).append($("<option></option>").attr("value", "NHIS Card").text("NHIS Card"));
        $('#' + option).append($("<option></option>").attr("value", "Passport").text("Passport"));
    }
}

async function getRegion(option, val = '') {
    await
    console.log();
    if (val) {
        $('#' + option).html($("<option></option>").attr("value", val).text(val));
        $('#' + option).append($("<option></option>").attr("value", "Greater Accra Region").text("Greater Accra Region"));
        $('#' + option).append($("<option></option>").attr("value", "Bono Region").text("Bono Region"));
        $('#' + option).append($("<option></option>").attr("value", "Ashanti Region").text("Ashanti Region"));
        $('#' + option).append($("<option></option>").attr("value", "Central Region").text("Central Region"));
        $('#' + option).append($("<option></option>").attr("value", "Eastern Region").text("Eastern Region"));
        $('#' + option).append($("<option></option>").attr("value", "Western Region").text("Western Region"));
        $('#' + option).append($("<option></option>").attr("value", "Northern Region").text("Northern Region"));
        $('#' + option).append($("<option></option>").attr("value", "Upper East Region").text("Upper East Region"));
        $('#' + option).append($("<option></option>").attr("value", "Upper West Region").text("Upper West Region"));
        $('#' + option).append($("<option></option>").attr("value", "Volta Region").text("Volta Region"));
        $('#' + option).append($("<option></option>").attr("value", "North East Region").text("North East Region"));
        $('#' + option).append($("<option></option>").attr("value", "Savannah Region").text("Savannah Region"));
        $('#' + option).append($("<option></option>").attr("value", "Bono East Region").text("Bono East Region"));
        $('#' + option).append($("<option></option>").attr("value", "Ahafo Region").text("Ahafo Region"));
        $('#' + option).append($("<option></option>").attr("value", "Western North Region").text("Western North Region"));
        $('#' + option).append('<option value="Oti Region">Oti Region</option>');
    } else {
        $('#' + option).html($("<option></option>").attr("value", '').text("Select region of residence"));
        $('#' + option).append($("<option></option>").attr("value", "Greater Accra Region").text("Greater Accra Region"));
        $('#' + option).append($("<option></option>").attr("value", "Bono Region").text("Bono Region"));
        $('#' + option).append($("<option></option>").attr("value", "Ashanti Region").text("Ashanti Region"));
        $('#' + option).append($("<option></option>").attr("value", "Central Region").text("Central Region"));
        $('#' + option).append($("<option></option>").attr("value", "Eastern Region").text("Eastern Region"));
        $('#' + option).append($("<option></option>").attr("value", "Western Region").text("Western Region"));
        $('#' + option).append($("<option></option>").attr("value", "Northern Region").text("Northern Region"));
        $('#' + option).append($("<option></option>").attr("value", "Upper East Region").text("Upper East Region"));
        $('#' + option).append($("<option></option>").attr("value", "Upper West Region").text("Upper West Region"));
        $('#' + option).append($("<option></option>").attr("value", "Volta Region").text("Volta Region"));
        $('#' + option).append($("<option></option>").attr("value", "North East Region").text("North East Region"));
        $('#' + option).append($("<option></option>").attr("value", "Savannah Region").text("Savannah Region"));
        $('#' + option).append($("<option></option>").attr("value", "Bono East Region").text("Bono East Region"));
        $('#' + option).append($("<option></option>").attr("value", "Ahafo Region").text("Ahafo Region"));
        $('#' + option).append($("<option></option>").attr("value", "Western North Region").text("Western North Region"));
        $('#' + option).append('<option value="Oti Region">Oti Region</option>');
    }
}

async function getQualify(option, val = '') {
    await
    console.log(); // Don't remove this line ever
    if (val) {
        $('#' + option).html($("<option></option>").attr("value", val).text(val));
        $('#' + option).append($("<option></option>").attr("value", 'Basic Education Certificate Basic Education Certificate ').text('Basic Education Certificate Basic Education Certificate '));
        $('#' + option).append($("<option></option>").attr("value", 'Vocational').text('Vocational'));
        $('#' + option).append($("<option></option>").attr("value", 'Technical').text('Technical'));
        $('#' + option).append($("<option></option>").attr("value", 'SSS').text('SSS'));
        $('#' + option).append($("<option></option>").attr("value", 'WASSEC').text('WASSEC'));
        $('#' + option).append($("<option></option>").attr("value", 'O Level').text('O Level'));
        $('#' + option).append($("<option></option>").attr("value", 'A Level').text('A Level'));
        $('#' + option).append($("<option></option>").attr("value", 'Diploma').text('Diploma'));
        $('#' + option).append($("<option></option>").attr("value", 'HND').text('HND'));
        $('#' + option).append($("<option></option>").attr("value", 'AHND').text('AHND'));
        $('#' + option).append($("<option></option>").attr("value", 'Degree').text('Degree'));
        $('#' + option).append($("<option></option>").attr("value", 'Masters').text('Masters'));
        $('#' + option).append($("<option></option>").attr("value", 'PhD').text('PhD'));
        $('#' + option).append($("<option></option>").attr("value", 'Others').text('Others/Workshop/Seminar'));
    } else {

        $('#' + option).html($("<option></option>").attr("value", '').text("Select qualification/certication attained"));
        $('#' + option).append("<option value='Basic Education Certificate'>Basic Education Certificate</option>");
        $('#' + option).append("<option value='Vocational'>Vocational</option>");
        $('#' + option).append("<option value='Technical'>Technical</option>");
        $('#' + option).append("<option value='SSS'>SSS</option>");
        $('#' + option).append("<option value='WASSEC'>WASSEC</option>");
        $('#' + option).append("<option value='O Level'>O Level</option>");
        $('#' + option).append("<option value='A Level'>A Level</option>");
        $('#' + option).append("<option value='Diploma'>Diploma</option>");
        $('#' + option).append("<option value='HND'>HND</option>");
        $('#' + option).append("<option value='AHND'>AHND</option>");
        $('#' + option).append("<option value='Degree'>Degree</option>");
        $('#' + option).append("<option value='Masters'>Masters</option>");
        $('#' + option).append("<option value='PhD'>PhD</option>");
        $('#' + option).append("<option value='Others'>Others/Workshop/Seminar</option>");
    }
}

function progress(data) {
return `<!-- looop start -->
		    <div class="post">
              <div class="user-block">
                <img class="img-circle img-bordered-sm" src="/${data[2]}" alt="user image">
                <span class="username">
                  <a href="#">${data[1]}</a>
                </span>
                <span class="description">
                	<span class="fa fa-calendar-day"></span>
                	<span><b>${data[0]}</b></span>
            	</span>
              </div>
              <div>
               ${data[3]}
              </div>
              <p>
              </p>
        </div>
    <!-- loops end here -->
    `
}