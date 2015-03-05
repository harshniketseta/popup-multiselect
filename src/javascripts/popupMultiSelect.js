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

    var defaults = {};

    var options = $.extend(defaults, options);

    return this.each(function () {

      function removeOption(event) {
        event.stopPropagation();
        var jRemoveOption = $(this)
          , index = jRemoveOption.data("index")
          , jAddedOption = jRemoveOption.closest(".addedOption")
          ;

        jAddedOption.remove();
        jModal.find(".popupOption[data-index='" + index + "']").toggleClass("selected");
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
        jOpenOptions.css({"padding-top": iconPaddingTop, "padding-bottom": iconPaddingBottom, right: optionsContainerPaddingRight});
      }

      function createModalBody(jElement) {
        var modalBodyHTML = "";
        $.each(jElement.find("option"), function (index, op) {
          modalBodyHTML += "<div class='popupOption clickable' data-index='" + index + "' data-value='" + op.value + "' >" +
            "<span class='displayText'>" + op.text + "</span>" +
            "<span class='tick'><i class='fa fa-check'></i></span>" +
            "</div>";
        });
        return modalBodyHTML;
      };

      function createModal(modalBody, title, helpText) {
        var modalContent = "<div class='modal-body'>" + modalBodyHTML + "</div>"
          , modalHeader = "<div class='modal-header'>" +
            "<span class='pull-right clickable close' aria-hidden='true'>&times;</span>" +
            "<h4 class='modal-title'>" + title + "</h4>" +
            "<div class='help-block text-center'>" + helpText + "</div>" +
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
        jOptionsContainer.css({position: "relative", "min-height": jOptionsContainer.height(), "height": "auto"});
        calculateIconPadding(jOptionsContainer);

        return jOptionsContainer;
      };

      function initEventListeners(jOptionsContainer, jModal) {
        var jOptionsContent = jOptionsContainer.find(".optionsContent");

        jOptionsContainer.on("click", function () {
          jModal.modal("show");
        });

        jModal.find(".close").on("click", function () {
          jModal.modal("hide");
        });

        jModal.find(".popupOption").on("click", function () {
          var jOption = $(this)
            , value = jOption.data("value")
            , index = jOption.data("index")
            , jDisplayText = jOption.find(".displayText")
            , displayText = jDisplayText.html()
            , newOptionHTML = "<span class='addedOption'><span class='text'>" + displayText +
              "</span><span class='clickable removeOption' data-index='" + index + "'><i class='fa fa-times'></i></span>" +
              "<input type='hidden' name='" + name + "' value='" + value + "' /></span>"
            , jNewOption = $(newOptionHTML)
            ;

          if (jOption.hasClass("selected")) {
            jOptionsContent.find(".removeOption[data-index='" + index + "']").closest(".addedOption").remove()
          } else {
            jOptionsContent.append(jNewOption);
            jNewOption.find(".removeOption").on("click", removeOption);
          }
          jOption.toggleClass("selected");
          calculateIconPadding(jOptionsContainer);
        });

        jOptionsContent.find(".removeOption").on("click", removeOption);
      }

//      -------------MAIN CODE STARTS HERE--------------

      var jElement = $(this)

      if (!jElement.is("select")) {
        console.log("Popup MultiSelect only possible in select.");
        return true;
      }

      var options = jElement.data()
        , title = options.title || "Select Options"
        , helpText = options.helpText || ""
        , name = jElement.attr("name") + "[]"
        , modalBodyHTML = createModalBody(jElement)
        , jModal = createModal(modalBodyHTML, title, helpText)
        ;

      // Hide existing modals if any and remove.
      $(".popupMultiSelect.modal").modal("hide").remove();

      // Add modal to body.
      $("body").append(jModal);

      // Create options container, which is supposed to replace select.
      var jOptionsContainer = createOptionsContainer(jElement);

      // Replacing select.
      jElement.replaceWith(jOptionsContainer);

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