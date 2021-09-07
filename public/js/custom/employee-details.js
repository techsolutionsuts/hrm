function displayDetails(id, name) {
    let html = '';
    $('.mainPage').html('');
    html += `<link href="/css/employee-style.css" rel="stylesheet">`;
    html += `<link href="/css/salary-dashboard-style.css" rel="stylesheet">`;

    html += `<style>
            table, th, td {
                border: 0px solid black;
            }
            tr {
                background-color: white;
            }
        </style>`;

    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800">Employee Details</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm employeeDash"><i';
    html += 'class = "fa fa-refresh fa-sm text-white-50"> </i> Back</a>';
    html += '</div>';

    // html += '<div class="container" style="padding: 0px;">';

    // html += `< div class = "tab-content" style = "margin-top:16px; ">`;

    html += `
        <div class="row " >
            <div class="col-md-12">

                <div class="card" style="border: 1px solid #696969; padding: 10px;">
                    <div class="user-message user-message--error" style="display: none;"></div>
                    
                    <div class="card-header form-group" style="background-color: ;">
                        <select class="" id="showEmply" type="text">
                        </select>
                        </div>`;
    // console.log('ID ===> ', id);
    $.ajax({
        type: 'GET',
        url: `${$('#nyanzi').val()}/getEmployee/${id}`,
        // processData: false,
        contentType: 'application/json',
        success: function(response) {
            console.log('Data ==> ', response.employee);

            function getFulName(mName, lName) {
                if (mName) {
                    return `${mName} ${lName}`;
                }
                return `${lName}`;
            }

            html += `<div style="margin-top: 0px; float: left;"><img style="width: 10%; height: 5%; padding-left: 10px;" class="img-profile rounded-circle" src="/${response.employee[0].photo || 'img/avatar.svg'}"> </div> <div style="margin-top: -60px; font-size: 30px;"><center>Employee's Personal Details</center></div>
                        
                <table border="1" class="" style="margin-top: 60px;">
                
                        <tr style="background-color: #008a9f; color: white; font-size: 16px;">
                            <th colspan="6" width="1500"><center>Basic Information</center></th>
                        </tr>
                        <tr class="myTr" style="background-color: gray; color: white">
                            <th>Full name</th>
                            <th>Gender</th>
                            <th>Birth date</th>
                            <th>Marriage</th>
                            <th>Phone</th>
                            <th>Email</th>
                        </tr>

                        <tr class="myTr" style="background-color: white">
                            <td>${response.employee[0].title} ${response.employee[0].fName} ${getFulName(response.employee[0].mName, response.employee[0].lName)}</td>
                            <td>${response.employee[0].gender || ''}</td>
                            <td>${getDate(response.employee[0].dob)}</td>
                            <td>${response.employee[0].maritalStatus || ''}</td>
                            <td>${response.employee[0].phone || ''}</td>
                            <td>${response.employee[0].email || ''}</td>
                            
                        </tr>

                        <tr class="myTr" style="background-color: #008a9f; color: white; font-size: 16px;">
                            <th colspan="6" width="1500"><center>Address</center></th>
                        </tr>

                        <tr class="myTr" style="background-color: gray; color: white">
                            <th>Residence</th>
                            <th>Nearest Landmark</th>
                            <th>GP Address</th>
                            <th>City</th>
                            <th>Region</th>
                            <th>Postal Addres.</th>
                        </tr>

                        <tr class="myTr" style="background-color: white">
                            <td>${response.employee[0].addresses[0].residAddress || ''}</td>
                            <td>${response.employee[0].addresses[0].nearestLandmark || ''}</td>
                            <td>${response.employee[0].addresses[0].gpGPSCode || ''}</td>
                            <td>${response.employee[0].addresses[0].town || ''}</td>
                            <td>${response.employee[0].addresses[0].region || ''}</td>
                            <td>${response.employee[0].addresses[0].postAddress || ''}</td>
                        </tr>

                        <tr class="myTr" style="background-color: #008a9f; color: white; font-size: 16px;">
                            <th colspan="6" width="1500"><center>Identity</center></th>
                        </tr>

                        <tr class="myTr" style="background-color: gray; color: white;">
                            <th>Card Type:</th>
                            <th>SSNIT No.:</th>
                            <th>TIN.:</th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>

                        <tr class="myTr" style="background-color: white">
                            <td>${response.employee[0].cardType}</td>
                            <td>${response.employee[0].cardNo}</td>
                            <td>${response.employee[0].tin}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>

                        <tr class="myTr" style="background-color: #008a9f; color: white; font-size: 16px;">
                            <th colspan="6" width="1500"><center>Employment</center></th>
                        </tr>

                        <tr class="myTr" style="background-color: gray; color: white;">
                            <th>Date Employed</th>
                            <th>Staff ID.</th>
                            <th>Jod Title</th>
                            <th>Department</th>
                            <th>Immediate Supervisor</th>
                            <th></th>
                        </tr>

                        <tr class="myTr" style="background-color: white">
                            <td>${getDate(response.employee[0].dateEmplyed)}</td>
                            <td>${response.employee[0].staffID}</td>
                            <td>${(response.employee[1]) ? response.employee[1].jobTitle : ''}</td>
                            <td>${(response.employee[2]) ? response.employee[2].deptName : ''}</td>
                            <td>${(response.employee[5]) ? response.employee[5].name : ''}</td>
                            <td></td>
                        </tr>

                        <tr class="myTr" style="background-color: #008a9f; color: white; font-size: 16px;">
                        <th colspan="6" width="1500"><center>Education Background</center></th>
                        </tr>
                        <tr class="myTr" style="background-color: gray; color: white">
                        <th>Institute/School</th>
                        <th>Program</th>
                        <th>Country</th>
                        <th>Qualification</th>
                        <th>From</th>
                        <th>To</th>
                        </tr>`;
            if (response.employee[0].educationbacgrounds.length > 0) {
                for (let i = 0; i < response.employee[0].educationbacgrounds.length; i++) {

                    html += `<tr class="myTr" style="background-color: white">
                        <td>${response.employee[0].educationbacgrounds[i].institution || ''}</td>
                        <td>${response.employee[0].educationbacgrounds[i].programMajor || ''}</td>
                        <td>${response.employee[0].educationbacgrounds[i].country || ''}</td>
                        <td>${response.employee[0].educationbacgrounds[i].qualification || ''}</td>
                        <td>${getDate(response.employee[0].educationbacgrounds[i].fromMonthYear, true) || ''}</td>
                        <td>${getDate(response.employee[0].educationbacgrounds[i].toMonthYear, true) || ''}</td>
                        </tr>`;
                }
            } else {
                html += `<td colspan="6">No data found for educational background</td>`;
            }

            //Emmala: 0541379312 Prisla: 0546344620

            html += `<tr class="myTr" style="background-color: #008a9f; color: white; font-size: 16px;">
                        <th colspan="6" width="1500"><center>Working Experiences</center></th>
                        </tr>

                        <tr class="myTr" style="background-color: gray; color: white">
                        <th>Organization</th>
                        <th>Position</th>
                        <th>From</th>
                        <th>To</th>
                        <th></th>
                        <th></th>
                        </tr>`;
            if (response.employee[0].workexperiences.length > 0) {
                for (let i = 0; i < response.employee[0].workexperiences.length; i++) {

                    html += `<tr class="myTr" style="background-color: white">
                        <td>${response.employee[0].workexperiences[i].organization || ''}</td>
                        <td>${response.employee[0].workexperiences[i].position || ''}</td>
                        <td>${getDate(response.employee[0].workexperiences[i].fromMonthYear, true) || ''}</td>
                        <td>${getDate(response.employee[0].workexperiences[i].toMonthYear, true) || ''}</td>
                        </tr>`;
                }
            } else {
                html += `<td colspan="6">No data found for work experience</td>`;
            }

            html += `<tr class="myTr" style="background-color: #008a9f; color: white; font-size: 16px;">
                            <th colspan="6" width="1500"><center>Bank Details</center></th>
                        </tr>`;

            if (response.employee[0].bankdetails[0]) {
                html += `
                        <tr class="myTr" style="background-color: white;">
                            <th>Bank name</th>
                            <td>${response.employee[0].bankdetails[0].bankName || ''}</td>
                            <th>Branch</th>
                            <td>${response.employee[0].bankdetails[0].branch || ''}</td>
                            <th>Account name</th>
                            <td>${response.employee[0].bankdetails[0].accNo || ''}</td>
                        </tr>`;
            } else {
                html += `<td colspan="6">No bank details found.</td>`
            }
            html += `    
                        <tr class="myTr" style="background-color: #008a9f; color: white; font-size: 16px;">
                            <th colspan="6" width="1500"><center>Emergency Contact</center></th>
                        </tr>

                        <tr class="myTr" style="background-color: gray; color: white">
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Relation</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Details</th>
                        </tr>`;

            if (response.employee[0].emergencycontacts.length > 0) {
                for (let i = 0; i < response.employee[0].emergencycontacts.length; i++) {

                    html += `  
                        <tr class="myTr" style="background-color: white">
                        <td>${response.employee[0].emergencycontacts[i].emergName || ''}</td>
                        <td>${response.employee[0].emergencycontacts[i].emergGender || ''}</td>
                        <td>${response.employee[0].emergencycontacts[i].emergRelation || ''}</td>
                        <td>${response.employee[0].emergencycontacts[i].emergPhone || ''}</td>
                        <td>${response.employee[0].emergencycontacts[i].emergAddress || ''}</td>
                        <td hidden>${response.employee[0].emergencycontacts[i].emergIDType || ''}</td>
                        <td hidden>${response.employee[0].emergencycontacts[i].emergIDNo || ''}</td>
                        <td hidden>${response.employee[0].emergencycontacts[i].emergimage || ''}</td>
                        <td><button class="btn-sm viewEmerg">View Details</button></td>
                        </tr>`;
                }
            } else {
                html += `<td colspan="6">No data found for emergency contact.</td>`
            }
            html += `
                        <tr class="myTr" style="background-color: #008a9f; color: white; font-size: 16px;">
                            <th colspan="6" width="1500"><center>Next of Kin</center></th>
                        </tr>

                         <tr class="myTr" style="background-color: gray; color: white">
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Relation</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Details</th>
                        </tr>`;

            if (response.employee[0].nextofkin) {
                html += `
                        <tr class="myTr" style="background-color: white">
                            <td>${response.employee[0].nextofkin.nokName || ''}</td>
                            <td>${response.employee[0].nextofkin.nokGender || ''}</td>
                            <td>${response.employee[0].nextofkin.nokRelation || ''}</td>
                            <td>${response.employee[0].nextofkin.nokPhone || ''}</td>
                            <td>${response.employee[0].nextofkin.nokAddress || ''}</td>
                            <td hidden>${response.employee[0].nextofkin.nokIDType || ''}</td>
                            <td hidden>${response.employee[0].nextofkin.nokIDNo || ''}</td>
                            <td hidden>${response.employee[0].nextofkin.nokImage || ''}</td>
                            <td><button class="btn-sm viewNoK">View Details</button></td>
                        </tr>`;
            } else {
                html += `<td colspan="6">No data found for next of kin.</td>`
            }
            html += ` 

                 <tr style="background-color: #008a9f; color: white; font-size: 16px;">
                    <th colspan="6" width="1500"><center>Dependents</center></th>
                </tr>

                    <tr class="myTr" style="background-color: gray; color: white">
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Relation</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Details</th>
                    </tr>`;

            if (response.employee[0].dependants.length > 0) {
                for (let i = 0; i < response.employee[0].dependants.length; i++) {

                    html += ` 
                        <tr style="background-color: white">
                        <td>${response.employee[0].dependants[i].dependName || ''}</td>
                        <td>${response.employee[0].dependants[i].dependGender || ''}</td>
                        <td>${response.employee[0].dependants[i].relation || ''}</td>
                        <td>${response.employee[0].dependants[i].dependPhone || ''}</td>
                        <td>${response.employee[0].dependants[i].dependAddress || ''}</td>
                        <td hidden>${getDate(response.employee[0].dependants[i].dependDOB) || ''}</td>
                        <td hidden>${response.employee[0].dependants[i].dependIDType || ''}</td>
                        <td hidden>${response.employee[0].dependants[i].dependIDNo || ''}</td>
                        <td hidden>${response.employee[0].dependants[i].dependimage || ''}</td>
                        <td><button class="btn-sm viewDepend">View Details</button></td>
                        </tr>`;

                }
            } else {
                html += `<td colspan="6">No data found for dependance.</td>`
            }
            html += `
                        <tr style="background-color: #008a9f; color: white; font-size: 16px;">
                            <th colspan="6" width="1500"><center>SSNIT Beneficiary</center></th>
                        </tr>
                        <tr class="myTr" style="background-color: gray; color: white">
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Relation</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Details</th>
                    </tr>`;

            if (response.employee[0].ssnitbenfits.length > 0) {
                for (let i = 0; i < response.employee[0].ssnitbenfits.length; i++) {

                    html += ` 
                        <tr style="background-color: white">
                            <td>${response.employee[0].ssnitbenfits[i].benName || ''}</td>
                            <td>${response.employee[0].ssnitbenfits[i].benfGender || ''}</td>
                            <td>${response.employee[0].ssnitbenfits[i].benRelation || ''}</td>
                            <td>${response.employee[0].ssnitbenfits[i].benPhone || ''}</td>
                            <td>${response.employee[0].ssnitbenfits[i].benAddress || ''}</td>
                            <td hidden>${getDate(response.employee[0].ssnitbenfits[i].benfDOB) || ''}</td>
                            <td hidden>${response.employee[0].ssnitbenfits[i].benIDType || ''}</td>
                            <td hidden>${response.employee[0].ssnitbenfits[i].benIDNo || ''}</td>
                            <td hidden>${response.employee[0].ssnitbenfits[i].benfImage || ''}</td>
                            <td hidden>${response.employee[0].ssnitbenfits[i].percentage || ''}</td>
                            <td><button class="btn-sm viewBenf">View Details</button></td>
                        </tr>`;
                }
            } else {
                html += `<td colspan="6">No data found for SSNIT beneficiaries.</td>`
            }
            html += `
                        </table>
                        </div>
                    </div>
                </div>
            <!-- </div> -->`;
            $('.mainPage').html(html);
            $("#loader").hide();
            getEmployees('showEmply', id, name);
        },
        error: function(error) {
            if (error.status == 500) {
                // console.log('Am here =>', error.responseJSON.error);

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
                errorPage('emplyDetails');
            }
            $("#loader").hide();
        }
    });

    // html += `<div class="row">`;
}

$(document).ready(function() {
    $(document).on('keyup', "#myInputTr", function() {
        var value = $(this).val().toLowerCase();
        $(".myTr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $(document).on('change', '#showEmply', function() {
        // alert($('#showEmply option:selected').text());
        $("#loader").show();
        displayDetails($(this).val(), $('#showEmply option:selected').text());
    });

    function pushDetails(mesg, data) {
        let html = '';
        html += `<a href="#" class="list-group-item list-group-item-action active">${mesg}</a>`;
        html += '<a href="#" class="list-group-item list-group-item-action"><strong>Person Info</strong></a>';
        html += `<a href="#" class="list-group-item list-group-item-action disabled"><div style="margin-top: 0px; text-align: center;"><img style="width: 20%; height: 10%; padding-left: 10px;" class="img-profile rounded-circle" src="/${data[7] || 'img/avatar.svg'}"> </div></a>`;
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Full Name: ' + data[0] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Gender: ' + data[1] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Relation: ' + data[2] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action"><strong>Contact Details</strong></a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Phone number: ' + data[3] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Address: ' + data[4] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action"><strong>Identity</strong></a>';

        // html += '<a href="#" class="list-group-item list-group-item-action disabled mode"></a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Card Type: ' + data[5] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Card No.: ' + data[6] + '</a>';

        return html;
    }

    $(document).on('click', '.viewEmerg', function() {
        $tr = $(this).closest('tr');
        let data = $tr.children("td").map(function() {
            return $(this).text();
        }).get();
        // console.log("Data tr ====> ", data);
        $('.appendDetails').html('');

        $('.appendDetails').html(pushDetails('Emergency Contact Details', data));
        $('#subDetail').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    });

    $(document).on('click', '.viewNoK', function() {
        $tr = $(this).closest('tr');
        let data = $tr.children("td").map(function() {
            return $(this).text();
        }).get();
        // console.log("Data tr ====> ", data);

        $('.appendDetails').html('');

        $('.appendDetails').html(pushDetails('Next of Kin Detail', data));
        $('#subDetail').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    });

    $(document).on('click', '.viewDepend', function() {
        $tr = $(this).closest('tr');
        let data = $tr.children("td").map(function() {
            return $(this).text();
        }).get();
        // console.log("Data tr ====> ", data);
        $('.appendDetails').html('');

        let html = '';
        html += `<a href="#" class="list-group-item list-group-item-action active">Dependant Details</a>`;
        html += '<a href="#" class="list-group-item list-group-item-action"><strong>Person Info</strong></a>';
        html += `<a href="#" class="list-group-item list-group-item-action disabled"><div style="margin-top: 0px; text-align: center;"><img style="width: 20%; height: 10%; padding-left: 10px;" class="img-profile rounded-circle" src="/${data[8] || 'img/avatar.svg'}"> </div></a>`;
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Full Name: ' + data[0] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Gender: ' + data[1] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Birth date: ' + data[5] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Relation: ' + data[2] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action"><strong>Contact Details</strong></a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Phone number: ' + data[3] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Address: ' + data[4] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action"><strong>Identity</strong></a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Card Type: ' + data[6] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Card No.: ' + data[7] + '</a>';

        $('.appendDetails').html(html);
        $('#subDetail').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    });

    $(document).on('click', '.viewBenf', function() {
        $tr = $(this).closest('tr');
        let data = $tr.children("td").map(function() {
            return $(this).text();
        }).get();
        // console.log("Data tr ====> ", data);
        $('.appendDetails').html('');

        let html = '';
        html += `<a href="#" class="list-group-item list-group-item-action active">Beneficiary Details</a>`;
        html += '<a href="#" class="list-group-item list-group-item-action"><strong>Person Info</strong></a>';
        html += `<a href="#" class="list-group-item list-group-item-action disabled"><div style="margin-top: 0px; text-align: center;"><img style="width: 20%; height: 10%; padding-left: 10px;" class="img-profile rounded-circle" src="/${data[8] || 'img/avatar.svg'}"> </div></a>`;
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Full Name: ' + data[0] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Gender: ' + data[1] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Birth date: ' + data[5] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Relation: ' + data[2] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action"><strong>Contact Details</strong></a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Phone number: ' + data[3] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Address: ' + data[4] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action"><strong>Identity</strong></a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Card Type: ' + data[6] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Card No.: ' + data[7] + '</a>';
        html += '<a href="#" class="list-group-item list-group-item-action disabled">Percentage: ' + data[9] + '</a>';

        $('.appendDetails').html(html);
        $('#subDetail').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    });
});