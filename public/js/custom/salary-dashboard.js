let getTaxData = [];
let getSSNITData = [];

function displayDash(showTab) {
    let html = '';
    $('.mainPage').html('');
    html += `<link href="/css/employee-style.css" rel="stylesheet">`;
    html += `<link href="/css/salary-dashboard-style.css" rel="stylesheet">`;

    html += '<div class="d-sm-flex align-items-center justify-content-between mb-2">';
    html += '<h6 class="h3 mb-0 text-gray-800"><i class="fa fa-cash-register fa-1x text-black-300"></i> Salary Dashboard</h6>';
    html += '<a href="#" data-toggle="modal" data-target="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm salaryDash"><i';
    html += 'class = "fa fa-refresh fa-sm text-white-50"> </i> Reload Page</a>';
    html += '</div>';
    // html += '<div class="container" style="padding: 0px;">';
    html += `
        <div class="row " >
            <div class="col-md-12">

                <div class="card" >
                    <div class="card-header addHeader" style="background-color: ; color: blue;">
                        Salary Structure
                    </div>
                </div>
            </div>
        </div>`;

    // html += `</div>`;

    html += `<div class="row">`;
    html += `<div class="col-md-12">`;

    // html += `<div class = "tab-content" style = "margin-top:16px; ">`;
    html += `<div class="card scroll-di">`;
    html += `<div class="card-header" style="background-color: ;">`;
    // html += `<div class="card-body" style="background-color: ; margin: 0px;">`;

    html += `<div class="show-content" style="height: 100%; border: 2px solid #4682B4; border-radius: 20px 20px 0px 0px; padding: 10px;">
                    
              </div>
                    
              <div class="tab">
                <button class="btn btn-primary tablinks ${(showTab === 'Salary') ? 'active' :''}" value="Salary" style="border-radius: 0px 0px 0px 0px;"><i class="fas fa-money-check-alt"></i> Salary Structure</button>
                    <button class="btn btn-primary tablinks ${(showTab === 'Allowance') ? 'active' :''}" value="Allowance"><i class="fas fa-hand-holding-usd"></i> Allowance</button>
                    <button class="btn btn-primary tablinks ${(showTab === 'Tax') ? 'active' :''}" value="Tax"><i class="fas fa-balance-scale"></i> Tax</button>
                    <button class="btn btn-primary tablinks ${(showTab === 'SSNIT') ? 'active' :''}" value="SSNIT"><i class="fas fa-shield-alt"></i> SSNIT</button>
              </div>`;
    $.ajax({
        type: 'GET',
        url: 'salaryStructures',
        // processData: false,
        contentType: 'application/json',
        success: function(response) {

            checkPoint('none', 'salaryDash');

            // console.log('Get department list');

            function getDate(date) {
                let formt_date = new Date(date);
                return formt_date.toLocaleDateString("en-US");
            }

            // $.each(response.compiledData, function(key, value) {

            html += `<div id="Salary" class="tabcontent ${(showTab === 'Salary') ? 'active' :''}" style="display:${(showTab === 'Salary') ? 'block' :'none'};">
                          <h6>Salary Structure</h6>
                          <button style="float: right;" class="btn btn-primary add-salary-form btn-sm"><i class="fas fa-plus"></i> Add New</button><br>
                          <div class="form-group"><input class="form-form-group" id="salaryInput" type="text" placeholder="Search record by anything.."></div>
                          
                          <div class="scroll-div">
                          <table class="layout display responsive-table">
                            <thead class="table-dark" style="background-color:#008a9f;">
                              <tr>
                                <!-- <th>Jod Title</th> -->
                                <th>Grade/Group</th>
                                <th>Notch</th>
                                <th>Description</th>
                                <th>Base_Salary</th>
                                <th>Total_Employees</th>
                                <th>Total_Allowance</th>
                                <th>Total_AftT1BeforeTax</th>
                                </tr>
                                </thead>
                            <tbody style="background-color: white;" class="salaryTable">`;
            if (response.compiledData.length === 0) {
                html += `<td colspan="6" style="color: red;">No data found</td>`;
            }
            $.each(response.compiledData, function(key, value) {
                html += `<tr class="clickMe" id="${value.id}">
                        <td hidden></td>
                        <td>${value.grade}</td>
                        <td>${value.notch}</td>
                        <td>${value.description}</td>
                        <td>${value.basic}</td>
                        <td>${value.totalEmp}</td>  
                        <td>${value.totalAllw}</td>
                        <td>${value.aftT1BeforeTax}</td>
                        <td hidden>${value.date}</td>
                        <td hidden>${value.totalBasic}</td>
                        <td hidden>${value.totalNo}</td>
                        <td hidden></td>
                        </tr>`;
            });
            html += `
                  </tbody>
                  </table>
                </div>
                </div>`;

            html += `<div id="Allowance" class="tabcontent ${(showTab === 'Allowance') ? 'active' :''}" style="display: ${(showTab === 'Allowance') ? 'block' :'none'};">
                 <h6>Employees Allowance</h6>
                  <button style="float: right;" value="add" class="btn btn-primary addEditAllw-form btn-sm"><i class="fas fa-plus"></i> Add New</button><br>
                  <div class="form-group"><input class="form-form-group" id="salaryInput" type="text" placeholder="Search record by anything.."></div>
                          <div class="scroll-div">
                          <table class="layout display responsive-table">
                            <thead class="table-dark" style="background-color:#008a9f;">
                              <tr>
                                <th>Date</th>
                                <th hidden>Jod ID</th>
                                <th>Grade</th>
                                <th>Allowance Title</th>
                                <th>Amount</th>
                                <th>Manage</th>
                                </tr>
                                </thead>
                            <tbody style="background-color: white;" class="salaryTable">`;
            if (response.allowane.length === 0) {
                html += `<td colspan="6" style="color: red;">No data found</td>`;
            }
            $.each(response.allowane, function(key, value) {
                html += `<tr class="" id="${value.id}">
                        <td class="organisationnumber">${getDate(value.createdAt)}</td>
                        <td hidden>${value.salarystructure.jobdescId}</td>
                        <td>${value.salarystructure.grade}</td>
                        <td>${value.allwTitle}</td>
                        <td>${value.allwAmount.toFixed(2)}</td>
                        <td hidden>${value.salarystructure.grade} | ${value.salarystructure.basic.toFixed(2)} | ${value.salarystructure.description}</td>
                        <td hidden>${value.salarystructureId}</td>

                        <td><button id="${value.id}" value="edit" class="btn btn-info addEditAllw-form btn-sm"><i class="fas fa-edit"></i> Edit</button>
                
                <button id="${value.id}" class="btn btn-danger delAllw btn-sm"><i class="fas fa-trash"></i> Delete</button></td>
                        </tr>`;
            });
            html += `
                  </tbody>
                  </table>
                </div>
                </div>`;

            html += `<div id="Tax" class="tabcontent ${(showTab === 'Tax') ? 'active' :''}" style="display: ${(showTab === 'Tax') ? 'block' :'none'};">
                  <h6>Income Tax Structure</h6>
                  <button style="float: right; display: ${(!response.tax) ? 'none' :'block'}" id="" class="btn btn-info editTax btn-sm"><i class="fas fa-edit"></i> Update</button><br>
                  <div class="form-group"><input class="form-form-group" id="salaryInput" type="text" placeholder="Search record by anything.."></div>
                          <div class="scroll-div">
                          <table class="layout display responsive-table">
                            <thead class="table-dark" style="background-color:#008a9f;">
                              <tr>
                                <th>Parameters</th>
                                <th>Amount</th>
                                <th>Rate %</th>
                                <th>Tax</th>
                                </tr>
                                </thead>
                            <tbody style="background-color: white;" class="salaryTable">`;
            if (!response.tax) {
                $('.editTax').css('display', 'none');
                html += `<td colspan="4" style="color: red;">No data found</td>`;
                // alert(response.tax);
            } else {
                const first = response.tax.first.split('_').map(Number); // This convert it to integer
                const nextOne = response.tax.nextOne.split('_').map(Number);
                const nextTwo = response.tax.nextTwo.split('_').map(Number);
                const nextThree = response.tax.nextThree.split('_').map(Number);
                const nextFour = response.tax.nextFour.split('_').map(Number);
                const exceeding = response.tax.exceeding.split('_').map(Number);

                getTaxData.push(first[0], nextOne[0], nextOne[1], nextTwo[0], nextTwo[1], nextThree[0], nextThree[1], nextFour[0], nextFour[1], exceeding[0], exceeding[1], response.tax.id);

                // console.log('Array ===> ', first);
                html += `<tr class="">
                            <th class="organisationnumber">${'First'}</th>
                            <td>${first[0].toFixed(2)}</td>
                            <td>${'Nill'}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <th class="organisationnumber">${'Next'}</th>
                            <td>${nextOne[0].toFixed(2)}</td>
                            <td>${nextOne[1].toFixed(2)}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <th class="organisationnumber">${'Next'}</th>
                            <td>${nextTwo[0].toFixed(2)}</td>
                            <td>${nextTwo[1].toFixed(2)}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <th class="organisationnumber">${'Next'}</th>
                            <td>${nextThree[0].toFixed(2)}</td>
                            <td>${nextThree[1].toFixed(2)}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <th class="organisationnumber">${'Next'}</th>
                            <td>${nextFour[0].toFixed(2)}</td>
                            <td>${nextFour[1].toFixed(2)}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <th class="organisationnumber">${'Exceeding'}</th>
                            <td>${exceeding[0].toFixed(2)}</td>
                            <td>${exceeding[1].toFixed(2)}</td>
                            <td></td>
                        </tr>`;
            }
            html += `
                  </tbody>
                  </table>
                </div>
                </div>`;

            html += `<div id="SSNIT" class="tabcontent ${(showTab === 'SSNIT') ? 'active' :''}" style="display: ${(showTab === 'SSNIT') ? 'block' :'none'};">
                  <h6>Social Security and National Insurance Trust (SSNIT)</h6>
                  <button style="float: right; display: ${(!response.ssnit) ? 'none' :'block'}" id="${1}" class="btn btn-info editSSNIT btn-sm"><i class="fas fa-edit"></i> Update</button><br>
                  <div class="form-group"><input class="form-form-group" id="salaryInput" type="text" placeholder="Search record by anything.."></div>
                          <div class="scroll-div">
                          <table class="layout display responsive-table">
                            <thead class="table-dark" style="background-color:#008a9f;">
                              <tr>
                                <th>Tier</th>
                                <th>Percent %</th>
                                <th>No. Emp</th>
                                <th>Amount</th>
                                </tr>
                                </thead>
                            <tbody style="background-color: white;" class="salaryTable">`;
            if (!response.ssnit) {
                html += `<td colspan="4" style="color: red;">No data found</td>`;
                // alert(response.tax);
            } else {

                // console.log('Array ===> ', first);
                getSSNITData.push(response.ssnit.teirOne, response.ssnit.teirTwo, response.ssnit.id);

                html += `<tr class="">
                            <th class="organisationnumber">${'Tier One'}</th>
                            <td>${response.ssnit.teirOne}</td>
                            <td>${0}</td>
                            <td>${0.00}</td>
                        </tr>
                        <tr>
                            <th class="organisationnumber">${'Tier Two'}</th>
                            <td>${response.ssnit.teirTwo}</td>
                            <td>${0}</td>
                            <td>${0.00}</td>
                        </tr>`;
            }
            html += `
                  </tbody>
                  </table>
                </div>
                </div>`;

            html += '</div>';
            html += '</div>';
            html += '</div>';

            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            html += '</div>';

            html += '</div>';
            html += '</div>';
            html += '<br>';
            $('.mainPage').html(html);
            $("#loader").hide();
            $('#employeeFeat').modal('hide');
        },
        error: function(error) {
            // console.log(error);
            errorPage('salaryDash');
            $("#loader").hide();
            getEmployees('deptHead', '', ''); // called from general-funct.js

        }

    });

}

$(document).ready(function() {
    $(document).on('keyup', "#salaryInput", function() {
        var value = $(this).val().toLowerCase();
        $(".salaryTable tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $(document).on('click', '.tablinks', function() {
        $('.show-content').html('');
        let tabValue = $(this).val();
        logUIAccess(`Clicked ${tabValue} tab`, '.tablinks');
        if (tabValue === 'Salary') {
            $('.addHeader').html(tabValue + ' Structure');
        } else if (tabValue === 'Tax') {
            $('.addHeader').html('Income Tax Structure');
        } else if (tabValue === 'SSNIT') {
            $('.addHeader').html('Social Security and National Insurance Trust (SSNIT)');
        } else if (tabValue === 'Allowance') {
            $('.addHeader').html('Employees Allowance');
        } else {
            $('.addHeader').html(tabValue)
        }

        $('.tablinks, tabs div.tabcontent').removeClass('active');
        $('.tabcontent').hide();
        $('#' + tabValue).show();
        $(this).addClass('active');
        $("#loader").show();
        displayDash(tabValue);

    });

    $(document).on('click', '.clickMe', function() {
        $tr = $(this).closest('tr');
        let data = $tr.children("td").map(function() {
            return $(this).text();
        }).get();
        logUIAccess('Expand salary grade', '.clickMe');
        let html = `<div class="row">
                      <div class="col-md-12">
                        <div class="card" >
                          <div class="card-header" style="background-color: #708090; color: blue;">
                      </div>
                    </div>
                </div><br><br>

                <div class=" col-lg-6 col-md-6">
                <span class="mr-2 d-none d-lg-inline text-info  padd"> <i class="fas fa-id-car"></i><th>Effective Date: </th> <td>${data[8]}</td></span><br>

                <!-- <span class="mr-2 d-none d-lg-inline text-gray-600  padd"> <i class="fas fa-envelop"></i> <th>Job Title: </th><td></td></span><br> -->

                <span class="mr-2 d-none d-lg-inline text-gray-600  padd"> <i class="fas fa-phon"></i> <th>Grade/Group: </th> <td>${data[1]}</td></span><br>

                <span class="mr-2 d-none d-lg-inline text-gray-600  padd"> <i class="fas fa-phon"></i> <th>Notch: </th> <td>${data[2]}</td></span><br>

                <span class="mr-2 d-none d-lg-inline text-gray-600  padd"> <i class="fas fa-phon"></i> Description: &emsp; &emsp; ${data[3]}</span><br>

                <span class="mr-2 d-none d-lg-inline text-gray-600 padd"> <i class="fas fa-phon"></i> Base salary: &emsp; &emsp; ${data[4]}</span><br>

                </div>`;

        html += `
                <div class=" col-lg-6 col-md-6">
                <span class="mr-2 d-none d-lg-inline text-info text-info-600 ">Total Base: &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; ${data[9]}</span><br>

                <span class="mr-2 d-none d-lg-inline text-info-600 ">Total Employees: &emsp; &emsp; &emsp; &emsp; &zwnj; &zwnj; ${data[5]}</span><br>

                <span class="mr-2 d-none d-lg-inline text-info-600 ">No. of Allowance: &emsp; &emsp; &emsp; &emsp; ${data[10]}</span><br>

                <span class="mr-2 d-none d-lg-inline text-info-600 ">Total Allowance &emsp; &emsp; &emsp; &emsp; &zwnj; &zwnj; ${data[6]}</span><br>

                <span class="mr-2 d-none d-lg-inline text-info-600 ">Net (After Tier1 Before Tax): ${data[7]}</span><br><br>
                <div style="float: right;">
                <button id="${[$(this).attr('id'), data[1], data[4], data[3], data[2]]}" class="btn btn-info edit btn-sm"><i class="fas fa-edit"></i> Edit</button>
                <button id="${$(this).attr('id')}" class="btn btn-danger del btn-sm"><i class="fas fa-trash"></i> Delete</button>
                </div>
                </div>
                
                </div>`;

        $('.show-content').html(html);

    })

    // Department page
    $(document).on('click', '.salaryDash', function() {

        $('title').html('Salary Dashboard');

        // $('#employeeFeat').modal('hide');
        $("#loader").show();
        displayDash('Salary');
        logUIAccess('Clicked salary dashboard', '.salaryDash');


        unactive();
        $('.salaryDash').css("color", 'blue');

    });

    function modal_form(title, header, mode) {
        $('#grade').val('');
        $('#error_grade').html('');
        $('#notch').val('');
        $('#error_notch').html('');
        $('#basic').val('');
        $('#error_basic').html('');
        $('#tax').val('');
        $('#error_tax').html('');
        $('#ssnit').val('');
        $('#error_ssnit').html('');
        $('#allwnce').val('');
        $('#error_allwnce').html('');
        $('#salaryDesc').val('');
        $('#error_salaryDesc').html('');
        $('.invalid').css({
            'border-color': 'gray',
            'color': 'black'
        });
        $('#salaryMode').val(mode);
        // $('#addSalary').modal(state);
        $('h5').html(header);
        $('title').html(title);
    }

    $(document).on('click', '.add-salary-form', function() {
        // alert('All set');
        $('.user-message').css('display', 'none');
        modal_form('Add Salary Structure', '<i class="fas fa-plus-circle"></i> Add New Salary Structure', 'add');
        getJobTs('job', '', '');
        // checkPoint('none', 'add-salary-form');
        // if (checkPoint('none', 'getSalaryStrct')) {
        logUIAccess('Clicked add new salary grade', '.add-salary-form')
        $('#addSalary').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
        // }
        // errorPage('getSalaryStrct');
    });


    function htmlAllw(no) {
        let html = '';
        html +=
            `<div class="removeAllw_${no}">
            <i class="fa fa-minus-circle removeAllw removeAllw_${no}" id="${no}" aria-hidden="true" style="padding: 0px; margin: 20px 0px 0px -100px; float: right; color: red;"></i><br>
            <div class="form-group removeAllw_${no}">
            <label for="allwTitle">Allowance title</label>
            <input type="text" name="allwTitle[]" id="allwTitle_${no}" placeholder="Enter title for allowance">
        </div>

        <div class="form-group removeAllw_${no}">
            <label for="allwnce"> Allowance amount</label>
            <input type="text" name="allwnce[]" id="allwnce_${no}" placeholder="Enter allowance amount">
        </div>
        </div>`;

        return html;
    }

    let MaxAllw = 100;
    let addAllwCount = 1;
    let AddAllwID = $("#appendAllw");
    let addAllwLegth = AddAllwID.length;

    $(document).on('click', '#addAllw', function() {
        // alert('All set here');
        // addEmergLegth = +$('.emergenName').length;
        // console.log('addEmergLegth', addEmergLegth);
        if (addAllwLegth <= MaxAllw) {
            // addEmergCount = +$('.emergenName').length;
            addAllwCount++;
            // console.log('addEmergCount', addEmergCount);
            $('#appendAllw').append(htmlAllw(addAllwCount));
            addAllwLegth++;
        }
        return false
    });

    $(document).on('click', '.removeAllw', function() {
        $('.removeAllw_' + $(this).attr('id')).remove();
        addAllwCount--;
        addAllwLegth--;
        return false;
    });

    $(document).on('submit', '#createSalary', function(e) {
        e.preventDefault();
        // alert(window.location.origin);
        let form = $(this)[0];
        let data = new FormData(form);
        const arrayAllwInpt = ['allwTitle', 'allwnce'];

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
                checkPoint('none', 'add-salary-form');

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
                    unactive();
                    modal_form('', 'Salary Structure', '');
                    $('#addSalary').modal('hide');
                    unactive();
                    $('.employeeFeat').css("color", 'blue');
                    $("#loader").show();
                    displayDash('Salary');
                }, 1000);
            },
            error: function(error) {
                console.log('In error');
                // console.log(error)
                if (error.status === 422) {

                    $('#allwErrors').text('');
                    let arrayB = ['grade', 'basic', 'salaryDesc'];
                    let errors = '';

                    $.each(error.responseJSON.validationErrors, function(key, value) {

                        if (arrayAllwInpt.includes(value.param)) {
                            errors += `<p> ${value.msg}</p>`;
                        } else {
                            // arrayB.slice
                            $('#error_' + value.param).text(value.msg);
                            // $('#' + value.param).addClass('has-error');
                            $('#' + value.param).addClass(`invalid`);
                            $('.invalid').css({
                                'border-color': 'red',
                                'color': 'red'
                            });
                        }
                    });
                    // clearError(arrayB); // from add-employee form

                    if (errors) {
                        $('#allwErrors').html('<div class="alert alert-danger">' + errors + '</div>');
                    } else {
                        $('#allwErrors').text('');
                    }
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
                    errorPage('getSalaryStrct');
                }
            }

        });
    });

    $(document).on('click', '.edit', function() {
        let data = $(this).attr('id').split(',');

        const url = `edit-salarystructure/${data[0]}`;

        logUIAccess('Clicked on edit salary structure', '.edit')
        $('#editgrade').val(data[1]);
        $('#editnotch').val(`${(data[4] === 'N/A')?'':data[4]}`);
        $('#editbasic').val(data[2]);
        $('#editsalaryDesc').val(data[3]);
        $('#salaID').val(data[0]);
        $('#editsalaryMode').val('edit');

        $('.user-message').css('display', 'none');
        $('.invalid').css({
            'border-color': 'black',
            'color': 'black'
        });
        // $('title').html('Update Salary Structure');
        modal_form('Update Salary Structure', '<i class="fas fa-edit"></i> Update Salary Structure', 'edit');

        checkPoint('none', 'add-salary-form');
        // errorPage('getSalaryStrct');
        $('#editSalary').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    });

    $(document).on('submit', '#updateSalary', function(e) {
        e.preventDefault();
        // alert(window.location.origin);
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
                checkPoint('none', 'add-salary-form');

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
                    unactive();
                    // modal_form('', 'Salary Structure', '');
                    $('#editSalary').modal('hide');
                    unactive();
                    $('.employeeFeat').css("color", 'blue');
                    $("#loader").show();
                    displayDash('Salary');
                }, 1000);
            },
            error: function(error) {
                console.log('In error');
                // console.log(error)
                if (error.status === 422) {
                    // $('.user-message').css('display', 'flex');
                    // $('.user-message').html(error.responseJSON.errorMessage);
                    // $('.user-message').css({
                    //     'border-color': 'red',
                    //     'color': 'red',
                    //     'background': 'rgb(255, 176, 176)'
                    // });
                    $.each(error.responseJSON.validationErrors, function(key, value) {
                        $('#error_' + value.param).text(value.msg);
                        $('#' + value.param).addClass(`invalid`);
                        $('.invalid').css({
                            'border-color': 'red',
                            'color': 'red'
                        });

                    });
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
                    // checkPoint('none', 'getSalaryStrct');
                    errorPage('getSalaryStrct');
                }
            }

        });
    });

    $(document).on('click', '.del', function() {
        logUIAccess('Clicked delete salary structure', '.del');
        if (confirm('Are you SURE you want to delete this Salary structure' + '\n' +
                'Once deleted, cannot be recovered.')) {

            const url = `delete-salary/${$(this).attr('id')}`;
            $.ajax({
                type: 'GET',
                url: url,
                // processData: false,
                contentType: 'application/json',
                success: function(response) {
                    // console.log('In success');
                    checkPoint('none', 'add-salary-form');
                    // errorPage('getSalaryStrct');
                    setTimeout(function() {
                        alert('Data deleted !!')
                        $("#loader").show();
                        displayDash('Salary');
                    }, 1000);
                },
                error: function(error) {
                    console.log('In error');
                    // console.log(error)
                    alert('Sorry data not deleted, try again');
                }
            });
        }
    });

    $(document).on('click', '.addEditAllw-form', function() {
        // alert('All set for now');
        const val = $(this).val();
        logUIAccess(`Clicked ${val} allowance form`, '.addEditAllw-form');
        if (val === 'add') {
            $('title').html('Add Allowance');
            $('h5').html('<i class="fas fa-plus-circle"></i> Add Allowance');
            getSalaries('salStruct', '', '');
            $('#allwMode').val('add');
            $('#allwID').val('');
            $('#allwTitle').val('');
            $('#amount').val('');

            $('#addEditAllw-form').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
        }
        if (val === 'edit') {
            $tr = $(this).closest('tr');
            let data = $tr.children("td").map(function() {
                return $(this).text();
            }).get();

            $('title').html('Update Allowance');
            $('h5').html('<i class="fas fa-edit"></i> Update Allowance');
            getSalaries('salStruct', `${data[6]}`, `${data[5]}`);
            $('#allwMode').val('edit');
            $('#allwID').val($(this).attr('id'));
            $('#allwTitle').val(data[3])
            $('#amount').val(data[4])
            $('#addEditAllw-form').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
        }
    });


    $(document).on('submit', '#add-updateAllw', function(e) {
        e.preventDefault();
        // alert(window.location.origin);
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
                checkPoint('none', 'add-salary-form');

                $('.user-message').css('display', 'flex')
                $('.user-message').html('A moment please.....');
                $('.user-message').css({
                    'border-color': 'blue',
                    'color': 'white',
                    'background-color': 'green'
                });

                setTimeout(function() {
                    $('.user-message').css('display', 'none');
                    $('.user-message').html('');
                    $('#error_allwTitle').html('');
                    $('#error_amount').html('');
                    unactive();
                    // modal_form('', 'Salary Structure', '');
                    $('#addEditAllw-form').modal('hide');
                    $('.salaryDash').css("color", 'blue');
                    $("#loader").show();
                    displayDash('Allowance');
                }, 1000);
            },
            error: function(error) {
                console.log('In error');
                // console.log(error)
                if (error.status === 422) {
                    $.each(error.responseJSON.validationErrors, function(key, value) {
                        $('#error_' + value.param).text(value.msg);
                        $('#' + value.param).addClass(`invalid`);
                        $('.invalid').css({
                            'border-color': 'red',
                            'color': 'red'
                        });

                    });
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
                    // checkPoint('none', 'getSalaryStrct');
                    errorPage('getSalaryStrct');
                }
            }

        });
    });

    $(document).on('click', '.delAllw', function() {

        logUIAccess('Clicked delete allowance', '.delAllw');

        if (confirm('Are you SURE you want to delete this Allowance' + '\n' +
                'Once deleted, cannot be recovered.')) {

            const url = `delete-allowance/${$(this).attr('id')}`;
            // alert(url);
            $.ajax({
                type: 'GET',
                url: url,
                // processData: false,
                contentType: 'application/json',
                success: function(response) {
                    // console.log('In success');
                    checkPoint('none', 'add-salary-form');
                    // errorPage('getSalaryStrct');
                    setTimeout(function() {
                        alert('Data deleted !!')
                        $("#loader").show();
                        displayDash('Allowance');
                    }, 1000);
                },
                error: function(error) {
                    console.log('In error');
                    // console.log(error)
                    alert('Sorry data not deleted, try again');
                }

            });
        }
    });

    $(document).on('click', '.editTax', function() {
        // alert('All is set');
        logUIAccess('Clicked edit tax', '.editTax');
        let inputs = ['miniW', 'nextOneAmt', 'nextOneRate', 'nextTwoAmt', 'nextTwoRate', 'nextThreeAmt', 'nextThreeRate', 'nextFourAmt', 'nextFourRate', 'exceedAmt', 'exceedRate'];

        for (let i = 0; i < getTaxData.length; i++) {
            $('#' + inputs[i]).val('');
            $('#error_' + inputs[i]).html('');
            $('#' + inputs[i]).val(getTaxData[i].toFixed(2));
        }
        $('#taxID').val(getTaxData[11]);
        modal_form('Update Tax', '<i class="fas fa-edit"></i> Update Tax', 'editTax');

        $('#editTax-form').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    });

    $(document).on('submit', '#update-tax', function(e) {
        e.preventDefault();
        // alert(window.location.origin);
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
                checkPoint('none', 'add-salary-form');

                $('.user-message').css('display', 'flex')
                $('.user-message').html('A moment please.....');
                $('.user-message').css({
                    'border-color': 'blue',
                    'color': 'white',
                    'background-color': 'green'
                });

                getTaxData = [];

                setTimeout(function() {
                    $('.user-message').css('display', 'none')
                    $('.user-message').html('');
                    unactive();
                    modal_form('', 'Salary Structure', '');
                    $('#editTax-form').modal('hide');
                    unactive();
                    $('.employeeFeat').css("color", 'blue');
                    $("#loader").show();
                    displayDash('Tax');
                }, 1000);
            },
            error: function(error) {
                console.log('In error');
                // console.log(error)
                if (error.status === 422) {
                    $.each(error.responseJSON.validationErrors, function(key, value) {

                        $('#error_' + value.param).text(value.msg);
                        // $('#' + value.param).addClass('has-error');
                        $('#' + value.param).addClass(`invalid`);
                        $('.invalid').css({
                            'border-color': 'red',
                            'color': 'red'
                        });
                    });

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
                    errorPage('getSalaryStrct');
                }
            }
        });
    });

    $(document).on('click', '.editSSNIT', function() {
        // alert('All is set');
        logUIAccess('Clicked edit SSNIT', '.editSSNIT');

        let inputs = ['t1', 't2'];

        for (let i = 0; i < getSSNITData.length; i++) {
            $('#' + inputs[i]).val(getSSNITData[i].toFixed(2));
        }
        $('#sstID').val(getSSNITData[2]);
        modal_form('Update SSNIT', '<i class="fas fa-edit"></i> Update SSNIT', 'editSSNIT');
        $('#editSSNIT-form').modal({show:true,
	                    backdrop:'static',
	                    keyboard:false,
	                    focus:true});
    });

    $(document).on('submit', '#update-ssnit', function(e) {
        e.preventDefault();
        // alert(window.location.origin);
        let form = $(this)[0];
        let data = new FormData(form);
        let inputs = ['t1', 't2'];

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
                checkPoint('none', 'add-salary-form');

                $('.user-message').css('display', 'flex')
                $('.user-message').html('A moment please.....');
                $('.user-message').css({
                    'border-color': 'blue',
                    'color': 'white',
                    'background-color': 'green'
                });

                getSSNITData = [];

                setTimeout(function() {
                    $('.user-message').css('display', 'none')
                    $('.user-message').html('');
                    unactive();
                    modal_form('', 'Salary Structure', '');
                    $('#t1').val('');
                    $('#t2').val('');
                    $('#error_t1').html('');
                    $('#error_t2').html('');
                    $('#editSSNIT-form').modal('hide');
                    unactive();
                    $('.employeeFeat').css("color", 'blue');
                    $("#loader").show();
                    displayDash('SSNIT');
                }, 1000);
            },
            error: function(error) {
                console.log('In error');
                // console.log(error)
                if (error.status === 422) {
                    $.each(error.responseJSON.validationErrors, function(key, value) {

                        $('#error_' + value.param).text(value.msg);
                        // $('#' + value.param).addClass('has-error');
                        $('#' + value.param).addClass(`invalid`);
                        $('.invalid').css({
                            'border-color': 'red',
                            'color': 'red'
                        });
                    });

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
                    errorPage('getSalaryStrct');
                }
            }
        });
    });

});