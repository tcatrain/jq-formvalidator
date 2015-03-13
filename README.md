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
Currently, the library can validate the form upon various triggers :

+ **validateOnBlur**    boolean *trigger validation upon blur event on input*
+ **validateOnSubmit**  boolean *trigger validation upon submit event on form*
+ **validateOnKeyUp**   boolean *trigger validation upon keyUp event on input*
+ **validateOnKeyDown** boolean *trigger validation upon keyDown event on input*
+ **validateOnFocus**   boolean *trigger validation upon focus event on input*

These triggers are static for the time being, I may enhance more dynamic possibilities.

### Success and error
The library allows to overright the default handlers for validation success and error.
The default handler is very basic, and just change the background from default to green
on success and from default to red on error.

You can overright these handler just by settings customizable options when defining your
form validation item :

```
$('theFormItem').formValidator({
    onValidationSuccess : yourSuccessHandler
    onValidationError   : yourErrorHandler
});
```

The engine will pass 3 parameters to your error handler :

+ **input** string *the checked input*
+ **errors** array *the error list upon validation*
+ **settings** object *the settings object defined on form validation item creation*

The engine will pass 2 parameters to your success handler :

+ **input** string *the checked input*
+ **settings** object *the settings object defined on form validation item creation*

