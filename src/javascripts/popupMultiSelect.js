/*

 * Popup Multi Select jQuery Plugin
 * Created By Harshniket Seta
 * Currently maintained by harshniketseta [at] gmail [dot] com
 * Version: 1.0
 * Release: 2015-03-05

 */

(function ($) {

  /****************
   * Main Function *
   *****************/
  $.fn.popupMultiSelect = function (options) {

    var defaults = {}
      , options = $.extend(defaults, options)
      ;

    return this.each(function () {

      function getOptionContent(jOptionContainer) {
        return jOptionsContainer.find(".optionsContent");
      }

      function createOption(text, value, index) {
        var newOptionHTML = "<span class='addedOption'><span class='text'>" + text +
          "</span><span class='clickable removeOption' data-index='" + index + "'><i class='fa fa-times'></i></span>" +
          "<input type='hidden' name='" + name + "' value='" + value + "' /></span>";

        return $(newOptionHTML);
      };

      function removeOption(jRemoveOption, jModal) {
        var index = jRemoveOption.data("index")
          , jAddedOption = jRemoveOption.closest(".addedOption")
          , jOptionsContainer = jAddedOption.closest(".optionsContainer")
          ;

        jAddedOption.remove();
        jModal.find(".popupOption[data-index='" + index + "']").toggleClass("selected");
        calculateIconPadding(jOptionsContainer);
        return true;
      };

      function removeOptionByIndex(jOptionsContainer, index) {
        getOptionByIndex(jOptionsContainer, index).remove();
        return true;
      }

      function updateHelpBlock(jOptionsContainer, jModal) {
        var helpText = ""
          , currentlySelectedLength = jOptionsContainer.find(".optionsContent").children().length
          , maxSelectionAllowed = jOptionsContainer.data("maxSelectionAllowed") || -1
          , selectionLeft = (maxSelectionAllowed - currentlySelectedLength)
          ;

        if (maxSelectionAllowed < 1) {
          return;
        }
        if ((currentlySelectedLength == 0) && (selectionLeft > 0)) {
          helpText = "Select " + selectionLeft;
        } else if (selectionLeft > 0) {
          helpText = "Select " + selectionLeft + " more.";
        } else if (selectionLeft == 0) {
          helpText = "Done.";
        }
        jModal.find(".help-block.autoUpdate").html(helpText);
      }

      function addOption(jOption, jOptionsContainer, jModal) {
        var maxSelectionAllowed = jOptionsContainer.data("maxSelectionAllowed") || -1
          , jOptionsContent = getOptionContent(jOptionsContainer)
          , currentlySelectedLength = jOptionsContent.children().length
          ;

        if ((maxSelectionAllowed > 0) && (currentlySelectedLength == maxSelectionAllowed))
          return false;

        var value = jOption.data("value")
          , index = jOption.data("index")
          , jDisplayText = jOption.find(".displayText")
          , displayText = jDisplayText.html()
          , jNewOption = createOption(displayText, value, index)
          ;


        jOptionsContent.append(jNewOption);
        jNewOption.find(".removeOption").on("click", function () {
          event.stopPropagation();
          var jRemoveOption = $(this);

          removeOption(jRemoveOption, jModal);
          updateHelpBlock(jOptionsContainer, jModal);
        });
        return true;
      };

      function getOptionByIndex(jOptionsContent, index) {
        return getOptionContent(jOptionsContainer).find(".removeOption[data-index='" + index + "']").closest(".addedOption");
      };

      function calculateIconPadding(jOptionsContainer) {
        var optionsContainerOuterHeight = jOptionsContainer.outerHeight()
          , optionsContainerPaddingTop = parseInt(jOptionsContainer.css("padding-top"))
          , optionsContainerPaddingBottom = parseInt(jOptionsContainer.css("padding-bottom"))
          , optionsContainerPaddingRight = parseInt(jOptionsContainer.css("padding-right"))
          , jOpenOptions = jOptionsContainer.find(".openOptions")
          , jOpenOptionIcon = jOpenOptions.find("i")
          , iconFontSize = 18
          , iconTotalPadding = (optionsContainerOuterHeight - iconFontSize) / 2
          , iconPaddingTop = iconTotalPadding - optionsContainerPaddingTop
          , iconPaddingBottom = iconTotalPadding - optionsContainerPaddingBottom
          ;

        jOpenOptionIcon.css({"font-size": iconFontSize});
        jOpenOptions.css({"height": iconFontSize,
          "padding-top": iconPaddingTop,
          "padding-bottom": iconPaddingBottom,
          right: optionsContainerPaddingRight
        });
      }

      function createModalBody(jElement) {
        var modalBodyHTML = "";
        $.each(jElement.find("option"), function (index, op) {
          modalBodyHTML += "<div class='popupOption clickable" + (this.selected ? " selected" : "") +
            "' data-index='" + index + "' data-value='" + op.value + "' >" +
            "<span class='displayText'>" + op.text + "</span>" +
            "<span class='tick'><i class='fa fa-check'></i></span>" +
            "</div>";
        });
        return modalBodyHTML;
      };

      function createModal(modalBody, options) {
        var title = options.title || "Select Options"
          , helpText = options.helpText || ""
          , modalContent = "<div class='modal-body'>" + modalBodyHTML + "</div>"
          , modalHeader = "<div class='modal-header'>" +
            "<span class='pull-right clickable close' aria-hidden='true'>&times;</span>" +
            "<h4 class='modal-title'>" + title + "</h4>" +
            "<div class='help-block" + (helpText.length > 0 ? "" : " autoUpdate") + "'>" + helpText + "</div>" +
            "</div>"
          , modal = "<div class='popupMultiSelect modal fade'><div class='modal-dialog modal-sm'>" +
            "<div class='modal-content'>" + modalHeader + modalContent +
            "</div></div></div>"
          , jModal = $(modal)
          ;

        return jModal;
      };

      function createOptionsContainer(jElement) {
        var optionsContainerHTML = "<div class='optionsContainer clearfix'>" +
            "<span class='optionsContent'></span>" +
            "<span class='openOptions clickable'>" +
            "<i class='fa fa-list'></i>" +
            "</span>" +
            "</div>"
          , jOptionsContainer = $(optionsContainerHTML)
          ;

        jOptionsContainer.copyCSS(jElement);
        jOptionsContainer.data(jElement.data());
        jOptionsContainer.css({position: "relative", "min-height": jOptionsContainer.outerHeight(), "height": "auto"});

        return jOptionsContainer;
      };

      function reflectCurrentState(jElement, jOptionsContainer, jModal) {
        var success = true;
        $.each(jModal.find(".popupOption.selected"), function () {
          success = success && addOption($(this), jOptionsContainer, jModal);
        });
        updateHelpBlock(jOptionsContainer, jModal);
        return success;
      };

      function initEventListeners(jOptionsContainer, jModal) {

        jOptionsContainer.on("click", function () {
          jModal.modal("show");
        });

        jModal.find(".close").on("click", function () {
          jModal.modal("hide");
        });

        jModal.find(".popupOption").on("click", function (event) {
          var jOption = $(this)
            , jModal = jOption.closest(".modal")
            , jOption = $(this)
            , index = jOption.data("index")
            , success = true
            ;

          if (jOption.hasClass("selected")) {
            success = removeOptionByIndex(jOptionsContainer, index);
          } else {
            success = addOption(jOption, jOptionsContainer, jModal);
          }
          if (success) {
            jOption.toggleClass("selected");
            updateHelpBlock(jOptionsContainer, jModal);
            calculateIconPadding(jOptionsContainer);
          }
        });

        getOptionContent(jOptionsContainer).find(".removeOption").on("click", function () {
          event.stopPropagation();
          var jRemoveOption = $(this);

          removeOption(jRemoveOption, jModal);
          updateHelpBlock(jOptionsContainer, jModal);
        });
      };

//      -------------MAIN CODE STARTS HERE--------------

      var jElement = $(this)

      if (!jElement.is("select")) {
        console.log("Popup MultiSelect only possible in select.");
        return true;
      }

      var options = jElement.data()
        , name = jElement.attr("name") + "[]"
        , modalBodyHTML = createModalBody(jElement)
        , jModal = createModal(modalBodyHTML, options)
        ;

      // Hide existing modals if any and remove.
      $(".popupMultiSelect.modal").modal("hide").remove();

      // Add modal to body.
      $("body").append(jModal);

      // Create options container, which is supposed to replace select.
      var jOptionsContainer = createOptionsContainer(jElement);

      // Replacing select.
      jElement.replaceWith(jOptionsContainer);

      // Calculating icon padding.
      calculateIconPadding(jOptionsContainer);

      reflectCurrentState(jElement, jOptionsContainer, jModal);

      // Initializing Event Listeners.
      initEventListeners(jOptionsContainer, jModal);
    });
  };

  // ------------------ Helper Functions ------------------
  $.fn.copyCSS = function (source) {
    var styles = $(source).getStyleObject();
    this.css(styles);
  };

  $.fn.getStyleObject = function () {
    var dom = this.get(0);
    var style;
    var returns = {};
    if (window.getComputedStyle) {
      var camelize = function (a, b) {
        return b.toUpperCase();
      };
      style = window.getComputedStyle(dom, null);
      for (var i = 0, l = style.length; i < l; i++) {
        var prop = style[i];
        var camel = prop.replace(/\-([a-z])/g, camelize);
        var val = style.getPropertyValue(prop);
        returns[camel] = val;
      }
      return returns;
    }

    if (style = dom.currentStyle) {
      for (var prop in style) {
        returns[prop] = style[prop];
      }
      return returns;
    }
    return this.css();
  };
})(jQuery);