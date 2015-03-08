/*

 * Popup Multi Select jQuery Plugin
 * Created By Harshniket Seta
 * Currently maintained by harshniketseta [at] gmail [dot] com
 * Version: 0.1.0
 * Release: 2015-03-05

 */

(function ($) {

  /****************
   * Main Function *
   *****************/
  $.fn.popupMultiSelect = function (options) {

    if (typeof popupMultiSelectInitiated === "undefined") {
      popupMultiSelectInitiated = 1;
    }

    var defaults = {}
      , finalOptions = $.extend({}, defaults, options)
      ;

    return this.each(function () {

      function getOptionContent(jOptionContainer) {
        return jOptionContainer.find(".optionsContent");
      }

      function getModal(jOptionsContainer) {
        var optionsContainerID = jOptionsContainer.attr("id")
          , identifier = optionsContainerID.split("_")[1]
          , jModal = $("#optionsModal_" + identifier)
          ;

        return jModal;
      }

      function getOptionContainer(jModal) {
        var modalID = jModal.attr("id")
          , identifier = modalID.split("_")[1]
          , jOptionsContainer = $("#optionsContainer_" + identifier)
          ;

        return jOptionsContainer;
      }

      function getModalOptionAtIndex(jModal, index) {
        return jModal.find(".popupOption[data-index='" + index + "']");
      }

      function getOptionByIndex(jOptionsContainer, index) {
        return getOptionContent(jOptionsContainer).find(".addedOption").filter(function () {
          return $(this).data("index") == index;
        });
      }

      function createOption(text, index) {
        var jText = $("<span></span>", {class: "text", text: text})
          , jRemoveIcon = $("<span></span>", {class: 'glyphicon glyphicon-remove', "aria-hidden": "true"})
          , jRemoveIconWrap = $("<span></span>", {class: "clickable removeOption"}).append(jRemoveIcon)
          , jNewOption = $("<span></span>", {class: "addedOption", data: {index: index}}).append(jText).append(jRemoveIconWrap)
          ;

        return jNewOption;
      }

      function markSelectOption(jOptionsContainer, index, selected) {
        var jSelect = jOptionsContainer.find("select");

        jSelect.find("option:nth-child(" + index + ")").attr("selected", selected);
      }

      function removeOptionHandler(event) {
        event.stopPropagation();
        var jRemoveOption = $(this)
          , jAddedOption = jRemoveOption.closest(".addedOption")
          , jOpContainer = jRemoveOption.closest(".optionsContainer")
          ;

        removeOption(jAddedOption);
        updateHelpBlock(jOpContainer);
      }

      function removeOption(jAddedOption) {
        var index = jAddedOption.data("index")
          , jOpContainer = jAddedOption.closest(".optionsContainer")
          , jModal = getModal(jOpContainer)
          ;

        jAddedOption.remove();
        getModalOptionAtIndex(jModal, index).toggleClass("selected");
        markSelectOption(jOpContainer, index, false);
        postProcess(jOpContainer);
        return true;
      }

      function updateHelpBlock(jOptionsContainer) {
        var helpText = ""
          , currentlySelectedLength = jOptionsContainer.find(".optionsContent").children().length
          , maxSelectionAllowed = jOptionsContainer.data("maxSelectionAllowed") || -1
          , selectionLeft = (maxSelectionAllowed - currentlySelectedLength)
          ;

        if (maxSelectionAllowed < 1) {
          return;
        }
        if ((currentlySelectedLength === 0) && (selectionLeft > 0)) {
          helpText = "Select " + selectionLeft;
        } else if (selectionLeft > 0) {
          helpText = "Select " + selectionLeft + " more.";
        } else if (selectionLeft === 0) {
          helpText = "Done.";
        }
        getModal(jOptionsContainer).find(".help-block.autoUpdate").html(helpText);
      }

      function addOption(jOption, jOptionsContainer) {
        var maxSelectionAllowed = jOptionsContainer.data("maxSelectionAllowed") || -1
          , jOptionsContent = getOptionContent(jOptionsContainer)
          , currentlySelectedLength = jOptionsContent.children().length
          , jModal = getModal(jOptionsContainer)
          ;

        if ((maxSelectionAllowed > 0) && (currentlySelectedLength == maxSelectionAllowed))
          return false;

        var index = jOption.data("index")
          , jDisplayText = jOption.find(".displayText")
          , displayText = jDisplayText.html()
          , jNewOption = createOption(displayText, index)
          ;

        jOptionsContent.append(jNewOption);
        jNewOption.find(".removeOption").on("click", removeOptionHandler);
        markSelectOption(jOptionsContainer, index, true);
        return true;
      }

      function postProcess(jOptionsContainer) {
        var optionsContainerOuterHeight = jOptionsContainer.outerHeight()
          , optionsContainerOuterWidth = jOptionsContainer.outerWidth()
          , optionsContainerPaddingTop = parseInt(jOptionsContainer.css("padding-top"))
          , optionsContainerPaddingBottom = parseInt(jOptionsContainer.css("padding-bottom"))
          , optionsContainerPaddingRight = parseInt(jOptionsContainer.css("padding-right"))
          , optionsContainerPaddingLeft = parseInt(jOptionsContainer.css("padding-left"))
          , jOptionsContent = jOptionsContainer.find(".optionsContent")
          , jOpenOptions = jOptionsContainer.find(".openOptions")
          , jOpenOptionIcon = jOpenOptions.find("i")
          , iconFontSize = 18
          , iconTotalPadding = (optionsContainerOuterHeight - iconFontSize) / 2
          , iconPaddingTop = iconTotalPadding - optionsContainerPaddingTop
          , iconPaddingBottom = iconTotalPadding - optionsContainerPaddingBottom
          , optionsContentWidth = optionsContainerOuterWidth - optionsContainerPaddingRight - optionsContainerPaddingLeft - iconFontSize
          ;

        jOptionsContent.css({display: "block", width: optionsContentWidth});
        jOpenOptionIcon.css({"font-size": iconFontSize});
        jOpenOptions.css({"height": iconFontSize,
          "padding-top": iconPaddingTop,
          "padding-bottom": iconPaddingBottom,
          right: optionsContainerPaddingRight
        });
      }

      function extractOptions(jSelect) {
        return jSelect.find("option");
      }

      function createModalBodyContent(jSelectOptions) {
        var jModalBodyContent = [];
        $.each(jSelectOptions, function (index, option) {
          var jDisplayText = $("<span></span>", {class: "displayText", text: option.text})
            , jTickIcon = $("<span></span>", {class: "glyphicon glyphicon-ok", "aria-hidden": "true"})
            , jTickWrap = $("<span></span>", {class: "tick"}).append(jTickIcon)
            , jModalOp = $("<div></div>",
              {class: "popupOption clickable", data: {index: index}}).append(jDisplayText).append(jTickWrap)
            ;

          if (option.selected) {
            jModalOp.addClass("selected");
          }
          jModalBodyContent.push(jModalOp);
        });
        return jModalBodyContent;
      }

      function createModal(jModalBodyContent, options) {
        var helpText = options.helpText || ""
          , maxSelectionAllowed = options.maxSelectionAllowed || -1
          , jModalBody = $("<div></div>", {class: "modal-body"}).append(jModalBodyContent)
          , jCloseButton = $("<span></span>", {class: "pull-right clickable glyphicon glyphicon-remove close", "aria-hidden": "true"})
          , jModalTitle = $("<h4></h4>", {class: "modal-title", text: (options.title || "Select Options")})
          , jModalHelpBlock = $("<div></div>", {class: "help-block", text: helpText})
          ;

        if (helpText.length === 0) {
          jModalHelpBlock.addClass("autoUpdate");
        }

        var jModalHeader = $("<div></div>", {class: "modal-header"}).append(jCloseButton).append(jModalTitle).append(jModalHelpBlock)
          , jModalContent = $("<div></div>", {class: "modal-content"}).append(jModalHeader).append(jModalBody)
          , jModalDialog = $("<div></div>", {class: "modal-dialog modal-sm"}).append(jModalContent)
          , jModal = $("<div></div>", {id: "optionsModal_" + options.identifier,
            class: "popupMultiSelect modal fade"}).append(jModalDialog)
          ;

        return jModal;
      }

      function createOptionsContainer(options) {
        var jOptionsContent = $("<span></span>", {class: "optionsContent"})
          , jOpenListIcon = $("<span></span>", {class: "glyphicon glyphicon-list", "aria-hidden": "true"})
          , jOpenListWrap = $("<span></span>", {class: "openOptions clickable"}).append(jOpenListIcon)
          , jOptionsContainer = $("<div></div>", {id: "optionsContainer_" + options.identifier,
              class: "optionsContainer clearfix", data: {maxSelectionAllowed: options.maxSelectionAllowed}}
          ).append(jOptionsContent).append(jOpenListWrap)
          ;

        return jOptionsContainer;
      }

      function reflectCurrentState(jOptionsContainer, jModal) {
        var success = true;
        $.each(jModal.find(".popupOption.selected"), function () {
          success = success && addOption($(this), jOptionsContainer, jModal);
        });
        updateHelpBlock(jOptionsContainer);
        return success;
      }

      function initEventListeners(jOptionsContainer, jModal) {

        jOptionsContainer.on("click", function () {
          var jOpContainer = $(this)
            , jOpModal = getModal(jOpContainer)
            ;

          jOpModal.modal("show");
        });

        jModal.find(".close").on("click", function () {
          var jCloseButton = $(this)
            , jOpModal = jCloseButton.closest(".modal")
            ;

          jOpModal.modal("hide");
        });

        jModal.find(".popupOption").on("click", function (event) {
          var jOption = $(this)
            , jOpModal = jOption.closest(".modal")
            , jOpContainer = getOptionContainer(jOpModal)
            , index = jOption.data("index")
            , success = true
            ;

          if (jOption.hasClass("selected")) {
            success = removeOption(getOptionByIndex(jOpContainer, index));
          } else {
            success = addOption(jOption, jOpContainer);
          }
          if (success) {
            jOption.toggleClass("selected");
            updateHelpBlock(jOpContainer);
            postProcess(jOpContainer);
          }
        });

        getOptionContent(jOptionsContainer).find(".removeOption").on("click", removeOptionHandler);
      }

//      -------------MAIN CODE STARTS HERE--------------

      var jElement = $(this);

      if (!jElement.is("select")) {
        console.log("Popup MultiSelect only possible in select.");
        return true;
      }
      options.identifier = popupMultiSelectInitiated;

      var jSelectOptions = extractOptions(jElement)
        , jModalBody = createModalBodyContent(jSelectOptions)
        , jModal = createModal(jModalBody, finalOptions)
        , jOptionsContainer = createOptionsContainer(finalOptions)
        ;

      // Add modal to body.
      $("body").append(jModal);

      // Replacing select.
      jElement.replaceWith(jOptionsContainer);
      jElement.css({display: "none"});
      jOptionsContainer.append(jElement);

      // Calculating icon padding.
      postProcess(jOptionsContainer);

      // Adds already selected Options to Options Container.
      reflectCurrentState(jOptionsContainer, jModal);

      // Initializing Event Listeners.
      initEventListeners(jOptionsContainer, jModal);

      popupMultiSelectInitiated += 1;

    });
  };
})(jQuery);