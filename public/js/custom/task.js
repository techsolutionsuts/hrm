function getTasks() {
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
    html += '<h6 class="h3 mb-0 text-gray-800"><i class="fa fa-tasks"></i> Task list</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm getTasks"><i';
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Reload Page</a>';
    html += '</div>';
    html += `<div class="row">`;
    html += `<div class=" col-lg-12 col-md-12">`;

    // html += `<div class = "tab-content" style = "margin-top:16px; ">`;
    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;
    html += `<div class="panel-heading" style="font-size: 15px;">Tasks</div>`;
    // html += `<label class="user-message user-message--error" style="display: none;"></label>`;
    html += `<div class="panel-body" style="padding: 0px;">`;
    html += `<div class="card-header form-group" style="background-color: ;">
                        <input class="" id="myInput" type="text" placeholder="Search task record by anything..">
                    </div>`;
    html += `<button style="float: right; margin: 0px;" class="btn btn-primary add-task btn-sm"><i class="fas fa-plus"></i> Add Task</button><br>`;

    html += '<table class="table mt-3 table-hover sticky table-condensed" id="taskdatatable" style="">';
    html += '<thead class="table-dark" style="background-color:#008a9f;">';
    html += '<tr>';

    html += '<th>Date</th>';
    html += '<th>Task</th>';
    html += '<th>Assigned To</th>';
    html += '<th>Due Date</th>';
    html += '<th>Status</th>';
    html += '<th>Manage</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody style="background-color: white;" class="myTable">';
    $.ajax({
        type: 'GET',
        url: `${$('#nyanzi').val()}/getTasks`,
        // processData: false,
        contentType: 'application/json',
        success: function (response) {
            if (response.data.length === 0) {
                html += `<td colspan="7" style="color: red;">No task data found</td>`;
            }
            $.each(response.data, function(key, value) {
                html += '<tr>';
                html += `<td>${value.date}</td>`;
                html += `<td><b>${value.task}</b><br><p class="truncate">${value.desc}</p></td>`;
                html += `<td>${value.assignedto}</td>`;
                html += `<td>${value.duedate}</td>`;
                html += `<td>`;
                if (value.status == 0) {
                    html += `<span class="badge badge-info">Pending</span>`;
                }
                if (value.status == 1) {
                    html += `<span class="badge badge-success">Completed</span>`;
                }
                if (value.overDue) {
                    html += `<span class="badge badge-danger">Over Due</span>`;
                }
                html += `</td>`;

                html += `<td hidden>${value.taskid}</td>`;
                html += `<td hidden>${value.employeeId}</td>`;
                html += `<td hidden>${value.desc}</td>`;
                html += `<td hidden>${value.status}</td>`;
                html += `<td hidden>${value.task}</td>`;
                html += `<td hidden>${value.date2}</td>`;
                html += `<td hidden>${value.duedate2}</td>`;
                html += `<td hidden>${value.toMe}</td>`;
                html += `<td hidden>${value.dateComp}</td>`;
                html += `<td hidden>${(value.overDue)?1:0}</td>`;

                html += `<td class="actions">
            
                        <button type="button" class="btn btn-default btn-sm btn-flat border-info wave-effect text-info dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
		                      Action
		                    </button>
                            <div class="dropdown-menu" style="">
		                    	<a class="dropdown-item taskDetails" id='${value.desc}' href="javascript:void(0)" data-id="">View Task</a>
                                <div class="dropdown-divider"></div>
                                `;
                                if (value.status == 0) {
                                     html += `
                                    <a class="dropdown-item addProgress" href="javascript:void(0)" data-id="">Add Progress</a>
                                    `;
                                }
                            if(value.countProgress){
                                html += `
		                    	 <div class="dropdown-divider"></div>
		                    	<a class="dropdown-item viewTaskProgress" id="${value.taskid}" href="javascript:void(0)" data-id="${value.task}">View progress</a>`;
                                }
                                 
                                html += `<div class="dropdown-divider"></div>`;
                                if ($('#userRole').val() !== 'STDU') {
                                    if (value.status == 0) {
                                        html += `
                                        <a class="dropdown-item editTask" href="javascript:void(0)" id='${value.desc}'  data-id="">Edit Task</a> 
                                        <div class="dropdown-divider"></div>  
                                        <a style="color: red;" id="${value.taskid}" class="dropdown-item delTask" data-pid='' data-tid='' data-task=''  href="javascript:void(0)">Delete Task</a>`;
                                    }
                                }
                                if ($('#userRole').val() == 'STDU') {
                                    if (value.toMe && value.status == 0) {
                                        html += `
                                        <a class="dropdown-item editTask" href="javascript:void(0)" id='${value.desc}'  data-id="">Edit Task</a> 
                                        <div class="dropdown-divider"></div>  
                                        <a style="color: red;" id="${value.taskid}" class="dropdown-item delTask" data-pid='' data-tid='' data-task=''  href="javascript:void(0)">Delete Task</a>`;
                                    }
                                }
                            html +=`
								</div>
            </td>`;
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
                errorPage('getTasks');
                $("#loader").hide();
                // getEmployees('deptHead', '', ''); // called from general-funct.js
            }
            // }
        }

    });
}

$(document).ready(function() {

    $(document).on('click', '.getTasks', function() {
        $('title').html('Task list');
        unactive();
        $(this).css("color", 'blue');
        $("#loader").show();
        getTasks();
        $('#taskdatatable').dataTable();
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

    $(document).on('submit', '#addTask', function(e) {
        e.preventDefault();
        let form = $(this)[0];
        let data = new FormData(form);
        let addTask = submit(data, `${$('#nyanzi').val()}/${$(this).attr('action')}`, 'POST');
        addTask.done(function(response) {
            $('title').html('Task list');
            $('#taskModal').modal('hide');
            $('.getTasks').css("color", 'blue');
            $("#loader").show();
            getTasks();
        })
    });

    $('.summernote').summernote({
        placeholder:'Type your content',
        height: 200,
        // color: 'black',
        // codemirror: { // codemirror options
        // theme: 'monokai'
        // },
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
            ['fontname', ['fontname']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ol', 'ul', 'paragraph', 'height']],
            ['table', ['table']],
            ['view', ['undo', 'redo', 'fullscreen', 'codeview', 'help']]
        ]
    });

    $(document).on('click', '.add-task', function () {
        const ddt = $('#ddT').val();
        $('.task-title').html('<i class="fas fa-plus"></i> Add Task');
        $('.user-message').css({
            'border-color': '',
            'color': 'white',
            'background-color': '',
            'display': 'none'
        });

        $('#taskName').val('');
        $('#dueDate').prop("type", "date");
        if ($('#userRole').val() == 'Admin') {
            getEmployees('assignTo', '', '');
        }
        if ($('#userRole').val() == 'HOD') {
            getDeptEmployees('assignTo', '', '', '', ddt);
        }
        if ($('#userRole').val() == 'STDU') {
            
        $('#assignTo').html($("<option></option>").attr("value", $('#userui').val()).text($('.getUsr').html()));
        }

        logUIAccess('View add task modal', '.add-task');
        $('#taskMode').val('addMode');
        $('#taskID').val('');
        $("#taskDescript").summernote("code", "");
        $("#taskDescript").summernote("color", "black");
        
        $('#taskModal').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
                        focus: true
        });
    });

    $(document).on('change', '#dueDate', function () {
        let dt1 = new Date().toDateString();
        let dt2 = new Date($(this).val()).toDateString();
        const date = Math.floor(new Date(dt1) / 1000);
        const dueDate = Math.floor(new Date(dt2) / 1000);
        console.log('Time => ', dt1, dt2);
        if (dueDate < date) {
            $('#error_dueDate').html("Date cannot be less than today's date");
        }
        else {
            $('#error_dueDate').html("");
        }
    });

    

    $(document).on('click', '.editTask', function () {
        $('.task-title').html('<i class="fas fa-edit"></i> Edit Task');
        $('.user-message').css({
            'border-color': '',
            'color': 'white',
            'background-color': '',
            'display': 'none'
        });
            logUIAccess(`Click on edit task`, '.editTask');
            const desc = $(this).attr('id');
            $tr = $(this).closest('tr');
            let data = $tr.children("td").map(function () {
                return $(this).text();
            }).get();
                if ($('#userRole').val() == 'Admin') {
                    getEmployees('assignTo', data[6], data[2], data[6]);
                }
                if ($('#userRole').val() == 'STDU') {
                    $('#assignTo').html($("<option></option>").attr("value", data[12]).text(data[2]));
                }

                $('#taskName').val(data[9]);
                $("#taskDescript").summernote("code", desc);
                $('#dueDate').prop("type", "text");
                $('#dueDate').val(data[3]);
                $('#taskID').val(data[5]);
                $('#taskMode').val('editMode');
                $('#taskModal').modal({
                    show: true,
                    backdrop: 'static',
                    keyboard: false,
                    focus: true
                });
    });

    $(document).on('click', '.taskDetails', function () {
        $tr = $(this).closest('tr');
        let data = $tr.children("td").map(function () {
            return $(this).text();
        }).get();
        const desc = $(this).attr('id');

        let html = `<h2 style="text-align: center;">${data[9]} </h2> <hr class="">
                    <div class="row" style="background-color:899;">
                    <div class=" col-lg-6 col-md-6">

                    <label class="lab"><i class="fa fa-calendar"></i> Date Created</label><hr class="hr">
                    <label>${data[0]}</label> <hr class="hr">

                    <label class="lab"><i class="fa fa-user"></i> Assigned To</label><hr class="hr">
                    <label>${data[2]}</label> <hr class="hr">    

                    <label class="lab"><i class="fa fa-file"></i> Description</label><hr class="hr">
                    <label style="color:black;">${desc}</label>
                    </div>

                    <div class=" col-lg-6 col-md-6">
                    <label class="lab"> <i class="fa fa-calendar"></i> Due Date</label><hr class="hr">
                    <label>${data[3]} </label> <hr class="hr"> `;
                     
                     if(+data[8] == 1){
                        html += `<label class="lab"> <i class="fa fa-calendar"></i> Date Completed</label><hr class="hr">
                        <label>${data[13]} </label> <hr class="hr">`;
                     }
        
                    html +=`<label class="lab"><i class="fa fa-tape"></i> Status</label><hr class="hr"> <label>`;
                    if (+data[8] == 0) {
                        html += `<span class="badge badge-info">Pending</span>`;
                    }
                    if (+data[8] == 1) {
                        html += `<span class="badge badge-success">Completed</span>`;
                    }
                    if (+data[14]) {
                        html += `<span class="badge badge-danger">Over Due</span>`;
                    }
        // <label>${data[4]}</label>
        html += `</label>
                    </div> 
                    </div>`;
        $('.appendTaskContent').html(html);

        $('#taskDetailModal').modal({
            show: true,
            backdrop: 'static',
            keyboard: false,
            focus: true
        });
    });

    $(document).on('click', '.addProgress', function () {
        $('.taskPro-title').html('<i class="fas fa-plus"></i> Add Progress');
        $('.user-message').css({
            'border-color': '',
            'color': 'white',
            'background-color': '',
            'display': 'none'
        });
        logUIAccess(`Click on add task progress`, '.addProgress');
        const desc = $(this).attr('id');
        $tr = $(this).closest('tr');
        let data = $tr.children("td").map(function () {
            return $(this).text();
        }).get();
        // if ($('#userRole').val() == 'Admin') {
        //     getEmployees('assignTo', data[6], data[2], data[6]);
        // }
        $('#taskTaskName').val(data[9]);
        $('#taskAssignTo').val(data[2]);
        $('#taskDueDate').val(data[3]);
        $('#taskProID').val(data[5]);
        $('#taskProgressModal').modal({
            show: true,
            backdrop: 'stastic',
            keyboard: false,
            focus: true
        });
    });

    $(document).on('submit', '#addProgress', function (e) {
        e.preventDefault();
        let form = $(this)[0];
        let data = new FormData(form);
        let addTask = submit(data, `${$('#nyanzi').val()}/${$(this).attr('action')}`, 'POST');
        addTask.done(function(response) {
            $('title').html('Task list');
            $('#taskProgressModal').modal('hide');
            $('.getTasks').css("color", 'blue');
            $("#loader").show();
            getTasks();
        })
    });
    $(document).on('click', '.delTask', function () {
      
        const delMsg = 'Are you SURE you want to delete this Task' + '\n' +
            'Once deleted, cannot be recovered' + '\n' +
            'and all information related to this task will be lost as well.' + '\n' + 'Such as progress reports.';
        if (confirm(delMsg)) {
            const taskId = $(this).attr('id');
            console.log('Id => ', taskId);

            let delTask = getSubmit(`${$('#nyanzi').val()}/del-task/${taskId}`);
            delTask.done(function (response) {
                $('title').html('Task list');
                $('.getTasks').css("color", 'blue');
                $("#loader").show();
                getTasks();
            })
        }
    });

    $(document).on('click', '.viewTaskProgress', function () {
        $('title').html('Task list');
        $('.getTasks').css("color", 'blue');
        $("#loader").show();
        let getProgress = getSubmit(`${$('#nyanzi').val()}/view-task-progress/${$(this).attr('id')}`);
        let html = `<h2 style="text-align: center;">${$(this).attr('data-id')} </h2> <hr class="">
          <div class="container-fluid">
	        <div id="post-field" class="scroll-div">`;
        getProgress.done(function (response) {
            let data = response.data;
            $.each(data, function (key, value) {
                html += progress([value.date, value.name, value.image, value.desc]);
            })
            html += `</div>
                    </div>`;
            $('.appendTaskContent').html(html);
            $("#loader").hide();
        });
        $('#taskDetailModal').modal({
                show: true,
                backdrop: 'stastic',
                keyboard: false,
                focus: true
            });
    });
})

{/* <select class="getTaskOptions" id="${value.id}">
                <option value="">Select option</option>
                <option value="taskDetails_${value.id}">Details</option>
                <option value="viewTaskProgress_${value.id}">View progress</option>`;
                    if (value.status == 0) {
                        html += `
                            <option value="editTask_${value.id}">Edit</option>`;
                    }
                if ($('#userRole').val() !== 'STDU') {
                    if (value.status == 0) {
                        html += `
                            <option value="delTask_${value.id}">Delete</option>`;
                    }
                }
                html += `
            </select> */}