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
            $(this).find('input[jqfmv-validators]').each(function() {
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
     * Method used to validate each input with a jqfmv-validator attr of a form
     **/
    $.fn._validateForm = function() {
        var err = [];
        var formFilter = $(this).filter('form');
        if (formFilter.length) {
            $(formFilter).each(function() {
                $(this).find('input[jqfmv-validators]').each(function() {
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
     * Method used to validate an input base on jqfmv-validators attribute
     **/
    $.fn._validateInput = function() {
        var err = [];
        var inputFilter = $(this).filter('input[jqfmv-validators]');
        inputFilter.each(function() {
            var inpt = $(this);
            var inptValue = inpt.val();
            var inptValidators = inpt.attr('jqfmv-validators').split(',');

            err[inpt.attr('name')] = [];
            $(inptValidators).each(function() {
                var inptErr = $.jqfmv.validators.validate(this, inpt);
                $(inptErr).each(function (){
                   err[inpt.attr('name')].push(this);
                });
            });
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
        this.find('input[jqfmv-validators]').each(function() {
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
        input.css('backgroundColor','red');
    };

    /**
     * @scope public
     * FormValidator tool object.
     **/
    $.jqfmv = {
        validators : {

            /**
             * @scope private
             * Object containing the defined validators
             **/
            _validators : {},

            /**
             * @scope public
             * @methd add
             * @this $.jqfmv.validators
             * @param validator ::the validator object {name, handler}
             * Method used to add a new validator capability
             **/
            add : function(validator) {
                this._validators[validator.name] = validator.handler;
            },

            /**
             * @scope public
             * @methd validate
             * @this $.jqfmv.validators
             * @param name ::name of the validator
             * @param input ::the target input
             * @return aray ::the list of all errors for the validator
             * Method used to execute the validator defined by name against the given input
             **/
            validate : function(name, input) {
                return ($.jqfmv.validators._validators[name](input.val(), this._against(name, input)));
            },

            /**
             * @scope private
             * @methd _against
             * @this $.jqfmv.validators
             * @param name ::name of the validator
             * @param input ::the target input
             * @return string ::the jqfmv-against-${name} attribute
             * Method used to retrieve the appropriate attribute to match against
             **/
            _against : function(name, input) {
                return (input.attr('jqfmv-against-' + name));
            },


            /**
             * @scope private
             * Object containing the core methods of the jqfmv.validators
             **/
            _core : {
                
                /**
                 * @scope private
                 * @methd _lengthValidator
                 * @this $.jqfmv.validators._core
                 * @param value ::the input value
                 * @param against value ::the parameter to validate against
                 * @return array ::the list of errors for the validator
                 * Method used to validate the length of a field, regarding the min length
                 * and/or max length.
                 *      ,n => to validate max length only
                 *      n, => to validate min length only
                 *      n,n => to validate min and max length
                 * 
                 *      JQFMV_LENGTH_MIN_ERROR indicates an error on min length
                 *      JQFMV_LENGTH_MAX_ERROR indicates an error on max length
                 **/
                _lengthValidator : function(value, against) {
                    var err = [];

                    var bounds = against.split(',');
                    var min = bounds[0].length ? window.parseInt(bounds[0]) : null;
                    var max = bounds[1].length ? window.parseInt(bounds[1]) : null;
                    if (min !== null && value.length < min) { err.push('JQFMV_LENGTH_MIN_ERROR'); }
                    if (max !== null && value.length > max) { err.push('JQFMV_LENGTH_MAX_ERROR'); }

                    return (err);
                },
                
                /**
                 * @scope private
                 * @methd _exprValidator
                 * @this $.jqfmv.validators._core
                 * @param value ::the input value
                 * @param against value ::the parameter to validate against
                 * @return array ::the list of errors for the validator
                 * Method used to validate the format of a field, regarding a regexp 
                 *      ^...$ => to validate against an given regexp
                 * 
                 *      JQFMV_EXPR_MATCH_ERROR indicates an error on matching the given regexp
                 **/
                _exprValidator : function(value, against) {
                    var err = [];

                    if (value.match(against) === null) err.push('JQFMV_EXPR_MATCH_ERROR');

                    return (err);
                }
            }

        }
    };

    // Initializing the core validators
    $.jqfmv.validators.add({'name' : 'length', 'handler' : $.jqfmv.validators._core._lengthValidator});
    $.jqfmv.validators.add({'name' : 'expr', 'handler' : $.jqfmv.validators._core._exprValidator});

}(jQuery));