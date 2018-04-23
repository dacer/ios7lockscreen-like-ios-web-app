
    // console.log(id);
var input = [];
var supportTouch = ('ontouchstart' in document.documentElement);

if(window.navigator.standalone){
  initListener();
}else{
  initListener();
}

function initListener(){
  for (var i = 11; i >= 0; i--) {
    var id = "#num-"+i;
    $(id).on("touchstart", onTouchStart(i));
    $(id).on("touchend", onTouchEnd(i));
    if (!supportTouch) {
      $(id).on("click", onClickMe(i));
    }
  };
  // for loading animation
  var spinner = new Spinner().spin();
  $('#loading-div').append(spinner.el);
}

function onTouchStart(num){
  return function() {
      $("#num-"+num).css("backgroundColor", "rgba(255,255,255,1)");
      $("#num-"+num).css("color", "rgba(0,0,0,1)");
    };
}

function onTouchEnd(num){
  return function() {
      $("#num-"+num).css("backgroundColor", "rgba(0,0,0,0)");
      $("#num-"+num).css("color", "rgba(255,255,255,1)");
      if (supportTouch) {
        onClickOrigin(num);
      }
    };
}

function onClickMe(num){
  return function(){onClickOrigin(num)};
}

function onClickOrigin(num){
  if(num === 10){
        deleteInput();
      }else if (num === 11) {
        loadingAnimate();
        postPasscode();
      }else{
        addInput(num);
      };
}
function addInput(num){
  if(input.length<3){
    input.push(num);
    console.log(input);
    $("#input-num-"+input.length).text(num);
  }
}
function deleteInput(){
  if(input.length>0){
    $("#input-num-"+input.length).text("·");
    input.pop();
    console.log(input);
  }
}


function postPasscode(){
  // $.post("/passwd", { command : input})
  // .done(function(data) {
  //   stopLoading();
  //   var func = new Function(data);
  //   func();//receive js code from service and run it.
  // });
  var passcode = [8,8,8];
  if(input.compare(passcode)){
    passedAnimation();
    
  }else{
    wrongPasswd();
  }
  stopLoading();
}

function wrongPasswd(){
  wrongAnimate($('#input-div'), 66,5);
  input = [];
  console.log(input);
}

function passedAnimation(){
  $('#main-div').animate({"marginTop":"50px"}, 500, function() {
    $('#main-div').animate({"marginTop":"-880px"},888,function(){
      // location.reload();
      alert("Enter!");
    });
  });
}

function loadingAnimate(){
  $('#loading-div').css("display","block"); 
}

function stopLoading(){
  $('#loading-div').css("display","none");
}

function wrongAnimate(targetElement, speed, times) {
  $(targetElement).css("color", "#FF4444");
  $(targetElement).animate({ marginLeft: "+=32px"},
  {
    duration: speed,
    complete: function (){
      targetElement.animate({ marginLeft: "-=32px" },
      {
        duration: speed,
        complete: function (){
          if(times>0){
            wrongAnimate(targetElement, speed,--times);
          }else{
            for (var i = 3; i >= 1; i--) {
              $("#input-num-"+i).text("·");
            }
            $(targetElement).css("color", "#FFFFFF");
          }
        }
      });
    }
  });
};

//http://stackoverflow.com/questions/7837456/comparing-two-arrays-in-javascript
// attach the .compare method to Array's prototype to call it on any array
Array.prototype.compare = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0; i < this.length; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
