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

These triggers are static for the time being, I may enhance more dynamic possibilities.

### Success and error
The library allows to overright the default handlers for validation success and error.
The default handler is very basic, and just change the background from default to green
on success and from default to red on error.

You can overright these handler just by settings customizable options when defining your
form validation item :

```javascript
$('theFormItem').formValidator({
    onValidationSuccess : yourSuccessHandler
    onValidationError   : yourErrorHandler
});
```

The engine will pass 3 parameters to your error handler :

| Parameter | Type   | Description                                                  |
| --------- | ------ | ------------------------------------------------------------ |
| input     | string | The checked input                                            |
| errors    | array  | The error list upon validation                               |
| settings  | object | The settings object defined on form validation item creation |

The engine will pass 2 parameters to your success handler :

+ **input**    string *The checked input*
+ **settings** object *The settings object defined on form validation item creation*

### Existing validators
A set of validator is already implemented as core handlers. Here is the list :

| Name       | Validation                       | Against attribut syntax       |
| ---------- | -------------------------------- | ----------------------------- |
| length     | Value has a valid length         | min,max                       |
| mandatory  | Value is set                     | none                          | 
| expr       | Value matches regular expression | regex                         |
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
and attribute to the input with the following syntax : jqfmv-against-*validatorName*.
If you specify more than one validator requiring an against attribute, no problems, just add as many
against attribute as required.

```html
<!-- This input will be validate against length validator, which should be at list 1. -->
<input type="text" name="inputLength" jqfmv-validators="length" jqfmv-against-length="1," />
<!-- This input will be validate against number validator.-->
<input type="text" name="inputNumber" jqfmv-validators="number" />
<!-- This input will be validate against mandatory and integer validator.-->
<input type="text" name="inputIntegerMandatory" jqfmv-validators="integer,mandatory" />
<!-- This input will be validate against length and format validator.-->
<input type="text" name="inputLengthFormat" jqfmv-validators="length,format" jqfmv-against-length="10,15" jqfmv-against-format="number" />
```

