function showSettings(data) {
    $('title').html('Basic system settings');
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
    html += '<h6 class="h3 mb-0 text-gray-800"><i class="fas fa-tools"></i> Basic system settings</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm settings" id="<%= userDetails[0] %>"><i';
    html += 'class = "fas fa-plus fa-sm text-white-50"> </i> Reload</a>';
    html += '</div>';

    // html += '<div class="container" style="padding: 0px;">';
    // html += `<div class="tab-content" style="margin-top:16px; ">`;
    html += `<div class="tab-pane active" id="basic_info">`;
    html += `<div class="panel panel-default">`;

    html += `<div class="panel-heading" style="font-size: 15px; background: #008a9f; color: white"></div>`;

    html += `<div class="panel-body">`;


    html += `<form action="systemSettings" method="POST" id="systemSettings">`;
    html += `<div class="row" style="background-color:white;">`;

    $.ajax({
        type: 'GET',
        url: 'getSettings',
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            checkPoint('none', 'getSettings');
            // console.log('Data => ', response.data);
            // if (response.data.length == 0) {
            // }

            html += `<div class="col-lg-6 col-md-6">`;
            html += `<div class="form-group"><label class="lab">Staff ID generation:</label>`;
            html += `<select required type="text" name="staffIDgen" id="staffIDgen">
                <option >${response.data[1].value} ${(response.data[1].value == 'Auto')? 'generate staff ID':'staff ID entry'}</option>
            <option value="Auto">Auto generate staff ID</option>
            <option value="Manual">Manual staff ID entry</option></select><span id="error_staffIDgen" class="text-danger"></span>`;
            html += `</div></div>`;

            html += `<div class="col-lg-6 col-md-6">`;

            html += `<div class="form-group"><label class="lab">Allow manual clocking within:</label>`;
            html += `<select required type="text" name="amanclock" id="amanclock">
    <option value="${response.data[0].value}">${response.data[0].value} hours</option>
    <option value="24">24 hours</option>
    <option value="48">48 hours</option>
    <option value="72">72 hours</option>
    </select>
      <span id="error_amanclock" class="text-danger"></span>`;
            html += `
    </div>
    <div>
      <input type="hidden" name="_csrf" value="${$('#crsf').val()}">
      <button type="submit" class="btn btn-success btn-sm"><i class="fa fa-edit"></i> Update</button>
    </div></div>
     </form>
    </div>`;
            html += `<br>`;

            //Employee details

            html += `</div>`;
            // html += `</div>`;

            html += `</div>`;
            // html += `</div>`;
            $('.mainPage').html(html);
            $("#loader").hide();
        },
        error: function(error) {}
    });
}

$(document).ready(function() {

    $(document).on('click', '.settings', function() {
        // $('title').html('System basic settings');
        $("#loader").show();
        showSettings();
        unactive();
        $('.settings').css("color", 'blue');
    });

    $(document).on('submit', '#systemSettings', function(e) {
        e.preventDefault();
        // alert('All set for now');
        let form = $(this)[0];
        let data = new FormData(form);
        let updateSettings = submit(data, $(this).attr('action'), 'POST');

        updateSettings.done(function(response) {
            console.log('In success', response.data);
            $("#loader").show();
            showSettings();
            unactive();
            $('.settings').css("color", 'blue');
        });
    });
});