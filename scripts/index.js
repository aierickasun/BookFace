/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//document.getElementByClass("nav_bar").onClick(()=>{
//    document.getElementByClass("nav_bar").style.backgroundColor="black";
//});

$(document).ready( function() {

    $("#jqueryButton").on("click", function() {
        $(this).hide();
        $(".title").fadeToggle("slow", function(){
            if($("#jqueryButton").val() === "0") {
                $("#jqueryButton").val("1")
                $("#jqueryButton").text("Title Fade In");
            } else {
                $("#jqueryButton").val("0")
                $("#jqueryButton").text("Title Fade Out");
            }
            $("#jqueryButton").show();
        });
    });

    $("#login-tab-id").on("click", function() {
        $(this).css("backgroundColor", "white");
        $("#signup-tab-id").css("backgroundColor","#d9d7d6");
        $("#signup-form").css("display","none");
        $("#alert-box-signup").css("display", "none");
        $("#login-form").css("display","block");
        if($.trim( $('#alert-box-login').html() ).length){
            $("#alert-box-login").css("display", "block");
        }
    });
    $("#signup-tab-id").on("click", function() {
        $(this).css("backgroundColor", "white");
        $("#login-tab-id").css("backgroundColor","#d9d7d6");
        $("#login-form").css("display","none");
        $("#alert-box-login").css("display", "none");
        $("#signup-form").css("display","block");
        if($.trim( $('#alert-box-signup').html() ).length){
            $("#alert-box-signup").css("display", "block");
        }
    });

});
function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}

function loginUser() {
    var bothValid = true;
    if($("#inputLoginUserName").val()=="") {
        $("#inputLoginUserName").addClass('is-invalid');
        bothValid = false;
    } else {
        $("#inputLoginUserName").removeClass('is-invalid');
        $("#inputLoginUserName").addClass('is-valid');
    }
    if ($("#inputLoginPassword").val()=="") {
        $("#inputLoginPassword").addClass('is-invalid');
        bothValid = false;
    } else {
        $("#inputLoginPassword").removeClass('is-invalid');
        $("#inputLoginPassword").addClass('is-valid');
    }
    if(bothValid) {
        // Log user in
        // make xmlhttp request to see if valid log in...
        // Stores session key as cookie
        const Url = "https://bkface.herokuapp.com/api/users";
        const Data = {
            name: $("#inputLoginUserName").val(),
            password: $("#inputLoginPassword").val(),
            action: "login"
        };
        const otherParam = {
            headers:{
                'content-type': 'application/json; charset=UTF-8',
                'Accept' : 'application/json'
                // 'Accept': 'application/json, text/plain, */*',
            },
            body:JSON.stringify(Data),
            method:"POST"
        };
        // $.post(Url, data , function(data, status) {
        //     if()
        //     window.location.replace(mainPageString);
        // });
        fetch(Url, otherParam)
        .then((data) => {
            // console.log(data);
            return data.json();
        })
        .then((res) => {
            // console.log(res.book_face_user_id == 'null');
            if(res.book_face_user_id != 'null') {
                // Set cookie
                // Redirect to new page...
               redirectUserHome(res.book_face_user_id);
            } else {
                // Username already taken
                $("#alert-box-login").html("Username or Password are wrong");
                $("#alert-box-login").addClass("alert-danger");
                $("#inputLoginUserName").addClass('is-invalid');
                $("#inputLoginPassword").addClass('is-invalid');
                $("#alert-box-login").css("display", "block");
            }
        })
        .catch((error)=> {
            console.log(error);
        });

    }
}
function redirectUserHome(user_id) {
    $.cookie("book_face_id", user_id);
    var mainPageString = "./userHome.html";
    window.location.replace(mainPageString);
}
function signupUser() {
    var allValid = true;
    if($("#inputSignupUserName").val()=="") {
        $("#inputSignupUserName").addClass('is-invalid');
        allValid = false;
    } else {
        $("#inputSignupUserName").removeClass('is-invalid');
        $("#inputSignupUserName").addClass('is-valid');
    }
    if ($("#inputSignupPassword").val()=="") {
        $("#inputSignupPassword").addClass('is-invalid');
        allValid = false;
    } else {
        $("#inputSignupPassword").removeClass('is-invalid');
        $("#inputSignupPassword").addClass('is-valid');
    }
    if($("#inputSignupRePassword").val()=="") {
        $("#inputSignupRePassword").addClass('is-invalid');
        allValid = false;

    } else if ($("#inputSignupRePassword").val() != $("#inputSignupPassword").val()) {

        $("#inputSignupRePassword").addClass('is-invalid');
        allValid = false;

    } else {
        $("#inputSignupRePassword").removeClass('is-invalid');
        $("#inputSignupRePassword").addClass('is-valid');
    }

    if(allValid) {
        // Log user in
        // make xmlhttp request to see if valid log in...
        // Stores session key as cookie
        const Url = "https://bkface.herokuapp.com/api/users";
        const Data = {
            name: $("#inputSignupUserName").val(),
            password: $("#inputSignupPassword").val(),
            action: "signup"
        };
        const otherParam = {
            headers:{
                'content-type': 'application/json; charset=UTF-8',
                'Accept' : 'application/json'
                // 'Accept': 'application/json, text/plain, */*',
            },
            body:JSON.stringify(Data),
            method:"POST"
        };
        // $.post(Url, data , function(data, status) {
        //     if()
        //     window.location.replace(mainPageString);
        // });
        fetch(Url, otherParam)
        .then((data) => {
            // console.log(data);
            return data.json();
        })
        .then((res) => {
            // console.log(res.book_face_user_id == 'null');
            if(res.book_face_user_id != 'null') {
                // Set cookie
                // Redirect to new page...
                redirectUserHome(res.book_face_user_id);
            } else {
                // Username already taken
                $("#alert-box-signup").html("Username is already taken");
                $("#inputSignupUserName").addClass('is-invalid');
                $("#alert-box-signup").addClass("alert-danger");
                $("#alert-box-signup").css("display", "block");
            }
        })
        .catch((error)=> {
            console.log(error);
        });
    }
}
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
function charCount(val) {
    var len = val.value.length;
    if (len >= 256) {
      val.value = val.value.substring(0, 500);
    } else {
      $('#charNum').text(500 - len);
    }
    console.log(len);
}
