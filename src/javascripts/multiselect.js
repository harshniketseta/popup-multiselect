/* ========================================================================
 * Bootstrap: multiselect.js
 * ========================================================================
 * Popup Multi Select
 * Created By Harshniket Seta
 * Currently maintained by harshniketseta [at] gmail [dot] com
 * Version: 0.2.0
 * Release: 2015-03-05
 * ======================================================================== */

(function ($) {
  'use strict';

  // MULTISELECT PUBLIC CLASS DEFINITION
  // ===============================

  var MultiSelect = function (element, options) {
    this.options = null;
    this.enabled = null;
    this.timeout = null;
    this.$element = null;
    this.type = "multiselect";


    this.init(element, options);
  };

  if (!$.fn.modal) throw new Error('MultiSelect requires modal.js');

  MultiSelect.VERSION = '0.2.0';

  MultiSelect.DEFAULTS = {
    animation: true,
    optionTemplate: '<div class="option clickable"><span class="option-text"></span><span class="option-tick"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></span></div>',
    selectTemplate: '<div class="selectWrap  clearfix"><span class="select-content"></span><span class="open-options clickable"><span class="glyphicon glyphicon-list" aria-hidden="true"></span></span></div>',
    modalTemplate: '<div class="select modal in" aria-hidden="false"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header"><span class="pull-right clickable close" aria-hidden="true">x</span><h4 class="modal-title"></h4><div class="help-block"></div></div><div class="modal-body"></div></div></div></div>',
    title: 'Select Options'
  };

  MultiSelect.prototype.init = function (element, options) {
    var $element = $(element);
    this.$element = $element.clone(true, true);
    this.enabled = this.isEnabled();
    this.options = this.getOptions(options);

    if (!this.$element.is("select")) {
      throw new Error('Popup MultiSelect only possible in select.');
    }

    this.$selectOptions = this.extractOptions();
    this.replaceDefaultSelect($element);
  };

  MultiSelect.prototype.getDefaults = function () {
    return MultiSelect.DEFAULTS;
  };

  MultiSelect.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options);

    return options;
  };

  MultiSelect.prototype.isEnabled = function () {
    return !this.$element.prop("disabled");
  };

  MultiSelect.prototype.extractOptions = function () {
    var options = []
      , configuration = {template: this.options.optionTemplate}
      ;

    $.each(this.$element.find("option"), function (index, option) {
      options.push(new MultiSelect.Option(option, configuration));
    });

    return options;
  };

  MultiSelect.prototype.getMultiSelect = function () {
    if (!this.$multiSelect) {
      this.$multiSelect = $(this.options.selectTemplate);
      if (!this.enabled) this.$multiSelect.addClass("disabled");
    }

    return this.$multiSelect;
  };

  MultiSelect.prototype.getSelectOpenIcon = function () {
    var $openOptions = this.getMultiSelectOpen()
      , optionsOpenIcon = $openOptions.find("span.glyphicon")
      ;

    return optionsOpenIcon;
  };

  MultiSelect.prototype.getMultiSelectOpen = function () {
    return this.$openOptions || (this.$openOptions = this.$multiSelect.find(".open-options"));
  };

  MultiSelect.prototype.getMultiSelectContent = function () {
    return this.$selectContent || (this.$selectContent = this.$multiSelect.find(".select-content"));
  };

  MultiSelect.prototype.getSelected = function () {
    return this.getMultiSelectContent().children();
  };

  MultiSelect.prototype.replaceDefaultSelect = function ($element) {

    var $multiSelect = this.getMultiSelect();
    $element.replaceWith($multiSelect);
    this.$element.css({visibility: "hidden", height: "0px", width: "0px"});
    $multiSelect.append(this.$element);

    // Calculating open icon position.
    this.postProcess();

    // Initializing Event Listeners.
    this.initMultiSelect();

  };

  MultiSelect.prototype.postProcess = function () {
    var multiSelectHeight = this.$multiSelect.height()
      , multiSelectOuterWidth = this.$multiSelect.outerWidth()
      , multiSelectPaddingRight = parseInt(this.$multiSelect.css("padding-right"))
      , multiSelectPaddingLeft = parseInt(this.$multiSelect.css("padding-left"))
      , $selectContent = this.getMultiSelectContent()
      , $openOptions = this.getMultiSelectOpen()
      , $openIcon = this.getSelectOpenIcon()
      , iconFontSize = parseInt($openIcon.css("font-size"))
      , iconPadding = (multiSelectHeight - iconFontSize) / 2
      , optionsContentWidth = multiSelectOuterWidth - multiSelectPaddingRight - multiSelectPaddingLeft - iconFontSize
      ;

    $selectContent.css({width: optionsContentWidth});
    $openOptions.css({
      "height": iconFontSize,
      "padding-top": iconPadding,
      "padding-bottom": iconPadding,
      right: multiSelectPaddingRight
    });
  };

  MultiSelect.prototype.initMultiSelect = function () {
    var oMutliSelect = this;

    this.getMultiSelectOpen().on("click", function () {
      oMutliSelect.show();
    });
  };

  MultiSelect.prototype.show = function () {

    var $modal = this.getModal();
    $("body").prepend($modal);
    $modal.modal("show");
  };

  MultiSelect.prototype.hide = function () {

    var $modal = this.getModal();
    $modal.modal("hide");
  };

  MultiSelect.prototype.getModal = function () {
    if (!this.$modal) {
      this.$modal = $(this.options.modalTemplate);
      if (this.options.animation) this.$modal.addClass("fade");
      this.getModalHelpBlock(this.$modal).html(this.getModalHelpTextContent());
      this.getModalBody(this.$modal).html(this.getModalBodyContent());
      this.initModal(this.$modal);
    }

    return this.$modal;
  };

  MultiSelect.prototype.getModalClose = function ($modal) {
    return $modal.find(".close");
  }

  MultiSelect.prototype.initModal = function ($modal) {
    var oMutliSelect = this;

    this.getModalClose($modal).on("click", function () {
      oMutliSelect.hide();
    });
  };

  MultiSelect.prototype.getModalHelpBlock = function ($modal) {
    $modal = $modal || this.getModal();

    return $modal.find(".help-block");
  };

  MultiSelect.prototype.getModalBody = function ($modal) {
    $modal = $modal || this.getModal();

    return $modal.find(".modal-body");
  };

  MultiSelect.prototype.getModalHelpTextContent = function () {
    var helpText = ""
      , currentlySelectedLength = this.getSelected().length
      , maxSelectionAllowed = this.options.maxSelectionAllowed
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
    return helpText;
  };

  MultiSelect.prototype.getModalBodyContent = function () {
    var oMutliSelect = this
      , $modalBodyContent = []
      ;

    $.each(this.$selectOptions, function (index, optionObj) {
      $modalBodyContent.push(optionObj.createModalOption());
      optionObj.onSelect = oMutliSelect.optionSelected
    });
    return $modalBodyContent;
  };

  MultiSelect.prototype.optionSelected = function (jOption) {
    debugger;
  };

  MultiSelect.Option = function (element, options) {
    this.options = null;
    this.enabled = null;
    this.timeout = null;
    this.$element = null;
    this.type = "multiselect.option";


    this.init(element, options);
  };

  MultiSelect.Option.DEFAULTS = {};

  MultiSelect.Option.prototype.init = function (element, options) {
    this.$element = $(element);
    this.enabled = this.isEnabled();
    this.options = this.getOptions(options);

    if (!this.$element.is("option")) {
      throw new Error('Popup MultiSelect Option only possible on option element.');
    }
  };

  MultiSelect.Option.prototype.getDefaults = function () {
    return MultiSelect.Option.DEFAULTS;
  };

  MultiSelect.Option.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options);

    return options;
  };

  MultiSelect.Option.prototype.isEnabled = function () {
    return !this.$element.prop("disabled");
  };

  MultiSelect.Option.prototype.createModalOption = function () {

    if (!this.$tip) {
      this.$tip = $(this.options.template);

      this.$tip.find(".option-text").html(this.$element.html());
      if (!this.enabled) this.$tip.addClass("disabled");

      this.initEventListeners();
    }
    return this.$tip;
  };

  MultiSelect.Option.prototype.initEventListeners = function () {
    var oMultiSelectOption = this;

    this.$tip.on("click", function () {
      $(this).toggleClass("selected");
      if (typeof(oMultiSelectOption.onSelected) === "function") {
        oMultiSelectOption.onSelected(oMultiSelectOption);
      }
    });
  };

  // MULTISELECT PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.multiselect');
      var options = typeof option == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.multiselect', (data = new MultiSelect(this, options)));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.multiselect;

  $.fn.multiselect = Plugin;
  $.fn.multiselect.Constructor = MultiSelect;

  // MULTISELECT NO CONFLICT
  // ===================

  $.fn.multiselect.noConflict = function () {
    $.fn.multiselect = old;
    return this;
  };
})(jQuery);