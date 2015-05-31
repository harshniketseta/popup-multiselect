$(document).ready(function () {

  $("input.enable").on("click", function(){
    $("#industries2").multiselect("enable");
  });

  $("input.disable").on("click", function(){
    $("#industries2").multiselect("disable");
  });

  $("#industries1").multiselect({title: "Select Industry", maxSelectionAllowed: 5});
  $("#industries2").multiselect({title: "Select Industry", maxSelectionAllowed: 5});
});