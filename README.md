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

1. validateOnBlur boolean ::trigger validation upon blur event on input

2. validateOnSubmit boolean ::trigger validation upon submit event on form

3. validateOnKeyUp boolean ::trigger validation upon keyUp event on input

4. validateOnKeyDown boolean ::trigger validation upon keyDown event on input

5. validateOnFocus boolean ::trigger validation upon focus event on input

These triggers are static for the time being, I may enhance more dynamic possibilities.

### Success and error
The library allows to overright the default handlers for validation success and error.
The default handler is very basic, and just change the background from default to green
on success and from default to red on error.