function drawCalendar(data) {

    // calendar.render();
    var calendarEl = document.getElementById('calendar');

    console.log('Data =>', data);
    // document.addEventListener('DOMContentLoaded', function() {
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        initialDate: data.start, //'2021-03-07',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: data
            // console.log('');
    });

    calendar.render();

    calendar.addEvent(data)

    // });
}

function calendarManager() {
    $('title').html('Manage Calendar');
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
    html += '<h6 class="h3 mb-0 text-gray-800"><i class="fas fa-calendar-alt" aria-hidden="true"></i> Manage Calendar</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm calendManager" id="<%= userDetails[0] %>"><i';
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Reload page</a>';
    html += '</div>';


    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;

    html += `<div class="panel-heading" style="font-size: 15px; background: #A52A2A; color: white">
    Add any public or special holidays, all holidays will be used during the payroll calculations, please do not add birthdays, event etc. which will not be used in the payroll.
    </div>`;

    // html += `<div class="panel-body">`;

    html += `<div class="modal-body" style="border: 2px solid gray;">
    <form action="calibrate-events" method="POST" id="calibrateEvents" >
        <input type="hidden" name="_csrf" id="_csrf" value="${$('#crsf').val()}">

        <div class="row" style="background-color:899; border: 1px solid #778899;">
            <div class=" col-lg-4 col-md-4">
                <div class="form-group" style="background-color: #B0C4DE;">
                <label style="background-color: #008a9f;" class="list-group-item list-group-item-action active">Public Holidays list for ${new Date().getFullYear()}</label>
                <select multiple type="text" name="thisYearEvents" id="thisYearEvents" class="form-control">
                    `;

    $.ajax({
        type: 'GET',
        url: 'all-calendar-events',
        // processData: false,
        contentType: 'application/json',
        success: function(response) {

            // checkPoint('none', 'getDept');
            // console.log('Get department list');

            if (response.thisYear.length === 0) {
                html += `<option value=""><label style="color: red;">No holiday for ${new Date().getFullYear()}</label></option>`;
            }
            $.each(response.thisYear, function(key, value) {
                // console.log(
                html += `<option value="${value.id} | ${value.event} | ${value.evtdate} | ${value.occur}">${value.event}  ${value.date}</option>`;
            });

            html += `
                    </select>
                </div>

                <label style="background-color: #483D8B;" class="list-group-item list-group-item-action active">Manage calendar</label>

                <div id="shiftDetails" style="display: block; padding: 10px; border: 1px solid #778899;">

                <div class="form-group" style="background-color: #B0C4DE;">
                <a href="#" style="background-color: #DCDCDC;" class="list-group-item list-group-item-action addEvent"><i class="fas fa-plus"></i> Add holiday</a>
                </div>

                <div class="form-group" style="background-color: #B0C4DE;">
                <a href="#" style="background-color: #DCDCDC;" class="list-group-item list-group-item-action updateEvent">Update</a>
                </div>

                <div class="form-group allEvents" style=" display: none; background-color: #B0C4DE;">
                <select type="text" name="eventsUpdate" id="eventsUpdate" class="form-control">
                
                
                `;
            if (response.thisYear.length === 0) {
                html += `<option value=""><label style="color: red;">No holiday for ${new Date().getFullYear()}</label></option>`;
            } else {
                html += `<option value="">Select to update</option>`;
            }

            $.each(response.thisYear, function(key, value) {
                // console.log(
                html += `<option value="${value.id} | ${value.event} | ${value.date} | ${value.occur}">${value.event}  ${value.date}</option>`;
            });

            html += `    
                    </select>
                </div>

                </div>

                <hr>
                
                <div class="form-group" style="background-color: #B0C4DE;">
                <label style="background-color: #7B68EE;" class="list-group-item list-group-item-action active">Previous holidays</label>
                    <select multiple type="text" name="previousEvents" id="previousEvents" class="form-control">`;

            if (response.previousYear.length === 0) {
                html += `<option value=""><label style="color: red;">No holiday for past years</label></option>`;
            }

            $.each(response.previousYear, function(key, value) {
                // console.log(
                html += `<option value="${value.id} | ${value.event} | ${value.evtdate} | ${value.occur}">${value.event}  ${value.date}</option>`;
            });

            html += `
                    </select>
                </div>

                <label style="background-color: #9370DB;" class="list-group-item list-group-item-action active">Calibrate previous holidays</label>
               
                <div id="shiftDetails" style="display: block; padding: 10px; border: 1px solid #778899;">

                <select required type="text" name="calibrateYear" id="calibrateYear" class="form-control">`;

            if (response.caliYear.length === 0) {
                html += `<option value="">No holiday for past years</option>`;
            } else {
                html += `<option value="">Select year to calibrate from</option>`;
            }

            $.each(response.caliYear, function(key, value) {
                // console.log(
                html += `<option value="${value}">${value}</option>`;
            });

            html += `
                </select>
                <hr>
                <div class="input-group form-group" style="background-color: #D3D3D3;">
                <select required multiple type="text" name="calibrateEvent" id="calibrateEvent" class="form-control">
                    
                </select>
                <div class="input-group-append">
                <button class="btn btn-primary caliTo" type="submit">
                <i class="fas fa-plus-circle fa-sm"></i>
                </button>
                </div>
            </div>
            <span id="error_calibrateEvent" class="text-danger"></span>
            </div>
                    
        </div>
      <div class=" col-lg-8 col-md-8" id="calendar">
            
        </div>

      </div>
      </form>
                    </div>
                    </div>
                    </div>
                    </div>`;

            $('.mainPage').html(html);
            $("#loader").hide();

            unactive();
            $('.calendManager_blue').css("color", 'blue');

            //holidays events
            const data = response.birthdays;
            drawCalendar(data.map(obj => {
                return {
                    title: obj.event,
                    start: obj.evtdate,
                    // allDay: true
                }
            }));
        },
        error: function(errors) {
            // console.log('error => ', errors);
            $("#loader").hide();
        }
    });

    // });
    // $('.addThis').prop('disabled', true);
}

$(document).ready(function() {

    $(document).on('click', '.calendManager', function () {
        $("#loader").show();
        calendarManager();
    });

    $(document).on('click', '.updateEvent', function() {
        $('title').html('Update Holiday Event');

        const state = $(this).text();

        if (state == 'Update') {
            $('.allEvents').show();
            $(this).html('Hide');
            //fill the select tag with all events
            return false;
        }

        if (state == 'Hide') {
            $('.allEvents').hide();
            $(this).html('Update');
            return false;
        }
    });

    $(document).on('click', '.addEvent', function() {

        $('.addEvent-title').html('<i class="fas fa-plus"></i> Add New Holiday');
        $('.user-message').css({
            'border-color': '',
            'color': 'white',
            'background-color': '',
            'display': 'none'
        });
        $('#occur').val('');
        $('#eventDate').val('');
        $('#eventName').val('');

        $('#eventMode').val('add');

        logUIAccess('View add holiday event modal', '.addEvent');

        $('#addEventModal').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});

    });

    $(document).on('submit', '#addEvent', function(e) {
        e.preventDefault();

        let form = $(this)[0];
        let data = new FormData(form);

        let saveEvent = submit(data, $(this).attr('action'), 'POST');

        saveEvent.done(function() {
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
                $('#addEventModal').modal('hide');
                calendarManager();
            }, 1000);
        })
    });

    $(document).on('change', '#eventsUpdate', function() {
        if ($('#eventsUpdate').val() !== '') {
            // alert('Please select an event');

            $('.addEvent-title').html('<i class="fas fa-edit"></i> Edit Holiday');
            $('.user-message').css({
                'border-color': '',
                'color': 'white',
                'background-color': '',
                'display': 'none'
            });

            let data = $(this).val().split(' | ');
            console.log('Data => ', data);

            $('#eventName').val(data[1]);

            $('#eventDate').prop("type", "text");
            $('#eventDate').val(data[2]);

            $('#occur').html($("<option></option>").attr("value", (data[3] == 'Yearly') ? 0 : 1).text(`${data[3]}`));
            $('#occur').append($("<option></option>").attr("value", 1).text(`Once`));
            $('#occur').append($("<option></option>").attr("value", 0).text(`Yearly`));

            $('#eventMode').val('edit');
            $('#eventId').val(data[0]);

            $('#addEventModal').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
            return false;
        }
        // data = data.split(' | ');

        // alert(data);
    });

    $(document).on('change', '#calibrateYear', function() {
        console.log('Date => ', $(this).val());
        if ($(this).val() !== '') {
            if ($(this).val() == new Date().getFullYear()) {
                alert('Sorry this year cannot be selected.');
                return false;
            }
            getPastYearsEvents('calibrateEvent', $(this).val());
        } else {
            $('#calibrateEvent').html($("<option></option>").attr("value", '').text(``));
        }

    });

    $(document).on('submit', '#calibrateEvents', function(e) {
        e.preventDefault();

        let form = $(this)[0];
        let data = new FormData(form);

        const calibrateEvent = submit(data, $(this).attr('action'), 'POST');

        calibrateEvent.done(function() {

            setTimeout(function() {
                calendarManager();
            }, 1000);
        })
    });

    $(document).on('change', '#thisYearEvents', function() {
        if ($(this).val() != '') {

            console.log('Val => ', $(this).val());

            let getData = $(this).val()[0].split(' | ');
            let data = { title: getData[1], start: getData[2] }
            drawCalendar(data);
            // alert(getData[2]);
        }
    });

    $(document).on('change', '#previousEvents', function() {
        if ($(this).val() != '') {

            console.log('Val => ', $(this).val());

            let getData = $(this).val()[0].split(' | ');
            let data = { title: getData[1], start: getData[2] }
            drawCalendar(data);
            // alert(getData[2]);
        }
    })

});