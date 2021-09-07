function addForm() {
    $('.mainPage').html('');
    let html = `
    <link href="/css/employee-style.css" rel="stylesheet">
    <script src="/vender/fontawesome-free/a076d05399.js"></script>

    <style>
  .box {
    width: 100%;
    padding: 0px;
    margin-bottom: 30px;
    margin: 0 auto;
  }

  /* .container {
    border: 2px solid teal;
  } */

  .active_tab1 {
    background-color: #fff;
    color: #333;
    font-weight: 600;
  }

  .inactive_tab1 {
    background-color: #f5f5f5;
    color: #333;
    cursor: not-allowed;
  }

  .has-error {
    border-color: #cc0000;
    background-color: #ffff99;
  }
</style>

    <div class="d-sm-flex align-items-center justify-content-between mb-2">
    <h6 class="h3 mb-0 text-gray-800 head">Add New Employee</h6>
    <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm employeeDash"><i
        class="fas fa-list"></i> View Employee Dashboard</a>
  </div>
  <hr>

  <!-- Content Row -->
  <div class="container box">
    <form action="" method="POST" enctype="multipart/form-data" id="employ_form">
    <input type="hidden" name="mode" id="mode" value="">
    <input type="hidden" name="empID" id="empID" value="">
    <input type="hidden" name="emph" id="emph" value="">
      <ul class="nav nav-tabs tabb">
        <li class="nav-item">
          <a class="nav-link active_tab1" style="border:2px solid #ccc;" id="list_basic_info">Basic Info</a>
        </li>
        <li class="nav-item">
          <a class="nav-link inactive_tab1" id="list_address_ids" style="border:2px solid #ccc">Address & IDs</a>
        </li>
        <li class="nav-item">
          <a class="nav-link inactive_tab1" id="list_emplmnt_work_edu" style="border:2px solid #ccc">Employment &
            Edu.</a>
        </li>
        <li class="nav-item">
          <a class="nav-link inactive_tab1" id="list_bank_details" style="border:2px solid #ccc">Bank Details</a>
        </li>
        <li class="nav-item">
          <a class="nav-link inactive_tab1" id="list_spouse_nofk" style="border:2px solid #ccc">Spouse & Next of Kin</a>
        </li>
        <li class="nav-item">
          <a class="nav-link inactive_tab1" id="list_depend_ssnit_benefit" style="border:2px solid #ccc">Depend & SSNIT
            Benefits</a>
        </li>
      </ul>

      <div class="tab-content" style="margin-top:16px; ">
      <input type="hidden" name="_csrf" value="${$('#crsf').val()}">

        <div class="tab-pane active" id="basic_info">
          <div class="panel panel-default">
            <div class="panel-heading" style="font-size: 20px;">Employee Basic Information</div>
            <div class="panel-body">

              <div class="row" style="background-color:white;">
                <div class=" col-lg-6 col-md-6">
                  <div class="form-group">
                    <label for="title">Title (Select title)</label>
                    <select require name="title" id="title">
                      <option value='Mr'>Mr</option>"
                      <option value='Miss'>Miss</option>"
                      <option value='Mrs'>Mrs</option>"
                      <option value='Dr'>Dr</option>"
                    </select>
                    <span id="error_title" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="fName">First Name</label>
                    <input require type="text" name="fName" id="fName" placeholder="First Name">
                    <span id="error_fName" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="mName">Middle Name</label>
                    <input type="text" name="mName" id="mName" placeholder="Middle Name">
                    <span id="error_mName" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="lName">Last Name</label>
                    <input type="text" name="lName" id="lName" placeholder="Last Name">
                    <span id="error_lName" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="gender">Gender (Select gender)</label>
                    <select name="gender" id="gender">
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                    </select>
                    <span id="error_gender" class="text-danger"></span>
                  </div>
                </div>

                <div class="col-lg-6 col-md-6">

                  <div class="form-group">
                    <label for="bdate">Birth Date</label>
                    <input type="date" name="bdate" id="bdate" class="chngTyp" placeholder="Date: yyyy-mm-dd">
                    <span id="error_bdate" class="text-danger"></span>
                  </div>
                  
                  <div class="form-group">
                    <label for="mStatus">Marriage Status</label>
                    <select name="mStatus" id="mStatus">
                      <option value='Single'>Single</option>
                      <option value='Married'>Married</option>
                      <option value='Divorce'>Divorce</option>
                    </select>
                    <span id="error_mStatus" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="image">Photo</label>
                    <input type="file" name="image" id="empimage" class="checkfile">
                    <span id="error_image" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="phone">Phone</label>
                    <input type="text" name="phone" maxlength="10" id="phone" placeholder="Phone Number">
                    <span id="error_phone" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" placeholder="Enter a valid email eg. example@example.com">
                    <span id="error_email" class="text-danger"></span>
                  </div>
                </div>
              </div>
              <div align="center">
              <button type="button" name="btn_basic_info" id="btn_basic_info" class="btn btn-info">Next</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Address and ID cards -->
        <div class="tab-pane" id="address_ids">
          <div class="panel panel-default">
            <div class="panel-heading" style="font-size: 20px; ">Employee Address & IDs Number (GH card, TIN, SSNIT)
            </div>
            <div class="panel-body">

              <div class="row" style="background-color:white;">
                <div class=" col-lg-6 col-md-6">
                  <div class="form-group">
                    <label for="residAddress">Residential Address</label>
                    <textarea type="text" name="residAddress" id="residAddress" class="charSiz" maxlength="100" rows="1"></textarea>
                    <div class="char-left" id="residAddressChar">100 characters remaining</div>
                    <span id="error_residAddress" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="nearmark">Nearest Landmark</label>
                    <textarea type="text" name="nearmark" id="nearmark" class="charSiz" maxlength="100" rows="1"></textarea>
                    <!-- <div class="char-left" id="nearmarkChar">100 characters remaining</div> -->
                    <span id="error_nearmark" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="gpCode">GP Digital Address Code</label>
                    <input type="text" name="gpCode" id="gpCode" placeholder="Enter GP code of employee residence">
                    <span id="error_gpCode" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="postAddress">Postal Address</label>
                    <textarea type="text" name="postAddress" id="postAddress" class="charSiz" maxlength="100" rows="1"></textarea>
                    <!-- <div class="char-left" id="postAddressChar">100 characters remaining</div> -->
                    <span id="error_postAddress" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="town">City/Town</label>
                    <input type="text" name="town" id="town" placeholder="Enter city or town of residence">
                    <span id="error_town" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label>Region of Residence</label>
                    <select type="text" name="region" id="region">
                      <option value="">Select region of residence</option>
                      <option value="Greater Accra Region">Greater Accra Region</option>
                      <option value="Bono Region">Bono Region</option>
                      <option value="Ashanti Region">Ashanti Region</option>
                      <option value="Central Region">Central Region</option>
                      <option value="Eastern Region">Eastern Region</option>
                      <option value="Western Region">Western Region</option>
                      <option value="Northern Region">Northern Region</option>
                      <option value="Upper East Region">Upper East Region</option>
                      <option value="Upper West Region">Upper West Region</option>
                      <option value="Volta Region">Volta Region</option>
                      <option value="North East Region">North East Region</option>
                      <option value="Savannah Region">Savannah Region</option>
                      <option value="Bono East Region">Bono East Region</option>
                      <option value="Ahafo Region">Ahafo Region</option>
                      <option value="Western North Region">Western North Region</option>
                      <option value="Oti Region">Oti Region</option>
                    </select>
                    <span id="error_region" class="text-danger"></span>
                  </div>
                </div>

                <div class="col-lg-6 col-md-6">

                <div class="form-group">
                    <label for="cardType">Card Type</label>
                    <select name="cardType" id="cardType" class="cardType">
                      <option value=''>Select card type</option>
                      <option value='Ghana Card'>Ghana Card</option>
                      <option value='Voter's ID Card'>Voter's ID Card</option>
                      <option value='Driver Licence'>Driver Licence</option>
                      <option value='NHIS Card'>NHIS Card</option>
                      <option value='Passport'>Passport</option>
                    </select>
                    <span id="error_cardType" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="idCard">Card Number</label>
                    <input type="text" name="idCard" id="idCard" placeholder="Enter card number">
                    <span id="error_idCard" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="tin">TIN</label>
                    <input type="text" name="tin" id="tin" placeholder="Enter employee TIN">
                    <span id="error_tin" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="ssnitNo">SSNIT No.</label>
                    <input type="text" name="ssnitNo" id="ssnitNo" placeholder="Enter employee SSNIT Number">
                    <span id="error_ssnitNo" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="ssnitimage">SSNIT Card Image</label>
                    <input type="file" name="ssnitimage" id="ssnitimage" class="checkfile">
                    <span id="error_ssnitimage" class="text-danger"></span>
                  </div>
                </div>
              </div>
              <div align="center">
                    <button type="button" name="previous_btn_address_ids" id="previous_btn_address_ids"
                      class="btn btn-dark">Previous</button>
                    <button type="button" name="btn_address_ids" id="btn_address_ids"
                      class="btn btn-info">Next</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Employment Work and Edu. -->
        <div class="tab-pane" id="emplmnt_work_edu">
          <div class="panel panel-default">
            <div class="panel-heading" style="font-size: 20px; ">Employment, Work & Educational Background
            </div>
            <div class="panel-body">
            <h5 class="" style="margin:0px; color: blue;">Employment</h5>
              <div class="row" style="background-color:white;">
                <div class=" col-lg-6 col-md-6">
                  <div class="form-group">
                    <label for="dateEmplyed">Date Employed</label>
                    <input type="date" name="dateEmplyed" class="chngTyp" placeholder="Date: yyyy-mm-dd" id="dateEmplyed">
                    <span id="error_dateEmplyed" class="text-danger"></span>
                  </div>
                  
                  <div class="form-group">
                    <label for="staffID">Staff ID</label>
                    <input type="text" name="staffID" id="staffID" placeholder="Enter staff ID for employee">
                    <span id="error_staffID" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="jobTitle">Job Title</label>
                    <select type="number" name="jobTitle" id="jobTitle">
                      <option value="">Select job title for employee</option>
                    </select>
                    <span id="error_jobTitle" class="text-danger"></span>
                  </div>
                  
                </div>

                <div class="col-lg-6 col-md-6">
                
                  <div class="form-group">
                    <label for="dept">Department</label>
                    <select type="number" name="dept" id="dept">
                      <option value="">Select department for employee</option>
                    </select>
                    <span id="error_dept" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="immediatesuper">Immediate Supervisor</label>
                    <select type="number" name="immediatesuper" id="immediatesuper">
                      <option value="">Employee reports to?</option>
                    </select>
                    <span id="error_immediatesuper" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="leavtype">Annual Leave Policy</label>
                    <select type="number" name="leavtype" id="leavtype">
                      
                    </select>
                    <span id="error_leavtype" class="text-danger"></span>
                  </div>

                  <!-- <div class="form-group">
                    <label for="empGroup">Group</label>
                    <select type="number" name="empGroup" id="empGroup">
                      <option value="">Select group for employee</option>
                    </select>
                    <span id="error_empGroup" class="text-danger"></span>
                  </div> -->

                </div>
              </div>

          <!-- <hr class="" style="background-color: indianred;"> -->
    <div class="accordion" id="accordionExample">
          <div class="card">
        <div class="card-header" id="headingEdu">
          <h2 class="mb-0">
            <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse"
              data-target="#collapseEdu" aria-expanded="false" aria-controls="collapseEdu">

              <h5 class="" style="margin:0px; color: blue;">Educational Background</h5>
              </button>
          </h2>
        </div>
        <div id="collapseEdu" class="collapse" aria-labelledby="headingEdu" data-parent="#accordionExample">
          <div class="card-body">

            <div class="form-group"  style="padding: 0px; margin: 0px 0px 0px -100px; float: right; ">
            <button type="button" style="float: right;" class="btn btn-primary" id="addEduBack"><i class="fa fa-plus-circle" aria-hidden="true"></i></button>
            </div><br>
              <div class="row" id="appendEduBack" style="background-color:white;">
                <div class=" col-lg-6 col-md-6">
                  <div class="form-group">
                    <label for="institution">Institution</label>
                    <input type="text" name="institution[]" class="institution" id="institution_1" placeholder="Enter institution name">
                  </div>
                  <div class="form-group">
                    <label for="instCountry_1">Country</label>
                    <select type="text" name="instCountry[]" id="instCountry_1">
                    <option value=''>Select country</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="qualification">Qualification/Certification</label>
                    <select type="text" name="qualification[]" id="qualification_1">
                    <option value=''>Select qualification/certication attained</option>
                    <option value='Basic Education Certificate'>Basic Education Certificate</option>
                    <option value='Vocational'>Vocational</option>
                    <option value='Technical'>Technical</option>
                    <option value='SSS'>SSS</option>
                    <option value='WASSEC'>WASSEC</option>
                    <option value='O Level'>O Level</option>
                    <option value='A Level'>A Level</option>
                    <option value='Diploma'>Diploma</option>
                    <option value='HND'>HND</option>
                    <option value='AHND'>AHND</option>
                    <option value='Degree'>Degree</option>
                    <option value='Masters'>Masters</option>
                    <option value='PhD'>PhD</option>
                    <option value='Others'>Others/Workshop/Seminar</option>
                    </select>
                  </div>
                </div>

                <div class="col-lg-6 col-md-6">
                  <div class="form-group" style="display: ">
                    <label for="">Program/ Course Major</label>
                    <input type="text" name="programMajor[]" id="programMajor_1" placeholder="Enter program, course major">
                  </div>
                  <div class="form-group">
                    <label for="fromDate">From Month/Year.</label>
                    <input type="month" name="fromDate[]" placeholder="Date: yyyy-mm" id="fromDate_1">
                  </div>
                  
                  <div class="form-group">
                    <label for="toDate">To Month/Year.</label>
                    <input type="month" name="toDate[]" placeholder="Date: yyyy-mm" id="toDate_1">
                  </div>
                </div>
              </div>

            </div>
        </div>
      </div>
      </div>
              <!--<hr class="" style="background-color: indianred;">-->

              <div class="accordion" id="accordionExample">
          <div class="card">
        <div class="card-header" id="headingWork">
          <h2 class="mb-0">
            <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse"
              data-target="#collapseWork" aria-expanded="false" aria-controls="collapseWork">

              <h5 class="" style="margin:0px; color: blue;">Work Experience</h5>
              </button>
          </h2>
        </div>
        <div id="collapseWork" class="collapse" aria-labelledby="headingWork" data-parent="#accordionExample">
          <div class="card-body">

              
            <div class="form-group"  style="padding: 0px; margin: 0px 0px 0px -100px; float: right; ">
            <button type="button" style="float: right;" class="btn btn-primary" id="addWorkExp"><i class="fa fa-plus-circle" aria-hidden="true"></i></button>
            </div><br>
              <div class="row" id="appendWorkExp" style="background-color:white;">
                <div class=" col-lg-6 col-md-6">
                  <div class="form-group">
                    <label for="orgName">Organization Name</label>
                    <input type="text" name="orgName[]" class="orgName" id="orgName_1" placeholder="Enter organization name">
                  </div>
                  <div class="form-group">
                    <label for="position">Position</label>
                    <input type="text" name="position[]" id="position_1" placeholder="Enter position">
                  </div>
                </div>

                <div class="col-lg-6 col-md-6">
                  <div class="form-group">
                    <label for="orgFromDate">From Month/Year.</label>
                    <input type="month" name="orgFromDate[]" placeholder="Date: yyyy-mm" id="orgFromDate_1">
                  </div>
                  
                  <div class="form-group">
                    <label for="orgToDate">To Month/Year.</label>
                    <input type="month" name="orgToDate[]" placeholder="Date: yyyy-mm" id="orgToDate_1">
                  </div>
                </div>
              </div>

              </div>
              </div>
              </div>
              </div><br>
              
              <div align="center">
                    <button type="button" name="previous_btn_emplmnt_work_edu" id="previous_btn_emplmnt_work_edu"
                      class="btn btn-dark">Previous</button>
                    <button type="button" name="btn_emplmnt_work_edu" id="btn_emplmnt_work_edu"
                      class="btn btn-info">Next</button>
                  </div>
            </div>
          </div>
        </div>

        <!-- Bank details  -->
        <div class="tab-pane" id="bank_details">
          <div class="panel panel-default">
            <div class="panel-heading" style="font-size: 20px;">Employee Salary & Bank Details</div>
            <div class="panel-body">

              <div class="row" style="background-color:white;">
                <div class=" col-lg-6 col-md-6">

                  <div class="form-group">
                    <label for="salaryStruct">Salary Structure</label>
                    <select name="salaryStruct" id="salaryStruct">
                    </select>
                    <span id="error_salaryStruct" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="bankName">Bank Name</label>
                    <input type="text" name="bankName" id="bankName" placeholder="Enter bank name">
                    <span id="error_bankName" class="text-danger"></span>
                  </div>
                  
                </div>

                <div class="col-lg-6 col-md-6">

                <div class="form-group">
                    <label for="branch">Branch</label>
                    <input type="text" name="branch" id="branch" placeholder="Enter branch">
                    <span id="error_branch" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="accNum">Account No.</label>
                    <input type="number" name="accNum" id="accNum">
                    <span id="error_accNum" class="text-danger"></span>
                  </div>
                  <br>
                  <!-- <div class="form-group">
                    <button type="button" style="float: right;" class="btn btn-primary" id="addBank">Add More</button>
                  </div> -->
                </div>
              </div>
            <div align="center">
                    <button type="button" name="previous_btn_bank_details" id="previous_btn_bank_details"
                      class="btn btn-dark">Previous</button>
                    <button type="button" name="btn_bank_details" id="btn_bank_details"
                      class="btn btn-info">Next</button>
            </div>
          </div>
        </div>
        </div>

        <!-- Spouse and Next of Kin -->
        <div class="tab-pane" id="spouse_nofk">
          <div class="panel panel-default">
            <div class="panel-heading" style="font-size: 20px;">Spouse & Next of Kin</div>
            <div class="panel-body">

              <h5 class="hasSpouse" style="margin:0px; color: blue;">Spouse Details</h5>

              <div class="row hasSpouse" style="background-color:white;">
                <div class=" col-lg-6 col-md-6">
                <div class="spouseID"><input type="text" hidden name="spouseID" id="spouseID"></div>
                  <div class="form-group">
                    <label for="spName">Spouse Name</label>
                    <input type="text" name="spName" id="spName" placeholder="Enter spouse name">
                    <span id="error_spName" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="spcardType">Card Type</label>
                    <select name="spcardType" id="spcardType" class="cardType">
                      <option value=''>Select card type</option>
                      <option value='Ghana Card'>Ghana Card</option>
                      <option value='Voter's ID Card'>Voter's ID Card</option>
                      <option value='Driver Licence'>Driver Licence</option>
                      <option value='NHIS Card'>NHIS Card</option>
                      <option value='Passport'>Passport</option>
                    </select>
                    <span id="error_spcardType" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="spIDCard">Card Number</label>
                    <input type="text" name="spIDCard" id="spIDCard" placeholder="Enter card Number">
                    <span id="error_spIDCard" class="text-danger"></span>
                  </div>
                </div>


                <div class="col-lg-6 col-md-6">

                <div class="form-group">
                    <label for="spphone">Phone</label>
                    <input type="text" name="spphone" id="spphone" placeholder="Phone Number">
                    <span id="error_spphone" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="spDOB">Birth Date.</label>
                    <input type="date" name="spDOB" class="chngTyp" id="spDOB">
                    <span id="error_spDOB" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="spImage">Photo</label>
                    <input type="file" name="spImage" id="spImage" class="checkfile">
                    <span id="error_spImage" class="text-danger"></span>
                  </div>
                  <br>
                  <!-- <div class="form-group">
                    <button type="button" style="float: right;" class="btn btn-primary" id="addSpouse">Add More</button>
                  </div> -->
                  <br>
                </div>
              </div>

              <!-- <hr class="hasSpouse" style="background-color: indianred;"> -->

              <h5 style="margin:0px; color: blue;">Next of Kin Details</h5>

              <div class="row" style="background-color:white;">
                <div class=" col-lg-6 col-md-6">
                <div class="noKinID"> <input type="text" hidden name="nOKinID" id="nOKinID"></div>
                  <div class="form-group">
                    <label for="nOKName">Name</label>
                    <input type="text" name="nOKName" id="nOKName" placeholder="Enter next of kin name">
                    <span id="error_nOKName" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="nOKRelation">Relation</label>
                    <input type="text" name="nOKRelation" id="nOKRelation" placeholder="Enter relation">
                    <span id="error_nOKRelation" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="nOkPhone">Phone.</label>
                    <input type="text" name="nOkPhone" id="nOkPhone" placeholder="Enter phone">
                    <span id="error_nOkPhone" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="noKGender">Gender</label>
                    <select name="noKGender" id="noKGender">
                      <option value=''>Select gender</option>
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                    </select>
                    <span id="error_noKGender" class="text-danger"></span>
                  </div>
                </div>

                <div class="col-lg-6 col-md-6">
                  <div class="form-group">
                    <label for="nOKAddress">Address.</label>
                    <input type="text" name="nOKAddress" id="nOKAddress" placeholder="Enter address">
                    <span id="error_nOKAddress" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="noKCardType">Card Type</label>
                    <select name="noKCardType" id="noKCardType" class="cardType">
                      <option value=''>Select card type</option>
                      <option value='Ghana Card'>Ghana Card</option>
                      <option value='Voter's ID Card'>Voter's ID Card</option>
                      <option value='Driver Licence'>Driver Licence</option>
                      <option value='NHIS Card'>NHIS Card</option>
                      <option value='Passport'>Passport</option>
                    </select>
                    <span id="error_noKCardType" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="noKIDCard">Card Number</label>
                    <input type="text" name="noKIDCard" id="noKIDCard" placeholder="Enter card Number">
                    <span id="error_noKIDCard" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="noKImage">Photo</label>
                    <input type="file" name="noKImage" id="noKImage" class="checkfile">
                    <span id="error_noKImage" class="text-danger"></span>
                  </div>
                </div>
              </div>

              <!-- <hr style="background-color: black;"> -->
        <div class="accordion" id="accordionExample">
          <div class="card">
        <div class="card-header" id="headingEmerg" style="float: left;">
          <h5 class="mb-0">
            <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse"
              data-target="#collapseEmerg" aria-expanded="false" aria-controls="collapseEmerg">

              <h5 style="margin:px; color: blue;">Emergency Contact</h5>

            </button>
          </h5>
        </div>

        <div id="collapseEmerg" class="collapse" aria-labelledby="headingEmerg" data-parent="#accordionExample">
          <div class="card-body">

              <div class="form-group"  style="padding: 0px; margin: 0px 0px 0px -100px; float: right; ">
            <button type="button" style="float: right;" class="btn btn-primary" id="addEmerg"><i class="fa fa-plus-circle" aria-hidden="true"></i></button>
            </div><br>

              <div class="row" id="appendEmerg" style="background-color:white;">
                <div class=" col-lg-6 col-md-6">
                  <div class="form-group">
                    <label for="emergenName">Name</label>
                    <input type="text" name="emergenName[]" class="emergenName" id="emergenName_1" placeholder="Enter emergency person name">
                    <span id="error_emergenName_1" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="emergenRelation">Relation.</label>
                    <input type="text" name="emergenRelation[]" id="emergenRelation_1" placeholder="Enter relation">
                    <span id="error_emergenRelation_1" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="emergenPhone">Phone.</label>
                    <input type="text" name="emergenPhone[]" id="emergenPhone_1" placeholder="Enter phone">
                    <span id="error_emergenPhone_1" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="emergGender">Gender</label>
                    <select name="emergGender[]" id="emergGender_1">
                      <option value=''>Select gender</option>
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                    </select>
                    <span id="error_emergGender_1" class="text-danger"></span>
                  </div>
                </div>

                <div class="col-lg-6 col-md-6">

                  <div class="form-group">
                    <label for="emergenAddress">Address.</label>
                    <input type="text" name="emergenAddress[]" id="emergenAddress_1" placeholder="Enter address">
                    <span id="error_emergenAddress_1" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="emergenCardType">Card Type</label>
                    <select name="emergenCardType[]" id="emergenCardType_1" class="cardType">
                      <option value=''>Select card type</option>
                      <option value='Ghana Card'>Ghana Card</option>
                      <option value='Voter's ID Card'>Voter's ID Card</option>
                      <option value='Driver Licence'>Driver Licence</option>
                      <option value='NHIS Card'>NHIS Card</option>
                      <option value='Passport'>Passport</option>
                    </select>
                    <span id="error_emergenCardType_1" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="emergenIDCard">Card Number</label>
                    <input type="text" name="emergenIDCard[]" id="emergenIDCard_1" placeholder="Enter card Number">
                    <span id="error_emergenIDCard_1" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="emergImage">Photo</label>
                    <input type="file" name="emergImage" id="emergImage_1" class="checkfile">
                    <span id="error_emergImage_1" class="text-danger"></span>
                  </div>
                </div>
              </div>

              </div>
        </div>
      </div>
      </div><br>


              <div align="center">
                    <button type="button" name="previous_btn_spouse_nofk" id="previous_btn_spouse_nofk"
                      class="btn btn-dark">Previous</button>
                    <button type="button" name="btn_spouse_nofk" id="btn_spouse_nofk"
                      class="btn btn-info">Next</button>
                  </div>
            </div>
          </div>
        </div>

        <!-- Dependance and SSNIT Benefits -->
        <div class="tab-pane" id="depend_ssnit_benefit">
          <div class="panel panel-default">
            <div class="panel-heading" style="font-size: 20px;">Dependants & SSNIT Beneficiaries</div>
            <div class="panel-body">
            <div class="accordion" id="accordionExample">
          <div class="card">
        <div class="card-header" id="headingDepnd">
          <h2 class="mb-0">
            <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse"
              data-target="#collapseDepnd" aria-expanded="false" aria-controls="collapseDepnd">

              <h5 style="margin:0px; color: blue;">Dependants</h5>

              </button>
          </h2>
        </div>
        <div id="collapseDepnd" class="collapse" aria-labelledby="headingDepnd" data-parent="#accordionExample">
          <div class="card-body">

              <div class="form-group"  style="padding: 0px; margin: 0px 0px 0px -100px; float: right; ">
                <button type="button" class="btn btn-primary" id="addDenpd"><i class="fa fa-plus-circle" aria-hidden="true"></i></button>
              </div><br>
              <div class="row" id="appendDenpd" style="background-color:white;">
              
                <div class=" col-lg-6 col-md-6">
                  <div class="form-group">
                    <label for="depdName">Name</label>
                    <input type="text" name="depdName[]" class="depdName" id="depdName_1" placeholder="Enter dependant name">
                    <span id="error_depdName_1" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="depdGender">Gender</label>
                    <select name="depdGender[]" id="depdGender_1">
                      <option value=''>Select gender</option>
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                    </select>
                    <span id="error_depdGender_1" class="text-danger"></span>
                  </div>
                  
                  <div class="form-group">
                    <label for="depdAddress">Address</label>
                    <input type="text" name="depdAddress[]" id="depdAddress_1" placeholder="Enter dependant address">
                    <span id="error_depdAddress_1" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="depdImage_1">Photo</label>
                    <input type="file" name="depdImage" id="depdImage_1" class="checkfile">
                    <span id="error_depdImage_1" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="depdPhone">Phone.</label>
                    <input type="text" name="depdPhone[]" id="depdPhone_1" placeholder="Enter phone">
                    <span id="error_depdPhone_1" class="text-danger"></span>
                  </div>
                </div>

                <div class="col-lg-6 col-md-6">
                  <div class="form-group">
                    <label for="depdDOB">Birth Date.</label>
                    <input type="date" name="depdDOB[]" id="depdDOB_1">
                    <span id="error_depdDOB_1" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="depdRelation">Relation</label>
                    <input type="text" name="depdRelation[]" id="depdRelation_1" placeholder="Enter relation">
                    <span id="error_depdRelation_1" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="depdCardType">Card Type</label>
                    <select name="depdCardType[]" id="depdCardType_1" class="cardType">
                      <option value=''>Select card type</option>
                      <option value='Ghana Card'>Ghana Card</option>
                      <option value='Voter's ID Card'>Voter's ID Card</option>
                      <option value='Driver Licence'>Driver Licence</option>
                      <option value='NHIS Card'>NHIS Card</option>
                      <option value='Passport'>Passport</option>
                    </select>
                    <span id="error_depdCardType_1" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="depdIDCard">Card Number</label>
                    <input type="text" name="depdIDCard[]" id="depdIDCard_1" placeholder="Enter card Number">
                    <span id="error_depdIDCard_1" class="text-danger"></span>
                  </div>                  
                </div>
              </div>

              </div>
        </div>
      </div>
      </div>

              <!-- <hr class="hasSSNIT" style="background-color: indianred;"> -->

              <div class="accordion" id="accordionExample">
          <div class="card">
        <div class="card-header" id="headingSSNIT">
          <h2 class="mb-0">
            <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse"
              data-target="#collapseSSNIT" aria-expanded="false" aria-controls="collapseSSNIT">

              <h5 class="hasSSNIT" style="margin:0px; color: blue;">SSNIT Beneficiary</h5>

              </button>
          </h2>
        </div>
        <div id="collapseSSNIT" class="collapse" aria-labelledby="headingSSNIT" data-parent="#accordionExample">
          <div class="card-body">

            <div class="form-group hasSSNIT"  style="padding: 0px; margin: 0px 0px 0px -100px; float: right; ">
            <button type="button" style="float: right;" class="btn btn-primary" id="addSSNIT"><i class="fa fa-plus-circle" aria-hidden="true"></i></button>
            </div><br>
              <div class="row hasSSNIT" id="appendSSNIT" style="background-color:white;">
                <div class=" col-lg-6 col-md-6">
                  <div class="form-group">
                    <label for="benfName_1">Name</label>
                    <input type="text" name="benfName[]" class="benfName" id="benfName_1" placeholder="Enter name">
                  </div>
                  <div class="form-group">
                    <label for="benfGender_1">Gender</label>
                    <select name="benfGender[]" id="benfGender_1">
                      <option value=''>Select gender</option>
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                    </select>
                    <span id="error_benfGender_1" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="benfAddress_1">Address</label>
                    <input type="text" name="benfAddress[]" id="benfAddress_1" placeholder="Enter address">
                    <span id="error_benfAddress_1" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="benfImage_1">Photo</label>
                    <input type="file" name="benfImage" id="benfImage_1" class="checkfile">
                    <span id="error_benfImage_1" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="benfPhone">Phone.</label>
                    <input type="text" name="benfPhone[]" id="benfPhone_1" placeholder="Enter phone">
                    <span id="error_benfPhone_1" class="text-danger"></span>
                  </div>
                </div>

                <div class="col-lg-6 col-md-6">
                  
                  <div class="form-group">
                    <label for="benfDOB_1">Birth Date.</label>
                    <input type="date" name="benfDOB[]" id="benfDOB_1">
                    <span id="error_benfDOB_1" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="benfRelation_1">Relation</label>
                    <input type="text" name="benfRelation[]" value="" id="benfRelation_1" placeholder="Enter relation name.">
                    <span id="error_benfRelation_1" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="benfCardType_1">Card Type</label>
                    <select name="benfCardType[]" id="benfCardType_1" class="cardType">
                      <option value=''>Select card type</option>
                      <option value='Ghana Card'>Ghana Card</option>
                      <option value='Voter's ID Card'>Voter's ID Card</option>
                      <option value='Driver Licence'>Driver Licence</option>
                      <option value='NHIS Card'>NHIS Card</option>
                      <option value='Passport'>Passport</option>
                    </select>
                    <span id="error_benfCardType_1" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="benfIDCard_1">Card Number</label>
                    <input type="text" name="benfIDCard[]" id="benfIDCard_1" placeholder="Enter card Number">
                    <span id="error_benfIDCard_1" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="percent_1">Percentage</label>
                    <input type="text" name="percent[]" id="percent_1" placeholder="Enter percentage">
                    <span id="error_benfIDCard_1" class="text-danger"></span>
                  </div>
                  </div>
                </div>

                </div>
                  </div>
                </div>
                </div><br>

              <div align="center">
                    <button type="button" name="previous_btn_depend_ssnit_benefit"
                      id="previous_btn_depend_ssnit_benefit" class="btn btn-dark">Previous</button>
                    <button type="button" name="btn_depend_ssnit_benefit" id="btn_depend_ssnit_benefit"
                      class="btn btn-info">Submit</button>
                  </div>
            </div>
          </div>
        </div>
          <span id="errors"></span>

      </div>
  
  </form>
  </div>`;

    $('.mainPage').html(html);
}

function htmlDepd(no) {
    let html = `
                <div class=" col-lg-6 col-md-6 removeDepnd_${no}">
                  <div class="form-group">
                    <label for="depdName">Name</label>
                    <input type="text" name="depdName[]" class="depdName" id="depdName_${no}" placeholder="Enter dependant name">
                    <span id="error_depdName_${no}" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="depdGender">Gender</label>
                    <select name="depdGender[]" id="depdGender_${no}">
                      <option value=''>Select gender</option>
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                    </select>
                    <span id="error_depdGender_${no}" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="depdAddress">Address</label>
                    <input type="text" name="depdAddress[]" id="depdAddress_${no}" placeholder="Enter dependant address">
                    <span id="error_depdAddress_${no}" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="depdImage_${no}">Photo</label>
                    <input type="file" name="depdImage" id="depdImage_${no}" class="checkfile">
                    <span id="error_depdImage_${no}" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="depdPhone_${no}">Phone.</label>
                    <input type="text" name="depdPhone[]" id="depdPhone_${no}" placeholder="Enter phone">
                    <span id="error_depdPhone_${no}" class="text-danger"></span>
                  </div>
                </div>

                <div class="col-lg-6 col-md-6 removeDepnd_${no}">
                  <i class="fa fa-minus-circle removeDepnd" id="${no}" aria-hidden="true" style="padding: 0px; margin: 0px 0px 0px -100px; float: right; color: red;"></i>

                  <div class="form-group">
                    <label for="depdDOB">Birth Date.</label>
                    <input type="date" name="depdDOB[]" id="depdDOB_${no}">
                    <span id="error_depdDOB_${no}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="depdRelation">Relation</label>
                    <input type="text" name="depdRelation[]" value="" id="depdRelation_${no}" placeholder="Enter relation">
                    <span id="error_depdRelation" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="depdCardType">Card Type</label>
                    <select name="depdCardType[]" id="depdCardType_${no}" class="cardType">
                      <option value=''>Select card type</option>
                      <option value='Ghana Card'>Ghana Card</option>
                      <option value='Voter's ID Card'>Voter's ID Card</option>
                      <option value='Driver Licence'>Driver Licence</option>
                      <option value='NHIS Card'>NHIS Card</option>
                      <option value='Passport'>Passport</option>
                    </select>
                    <span id="error_depdCardType_${no}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="depdIDCard">Card Number</label>
                    <input type="text" name="depdIDCard[]" id="depdIDCard_${no}" placeholder="Enter card Number">
                    <span id="error_depdIDCard_${no}" class="text-danger"></span>
                  </div>
                </div>`;
    return html;
}

function htmlSSNIT(no) {
    let html = `<div class=" col-lg-6 col-md-6 removeSSNIT_${no}">
                  <div class="form-group">
                    <label for="benfName_${no}">Name</label>
                    <input type="text" name="benfName[]" class="benfName" id="benfName_${no}" placeholder="Enter name">
                </div>
                  <div class="form-group">
                    <label for="benfGender_${no}">Gender</label>
                    <select name="benfGender[]" id="benfGender_${no}">
                      <option value=''>Select gender</option>
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                    </select>
                    <span id="error_benfGender_${no}" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="benfAddress_${no}">Address</label>
                    <input type="text" name="benfAddress[]" id="benfAddress_${no}" placeholder="Enter address">
                    <span id="error_benfAddress_${no}" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="benfImage_${no}">Photo</label>
                    <input type="file" name="benfImage" id="benfImage_${no}" class="checkfile">
                    <span id="error_benfImage_${no}" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="benfPhone">Phone.</label>
                    <input type="text" name="benfPhone[]" id="benfPhone_${no}" placeholder="Enter phone">
                    <span id="error_benfPhone_${no}" class="text-danger"></span>
                  </div>
                </div>

                <div class="col-lg-6 col-md-6 removeSSNIT_${no}">
                  <i class="fa fa-minus-circle removeSSNIT" id="${no}" aria-hidden="true" style="padding: 0px; margin: 20px 0px 0px -100px; float: right; color: red;"></i>

                  <div class="form-group">
                    <label for="benfDOB_${no}">Birth Date.</label>
                    <input type="date" name="benfDOB[]" id="benfDOB_${no}">
                    <span id="error_benfDOB_${no}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="benfRelation_${no}">Relation</label>
                    <input type="text" name="benfRelation[]" value="" id="benfRelation_${no}" placeholder="Enter relation name.">
                    <span id="error_benfRelation_${no}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="benfCardType_${no}">Card Type</label>
                    <select name="benfCardType[]" id="benfCardType_${no}" class="cardType">
                      <option value=''>Select card type</option>
                      <option value='Ghana Card'>Ghana Card</option>
                      <option value='Voter's ID Card'>Voter's ID Card</option>
                      <option value='Driver Licence'>Driver Licence</option>
                      <option value='NHIS Card'>NHIS Card</option>
                      <option value='Passport'>Passport</option>
                    </select>
                    <span id="error_benfCardType_${no}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="benfIDCard_${no}">Card Number</label>
                    <input type="text" name="benfIDCard[]" id="benfIDCard_${no}" placeholder="Enter card Number">
                    <span id="error_benfIDCard_${no}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="percent_${no}">Percentage</label>
                    <input type="text" name="percent[]" id="percent_${no}" placeholder="Enter percentage">
                  </div>
                  </div>
                </div>`;
    return html
}

function htmlEduBack(no) {
    let html = `<div class=" col-lg-6 col-md-6 removeEduBack_${no}">
                  <div class="form-group">
                    <label for="institution">Institution</label>
                    <input type="text" name="institution[]" class="institution" id="institution_${no}" placeholder="Enter institution name">
                  </div>
                  <div class="form-group">
                    <label for="instCountry">Country</label>
                    <select type="text" name="instCountry[]" id="instCountry_${no}">
                    <option value=''>Select country</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="qualification">Qualification/Certification</label>
                    <select type="text" name="qualification[]" id="qualification_${no}">
                    <option value=''>Select qualification/certication attained</option>
                    <option value='Basic Education Certificate'>Basic Education Certificate</option>
                    <option value='Vocational'>Vocational</option>
                    <option value='Technical'>Technical</option>
                    <option value='SSS'>SSS</option>
                    <option value='WASSEC'>WASSEC</option>
                    <option value='O Level'>O Level</option>
                    <option value='A Level'>A Level</option>
                    <option value='Diploma'>Diploma</option>
                    <option value='HND'>HND</option>
                    <option value='AHND'>AHND</option>
                    <option value='Degree'>Degree</option>
                    <option value='Masters'>Masters</option>
                    <option value='PhD'>PhD</option>
                    <option value='Others'>Others/Workshop/Seminar</option>
                    </select>
                  </div>
                </div>

                <div class="col-lg-6 col-md-6 removeEduBack_${no}">
                <i class="fa fa-minus-circle removeEduBack" id="${no}" aria-hidden="true" style="padding: 0px; margin: 20px 0px 0px -100px; float: right; color: red;"></i>
                  <div class="form-group" style="display: ">
                    <label for="">Program/ Course Major</label>
                    <input type="text" name="programMajor[]" id="programMajor_${no}" placeholder="Enter program, course major">
                  </div>
                  <div class="form-group">
                    <label for="fromDate">From Month/Year.</label>
                    <input type="month" name="fromDate[]" placeholder="Date: yyyy-mm" id="fromDate_${no}">
                  </div>
                  <div class="form-group">
                    <label for="toDate">To Month/Year.</label>
                    <input type="month" name="toDate[]" placeholder="Date: yyyy-mm" id="toDate_${no}">
                  </div>
                </div>`;

    getCountries(`instCountry_${no}`, '');

    return html
}

function htmlWorkExp(no) {
    let html = `<div class=" col-lg-6 col-md-6 removeWorkExp_${no}">
                  <div class="form-group">
                    <label for="orgName">Organization Name</label>
                    <input type="text" name="orgName[]" class="orgName" id="orgName_${no}" placeholder="Enter organization name">
                  </div>
                  <div class="form-group">
                    <label for="position">Position</label>
                    <input type="text" name="position[]" id="position_${no}" placeholder="Enter position">
                  </div>
                </div>

                <div class="col-lg-6 col-md-6 removeWorkExp_${no}">
                <i class="fa fa-minus-circle removeWorkExp" id="${no}" aria-hidden="true" style="padding: 0px; margin: 20px 0px 0px -100px; float: right; color: red;"></i>
                  <div class="form-group">
                    <label for="orgFromDate">From Month/Year.</label>
                    <input type="month" name="orgFromDate[]" placeholder="Date: yyyy-mm" id="orgFromDate_${no}">
                  </div>
                  <div class="form-group">
                    <label for="orgToDate">To Month/Year.</label>
                    <input type="month" name="orgToDate[]" placeholder="Date: yyyy-mm" id="orgToDate_${no}">
                  </div>
                </div>`;
    return html;
}

function htmlEmerg(no) {
    let html = `<div class=" col-lg-6 col-md-6 removeEmerg_${no}">
                  <div class="form-group">
                    <label for="emergenName">Name</label>
                    <input type="text" name="emergenName[]" class="emergenName" id="emergenName_${no}" placeholder="Enter emergency person name">
                    <span id="error_emergenName_${no}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="emergenRelation">Relation.</label>
                    <input type="text" name="emergenRelation[]" id="emergenRelation_${no}" placeholder="Enter relation">
                    <span id="error_emergenRelation_${no}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="emergenPhone">Phone.</label>
                    <input type="text" name="emergenPhone[]" id="emergenPhone_${no}" placeholder="Enter phone">
                    <span id="error_emergenPhone_${no}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="emergGender">Gender</label>
                    <select name="emergGender[]" id="emergGender_${no}">
                      <option value=''>Select gender</option>
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                    </select>
                    <span id="error_emergGender_${no}" class="text-danger"></span>
                  </div>
                </div>

                <div class="col-lg-6 col-md-6 removeEmerg_${no}">
                  <i class="fa fa-minus-circle removeEmerg" id="${no}" aria-hidden="true" style="padding: 0px; margin: 20px 0px 0px -100px; float: right; color: red;"></i>
                  <div class="form-group">
                    <label for="emergenAddress">Address.</label>
                    <input type="text" name="emergenAddress[]" id="emergenAddress_${no}" placeholder="Enter address">
                    <span id="error_emergenAddress_${no}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="emergenCardType">Card Type</label>
                    <select name="emergenCardType[]" id="emergenCardType_${no}" class="cardType">
                      <option value=''>Select card type</option>
                      <option value='Ghana Card'>Ghana Card</option>
                      <option value='Voter's ID Card'>Voter's ID Card</option>
                      <option value='Driver Licence'>Driver Licence</option>
                      <option value='NHIS Card'>NHIS Card</option>
                      <option value='Passport'>Passport</option>
                    </select>
                    <span id="error_emergenCardType_${no}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="emergenIDCard">Card Number</label>
                    <input type="text" name="emergenIDCard[]" id="emergenIDCard_${no}" placeholder="Enter card Number">
                    <span id="error_emergenIDCard_${no}" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="emergImage">Photo</label>
                    <input type="file" name="emergImage" id="emergImage_${no}" class="checkfile">
                    <span id="error_emergImage_${no}" class="text-danger"></span>
                  </div>
              </div>`;
    return html;
}

const basic = ['title', 'fName', 'mName', 'lName', 'gender', 'bdate', 'mStatus', 'phone', 'email', 'empimage'];
const address_id = ['residAddress', 'nearmark', 'postAddress', 'town', 'region', 'gpCode', 'cardType', 'idCard', 'tin', 'ssnitNo', 'ssnitimage'];
const employment = ['dateEmplyed', 'staffID', 'jobTitle', 'dept', 'immediatesuper', 'diimmediatesuper'];
const bank = ['salaryStruct', 'bankName', 'accNum', 'branch'];
const spouse_nofk = ['spName', 'spcardType', 'spIDCard', 'spphone', 'spDOB', 'nOKName', 'nOKRelation', 'noKGender', 'nOKAddress', 'noKCardType', 'noKImage', 'noKIDCard', 'nOkPhone', 'emergenName', 'emergenPhone'];

function clearError(inputsArray) {
    for (let i = 0; i < inputsArray.length; i++) {
        $('#error_' + inputsArray[i]).text('');
        // $('#' + value.param).addClass('has-error');
        $('.invalid').css({
            'border-color': 'black',
            'color': 'black'
        });
        $('#' + inputsArray[i]).removeClass(`
    invalid `);
    }
}

// Validate inputs from backend
function validateInputs(url, data, list1, tabpane1, list2, tabpane2, inputFields) {
    const arrayError = ['institution', 'instCountry', 'qualification', 'programMajor', 'fromDate', 'toDate', 'fromDate', 'orgName', 'position', 'orgFromDate', 'orgToDate', 'emergenName', 'emergenRelation', 'emergenPhone', 'emergGender', 'emergenAddress', 'emergenCardType', 'emergenIDCard', 'depdName', 'depdGender', 'depdAddress', 'depdDOB', 'depdRelation', 'depdCardType', 'depdIDCard', 'benfName', 'benfGender', 'benfAddress', 'benfDOB', 'benfRelation', 'benfCardType', 'benfIDCard', 'percent']
    $.ajax({
        type: 'POST',
        enctype: 'multipart/form-data',
        url: url,
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        success: function(response) {
            console.log('In validation success');
            console.log(response);

            $('#' + list1).removeClass('active active_tab1');
            $('#' + list1).removeAttr('href data-toggle');
            $('#' + tabpane1).removeClass('active');
            $('#' + list1).addClass('inactive_tab1');
            $('#' + list2).removeClass('inactive_tab1');
            $('#' + list2).addClass('active_tab1 active');
            $('#' + list2).attr('href', '#' + tabpane2);
            $('#' + list2).attr('data-toggle', 'tab');
            $('#' + tabpane2).addClass('active in');

            clearError(inputFields);
            $('#errors').text('');
        },
        error: function(error) {
            console.log('In validation error');
            console.log(error);
            if (error.status === 422) {
                clearError(basic);
                $('#errors').text('');
                let errors = '';
                $.each(error.responseJSON.validationErrors, function(key, value) {
                    if (arrayError.includes(value.param)) {
                        errors += `<p> ${value.msg}</p>`;
                    } else {
                        // clearError(basic);
                        $('#error_' + value.param).text(value.msg);
                        // $('#' + value.param).addClass('has-error');
                        $('#' + value.param).addClass(`invalid`);
                        $('.invalid').css({
                            'border-color': 'red',
                            'color': 'red'
                        });
                    }
                })
                if (errors) {
                    $('#errors').html('<div class="alert alert-danger">' + errors + '</div>');
                } else {
                    $('#errors').text('');
                }

                // $('.user-message').css('display', 'flex')
                // $('.user-message').html(errors);
            } else {
                console.log(error);
                $('#errors').css('display', 'flex')
                $('#errors').html('Sorry something went wrong, try again');
            }
        }
    });
}

// Handle the previous btn
function previousBtn(cur_list, cur_tabpane, prev_list, prev_tabpane) {
    $('#' + cur_list).removeClass('active active_tab1');
    $('#' + cur_list).removeAttr('href data-toggle');
    $('#' + cur_tabpane).removeClass('active in');
    $('#' + cur_list).addClass('inactive_tab1');
    $('#' + prev_list).removeClass('inactive_tab1');
    $('#' + prev_list).addClass('active_tab1 active');
    $('#' + prev_list).attr('href', '#' + '#' + prev_tabpane);
    $('#' + prev_list).attr('data-toggle', 'tab');
    $('#' + prev_tabpane).addClass('active in');
    // });
}

$(document).ready(function() {

    $(document).on('click', '.add-employee-form', async function() {
        unactive()
        $('.add-employee-form').css('color', '');
        $('#employeeFeat').modal('hide');

        checkPoint('add', 'add-employee-form'); // from the general-funct
    });


    // For basic info
    $(document).on('click', '#btn_basic_info', function() {
        let form = $('#employ_form');
        let form_data = form[0];
        let data = new FormData(form_data);
        validateInputs('/admin/validate-basic', data, 'list_basic_info', 'basic_info', 'list_address_ids', 'address_ids', basic);

    });
    // from general function
    $(document).on('change', '.checkfile', function() {
        checkImage($(this).attr('id'));
    }).change();

    $(document).on('change', '.checkfilePDF', function() {
        checkPDF($(this).attr('id'));
    }).change();

    $(document).on('click', '#previous_btn_address_ids', function() {
        previousBtn('list_address_ids', 'address_ids', 'list_basic_info', 'basic_info');
    });

    //For Addresss_ids
    $(document).on('click', '#btn_address_ids', function() {
        let form = $('#employ_form');
        let form_data = form[0];
        let data = new FormData(form_data);
        validateInputs('/admin/validate-address', data, 'list_address_ids', 'address_ids', 'list_emplmnt_work_edu', 'emplmnt_work_edu', address_id);
    });

    $(document).on('click', '#previous_btn_emplmnt_work_edu', function() {
        previousBtn('list_emplmnt_work_edu', 'emplmnt_work_edu', 'list_address_ids', 'address_ids');
    });

    $(document).on('click', '#btn_emplmnt_work_edu', function() {
        let form = $('#employ_form');
        let form_data = form[0];
        let data = new FormData(form_data);
        validateInputs('/admin/validate-employmnet', data, 'list_emplmnt_work_edu', 'emplmnt_work_edu', 'list_bank_details', 'bank_details', employment);
    });

    $(document).on('click', '#previous_btn_bank_details', function() {
        previousBtn('list_bank_details', 'bank_details', 'list_emplmnt_work_edu', 'emplmnt_work_edu');
    });

    // For bank details
    $(document).on('click', '#btn_bank_details', function() {
        let form = $('#employ_form');
        let form_data = form[0];
        let data = new FormData(form_data);
        validateInputs('/admin/validate-bank', data, 'list_bank_details', 'bank_details', 'list_spouse_nofk', 'spouse_nofk', bank);

        // hide or show spouse detail section based on marriage status
        const mStatus = $('#mStatus').val();
        if (mStatus != 'Married') {
            $('.hasSpouse').hide();
        } else {
            $('.hasSpouse').show();
        }

    });

    $(document).on('click', '#previous_btn_spouse_nofk', function() {
        previousBtn('list_spouse_nofk', 'spouse_nofk', 'list_bank_details', 'bank_details');
    });

    // For spouse and NoK details
    $(document).on('click', '#btn_spouse_nofk', function() {
        let form = $('#employ_form');
        let form_data = form[0];
        let data = new FormData(form_data);
        validateInputs('/admin/validate-spouseNoK', data, 'list_spouse_nofk', 'spouse_nofk', 'list_depend_ssnit_benefit', 'depend_ssnit_benefit', spouse_nofk);

        // hide or show ssnit beneficiary detail section based on ssnit number if empty or not
        const ssnitNo = $('#ssnitNo').val();
        if (ssnitNo === '') {
            $('.hasSSNIT').hide();
        } else {
            $('.hasSSNIT').show();
        }
    });

    $(document).on('click', '#previous_btn_depend_ssnit_benefit', function() {
        previousBtn('list_depend_ssnit_benefit', 'depend_ssnit_benefit', 'list_spouse_nofk', 'spouse_nofk');
    });

    // For dependant and ssnit benefits
    $(document).on('click', '#btn_depend_ssnit_benefit', function() {
        let form = $('#employ_form');
        let form_data = form[0];
        let data = new FormData(form_data);
        // validateInputs('validate-depdSBen', data, 'list_depend_ssnit_benefit', 'depend_ssnit_benefit', 'list_basic_info', 'basic_info', spouse_nofk);
        $.ajax({
            type: 'POST',
            enctype: 'multipart/form-data',
            url: '/admin/validate-depdSBen',
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            success: function(response) {
                console.log('In validation success');
                console.log(response);
                displayDashboard();
                $('title').html('Employees Info');
                $('.getAllEmploy').css("color", 'blue');
                $('.add-employee-form').css("color", '');
                $('#errors').text('');

            },
            error: function(error) {
                console.log('In validation error');
                console.log(error);
                if (error.status === 422) {
                    $('#errors').text('');
                    let errors = '';
                    $.each(error.responseJSON.validationErrors, function(key, value) {
                        errors += ` <p> ${value.msg} </p>`;
                    })

                    if (errors) {
                        $('#errors').html('<div class="alert alert-warning">' + errors + '</div>');
                    } else {
                        $('#errors').text('');
                    }
                } else {
                    console.log(error);
                    $('#errors').html('<div class="alert alert-danger">Sorry something went wrong, try again</div>');
                }
            }
        });
    });

    $(document).on('click', '#previous_btn_depend_ssnit_benefit', function() {
        previousBtn('list_depend_ssnit_benefit', 'depend_ssnit_benefit', 'list_spouse_nofk', 'spouse_nofk');
    });

    let MaxDepd = 100;
    let addDepdCount = 1;
    let AddDepdID = $("#appendDenpd");
    let addDepdLegth = AddDepdID.length;

    $(document).on('click', '#addDenpd', function() {
        addDepdLegth = +$('.depdName').length;
        // console.log('addDepdLegth', addDepdLegth);
        if (addDepdLegth <= MaxDepd) {
            addDepdCount = +$('.depdName').length;
            addDepdCount++;
            // console.log('addDepdCount', addDepdCount);
            $('#appendDenpd').append(htmlDepd(addDepdCount));
            addDepdLegth++;
        }
        return false
    });

    $(document).on('click', '.removeDepnd', function() {
        $('.removeDepnd_' + $(this).attr('id')).remove();
        addDepdCount--;
        addDepdLegth--;
        return false;
    });

    let MaxSSNIT = 100;
    let addSSNITCount = 1;
    let AddSSNITID = $("#appendSSNIT");
    let addSSNITLegth = AddSSNITID.length;

    $(document).on('click', '#addSSNIT', function() {
        addSSNITLegth = +$('.benfName').length;
        // console.log('addSSNITLegth', addSSNITLegth);
        if (addSSNITLegth <= MaxSSNIT) {
            addSSNITCount = +$('.benfName').length;
            addSSNITCount++;
            // console.log('addSSNITCount', addSSNITCount);
            $('#appendSSNIT').append(htmlSSNIT(addSSNITCount));
            addSSNITLegth++;
        }
        return false
    });

    $(document).on('click', '.removeSSNIT', function() {
        $('.removeSSNIT_' + $(this).attr('id')).remove();
        addSSNITCount--;
        addSSNITLegth--;
        return false;
    });

    let MaxEdu = 100;
    let addEduCount = 1;
    let AddEduID = $("#appendEduBack");
    let addEduLegth = AddEduID.length;

    $(document).on('click', '#addEduBack', function() {
        addEduLegth = +$('.institution').length
            // console.log('addEdulegth', $('.institution').length);
        if (addEduLegth <= MaxEdu) {
            addEduCount = +$('.institution').length
            addEduCount++;
            // console.log('addEduCount', addEduCount);
            $('#appendEduBack').append(htmlEduBack(addEduCount));
            addEduLegth++;
        }
        return false
    });

    $(document).on('click', '.removeEduBack', function() {
        $('.removeEduBack_' + $(this).attr('id')).remove();
        addEduCount--;
        addEduLegth--;
        return false;
    });

    let MaxWorkExp = 100;
    let addWorkExpCount = 1;
    let AddWorkExpID = $("#appendWorkExp");
    let addWorkExpLegth = AddWorkExpID.length;

    $(document).on('click', '#addWorkExp', function() {
        addWorkExpLegth = +$('.orgName').length;
        console.log('addWorkExpLegth', addWorkExpLegth);
        if (addWorkExpLegth <= MaxWorkExp) {
            addWorkExpCount = +$('.orgName').length;
            addWorkExpCount++;
            console.log('addWorkCount', addWorkExpCount);
            $('#appendWorkExp').append(htmlWorkExp(addWorkExpCount));
            addWorkExpLegth++;
        }
        return false
    });

    $(document).on('click', '.removeWorkExp', function() {
        $('.removeWorkExp_' + $(this).attr('id')).remove();
        addWorkExpCount--;
        addWorkExpLegth--;
        return false;
    });

    let MaxEmerg = 100;
    let addEmergCount = 1;
    let AddEmergID = $("#appendEmerg");
    let addEmergLegth = AddEmergID.length;

    $(document).on('click', '#addEmerg', function() {
        addEmergLegth = +$('.emergenName').length;
        console.log('addEmergLegth', addEmergLegth);
        if (addEmergLegth <= MaxEmerg) {
            addEmergCount = +$('.emergenName').length;
            addEmergCount++;
            console.log('addEmergCount', addEmergCount);
            $('#appendEmerg').append(htmlEmerg(addEmergCount));
            addEmergLegth++;
        }
        return false
    });

    $(document).on('click', '.removeEmerg', function() {
        $('.removeEmerg_' + $(this).attr('id')).remove();
        addEmergCount--;
        addEmergLegth--;
        return false;
    });

    // Editing data
    $(document).on('click', '.editEmployee', function() {
        // alert($(this).attr('id'));
        checkPoint('edit', 'getAllEmploy'); // from the general-funct
        logUIAccess('Clicked edit employee', '.editEmployee');

        $.ajax({
            type: 'GET',
            url: `/admin/getEmployee/${$(this).attr('id')}`,
            // processData: false,
            contentType: 'application/json',
            success: function(response) {
                // console.log('Array one ==>', response.employee[0]);

                addForm();
                // alert(response.employee[1].jobTitle);
                $('.head').html('Edit Employee Info')
                $('.box').css("background-color", 'gray');
                $('#mode').val('edit');
                $('#empID').val(`${response.employee[0].id}`);
                $('#emph').val(`${response.employee[0].emplID}`);
                if (response.employee[1]) {
                    getJobTs('jobTitle', response.employee[0].jobdescId, response.employee[1].jobTitle);
                } else { getJobTs('jobTitle', '', ''); }
                if (response.employee[2]) {
                    getDeparts('dept', response.employee[0].departmentId, response.employee[2].deptName);
                } else { getDeparts('dept', '', '') }
                if (response.employee[0].reporttos[0].immediateSupEmplyId) {
                    getEmployees('immediatesuper', response.employee[0].reporttos[0].immediateSupEmplyId, response.employee[4].name, response.employee[0].id);
                } else { getEmployees('immediatesuper', '', '', ''); }

                if (response.employee[6]) {
                    getAnnualLeaves('leavtype', response.employee[0].leaveTypeId, `${response.employee[6].leaveType} | ${response.employee[6].nofdays} days`);
                } else { getAnnualLeaves('leavtype', '', ''); }
                // getEmployees('diimmediatesuper', '', '');
                if (response.employee[3]) {
                    getSalaries('salaryStruct', response.employee[0].salarystructureId, `${response.employee[3].basic.toFixed(2) || ''} ${response.employee[3].description || ''} Applied Tax ${response.employee[3].taxDeduct || 0} % Applied SSNIT ${response.employee[3].ssintDeduct || 0}`);
                } else { getSalaries('salaryStruct', '', ''); }

                // Drop downs
                getTitle('title', response.employee[0].title);
                getGender('gender', response.employee[0].gender);
                marigeStatus('mStatus', response.employee[0].maritalStatus);
                getCardType('cardType', response.employee[0].cardType);
                if (response.employee[0].addresses[0].region) {
                    getRegion('region', response.employee[0].addresses[0].region);
                } else {
                    getRegion('region', '');
                }


                // Input fields
                $('#fName').val(`${response.employee[0].fName || ''}`);
                $('#mName').val(`${response.employee[0].mName || ''}`);
                $('#lName').val(`${response.employee[0].lName || ''}`);
                $('#bdate').prop("type", "text");
                $('#bdate').val(`${getDate(response.employee[0].dob, false) || ''}`);
                // $('#bdate').prop("type", "date");
                $('#phone').val(`${response.employee[0].phone || ''}`);
                $('#email').val(`${response.employee[0].email || ''}`);

                $('#residAddress').val(`${response.employee[0].addresses[0].residAddress || ''}`);
                $('#nearmark').val(`${response.employee[0].addresses[0].nearestLandmark || ''}`);
                $('#postAddress').val(`${response.employee[0].addresses[0].postAddress || ''}`);
                $('#town').val(`${response.employee[0].addresses[0].town || ''}`);
                $('#gpCode').val(`${response.employee[0].addresses[0].gpGPSCode || ''}`);
                $('#idCard').val(`${response.employee[0].cardNo || ''}`);
                $('#tin').val(`${response.employee[0].tin || ''}`);
                $('#ssnitNo').val(`${response.employee[0].ssnitNo || ''}`);

                $('#dateEmplyed').prop("type", "text");
                $('#dateEmplyed').val(`${getDate(response.employee[0].dateEmplyed, false) || ''}`);
                $('#staffID').prop("readonly", true);
                $('#staffID').val(`${response.employee[0].staffID || ''}`);

                if (response.employee[0].bankdetails[0]) {
                    $('#bankName').val(`${response.employee[0].bankdetails[0].bankName || ''}`);
                    $('#accNum').val(`${response.employee[0].bankdetails[0].accNo || ''}`);
                    $('#branch').val(`${response.employee[0].bankdetails[0].branch || ''}`);
                }

                // Spouse
                if (response.employee[0].spouses.length && $('#mStatus').val()) {
                    $('#spouseID').val(`${response.employee[0].spouses[0].id || ''}`);
                    $('#spName').val(`${response.employee[0].spouses[0].spouseName || ''}`);
                    $('#spDOB').val(`${getDate(response.employee[0].spouses[0].spouseDOB, false) || ''}`);
                    $('#spphone').val(`${response.employee[0].spouses[0].spousePhone || ''}`);
                    getCardType(`spcardType`, `${response.employee[0].spouses[0].spouseIDType || ''}`);
                    $('#spIDCard').val(`${response.employee[0].spouses[0].spouseIDNo || ''}`);
                }

                // Next of kin
                if (response.employee[0].nextofkin) {

                    // let nOKinID = `<input type="text" hidde name="nOKinID" id="nOKinID" value="${response.employee[0].nextofkin.id || ''}">`;
                    // $('.nOKinID').html(nOKinID);

                    $('#nOKinID').val(`${response.employee[0].nextofkin.id || ''}`)
                    $('#nOKName').val(`${response.employee[0].nextofkin.nokName || ''}`);
                    $('#nOKRelation').val(`${response.employee[0].nextofkin.nokRelation || ''}`);
                    $('#nOkPhone').val(`${response.employee[0].nextofkin.nokPhone || ''}`);
                    getGender(`noKGender`, `${response.employee[0].nextofkin.nokGender || ''}`);
                    $('#nOKAddress').val(`${response.employee[0].nextofkin.nokAddress || ''}`);
                    getCardType(`noKCardType`, `${response.employee[0].nextofkin.nokIDType || ''}`);
                    $('#noKIDCard').val(`${response.employee[0].nextofkin.nokIDNo || ''}`);
                }

                // Educational background
                if (response.employee[0].educationbacgrounds.length > 0) {
                    let html = '';
                    for (let i = 0; i < response.employee[0].educationbacgrounds.length; i++) {
                        if (!response.employee[0].educationbacgrounds[i].deleted) {
                            let rmv = '';
                            if (i !== 0) {
                                rmv = `<i class="fa fa-minus-circle removeEduBack" id="${i + 1}" aria-hidden="true" style="padding: 0px; margin: 20px 0px 0px -100px; float: right; color: red;"></i>`;
                            } else { rmv = ''; }

                            html += `<div class=" col-lg-6 col-md-6 removeEduBack_${i + 1}">
                  <div class="form-group">
                    <label for="institution">Institution</label>
                    <input type="text" name="institution[]" class="institution" id="institution_${i + 1}" placeholder="Enter institution name" value="${response.employee[0].educationbacgrounds[i].institution || ''}">
                    <input type="text" hidden name="educateID[]" value="${response.employee[0].educationbacgrounds[i].id }">
                  </div>
                  <div class="form-group">
                    <label for="instCountry">Country</label>
                    <select type="text" name="instCountry[]" id="instCountry_${i + 1}">
                    <option value=''>Select country</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="qualification">Qualification/Certification</label>
                    <select type="text" name="qualification[]" id="qualification_${i + 1}">
                    
                    </select>
                  </div>
                </div>

                <div class="col-lg-6 col-md-6 removeEduBack_${i + 1}">
                ${rmv}
                  <div class="form-group" style="display: ">
                    <label for="">Program/ Course Major</label>
                    <input type="text" name="programMajor[]" id="programMajor_${i + 1}" placeholder="Enter program, course major" value="${response.employee[0].educationbacgrounds[i].programMajor || ''}">
                  </div>
                  <div class="form-group">
                    <label for="fromDate">From Month/Year.</label>
                    <input type="${getType(response.employee[0].educationbacgrounds[i].fromMonthYear, 'month')}" name="fromDate[]" class="chngType" placeholder="Date: yyyy-mm" id="fromDate_${i + 1}" value="${getDate(response.employee[0].educationbacgrounds[i].fromMonthYear, true) || ''}">
                  </div>
                  <div class="form-group">
                    <label for="toDate">To Month/Year.</label>
                    <input type="text" name="toDate[]" class="chngType" placeholder="Date: yyyy-mm" id="toDate_${i + 1}" value="${getDate(response.employee[0].educationbacgrounds[i].toMonthYear, true) || ''}">
                  </div>
                </div>`;

                            getCountries(`instCountry_${i + 1}`, `${response.employee[0].educationbacgrounds[i].country || ''}`);
                            getQualify(`qualification_${i + 1}`, `${response.employee[0].educationbacgrounds[i].qualification || ''}`);
                        }
                    }
                    $('#appendEduBack').html(html);
                } else {
                    console.log('instCountry_1 ===>');
                    getCountries('instCountry_1', '');
                }
                // Work experience
                if (response.employee[0].workexperiences.length > 0) {
                    let html = '';
                    for (let i = 0; i < response.employee[0].workexperiences.length; i++) {
                        if (!response.employee[0].workexperiences[i].deleted) {
                            let rmv = '';
                            if (i !== 0) {
                                rmv = `<i class="fa fa-minus-circle removeWorkExp" id="${i + 1}" aria-hidden="true" style="padding: 0px; margin: 20px 0px 0px -100px; float: right; color: red;"></i>`;
                            } else { rmv = ''; }

                            html += `<div class=" col-lg-6 col-md-6 removeWorkExp_${i+1}">
                  <div class="form-group">
                    <label for="orgName">Organization Name</label>
                    <input type="text" class="orgName" name="orgName[]" id="orgName_${i + 1}" placeholder="Enter organization name" value="${response.employee[0].workexperiences[i].organization || ''}">
                    <input type="text" hidden name="workID[]" value="${response.employee[0].workexperiences[i].id }">
                  </div>
                  <div class="form-group">
                    <label for="position">Position</label>
                    <input type="text" name="position[]" id="position_${i + 1}" placeholder="Enter position" value="${response.employee[0].workexperiences[i].position || ''}">
                  </div>
                </div>

                <div class="col-lg-6 col-md-6 removeWorkExp_${i + 1}">
                ${rmv}
                
                  <div class="form-group">
                    <label for="orgFromDate">From Month/Year.</label>
                    <input type="${getType(response.employee[0].workexperiences[i].fromMonthYear, 'month')}" name="orgFromDate[]" class="chngType" placeholder="Date: yyyy-mm" id="orgFromDate_${i + 1}" value="${getDate(response.employee[0].workexperiences[i].fromMonthYear, true) || ''}">
                  </div>
                  <div class="form-group">
                    <label for="orgToDate">To Month/Year.</label>
                    <input type="${getType(response.employee[0].workexperiences[i].toMonthYear, 'month')}" name="orgToDate[]" class="chngType" placeholder="Date: yyyy-mm" id="orgToDate_${i + 1}" value="${getDate(response.employee[0].workexperiences[i].toMonthYear, true) || ''}">
                  </div>
                </div>`;
                        }
                    }
                    $('#appendWorkExp').html(html);
                }
                // Emergency contact
                if (response.employee[0].emergencycontacts.length > 0) {
                    let html = '';
                    for (let i = 0; i < response.employee[0].emergencycontacts.length; i++) {
                        if (!response.employee[0].emergencycontacts[i].deleted) {
                            let rmv = '';
                            if (i !== 0) {
                                rmv = `<i class="fa fa-minus-circle removeEmerg" id="${i + 1}" aria-hidden="true" style="padding: 0px; margin: 20px 0px 0px -100px; float: right; color: red;"></i>`;
                            } else { rmv = ''; }

                            html += `<div class=" col-lg-6 col-md-6 removeEmerg_${i + 1}">
                  <div class="form-group">
                    <label for="emergenName">Name</label>
                    <input type="text" name="emergenName[]" class="emergenName" id="emergenName_${i + 1}" placeholder="Enter emergency person name" value="${response.employee[0].emergencycontacts[i].emergName || ''}">
                    <input type="text" hidden name="emergID[]" value="${response.employee[0].emergencycontacts[i].id }">
                    <span id="error_emergenName_${i + 1}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="emergenRelation">Relation.</label>
                    <input type="text" name="emergenRelation[]" id="emergenRelation_${i + 1}" placeholder="Enter relation" 
                    value="${response.employee[0].emergencycontacts[i].emergRelation || ''}">
                    <span id="error_emergenRelation_${i + 1}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="emergenPhone">Phone.</label>
                    <input type="text" name="emergenPhone[]" id="emergenPhone_${i + 1}" placeholder="Enter phone"
                    value="${response.employee[0].emergencycontacts[i].emergPhone || ''}">
                    <span id="error_emergenPhone_${i + 1}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="emergGender">Gender</label>
                    <select name="emergGender[]" id="emergGender_${i + 1}">
                      
                    </select>
                    <span id="error_emergGender_${i + 1}" class="text-danger"></span>
                  </div>
                </div>

                <div class="col-lg-6 col-md-6 removeEmerg_${i + 1}">
                  ${rmv}
                  <div class="form-group">
                    <label for="emergenAddress">Address.</label>
                    <input type="text" name="emergenAddress[]" id="emergenAddress_${i + 1}" placeholder="Enter address"
                    value="${response.employee[0].emergencycontacts[i].emergAddress || ''}">
                    <span id="error_emergenAddress_${i + 1}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="emergenCardType">Card Type</label>
                    <select name="emergenCardType[]" id="emergenCardType_${i + 1}" class="cardType">
                      
                    </select>
                    <span id="error_emergenCardType_${i + 1}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="emergenIDCard">Card Number</label>
                    <input type="text" name="emergenIDCard[]" id="emergenIDCard_${i + 1}" placeholder="Enter card Number"
                    value="${response.employee[0].emergencycontacts[i].emergIDNo || ''}">
                    <span id="error_emergenIDCard_${i + 1}" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="emergImage">Photo</label>
                    <input type="file" name="emergImage" id="emergImage_${i + 1}" class="checkfile">
                    <span id="error_emergImage_${i + 1}" class="text-danger"></span>
                  </div>
              </div>`;

                            getGender(`emergGender_${i + 1}`, `${response.employee[0].emergencycontacts[i].emergGender || ''}`);
                            getCardType(`emergenCardType_${i + 1}`, `${response.employee[0].emergencycontacts[i].emergIDType || ''}`)
                        }
                    }
                    $('#appendEmerg').html(html);

                }
                // SSNIT beneficiaries
                if (response.employee[0].ssnitbenfits.length > 0) {
                    let html = '';
                    // console.log('Emer name', `${response.employee[0].emergencycontacts.length}`);
                    for (let i = 0; i < response.employee[0].ssnitbenfits.length; i++) {
                        if (!response.employee[0].ssnitbenfits[i].deleted) {
                            let rmv = '';
                            if (i !== 0) {
                                rmv = `<i class="fa fa-minus-circle removeSSNIT" id="${i + 1}" aria-hidden="true" style="padding: 0px; margin: 20px 0px 0px -100px; float: right; color: red;"></i>`;
                            }
                            html += `<div class=" col-lg-6 col-md-6 removeSSNIT_${i + 1}">
                  <div class="form-group">
                    <label for="benfName_${i + 1}">Name</label>
                    <input type="text" name="benfName[]" class="bendName" id="benfName_${i + 1}" placeholder="Enter name" value="${response.employee[0].ssnitbenfits[i].benName || ''}">
                    <input type="text" hidden name="benfID[]" value="${response.employee[0].ssnitbenfits[i].id }">
                </div>
                  <div class="form-group">
                    <label for="benfGender_${i + 1}">Gender</label>
                    <select name="benfGender[]" id="benfGender_${i + 1}">
                      
                    </select>
                    <span id="error_benfGender_${i + 1}" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="benfAddress_${i + 1}">Address</label>
                    <input type="text" name="benfAddress[]" id="benfAddress_${i + 1}" placeholder="Enter address" value="${response.employee[0].ssnitbenfits[i].benAddress || ''}">
                    <span id="error_benfAddress_${i + 1}" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="benfImage_${i + 1}">Photo</label>
                    <input type="file" name="benfImage" id="benfImage_${i + 1}" class="checkfile">
                    <span id="error_benfImage_${i + 1}" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="benfPhone">Phone.</label>
                    <input type="text" name="benfPhone[]" id="benfPhone_${i + 1}" placeholder="Enter phone" value="${response.employee[0].ssnitbenfits[i].benPhone || ''}">
                    <span id="error_benfPhone_${i + 1}" class="text-danger"></span>
                  </div>
                </div>

                <div class="col-lg-6 col-md-6 removeSSNIT_${i + 1}">
                  ${rmv}

                  <div class="form-group">
                    <label for="benfDOB_${i + 1}">Birth Date.</label>
                    <input type="${getType(response.employee[0].ssnitbenfits[i].benfDOB, 'date')}" name="benfDOB[]" id="benfDOB_${i + 1}" class="chngTyp" value="${getDate(response.employee[0].ssnitbenfits[i].benfDOB, false) || ''}">
                    <span id="error_benfDOB_${i + 1}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="benfRelation_${i + 1}">Relation</label>
                    <input type="text" name="benfRelation[]" value="" id="benfRelation_${i + 1}"
                    placeholder="Enter relation name." value="${response.employee[0].ssnitbenfits[i].benRelation || ''}">
                    <span id="error_benfRelation_${i + 1}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="benfCardType_${i + 1}">Card Type</label>
                    <select name="benfCardType[]" id="benfCardType_${i + 1}" class="cardType">
                      
                    </select>
                    <span id="error_benfCardType_${i + 1}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="benfIDCard_${i + 1}">Card Number</label>
                    <input type="text" name="benfIDCard[]" id="benfIDCard_${i + 1}" placeholder="Enter card Number" value="${response.employee[0].ssnitbenfits[i].benIDNo || ''}">
                    <span id="error_benfIDCard_${i + 1}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="percent_${i + 1}">Percentage</label>
                    <input type="text" name="percent[]" id="percent_${i + 1}" placeholder="Enter percentage" value="${response.employee[0].ssnitbenfits[i].percentage || ''}">
                  </div>
                  </div>
                </div>`;

                            getGender(`benfGender_${i + 1}`, `${response.employee[0].ssnitbenfits[i].benfGender || ''}`);
                            getCardType(`benfCardType_${i + 1}`, `${response.employee[0].ssnitbenfits[i].benIDType || ''}`)
                        }
                    }
                    $('#appendSSNIT').html(html);
                }
                // Dependants
                if (response.employee[0].dependants.length > 0) {
                    let html = '';
                    for (let i = 0; i < response.employee[0].dependants.length; i++) {
                        if (!response.employee[0].dependants[i].deleted) {
                            let rmv = '';
                            if (i !== 0) {
                                rmv = `<i class="fa fa-minus-circle removeDepnd" id="${i + 1}" aria-hidden="true" style="padding: 0px; margin: 20px 0px 0px -100px; float: right; color: red;"></i>`;
                            }

                            html += `<div class=" col-lg-6 col-md-6 removeDepnd_${i+1}">
                  <div class="form-group">
                    <label for="depdName">Name</label>
                    <input type="text" name="depdName[]" class="depdName" id="depdName_${i+1}" placeholder="Enter dependant name" value="${response.employee[0].dependants[i].dependName || ''}">
                    <input type="text" hidden name="depndID[]" value="${response.employee[0].dependants[i].id }">
                    <span id="error_depdName_${i+1}" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="depdGender">Gender</label>
                    <select name="depdGender[]" id="depdGender_${i+1}">
                    </select>
                    <span id="error_depdGender_${i+1}" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="depdAddress">Address</label>
                    <input type="text" name="depdAddress[]" id="depdAddress_${i+1}" placeholder="Enter dependant address" value="${response.employee[0].dependants[i].dependAddress || ''}">
                    <span id="error_depdAddress_${i+1}" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="depdImage_${i+1}">Photo</label>
                    <input type="file" name="depdImage" id="depdImage_${i+1}" class="checkfile">
                    <span id="error_depdImage_${i+1}" class="text-danger"></span>
                  </div>
                  <div class="form-group">
                    <label for="depdPhone_${i+1}">Phone.</label>
                    <input type="text" name="depdPhone[]" id="depdPhone_${i+1}" placeholder="Enter phone" value="${response.employee[0].dependants[i].dependPhone || ''}">
                    <span id="error_depdPhone_${i+1}" class="text-danger"></span>
                  </div>
                </div>

                <div class="col-lg-6 col-md-6 removeDepnd_${i+1}">
                ${rmv}

                  <div class="form-group">
                    <label for="depdDOB">Birth Date.</label>
                    <input type="${getType(response.employee[0].dependants[i].dependDOB, 'date')}" name="depdDOB[]" class="chngTyp" id="depdDOB_${i+1}" value="${getDate(response.employee[0].dependants[i].dependDOB, false) || ''}">
                    <span id="error_depdDOB_${i+1}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="depdRelation">Relation</label>
                    <input type="text" name="depdRelation[]" id="depdRelation_${i+1}" placeholder="Enter relation" value="${response.employee[0].dependants[i].relation || ''}">
                    <span id="error_depdRelation" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="depdCardType">Card Type</label>
                    <select name="depdCardType[]" id="depdCardType_${i+1}" class="cardType">
                      
                    </select>
                    <span id="error_depdCardType_${i+1}" class="text-danger"></span>
                  </div>

                  <div class="form-group">
                    <label for="depdIDCard">Card Number</label>
                    <input type="text" name="depdIDCard[]" id="depdIDCard_${i+1}" placeholder="Enter card Number"
                    value="${response.employee[0].dependants[i].dependIDNo || ''}">
                    <span id="error_depdIDCard_${i+1}" class="text-danger"></span>
                  </div>
                </div>`;

                            getGender(`depdGender_${i + 1}`, `${response.employee[0].dependants[i].dependGender || ''}`);
                            getCardType(`depdCardType_${i + 1}`, `${response.employee[0].dependants[i].dependIDType || ''}`)
                        }
                    }
                    $('#appendDenpd').html(html);

                }

                // getCountries('instCountry_1', '');
                // getCompany('staffID');
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

                $('title').html('Edit Employees');
                // $('.add-employee-form').css("color", 'blue');
                unactive();
                $('#employeeFeat').modal('hide');

            },
            error: function(error) {
                console.log(error);
                $('.user-message').css('display', 'flex');
                $('.user-message').html(error.responseJSON.error);
                $('.user-message').addClass('danger');
                $('.user-message').css({ 'border-color': '', 'color': 'white', 'background-color': '' });

                setTimeout(function() {
                    $('.user-message').css('display', 'none');
                    $('user-message').html('');
                    $('.leaveDash').css('color', 'blue');
                    // leaveDash('Pending');

                }, 2000)
                return false;
            }
        });

    });

    $(document).on('click', '.employeeDetails', function() {
        alert('Still working on it, be patient with me !!');
    });

    $(document).on('click', '.chngType', function() {

        changeType($(this).attr('id'), $(this).val());
        // console.log('ID', $(this).attr('id'));
    });

    $(document).on('click', '.chngTyp', function() {

        changeTyp($(this).attr('id'), $(this).val());
        // console.log('ID', $(this).attr('id'));
    });
})