function getJobTitles() {
    $('.mainPage').html('');
    let html = '';
    html += `<link href="/css/employee-style.css" rel="stylesheet">`;

    html += `<style>
  td label{
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
    content: 'Staff ID.:';
  }
  table.responsive-table td:nth-child(2):before{
    content: 'Date Emplyed:';
  }
  table.responsive-table td:nth-child(3):before{
    content: 'Full Name:';
  }
  table.responsive-table td:nth-child(4):before{
    content: 'Phone:';
  }
  table.responsive-table td:nth-child(5):before{
    content: 'Email:';
  }
  table.responsive-table td:nth-child(6):before{
    content: 'Department:';
  }

  
  table.responsive-table td:nth-child(1),
  table.responsive-table td:nth-child(2),
  table.responsive-table td:nth-child(3),
  table.responsive-table td:nth-child(4),
  table.responsive-table td:nth-child(5),
  table.responsive-table td:nth-child(6){
    padding-left: 42%;
  }
  table.responsive-table td:nth-child(1):before,
  table.responsive-table td:nth-child(2):before,
  table.responsive-table td:nth-child(3):before,
  table.responsive-table td:nth-child(4):before,
  table.responsive-table td:nth-child(5):before,
  table.responsive-table td:nth-child(6):before{
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
  </style>`;
    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800"><i class="fa fa-comment fa-1x text-black-300"></i> Job Description</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm jobTitleDecs"><i';
    html += 'class = "fa fa-plus fa-sm text-white-50"></i> Reload Page</a>';
    html += '</div>';
    html += `<div class="tab-pane active" id="basic_info" style="">`;
    html += `<div class="panel panel-default">`;
    html += `<div class="panel-heading" style="font-size: 15px;">Job Description & Responsibilities</div>`;
    html += `<div class="panel-body" style="padding: 0px;">`;
    html += `<div class="card-header form-group" style="background-color: ;">
                        <input class="" id="myInput" type="text" placeholder="Search job decription record by anything..">
                    </div>`;
    html += `<button style="float: right; margin: 0px 0px 10px 10px;" class="btn btn-primary add-job-form btn-sm"><i class="fas fa-plus"></i> Create Job Description</button><br>`;

    html += '<table class="layout display responsive-table">';
    html += '<thead class="table-dark" style="background-color:#008a9f;">';
    html += '<tr>';
    html += '<th scope="col">Job Title</th>';
    html += '<th scope="col">Competencies</th>';
    html += '<th scope="col">Job summary/purpose</th>';
    html += '<th scope="col">Key Duties</th>';
    html += '<th scope="col">Manage</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color: white;" class="myTable">';

    $.ajax({
        type: 'GET',
        url: 'jobTitleDescs',
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            // checkPoint('none', 'jobTitleDecs');
            // console.log('Get job description list');

            function getDate(date) {
                let formt_date = new Date(date);
                return formt_date.toLocaleDateString("en-US");
            }

            if (response.jobTitleDesc.length === 0) {
                html += `<td colspan="5" style="color: red;">No data found</td>`;
            }
            $.each(response.jobTitleDesc, function(key, value) {
                html += '<tr>';
                // html += `<td>${value.deptName}</td>`;
                html += `<td class="organisationnumber">${value.jobTitle}</td>`;
                html += `<td>${value.jobDescription}</td>`;
                html += `<td>${value.jobSummary}</td>`;
                html += `<td>${value.keyDutiesRespon}</td>`;
                html += `<td class="actions"><label style="cursor: pointer; color: blue;" class="editJob" id="${value.id}">Edit</label> | <label style="cursor: pointer; color: blue;" class="jobDetails" id="${value.id}">Details</label>`;
                html += `</tr>`;
            });

            html += '</tbody>';
            html += '</table>';
            // html += '</div>';

            // html += '</div>';
            html += '</div>';
            html += '</div>';
            // 

            html += '</div>';

            // html += '</div>';
            $('.mainPage').html(html);
            $("#loader").hide();
            getEmployees('deptHead', '', ''); // called from general-funct.js

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
                    $('user-message').html('');
                }, 2000)
                return false;
            } else {
                errorPage('jobTitleDecs');
            }

            getEmployees('deptHead', '', ''); // called from general-funct.js
            $("#loader").hide();
        }

    });

}

$(document).ready(function() {

    $(document).on('keyup', "#myInput", function() {
        var value = $(this).val().toLowerCase();
        $(".myTable tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    // job title etc page
    $(document).on('click', '.jobTitleDecs', function() {

        $('title').html('Job Title & Decs');

        $('#employeeFeat').modal('hide');
        $("#loader").show();
        getJobTitles();
        unactive();
        $('.jobTitleDecs').css("color", 'blue');
    });

    // To clear the add job form
    $(document).on('click', '#jobcls', function() {
        $('#jobPosition').val('');
        $('#jobSummary').val('');
        $('#jobDesc').val('');
        $('#keyRespn').val('');
        $('.user-message').css('display', 'none');
        $('.user-message').html('')
        $('.char-left').html('');
    });

    // Add new job description
    $(document).on('click', '.add-job-form', function() {
        $('.job-title').html('<i class="fas fa-plus"></i> Create Job Description');
        $('#jobPosition').val('');
        $('#jobSummary').val('');
        $('#jobDesc').val('');
        $('#keyRespn').val('');
        $('.user-message').css('display', 'none');
        $('.user-message').html('')
        $('#jobEditMode').val('');

        $('#jobEditMode').val('addMode');
        $('#jobcls').show();
        $('#jobDescModal').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});

    });

    // Edit job option
    $(document).on('click', '.editJob', function() {

        $('.job-title').html('<i class="fas fa-edit"></i> Edit Job Description');
        $('#jobEditMode').val('editMode');
        $('.user-message').css('display', 'none');
        $('.user-message').html('')
        $('#jobcls').hide();
        $('#jobDescModal').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});

        $.ajax({
            type: 'GET',
            url: 'jobTitleDec/' + $(this).attr('id'),
            // processData: false,
            contentType: 'application/json',
            success: function(response) {
                // console.log('Get job description details');
                // console.log(response);
                checkPoint('none', 'jobTitleDecs');

                function getDate(date) {
                    let formt_date = new Date(date);
                    return formt_date.toLocaleDateString("en-US");
                }

                if (response) {
                    $('#jobPosition').val(response.jobDesc.jobTitle);
                    $('#jobDesc').val(response.jobDesc.jobDescription);
                    $('#keyRespn').val(response.jobDesc.keyDutiesRespon);
                    $('#jobdescId').val(response.jobDesc.id);
                    $('#jobSummary').val(response.jobDesc.jobSummary);
                    $('#jobEditMode').val('editMode');
                    $('.user-message').css('display', 'none');
                    $('.user-message').html('');
                    $('.char-left').html('');
                }
            },
            error: function(error) {
                // console.log(error);
                if (error.status == 500) {

                    alert(error.responseJSON.error);

                    return false;
                } else {
                    errorPage('jobTitleDecs');
                }

            }

        });

    })

    // Count char for all textarea
    $(document).on('keyup', '.charSize', function() {

        const max = $(this).attr('maxlength');
        const id = $(this).attr('id');
        const divId = id + 'Char'; // form an ID that will match the ID on the div below textarea
        requiredText(max, id, divId);
    })

    // Dept details
    $(document).on('click', '.jobDetails', function() {
        // alert($(this).attr('id'))
        $.ajax({
            type: 'GET',
            url: 'jobTitleDec/' + $(this).attr('id'),
            // processData: false,
            contentType: 'application/json',
            success: function(response) {
                // console.log('Get department details');
                // console.log(response);
                checkPoint('none', 'jobTitleDecs');

                function getDate(date) {
                    let formt_date = new Date(date);
                    return formt_date.toLocaleDateString("en-US");
                }

                if (response) {
                    $('.appendInfo').html('');

                    let html = `
          <label class="list-group-item list-group-item-action active">Job Title and Description</label><br>
          <label style="color: white; background-color: gray;" class="list-group-item list-group-item-action">Total employee(s): ${response.totalEmp}</label><br>
          <label style="color: blue;">Job Title:</label>
          <label class="list-group-item list-group-item-action">${response.jobDesc.jobTitle}</label><br>
          <label style="color: blue;">Competencies:</label>
          <label class="list-group-item list-group-item-action">${response.jobDesc.jobDescription}</label><br>
          <label style="color: blue;">Job Summary/purpose:</label>
          <label class="list-group-item list-group-item-action">${response.jobDesc.jobSummary}</label><br>
          <label style="color: blue;">Key Duties & Responsibilities:</label>
          <label class="list-group-item list-group-item-action">${response.jobDesc.keyDutiesRespon}</label>
          `;

                    $('.appendInfo').html(html);
                    $('#jobTitleDec').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});

                }
            },
            error: function(error) {
                // checkPoint('none', 'jobTitleDecs');
                if (error.status == 500) {

                    alert(error.responseJSON.error);

                    return false;
                } else {
                    errorPage('jobTitleDecs');
                }
            }

        });
    });


    $(document).on('submit', '#addJobDec', function(e) {
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
                // console.log('In success');
                checkPoint('none', 'jobTitleDecs');
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
                    getJobTitles();
                    $('.getDept').css("color", 'blue');
                    $('#jobDescModal').modal('hide');

                }, 1000);

                console.log(response)
            },
            error: function(error) {
                // console.log('In error');
                // console.log(error)
                if (error.status === 422) {
                    $('.user-message').css('display', 'flex')
                    $('.user-message').html(error.responseJSON.errorMessage);
                    // $('.user-message').addClass("user-message user-message--error"); dose not continue so use it last.
                    $.each(error.responseJSON.validationErrors, function(key, value) {
                        $('#' + value.param).addClass(`invalid`);
                        $('.invalid').css({
                            'border-color': 'red',
                            'color': 'red'
                        });
                    })
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
                    // console.log(error);
                    errorPage('jobTitleDecs');
                    // $('.user-message').css('display', 'flex')
                    // $('.user-message').html('Sorry something went wrong, try again');
                }
            }
        });
    });

});