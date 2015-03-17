<pre>
      ___    ______    _______  ___      ___  ___      ___ 
     |"  |  /    " \  /"     "||"  \    /"  ||"  \    /"  |
     ||  | // ____  \(: ______) \   \  //   | \   \  //  / 
     |:  |/  /    )  )\/    |   /\\  \/.    |  \\  \/. ./  
  ___|  /(: (____/ // // ___)  |: \.        |   \.    //   
 /  :|_/ )\         \(:  (     |.  \    /:  |    \\   /    
(_______/  \"____/\__\\__/     |___|\__/|___|     \__/     
                                                           
</pre>

# JQuery Form Validator


## Introduction
This is the first version of a form validation plugin for JQuery.
The JQuery plugin will help you with validating your forms, with just some
simple markup. Then create your form validation item, and that's it !
The module will take care of everything else.

## Usage

### Events
Currently, the library can validate the form upon various triggers. You can set them 
at formValidator initialization.

| Option            | Type    | Description                                    |
| ----------------- | ------- | ---------------------------------------------- |
| validateOnBlur    | boolean | Trigger validation upon blur event on input    |
| validateOnSubmit  | boolean | Trigger validation upon submit event on form   |
| validateOnKeyUp   | boolean | Trigger validation upon keyUp event on input   |
| validateOnKeyDown | boolean | Trigger validation upon keyDown event on input |
| validateOnFocus   | boolean | Trigger validation upon focus event on input   |

```javascript
$('theFormItem').formValidator({
    'validateOnBlur'    : true,
    'validateOnSubmit'  : true,
    'validateOnKeyUp'   : false,
    'validateOnKeyDown' : false,
    'validateOnFocus'   : false
});
```

These triggers are static for the time being, I may enhance more dynamic possibilities.

### Success and error
The library allows to override the default handlers for validation success and error.
The default handler is very basic, and just change the background from default to green
on success and from default to red on error.

You can override these handler just by settings customizable options when defining your
form validation item :

```javascript
$('theFormItem').formValidator({
    'onValidationSuccess' : yourSuccessHandler,
    'onValidationError'   : yourErrorHandler
});
```

The engine will pass 3 parameters to your error handler :

| Parameter | Type   | Description                                                  |
| --------- | ------ | ------------------------------------------------------------ |
| input     | string | The checked input                                            |
| errors    | array  | The error list upon validation                               |
| settings  | object | The settings object defined on form validation item creation |

The engine will pass 2 parameters to your success handler :

| Parameter | Type   | Description                                                  |
| --------- | ------ | ------------------------------------------------------------ |
| input     | string | The checked input                                            |
| settings  | object | The settings object defined on form validation item creation |

### Built-in validators
A set of validator is already implemented as core handlers. Here is the list :

| Name       | Validation                       | Against attribute syntax      |
| ---------- | -------------------------------- | ----------------------------- |
| length     | Value has a valid length         | '[' or ']'min,max'[' or ']'   |
| mandatory  | Value is set                     | none                          | 
| expr       | Value matches regular expression | regex                         |
| alphabetic | Value is a valid alphabetic      | none                          |
| email      | Value is a valid email           | none                          |
| number     | Value is a valid number          | none                          |
| integer    | Value is a valid integer         | none                          |
| phone      | Value is a valid phone number    | none                          |
| checklist  | Value is in the list             | item1,item2...                |
| consistency| Value match a given input value  | #itemId or itemName           |
| format     | Values matches a given format    | email or number or integer... |

To use a validator, just add the attribute jqfmv-validators on the input field. You can add multiple validators
on one single input, just separate them with comas.
Some validators doesn't require against attribute (see the table above). When needed, just add 
and attribute to the input with the following syntax : data-jqfmv-*validatorName*.
If you specify more than one validator requiring an against attribute, no problems, just add as many
against attribute as required.

```html
<!-- This input will be validated against length validator, which should be at list 1. -->
<input type="text" name="inputLength" data-jqfmv="length" data-jqfmv-length="]1,]" />
<!-- This input will be validated against number validator.-->
<input type="text" name="inputNumber" data-jqfmv="number" />
<!-- This input will be validated against mandatory and integer validator.-->
<input type="text" name="inputIntegerMandatory" data-jqfmv="integer,mandatory" />
<!-- This input will be validated against length and format validator.-->
<input type="text" name="inputLengthFormat" data-jqfmv="length,format" data-jqfmv-length="[10,15]" data-jqfmv-format="number" />
```

### Extending the core
If you need some special validation, you can extend the core validators by adding your own.
Just add a new validator, with a name and a handler.

```javascript
// Testing custom extension
function staticValidator(value, against, settings) {
    var err = [];
    
    if (value !== against) err.push('CUSTOM_ERR_CODE');
    
    return err;
}
$.jqfmv.validators.add({'name' : 'static', 'handler' : staticValidator});
```

Then you can use it the same way you use built-in validators.

```html
<!-- This input will be validated against static validator.-->
<input type="text" name="inputStatic" data-jqfmv="static" data-jqfmv-static="test" />
<!-- This input will be validated against static and mandatory validator.-->
<input type="text" name="inputStaticMandatory" data-jqfmv="static,mandatory" data-jqfmv-static="test" />
```

### Built-in settings
A bunch of built-in settings are available with default values. Based on these values, the core determine some actions
and validations to do. Here is the list of built-in settings :

| Name                       | Type     | Default value             | Description                                 |
| -------------------------- | -------- | ------------------------- | ------------------------------------------- |
| validateOnBlur             | boolean  | true                      | cf. [Events](#events)                       |
| validateOnSubmit           | boolean  | true                      | cf. [Events](#events)                       |
| validateOnKeyUp            | boolean  | false                     | cf. [Events](#events)                       |
| validateOnKeyDown          | boolean  | false                     | cf. [Events](#events)                       |
| validateOnFocus            | boolean  | false                     | cf. [Events](#events)                       |
| trimValues                 | boolean  | true                      | Trim the values before check                |
| replaceWithTrimedValues    | boolean  | true                      | Replace the values in the input after trim  |
| keepValueIfWrong           | boolean  | true                      | Keep the value in place if validation error |
| onValidationSuccess        | function | $.fn._onValidationSuccess | cf. [Success and error](#success-and-error)   |
| onValidationError          | function | $.fn._onValidationError   | cf. [Success and error](#success-and-error)   |
| afterFormValidationSuccess | function | null                      | cf. [Success and error](#success-and-error)   |
| afterFormValidationError   | function | null                      | cf. [Success and error](#success-and-error)   |


### Extending the settings
Should you ever need to add a new option in the settings, you can define it directly on formValidator definition.
Just add your property to the given object, it will be transmitted to your custom validators and success / error
hanlders.

```javascript
$('theFormItem').formValidator({
    'yourOption1' : true,
    'yourOption2' : 'valueOption2'
});
```

## Upcoming features
Currently, the plugin just handle input text/password field. Next focus will be to enhance select/radio/checkbox
and textarea fields.
Then, some reset and default values for the fields could be usefull for those who don't want to use placeholders.

Keep in mind the project is always ongoing. Feel free to use it as you want, just send me your feedback. I'll 
consider any suggestion.

## Enjoy