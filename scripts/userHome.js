/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//document.getElementByClass("nav_bar").onClick(()=>{
//    document.getElementByClass("nav_bar").style.backgroundColor="black";
//});
var all_posts = [];
var users_names = [];
var map = {};
var selectedUser;



$(document).ready( function() {
    if($.cookie("book_face_id")==null) {
        window.location.href = "./index.html";
    }
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
        $("#login-form").css("display","block");

    });
    $("#signup-tab-id").on("click", function() {
        $(this).css("backgroundColor", "white");
        $("#login-tab-id").css("backgroundColor","#d9d7d6");
        $("#login-form").css("display","none");
        $("#signup-form").css("display","block");
    });
    $("#friend-button").on("click", function() {
        var searchedFriend = $("#search-profile-name").html();

        addFriend(map[searchedFriend]._id);
    });
    // const user_id = getUserId();
    const user_id = $.cookie("book_face_id");
    getUserInfo(user_id);

});

function getUserId() {
    return $.cookie("book_face_id");
}

function getUserInfo(userId) {
    const Url = "https://bkface.herokuapp.com/api/users/"+userId;
    // const Data = {
    //     name: $("#inputSignupUserName").val(),
    //     password: $("#inputSignupPassword").val(),
    //     action: "signup"
    // };
    const otherParam = {
        headers:{
            'content-type': 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
        },
        // body:JSON.stringify(Data),
        method:"GET"
    };

    fetch(Url, otherParam)
    .then((data) => {
        return data.json();
    })
    .then((res) => {
        all_posts = res.posts;

        setUserName(res.name);
        setUserPosts(res.posts, res.friends);
    })
    .catch((error)=> {
      console.log(error);
    });
}
function getFriendInfo(friendId, lastUser) {
    const Url = "https://bkface.herokuapp.com/api/posts/"+friendId;
    // const Data = {
    //     name: $("#inputSignupUserName").val(),
    //     password: $("#inputSignupPassword").val(),
    //     action: "signup"
    // };
    const otherParam = {
        headers:{
            'content-type': 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
        },
        // body:JSON.stringify(Data),
        method:"GET"
    };

    fetch(Url, otherParam)
    .then((data) => {
        return data.json();
    })
    .then((res) => {
        // setUserName(res.name);
        addToAllPosts(res.user_posts, lastUser);

    })
    .catch((error)=> {
      console.log(error);
    });

}
function addToAllPosts(posts, lastUser) {
    for(var i = 0; i < posts.length ; i++) {
        all_posts.push(posts[i]);
    }
    if(lastUser) {
        // Sort the array and populate...
        all_posts.sort(function(a,b){
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.date) - new Date(a.date);
        });
        populatePage();
    }
}
function populatePage() {
    // Generate div stuff...
    // () => {

    // }
    // var paras = $(".post-class");

    // while(paras[0]) {
    //     paras[0].parentNode.removeChild(paras[0]);
    // }​
    $("#home-page .post-class").remove();
    var postHtml = "";
    for(var i = 0; i < all_posts.length ; i++) {
        postHtml += `<div class="col-12  container-fluid post-class">
                        <div class="row">
                            <div class="col-3 user-info-container">
                                <div class="col-12 post-image-container">
                                    <img src="./fb_default_male.jpg" class="post-image"/>
                                </div>
                                <div class="col-12 post-name">`+all_posts[i].author+`
                                    </div>
                                </div>
                                <div class="col-9 user-post-container">
                                    <div class="user-post-content">`+
                                    all_posts[i].body+`</div>
                            </div>
                        </div>
                    </div>`;

    }
    $("#post-container").append(postHtml);

    // Then set innerHtml.
}
function setUserName(userName) {
    $("#user-profile-name").html(userName);
}
function setUserPosts(userPosts, userFriends) {
    // var all_posts = userPosts;
    all_posts.concat(userPosts);
    var i = 0;
    for(i = 0; i < userFriends.length ; i++) {
        if(userFriends.length-1 == i ) {
            getFriendInfo(userFriends[i], true);

        } else {
            getFriendInfo(userFriends[i], false);

        }
    }
    if(i==0) {
        all_posts.sort(function(a,b){
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.date) - new Date(a.date);
        });
        populatePage();
        // No friends. already sorted? Just populate.
    }
    // array.sort(function(a,b){
    //   // Turn your strings into dates, and then subtract them
    //   // to get a value that is either negative, positive, or zero.
    //   return new Date(b.date) - new Date(a.date);
    // });
}


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
function userHome() {
    $("#searchQueryNavButton").removeClass('active');
    $("#logoutNavButton").removeClass('active');
    $("#userHomeNavButton").addClass('active');
    if($(".navbar-toggler").is(":visible")) {
        $('.navbar-toggler').click();
    }
    // const user_id = getUserId();
    const user_id = $.cookie("book_face_id");
    getUserInfo(user_id);
    $("#search-page").css("display", "none");
    $("#home-page").css("display", "block");
}
function searchQuery() {
    $("#userHomeNavButton").removeClass('active');
    $("#logoutNavButton").removeClass('active');
    $("#searchQueryNavButton").addClass('active');
    if($(".navbar-toggler").is(":visible")) {
        $('.navbar-toggler').click();
    }
    // Grab all users...
    // Make userHome disappear...
    $("#home-page").css("display", "none");
    $("#search-page").css("display", "block");

    // Get all users
    const Url = "https://bkface.herokuapp.com/api/users";
    // const Data = {
    //     name: $("#inputSignupUserName").val(),
    //     password: $("#inputSignupPassword").val(),
    //     action: "signup"
    // };
    const otherParam = {
        headers:{
            'content-type': 'application/json; charset=UTF-8',
            'Accept' : 'application/json'
        },
        // body:JSON.stringify(Data),
        method:"GET"
    };

    fetch(Url, otherParam)
    .then((data) => {
        return data.json();
    })
    .then((res) => {
        var users = res;
        // setUserName(res.name);
        // setUserPosts(res.posts, res.friends);
        // var all_users = new Bloodhound({
        //         datumTokenizer: Bloodhound.tokenizers.whitespace,
        //         queryTokenizer: Bloodhound.tokenizers.whitespace,
        //         local: all_users
        //     });
        // $('#input-container .typeahead').typeahead({
        //   hint: true,
        //   highlight: true,
        //   minLength: 1
        // },
        // {
        //   name: 'all_users',
        //   source: substringMatcher(all_users)
        // });
        var user_names = [];
        for(var i = 0; i < users.length; i++) {
            user_names.push(users[i].name);
            map[users[i].name] = users[i];
        }

        $.typeahead({
            input: '.js-typeahead-users',
            order: "asc",
            source: user_names,
            callback: {
                onSubmit: function(node, form, item, event) {
                    showUserSearched(item.display);
                    return false;
                }
            }
        });
    })
    .catch((error)=> {
      console.log(error);
    });

}
function showUserSearched(userName) {

    var userPosts = map[userName].posts;
    userPosts.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) - new Date(a.date);
    });
    $("#search-profile-name").html(userName);
   $("#search-post-container .post-class").remove();
   // IF they're friends, make disabled and color green.
   $("#friend-button").removeClass("btn-success");
            $("#friend-button").addClass("btn-light");
            $("#friend-button").html("Follow");
    var postHtml = "";
    for(var i = 0; i < userPosts.length ; i++) {
        postHtml += `<div class="col-12  container-fluid post-class">
                        <div class="row">
                            <div class="col-3 user-info-container">
                                <div class="col-12 post-image-container">
                                    <img src="./fb_default_male.jpg" class="post-image"/>
                                </div>
                                <div class="col-12 post-name">`+userPosts[i].author+`</div>
                            </div>
                            <div class="col-9 user-post-container">
                                <div class="user-post-content">`+
                                    userPosts[i].body+` </div>
                            </div>
                        </div>
                    </div> `;

    }
    $("#search-post-container").append(postHtml);
    $("#searchProfile").show();
    $("#search-post-container").show();
}
function addFriend(userId) {
    // Make post request to add friend);


    const Url = "https://bkface.herokuapp.com/api/users/"+userId;
        const Data = {
            // const user_id = getUserId();
            user_id:$.cookie("book_face_id")
            // user_id: getUserId()
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
            return data.json();
        })
        .then((res) => {
                // Username already taken
            $("#friend-button").removeClass("btn-light");
            $("#friend-button").addClass("btn-success");
            $("#friend-button").html("Followed");
        })
        .catch((error)=> {
          console.log(error);
        });

}
var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str.name)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};
function searchUser() {
}
function logout() {
    $("#userHomeNavButton").removeClass('active');
    $("#searchQueryNavButton").removeClass('active');
    $("#logoutNavButton").addClass('active');
    if($(".navbar-toggler").is(":visible")) {
        $('.navbar-toggler').click();
    }
    // if($.cookie("book_face_id")==null) {
    //     window.location.href = "./index.html";
    // }
    $.removeCookie("book_face_id");
    window.location.href = "./index.html";
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
    $('#charNum').text(256 - len + "/256 chars left");

}
function makePost(post) {
  //  var postText = post.value;
    //this.value = "";
    var key = window.event.keyCode;
    if ( key === 13 ) {
        var curPost = $("#textarea-char-counter").val();
        const user_id = $.cookie("book_face_id");
        //getUserInfo(user_id);
        $("#textarea-char-counter").blur();

        $("#textarea-char-counter").val('');
        $('#charNum').text('');
        var userId = "";
        const Url = "https://bkface.herokuapp.com/api/posts/"+user_id;
        const Data = {
            // const user_id = getUserId();
            new_post: curPost
            // user_id: getUserId()
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
            return data.json();
        })
        .then((res) => {
                const user_id = $.cookie("book_face_id");
                getUserInfo(user_id);

        })
        .catch((error)=> {
          console.log(error);
        });



    }
}
function filterChars(val) {
    var key = window.event.keyCode;
    if ( key !== 13 ) {
        charCount(val);

    } else {
        makePost(val);
    }
}
