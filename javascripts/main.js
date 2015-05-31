$(document).ready(function () {

  function logEvent(event) {
    var jEventArea = $("#eventsArea");

    jEventArea.val(jEventArea.val().trim() + "\n" + event.type + "." + event.namespace);
  };

  $("input.enable2").on("click", function () {
    $("#industries2").multiselect("enable");
  });

  $("input.disable2").on("click", function () {
    $("#industries2").multiselect("disable");
  });

  $("#industries3").on("enabled.bs.multiselect", function (event) {
    logEvent(event);
  });

  $("#industries3").on("disabled.bs.multiselect", function (event) {
    logEvent(event);
  });

  $("#industries3").on("show.bs.multiselect", function (event) {
    logEvent(event);
  });

  $("#industries3").on("shown.bs.multiselect", function (event) {
    logEvent(event);
  });

  $("#industries3").on("hide.bs.multiselect", function (event) {
    logEvent(event);
  });

  $("#industries3").on("hidden.bs.multiselect", function (event) {
    logEvent(event);
  });

  $("#industries3").on("selected.bs.multiselect", function (event, option) {
    logEvent(event);
  });

  $("#industries3").on("selectiondone.bs.multiselect", function (event) {
    logEvent(event);
  });

  $("#industries3").on("deselected.bs.multiselect", function (event, option) {
    logEvent(event);
  });

  $("#industries3").on("deselectiondone.bs.multiselect", function (event) {
    logEvent(event);
  });

  $("#industries3").on("optionadded.bs.multiselect", function (event) {
    logEvent(event);
  });

  $("input.enable3").on("click", function () {
    $("#industries3").multiselect("enable");
  });

  $("input.disable3").on("click", function () {
    $("#industries3").multiselect("disable");
  });

  $("input.show3").on("click", function () {
    $("#industries3").multiselect("show");
  });

  $("input.hide3").on("click", function () {
    $("#industries3").multiselect("hide");
  });

  $("input.select3").on("click", function () {
    $("#industries3").multiselect("selectOption", $("#optionValue").val().trim());
  });

  $("input.deselect3").on("click", function () {
    $("#industries3").multiselect("deselectOption", $("#optionValue").val().trim());
  });

  $("input.addOption3").on("click", function () {
    var option = {
      value: $("#newOptionValue").val(),
      html: $("#newOptionText").val(),
      selected: $("#newOptionSelected").prop("checked")
    }
    $("#industries3").multiselect("addOption", option);
  });

  $("#industries1").multiselect({title: "Select Industry", maxSelectionAllowed: 5});
  $("#industries2").multiselect({title: "Select Industry", maxSelectionAllowed: 5});
  $("#industries3").multiselect({title: "Select Industry", maxSelectionAllowed: 5});
});