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
 * @updated 2015-03-05
 *      Adding new predefined formats :
 *          email
 *          consistency
 *          checklist
 *          phone
 *          number
 *          integer
 *          format
 *          mandatory
 * @updated 2015-03-13
 *      Handling multiple options :
 *          keepValueIfWrong
 *          replaceWithTrimedValues
 *          trimValues
 *      Adding settings propagation
 * @updated 2015-03-16
 *      Handling callback after validation success
 *      Handling callback after validation error
 * @updated 2015-03-17
 *      Making markup lighter
 *      Changing length notation with bound ] and [
 ******************************************************************************/

(function( $ ) {
    /**
     * @scope public
     * @mthd formValidator
     * @this form ::the form to validate
     * @param options ::list of customizable settings
     *      validateOnBlur boolean ::trigger validation upon blur event on input
     *      validateOnSubmit boolean ::trigger validation upon submit event on form
     *      validateOnKeyUp boolean ::trigger validation upon keyUp event on input
     *      validateOnKeyDown boolean ::trigger validation upon keyDown event on input
     *      validateOnFocus boolean ::trigger validation upon focus event on input
     *      trimValues boolean ::trim values before validation
     *      replaceWithTrimedValues boolean ::replace values in place after trim
     *      keepValueIfWrong boolean ::keep or remove the values on validation error
     *      onValidationSuccess function ::handler triggered on validation success
     *      onValidationError function ::handler triggered on validation error
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
            'trimValues' : true,
            'replaceWithTrimedValues' : true,
            'keepValueIfWrong' : true,
            'onValidationSuccess' : $(this)._onValidationSuccess,
            'onValidationError' : $(this)._onValidationError,
            'afterFormValidationSuccess' : null,
            'afterFormValidationError' : null
        }, options);

        $(this).filter('form').each(function() {
            $(this)._listen(settings);
            $(this).find('input[data-jqfmv]').each(function() {
                $(this)._listen(settings);
            });
        });
    };

    /**
     * @scope public
     * @mthd validate
     * @this form or input ::validation target
     * @param settings ::list of customizable settings
     * Method used to validate a full form or a single input. Can be called
     * directly
     **/
    $.fn.validate = function(settings) {
        return ($(this).is('form') ? $(this)._validateForm(settings) : $(this)._validateInput(settings));
    };

    /**
     * @scope private
     * @mthd _validateForm
     * @this form ::the form to validate
     * @param settings ::list of customizable settings
     * @return array ::list of errors
     * Method used to validate each input with a jqfmv-validator data attr of a form
     **/
    $.fn._validateForm = function(settings) {
        var err = [];
        var formFilter = $(this).filter('form');
        if (formFilter.length) {
            $(formFilter).each(function() {
                $(this).find('input[data-jqfmv]').each(function() {
                    err[$(this).attr('name')] = $(this)._validateInput(settings)[$(this).attr('name')];
                });
            });
        }
        return (err);
    };

    /**
     * @scope private
     * @mthd _validateInput
     * @this form ::the input to validate
     * @param settings ::list of customizable settings
     * @return array ::list of errors
     * Method used to validate an input base on jqfmv data attribute
     **/
    $.fn._validateInput = function(settings) {
        var err = [];
        var inputFilter = $(this).filter('input[data-jqfmv]');
        inputFilter.each(function() {
            var inpt = $(this);
            var inptValue = inpt.val();
            var inptValidators = inpt.data('jqfmv').split(',');

            err[inpt.attr('name')] = [];
            $(inptValidators).each(function() {
                var inptErr = $.jqfmv.validators.validate(this, inpt, settings);
                if (inptErr.length != 0) {
                    $(inptErr).each(function (){
                       err[inpt.attr('name')].push(this);
                    });
                    if (settings.keepValueIfWrong === false) inpt.val('');
                }
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
        var err = this.validate(settings);
        var success = true;
        this.find('input[data-jqfmv]').each(function() {
            if (err[$(this).attr('name')].length > 0) {
                settings.onValidationError($(this), err[$(this).attr('name')]);
                success = false;
            } else
                settings.onValidationSuccess($(this));
        });
        if (success === true && settings.afterFormValidationSuccess !== null)
            settings.afterFormValidationSuccess(settings);
        else if (success === false && settings.afterFormValidationError !== null)
            settings.afterFormValidationError(settings);
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
        var err = this.validate(settings);
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
        var resultSpan = input.next('span.success, span.error');
        var text = '<span class="success">&#10004;</span>'
        
        if (resultSpan.length > 0) resultSpan.replaceWith(text);
        else input.after(text);
    };

    /**
     * @scope private
     * @methd _onValidationError
     * @this settings ::the setting object
     * @param input ::the controlled input
     * Method used by default when a validation fails
     **/
    $.fn._onValidationError = function(input, errors) {
        var resultSpan = input.next('span.success, span.error');
        var text = '<span class="error" title="'
            .concat($(input).attr('name') + " : " + errors)
            .concat('">&#10008;</span>');
        
        if (resultSpan.length > 0) resultSpan.replaceWith(text);
        else input.after(text);
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
            validate : function(name, input, settings) {
                var inptValue = settings.trimValues === true ? input.val().trim() : input.val();
                if (settings.trimValues === true && settings.replaceWithTrimedValues === true)
                    input.val(inptValue);
                return ($.jqfmv.validators._validators[name](inptValue, this._against(name, input), settings));
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
                return (input.data('jqfmv-' + name));
            },


            /**
             * @scope private
             * Object containing the core methods of the jqfmv.validators
             **/
            _core : {
                
                /**
                 * @scope private
                 * @methd _mandatoryValidator
                 * @this $.jqfmv.validators._core
                 * @param value ::the input value
                 * @return array ::the list of errors for the validator
                 * Method used to validate the valuation of a field
                 * 
                 *      JQFMV_MANDATORY_ERROR indicates an error on finding a value
                 **/
                _mandatoryValidator : function(value) {
                    var err = [];
                    
                    if (value === null || value.length === 0) err.push('JQFMV_MANDATORY_ERROR');
                    
                    return (err);
                },
                
                /**
                 * @scope private
                 * @methd _lengthValidator
                 * @this $.jqfmv.validators._core
                 * @param value ::the input value
                 * @param against value ::the parameter to validate against
                 * @return array ::the list of errors for the validator
                 * Method used to validate the length of a field, regarding the min length
                 * and/or max length.
                 *      [,n] => to validate max length only
                 *      [n,] => to validate min length only
                 *      [n,n] => to validate min and max length
                 * 
                 *      JQFMV_LENGTH_MIN_ERROR indicates an error on min length
                 *      JQFMV_LENGTH_MAX_ERROR indicates an error on max length
                 **/
                _lengthValidator : function(value, against) {
                    var err = [];
                    if (value === null || value.length === 0) return err;

                    var bounds = against.split(',');
                    
                    var maxLength = bounds[1].length;
                    
                    var minModifier = bounds[0].charAt(0) == ']' ? 1 : 0;
                    var maxModifier = bounds[1].charAt(maxLength - 1) == '[' ? -1 : 0;
                    
                    var min = bounds[0].length ? window.parseInt(bounds[0].slice(1)) + minModifier : null;
                    var max = bounds[1].length ? window.parseInt(bounds[1].slice(0, maxLength - 1)) + maxModifier : null;
                    if (min !== null && value.length < min) err.push('JQFMV_LENGTH_MIN_ERROR');
                    if (max !== null && value.length > max) err.push('JQFMV_LENGTH_MAX_ERROR');

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
                    if (value === null || value.length === 0) return err;

                    if (value.match(against) === null) err.push('JQFMV_EXPR_MATCH_ERROR');

                    return (err);
                },
                
                /**
                 * @scope private
                 * @methd _alphabeticValidator
                 * @this $.jqfmv.validators._core
                 * @param value ::the input value
                 * @return array ::the list of errors for the validator
                 * Method used to validate the format of a field against alphabetic pattern
                 * 
                 *      JQFMV_ALPHABETIC_MATCH_ERROR indicates an error on matching the alphabetic format
                 **/
                _alphabeticValidator : function(value) {
                    var err = [];
                    if (value === null || value.length === 0) return err;
                    
                    if (value.match(/^[A-Za-z]+$/) === null) err.push('JQFMV_ALPHABETIC_MATCH_ERROR');
                        
                    return (err);
                },
                
                /**
                 * @scope private
                 * @methd _emailValidator
                 * @this $.jqfmv.validators._core
                 * @param value ::the input value
                 * @return array ::the list of errors for the validator
                 * Method used to validate the format of a field against email pattern
                 * 
                 *      JQFMV_EMAIL_MATCH_ERROR indicates an error on matching the email format
                 **/
                _emailValidator : function(value) {
                    var err = [];
                    if (value === null || value.length === 0) return err;
                    
                    if (value.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/) === null)
                        err.push('JQFMV_EMAIL_MATCH_ERROR');
                        
                    return (err);
                },
                
                /**
                 * @scope private
                 * @methd _numberValidator
                 * @this $.jqfmv.validators._core
                 * @param value ::the input value
                 * @return array ::the list of errors for the validator
                 * Method used to validate the format of a field against number pattern
                 * 
                 *      JQFMV_NUMBER_MATCH_ERROR indicates an error on matching the number format
                 **/
                _numberValidator : function(value) {
                    var err = [];
                    if (value === null || value.length === 0) return err;
                    
                    if (value.match(/^(\+|\-)?[0-9]+((\.|,)[0-9]+)?$/) === null) err.push('JQFMV_NUMBER_MATCH_ERROR');
                        
                    return (err);
                },
                
                /**
                 * @scope private
                 * @methd _integerValidator
                 * @this $.jqfmv.validators._core
                 * @param value ::the input value
                 * @return array ::the list of errors for the validator
                 * Method used to validate the format of a field against integer number pattern
                 * 
                 *      JQFMV_INTEGER_MATCH_ERROR indicates an error on matching the integer number format
                 **/
                _integerValidator : function(value) {
                    var err = [];
                    if (value === null || value.length === 0) return err;
                    
                    if (value.match(/^(\+|\-)?[0-9]+$/) === null) err.push('JQFMV_INTEGER_MATCH_ERROR');
                        
                    return (err);
                },
                
                /**
                 * @scope private
                 * @methd _phoneValidator
                 * @this $.jqfmv.validators._core
                 * @param value ::the input value
                 * @return array ::the list of errors for the validator
                 * Method used to validate the format of a field against phone number pattern
                 * 
                 *      JQFMV_PHONE_MATCH_ERROR indicates an error on matching the phone number format
                 **/
                _phoneValidator : function(value) {
                    var err = [];
                    if (value === null || value.length === 0) return err;
                    
                    if (value.match(/^\+?[0-9 ]{5,20}$/) === null) err.push('JQFMV_PHONE_MATCH_ERROR');
                        
                    return (err);
                },
                
                /**
                 * @scope private
                 * @methd _checklistValidator
                 * @this $.jqfmv.validators._core
                 * @param value ::the input value
                 * @param against ::the list of items in the checklist
                 * @return array ::the list of errors for the validator
                 * Method used to validate the value of a field against list of items
                 * 
                 *      JQFMV_CHECKLIST_MATCH_ERROR indicates an error on matching an item in the list
                 **/
                _checklistValidator : function(value, against) {
                    var err = [];
                    if (value === null || value.length === 0) return err;
                    
                    var items = against.split(',');
                    if ($.inArray(value, items) === -1) err.push('JQFMV_CHECKLIST_MATCH_ERROR');
                        
                    return (err);
                },
                
                /**
                 * @scope private
                 * @methd _consistencyValidator
                 * @this $.jqfmv.validators._core
                 * @param value ::the input value
                 * @param against ::the name or id of the field to validate against
                 * @return array ::the list of errors for the validator
                 * Method used to validate the value of a field against an other field
                 * 
                 *      JQFMV_CONSISTENCY_FAILED_ERROR indicates an error on matching the value
                 *          against the given field
                 **/
                _consistencyValidator : function(value, against) {
                    var err = [];
                    
                    var consistentField = against.charAt(0) == '#' ? $(against) : $("input[name=\"" + against + "\"");
                    if (consistentField === null || value !== consistentField.val())
                        err.push('JQFMV_CONSISTENCY_FAILED_ERROR');
                    
                    return (err);
                },
                
                
                /**
                 * @scope private
                 * @methd _formatValidator
                 * @this $.jqfmv.validators._core
                 * @param value ::the input value
                 * @param against ::the name of format to validate against
                 * @return array ::the list of errors for the validator
                 * Method used to validate the value of a field against a given format
                 * 
                 *      JQFMV_UNKNOWN_FORMAT_ERROR indicates an error the format name
                 *      For other error codes, please check appropriate method.
                 **/
                _formatValidator : function(value, against) {
                    var err = [];
                    
                    if ($.inArray(against, $.jqfmv.validators._validators))
                        err = err.concat($.jqfmv.validators._validators[against](value));
                    else
                        err.push('JQFMV_UNKNOWN_FORMAT_ERROR');
                    
                    return (err);
                }
            }

        }
    };

    // Initializing the core validators
    $.jqfmv.validators.add({'name' : 'length', 'handler' : $.jqfmv.validators._core._lengthValidator});
    $.jqfmv.validators.add({'name' : 'mandatory', 'handler' : $.jqfmv.validators._core._mandatoryValidator});
    $.jqfmv.validators.add({'name' : 'expr', 'handler' : $.jqfmv.validators._core._exprValidator});
    $.jqfmv.validators.add({'name' : 'alphabetic', 'handler' : $.jqfmv.validators._core._alphabeticValidator});
    $.jqfmv.validators.add({'name' : 'email', 'handler' : $.jqfmv.validators._core._emailValidator});
    $.jqfmv.validators.add({'name' : 'number', 'handler' : $.jqfmv.validators._core._numberValidator});
    $.jqfmv.validators.add({'name' : 'integer', 'handler' : $.jqfmv.validators._core._integerValidator});
    $.jqfmv.validators.add({'name' : 'phone', 'handler' : $.jqfmv.validators._core._phoneValidator});
    $.jqfmv.validators.add({'name' : 'checklist', 'handler' : $.jqfmv.validators._core._checklistValidator});
    $.jqfmv.validators.add({'name' : 'consistency', 'handler' : $.jqfmv.validators._core._consistencyValidator});
    $.jqfmv.validators.add({'name' : 'format', 'handler' : $.jqfmv.validators._core._formatValidator});
    

}(jQuery));