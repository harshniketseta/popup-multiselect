/* ========================================================================
 * Bootstrap: multiselect.js
 * ========================================================================
 * Popup Multi Select
 * Created By Harshniket Seta
 * Currently maintained by harshniketseta [at] gmail [dot] com
 * Version: 3.1.0
 * Release: 2019-06-07
 * ======================================================================== */

(function($) {
  "use strict";

  // MULTISELECT PUBLIC CLASS DEFINITION
  // ===============================

  var MultiSelect = function(element, options) {
    this.options = null;
    this.enabled = null;
    this.multiple = null;
    this.timeout = null;
    this.modalShown = null;
    this.$element = null;
    this.type = "multiselect";

    this.init(element, options);
  };

  if (!$.fn.modal) throw new Error("MultiSelect requires modal.js");

  MultiSelect.VERSION = "3.1.0";

  MultiSelect.DEFAULTS = {
    animation: true,
    modalSize: "sm",
    selectTemplate:
      '<div class="selectWrap clearfix"><span class="select-content"></span><a href="#" class="open-options clickable"><span class="icon icon-list">&#9776;</span></a></div>',
    selectOptionTemplate:
      '<span class="addedOption" ><span class="text"></span><span class="clickable removeOption"><span class="icon icon-remove" aria-hidden="true">&#9747;</span></span></span>',
    modalTemplate:
      '<div class="select modal in" aria-hidden="false"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div><h5 class="modal-title"></h5><div class="help-block"></div></div><span class="float-right clickable close" aria-hidden="true">&#9747;</span></div><div class="modal-body"></div></div></div></div>',
    modalOptionTemplate:
      '<div class="option clickable"><span class="option-text"></span><span class="option-tick"><span class="icon icon-ok" aria-hidden="true">&#x2713;</span></span></div>',
    title: "Select Options"
  };

  MultiSelect.prototype.init = function(element, options) {
    var $element = $(element);
    this.$element = $element.clone(true, true);
    this.enabled = this.isEnabled();
    this.multiple = this.isMultiple();
    this.options = this.getOptions(options);

    if (!this.$element.is("select")) {
      throw new Error("Popup MultiSelect only possible in select.");
    }

    this.replaceDefaultSelect($element);
    this.$selectOptions = this.extractSelectOptions();
  };

  MultiSelect.prototype.isEnabled = function() {
    return !this.$element.prop("disabled");
  };

  MultiSelect.prototype.isMultiple = function() {
    return this.$element.prop("multiple");
  };

  MultiSelect.prototype.hasSelectOptions = function() {
    return this.$selectOptions.length > 0;
  };

  MultiSelect.prototype.extractSelectOptions = function() {
    var options = [],
      configuration = this.getOptionConfig(),
      oMultiSelect = this;
    $.each(this.$element.find("option"), function(index, option) {
      var optionObj = new MultiSelect.Option(option, configuration);
      options.push(optionObj);
      if (optionObj.isSelected()) {
        oMultiSelect._optionSelected(optionObj);
      }
    });

    return options;
  };

  MultiSelect.prototype.replaceDefaultSelect = function($element) {
    var $multiSelect = this.getMultiSelect();
    $element.replaceWith($multiSelect);
    this.$element.css({ visibility: "hidden", height: "0px", width: "0px" });
    $multiSelect.append(this.$element);

    // Calculating open icon position.
    this.postProcess();

    // Initializing Event Listeners.
    this.initMultiSelect();
  };

  MultiSelect.prototype.initMultiSelect = function() {
    var oMultiSelect = this;

    this.getMultiSelectOpen().on("click", function(event) {
      event.preventDefault();
      oMultiSelect.show();
    });
  };

  MultiSelect.prototype.getDefaults = function() {
    return MultiSelect.DEFAULTS;
  };

  MultiSelect.prototype.getOptions = function(options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options);
    if (!this.multiple) {
      options.maxSelectionAllowed = 1;
    }

    return options;
  };

  MultiSelect.prototype.getOptionConfig = function(options) {
    return {
      modalOptionTemplate: this.options.modalOptionTemplate,
      selectOptionTemplate: this.options.selectOptionTemplate
    };
  };

  MultiSelect.prototype.getUID = function(prefix) {
    do prefix += ~~(Math.random() * 1000000);
    while (document.getElementById(prefix));
    return prefix;
  };

  MultiSelect.prototype.getMultiSelect = function() {
    if (!this.$multiSelect) {
      this.$multiSelect = $(this.options.selectTemplate);
      if (!this.enabled) this.$multiSelect.addClass("disabled");

      var elementClasses = this.$element.prop("class").split(" ");
      for (var i = 0; i < elementClasses.length; i++) {
        this.$multiSelect.addClass(elementClasses[i]);
      }
    }

    var multiSelectId = this.getUID(
      this.$element.attr("id") || "selectContainer"
    );
    this.$multiSelect.attr("id", multiSelectId);
    this.$element.attr("aria-describedby", multiSelectId);
    return this.$multiSelect;
  };

  MultiSelect.prototype.getSelectOpenIcon = function() {
    var $openOptions = this.getMultiSelectOpen(),
      optionsOpenIcon = $openOptions.find("span.icon");
    return optionsOpenIcon;
  };

  MultiSelect.prototype.getMultiSelectOpen = function() {
    return (
      this.$openOptions ||
      (this.$openOptions = this.$multiSelect.find(".open-options"))
    );
  };

  MultiSelect.prototype.getMultiSelectContent = function() {
    return (
      this.$selectContent ||
      (this.$selectContent = this.$multiSelect.find(".select-content"))
    );
  };

  MultiSelect.prototype.getSelected = function() {
    return this.getMultiSelectContent().children();
  };

  MultiSelect.prototype.getModal = function() {
    if (!this.$modal) {
      this.$modal = $(this.options.modalTemplate);
      this.getModalHelpBlock(this.$modal).html(this.getModalHelpTextContent());
      this.getModalTitleBlock(this.$modal).html(this.getModalTitle());
      this.getModalBody(this.$modal).html(this.getModalBodyContent());
      this.getModalDialog(this.$modal).addClass(this.getModalSizeClass());
      this.initModal(this.$modal);
    }

    return this.$modal;
  };

  MultiSelect.prototype.getModalClose = function($modal) {
    return $modal.find(".close");
  };

  MultiSelect.prototype.getModalHelpBlock = function($modal) {
    $modal = $modal || this.getModal();

    return $modal.find(".help-block");
  };

  MultiSelect.prototype.getModalTitleBlock = function($modal) {
    $modal = $modal || this.getModal();

    return $modal.find(".modal-title");
  };

  MultiSelect.prototype.getModalBody = function($modal) {
    $modal = $modal || this.getModal();

    return $modal.find(".modal-body");
  };

  MultiSelect.prototype.getModalDialog = function($modal) {
    $modal = $modal || this.getModal();

    return $modal.find(".modal-dialog");
  };

  MultiSelect.prototype.getModalHelpTextContent = function(jOption, action) {
    var helpText = "",
      currentlySelectedLength = this.getSelected().length,
      maxSelectionAllowed = this.options.maxSelectionAllowed,
      selectionLeft = maxSelectionAllowed - currentlySelectedLength;
    if (maxSelectionAllowed < 1) {
      return;
    }
    if (currentlySelectedLength === 0 && selectionLeft > 0) {
      helpText = "Select " + selectionLeft;
    } else if (selectionLeft > 0) {
      helpText = "Select " + selectionLeft + " more.";
    } else if (selectionLeft === 0) {
      helpText = "Done.";
    }
    return helpText;
  };

  MultiSelect.prototype.getModalTitle = function() {
    return this.options.title;
  };

  MultiSelect.prototype.getModalSizeClass = function() {
    return "modal-" + this.options.modalSize;
  };

  MultiSelect.prototype.getModalBodyContent = function() {
    var oMultiSelect = this,
      modalBodyContent = [];
    $.each(this.$selectOptions, function(index, optionObj) {
      var jModalOption = optionObj.createModalOption();

      jModalOption.on("click", function() {
        var $option = $(this),
          oOption = $option.data("multiselect.option");
        if ($option.hasClass("selected")) {
          oMultiSelect.optionDeSelected(oOption);
        } else {
          oMultiSelect.optionSelected(oOption);
        }
      });
      modalBodyContent.push(jModalOption);
    });
    return modalBodyContent;
  };

  MultiSelect.prototype.postProcess = function() {
    var multiSelectHeight = this.$multiSelect.height(),
      multiSelectOuterWidth = this.$multiSelect.outerWidth(),
      multiSelectPaddingRight = parseInt(
        this.$multiSelect.css("padding-right")
      ),
      multiSelectPaddingLeft = parseInt(this.$multiSelect.css("padding-left")),
      $selectContent = this.getMultiSelectContent(),
      $openOptions = this.getMultiSelectOpen(),
      $openIcon = this.getSelectOpenIcon(),
      iconFontSize = parseInt($openIcon.css("font-size")),
      iconPadding = (multiSelectHeight - iconFontSize) / 2,
      optionsContentWidth =
        multiSelectOuterWidth -
        multiSelectPaddingRight -
        multiSelectPaddingLeft -
        iconFontSize;
    $selectContent.css({ width: optionsContentWidth });
    $openOptions.css({
      height: iconFontSize,
      "margin-top": iconPadding,
      "margin-bottom": iconPadding,
      right: multiSelectPaddingRight
    });
  };

  MultiSelect.prototype.updateHelpText = function(jOption, e) {
    this.getModalHelpBlock(this.getModal()).html(
      this.getModalHelpTextContent(jOption, e)
    );
    return true;
  };

  MultiSelect.prototype.initModal = function($modal) {
    var oMultiSelect = this;

    this.getModalClose($modal).on("click", function() {
      oMultiSelect.hide();
    });

    $modal.on("hide.bs.modal", function(event) {
      var e = $.Event("hide.bs." + oMultiSelect.type);
      oMultiSelect.$element.trigger(e);

      if (e.isDefaultPrevented()) {
        event.preventDefault();
      }
    });

    $modal.on("hidden.bs.modal", function(event) {
      oMultiSelect.modalShown = false;
      var e = $.Event("hidden.bs." + oMultiSelect.type);
      oMultiSelect.$element.trigger(e);
      oMultiSelect.cleanModal();
    });
  };

  MultiSelect.prototype.show = function() {
    var e = $.Event("show.bs." + this.type);

    if (this.hasSelectOptions() && this.enabled) {
      this.$element.trigger(e);
      var inDom = $.contains(
        this.$multiSelect[0].ownerDocument.documentElement,
        this.$multiSelect[0]
      );

      if (e.isDefaultPrevented() || !inDom) {
        return;
      }

      var $modal = this.getModal(),
        modalId = this.getUID(this.type);
      this.appendModal();
      $modal.attr("id", modalId);
      this.$multiSelect.attr("aria-describedby", modalId);

      if (this.options.animation) $modal.addClass("fade");
      $("body").prepend($modal);

      var oMultiSelect = this;
      $modal.on("shown.bs.modal", function() {
        oMultiSelect.modalShown = true;
        var e = $.Event("shown.bs." + oMultiSelect.type);
        oMultiSelect.$element.trigger(e);
      });

      $modal.modal("show");
    }
  };

  MultiSelect.prototype.hide = function() {
    var $modal = this.getModal();
    $modal.modal("hide");
  };

  MultiSelect.prototype.cleanModal = function() {
    this.$multiSelect.removeAttr("aria-describedby");
    this.$modal.remove();
    this.$modal = null;
  };

  MultiSelect.prototype.appendModal = function() {
    $("body").prepend(this.$modal);
  };

  MultiSelect.prototype.addOption = function(attributes) {
    var jOption = $("<option></option>", attributes),
      optionObj = new MultiSelect.Option(jOption, this.getOptionConfig()),
      e = null;
    e = $.Event("addingoption.bs." + this.type);
    this.$element.trigger(e, optionObj);

    if (e.isDefaultPrevented()) {
      return;
    }

    this.$element.append(jOption);
    this.$selectOptions.push(optionObj);

    e = $.Event("optionadded.bs." + this.type);
    this.$element.trigger(e, optionObj);

    if (jOption.prop("selected")) {
      this.optionSelected(optionObj);
    }

    if (this.modalShown) {
      this.getModalBody().html(this.getModalBodyContent());
    }
  };

  MultiSelect.prototype.selectOption = function(value) {
    var optionObj = this.$element
      .find("option[value=" + value + "]")
      .data("multiselect.option");

    this.optionSelected(optionObj);
  };

  MultiSelect.prototype.deselectOption = function(value) {
    var optionObj = this.$element
      .find("option[value=" + value + "]")
      .data("multiselect.option");

    this.optionDeSelected(optionObj);
  };

  MultiSelect.prototype.enable = function() {
    if (this.enabled) {
      return;
    }

    this.$multiSelect.removeClass("disabled");
    this.$element.prop("disabled", false);
    this.enabled = true;

    var e = $.Event("enabled.bs." + this.type);
    this.$element.trigger(e);
  };

  MultiSelect.prototype.disable = function() {
    if (!this.enabled) {
      return;
    }

    this.$multiSelect.addClass("disabled");
    this.$element.prop("disabled", true);
    this.enabled = false;

    var e = $.Event("disabled.bs." + this.type);
    this.$element.trigger(e);
  };

  MultiSelect.prototype.optionSelected = function(optionObj) {
    var e = null;

    if (this.options.maxSelectionAllowed == this.getSelected().length) {
      e = $.Event("maxselected.bs." + this.type);
      this.$element.trigger(e, optionObj);
      return true;
    }

    e = $.Event("selected.bs." + this.type);
    this.$element.trigger(e, optionObj);

    if (e.isDefaultPrevented()) {
      return;
    }

    optionObj.selected();

    this._optionSelected(optionObj);

    e = $.Event("selectiondone.bs." + this.type);
    this.$element.trigger(e, optionObj);

    this.updateHelpText(optionObj, e);
    this.postProcess();
  };

  MultiSelect.prototype._optionSelected = function(optionObj) {
    var oMultiSelect = this,
      $selectOption = optionObj.getContent();
    $selectOption.find(".removeOption").on("click", function() {
      oMultiSelect.optionDeSelected(optionObj);
    });

    this.getMultiSelectContent().append($selectOption);
  };

  MultiSelect.prototype.optionDeSelected = function(optionObj) {
    var e = $.Event("deselected.bs." + this.type);
    this.$element.trigger(e, optionObj);

    if (e.isDefaultPrevented()) {
      return;
    }

    optionObj.deselected();
    optionObj.getContent().remove();

    e = $.Event("deselectiondone.bs." + this.type);
    this.$element.trigger(e, optionObj);

    this.updateHelpText(optionObj, e);
    this.postProcess();
  };

  MultiSelect.Option = function(element, options) {
    this.options = null;
    this.enabled = null;
    this.timeout = null;
    this.$element = null;
    this.type = "multiselect.option";

    this.init(element, options);
  };

  MultiSelect.Option.DEFAULTS = {};

  MultiSelect.Option.prototype.init = function(element, options) {
    this.$element = $(element);
    this.enabled = this.isEnabled();
    this.options = this.getOptions(options);

    if (!this.$element.is("option")) {
      throw new Error(
        "Popup MultiSelect Option only possible on option element."
      );
    }

    this.$element.data(this.type, this);
    this.tip();
  };

  MultiSelect.Option.prototype.tip = function() {
    if (!this.$tip) {
      this.$tip = $(this.options.modalOptionTemplate);

      this.$tip.find(".option-text").html(this.$element.text());
      if (!this.enabled) this.$tip.addClass("disabled");

      if (this.isSelected()) {
        this.selected();
      }
    }
  };

  MultiSelect.Option.prototype.getDefaults = function() {
    return MultiSelect.Option.DEFAULTS;
  };

  MultiSelect.Option.prototype.getOptions = function(options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options);

    return options;
  };

  MultiSelect.Option.prototype.isEnabled = function() {
    return !this.$element.prop("disabled");
  };

  MultiSelect.Option.prototype.createModalOption = function() {
    this.$tip.data(this.type, this);

    return this.$tip;
  };

  MultiSelect.Option.prototype.isSelected = function() {
    return this.$element.prop("selected");
  };

  MultiSelect.Option.prototype.selected = function() {
    this.$element.attr("selected", "selected");
    this.$tip.addClass("selected");
  };

  MultiSelect.Option.prototype.deselected = function() {
    this.$element.removeAttr("selected");
    this.$tip.removeClass("selected");
  };

  MultiSelect.Option.prototype.getContent = function() {
    if (!this.$content) {
      this.$content = $(this.options.selectOptionTemplate);

      this.$content.find(".text").html(this.$element.html());
      if (!this.enabled) this.$content.addClass("disabled");

      this.$content.data(this.type, this);
    }
    return this.$content;
  };

  // MULTISELECT PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    var optionalParams = Array.prototype.slice.call(arguments);
    optionalParams.shift();
    return this.each(function() {
      var $this = $(this);
      var data = $this.data("bs.multiselect");
      var options = typeof option == "object" && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) {
        data = new MultiSelect(this, options);
        $this = data.$element;
        $this.data("bs.multiselect", data);
      }
      if (typeof option == "string") data[option].apply(data, optionalParams);
    });
  }

  var old = $.fn.multiselect;

  $.fn.multiselect = Plugin;
  $.fn.multiselect.Constructor = MultiSelect;

  // MULTISELECT NO CONFLICT
  // ===================

  $.fn.multiselect.noConflict = function() {
    $.fn.multiselect = old;
    return this;
  };
})(jQuery);
