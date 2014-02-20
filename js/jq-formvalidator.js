/*******************************************************************************
 * JQUERY FormValidator plugin.
 * Based on jquery-1.11.0. This plugin is used to validate HTML form based on 3
 * constraints :
 *      - max length of an input
 *      - min length of an input
 *      - format of an input (regexp control)
 * 
 * @created 2014-20-02
 * @enhancements Add predefined formats (email / phone / name / number / float ...)
 ******************************************************************************/

(function( $ ) {
    /**
     * @scope public
     * @mthd formValidator
     * @this form ::the form to validate
     * @param options ::list of customizable settings
     * Method used to make a form automatically validated on various customizable
     * events.
     **/
    $.fn.formValidator = function(options) {
        var settings = $.extend({
            'validateOnBlur' : true,
            'validateOnSubmit' : true,
            'validateOnKeyUp' : false,
            'validateOnKeyDown' : false,
            'validateOnFocus' : false,
            'keepValueIfWrong' : true,
            'onValidationSuccess' : $(this)._onValidationSuccess,
            'onValidationError' : $(this)._onValidationError
        }, options);
        
        $(this).filter('form').each(function() {
            $(this)._listen(settings);
            $(this).find('input:not([type=submit])').each(function() {
                $(this)._listen(settings);
            });
        });
    };
    
    /**
     * @scope public
     * @mthd validate
     * @this form or input ::validation target
     * Method used to validate a full form or a single input. Can be called 
     * directly
     **/
    $.fn.validate = function() {
        return ($(this).is('form') ? $(this)._validateForm() : $(this)._validateInput());
    };
    
    /**
     * @scope private
     * @mthd _validateForm
     * @this form ::the form to validate
     * @return array ::list of errors
     * Method used to validate each input of a form
     **/
    $.fn._validateForm = function() {
        var err = [];
        var formFilter = $(this).filter('form');
        if (formFilter.length) {
            $(formFilter).each(function() {
                $(this).find('input').each(function() {
                    err[$(this).attr('name')] = $(this)._validateInput()[$(this).attr('name')];
                });
            });
        }
        return (err);
    };
    
    /**
     * @scope private
     * @mthd _validateInput
     * @this form ::the input to validate
     * @return array ::list of errors
     * Method used to validate an input base on min-length max-length and format attr
     **/
    $.fn._validateInput = function() {
        var err = [];
        var inputFilter = $(this).filter('input');
        inputFilter.each(function() {
            var inptVal = $(this).val();
            var inptMinLength = $(this).attr('min-length');
            var inptMaxLength = $(this).attr('max-length');
            var inptFormat = $(this).attr('format');
            
            err[$(this).attr('name')] = []
            if (inptVal.length < inptMinLength) err[$(this).attr('name')].push("KO_MINLENGTH");
            if (inptVal.length > inptMaxLength) err[$(this).attr('name')].push("KO_MAXLENGTH");
            if (inptVal.match(inptFormat) === null) err[$(this).attr('name')].push("KO_FORMAT");
        });
        return (err);
    };
    
    /**
     * @scope private
     * @methd _listen
     * @this form or input ::the target element to listen on
     * @param settings ::list of customizable settings
     * Method used to start listening the customized events
     **/
    $.fn._listen = function(settings) {
        var formFilter = $(this).filter('form');
        if ($(this).is('form')) {
            var form = $(this);
            if (settings.validateOnBlur) form.on('submit', $.proxy(form._onFormEventTrigger, form, settings));
        } else {
           var input = $(this);
           if (settings.validateOnBlur) input.on('blur', $.proxy(input._onInputEventTrigger, input, settings));
           if (settings.validateOnKeyUp) input.on('keyup', $.proxy(input._onInputEventTrigger, input, settings));
           if (settings.validateOnKeyDown) input.on('keydown', $.proxy(input._onInputEventTrigger, input, settings));
           if (settings.validateOnFocus) input.on('focus', $.proxy(input._onInputEventTrigger, input, settings));
        }
    };
    
    /**
     * @scope private
     * @methd _onFormEventTrigger
     * @this form ::the target form  of the event
     * @param settings ::list of customizable settings
     * @param evt ::the event triggered
     * Method used to when a customized form event is triggered
     **/
    $.fn._onFormEventTrigger = function(settings, evt) {
        evt.preventDefault();
        var err = this.validate();
        this.find('input:not([type=submit])').each(function() {
            if (err[$(this).attr('name')].length > 0)
                settings.onValidationError($(this), err[$(this).attr('name')]);
            else
                settings.onValidationSuccess($(this));
        });
    };
    
    /**
     * @scope private
     * @methd _onInputEventTrigger
     * @this input ::the target input of the event
     * @param settings ::list of customizable settings
     * @param evt ::the event triggered
     * Method used to when a customized input event is triggered
     **/
    $.fn._onInputEventTrigger = function(settings, evt) {
        var err = this.validate();
        if (err[this.attr('name')].length)
            settings.onValidationError(this, err[this.attr('name')]);
        else
            settings.onValidationSuccess(this);
    };
    
    /**
     * @scope private
     * @methd _onValidationSuccess
     * @this settings ::the setting object
     * @param input ::the controlled input
     * Method used by default when a validation succeeds
     **/
    $.fn._onValidationSuccess = function(input) {
        console.info(this);
        input.css('backgroundColor','green');
    };
    
    /**
     * @scope private
     * @methd _onValidationError
     * @this settings ::the setting object
     * @param input ::the controlled input
     * Method used by default when a validation fails
     **/
    $.fn._onValidationError = function(input, errors) {
        console.info(this);
        input.css('backgroundColor','red');
    };
}(jQuery));