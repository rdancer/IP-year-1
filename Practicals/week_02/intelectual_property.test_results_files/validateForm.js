/* ==================================================================
 *The JavaScript Validation objects to be used in form validation.
 * Copyright (c) 2001 by Blackboard, Inc.,
 * 1899 L Street, NW, 5th Floor
 * Washington, DC, 20036, U.S.A.
 * All rights reserved.
 * Submit RFC & bugs report to: aklimenko@blackboard.com
 * This software is the confidential and proprietary information
 * of Blackboard, Inc. ("Confidential Information").  You
 * shall not disclose such Confidential Information and shall use
 * it only in accordance with the terms of the license agreement
 * you entered into with Blackboard.
 * ==================================================================*/

/************************************************************
* Object formCheckList. Use this object to hold form objects
* to be validated and perform form validation
************************************************************/

var formCheckList = new formCheckList();
var dblSubmit = false;
var skipValidation=false;

function formCheckList()
{
    this.checkList  = new Array();
    //this.superGroups= new Array(); // Create empty array for objects representing groups of radio/checkbox groups
    this.addElement = addElement;
    this.removeElement = removeElement;
    this.removeAllElements = removeAllElements;
    this.getElement = getElement;
    this.check      = checkForm;
}

function addElement(element)
{
    if ( typeof element.group != 'undefined' )
    {
        for ( var i=0; i < this.checkList.length;i++ )
        {
            if ( this.checkList[i].name == element.group )
            {
                this.checkList[i].addElement(element);
                return;
            }
        }
        var grp = new CheckGroup(element);
        grp.addElement(element);
        this.checkList[this.checkList.length] = grp;
        return;
    }
    this.checkList[this.checkList.length] = element;
}

function removeElement(name)
{
  for (var i = 0; i < this.checkList.length; ++i)
  {
    if ( this.checkList[i].fieldName == name )
    {
      this.checkList.splice(i, 1);
    }
  }
}

function getElement(name)
{
  for (var i = 0; i < this.checkList.length; ++i)
  {
    if ( this.checkList[i].fieldName == name )
    {
      return this.checkList[i];
    }
  }  
}

function removeAllElements()
{
  var valSize = this.checkList.length;
  this.checkList.splice(0, valSize);
}

function checkForm()
{
    if ( typeof(window.invalidAnswersTmp)!='undefined' )
    {
        window.invalidAnswersTmp=[];
    }
    var valid =true;
    for ( var i=0;i<this.checkList.length;i++ )
    {
        if ( !this.checkList[i].check() )
        {
            if ( this.checkList[i].answerChk )
            {
                valid=false;
            }
            else
            {
                return false;
            }
        }
    }
    return valid;
}
///////////////////End of object formCheckList////////////////

/************************************************************
* Object: inputText. Use this object to validate text input in
* your form (for input type == text|password|textarea|BUT NOT FILE!!! (FILE IS READ-ONLY))
************************************************************/
function inputText(h)
{
    if (h.id) {
    	this.element 		  = $(h.id);
    } else {
    	this.element          = 'document.forms[0]["'+h.name+'"]';
    }
    this.shouldFocus          = h.shouldFocus;
    if ( h.shouldFocus === undefined )
    {
      this.shouldFocus = true; 
    }
    if ( this.shouldFocus )
    {
      this.formatElement        = 'document.forms[0]["'+h.display_format+'"]';
      this.focusElement         = h.focus_element; // override element for focus in case of error
    }
    this.fieldName            = h.name;
    this.disable_script       = h.disable_script;
    this.ref_label            = h.ref_label;

    this.custom_alert         = h.custom_alert;
    this.custom_alert_cmp     = h.custom_alert_cmp;

    this.minlength            = h.minlength;
    this.maxlength            = h.maxlength;
    this.trim                 = h.trim;
    this.regex                = h.regex;
    this.regex_msg            = h.regex_msg;
    this.regex_match          = h.regex_match;
    this.verify               = h.verify;
    this.check                = inputTextCheck;
    this.valid_number         = h.valid_number;
    this.min_value	      = h.min_value;
    this.nonnegative          = h.nonnegative;
    this.valid_float          = h.valid_float;
    this.allow_negative_float = h.allow_negative_float;
    this.valid_percent        = h.valid_percent;
    this.valid_efloat         = h.valid_efloat; // float with optional exponent
    this.valid_email          = h.valid_email;
    this.valid_url            = h.valid_url;
    this.required_url         = h.required_url;
    this.invalid_chars        = h.invalid_chars; // eg: /[%&#<>=+,]/g
    this.cmp_element          = 'document.forms[0]["'+h.cmp_field+'"]';
    this.cmp_ref_label        = h.cmp_ref_label;
    this.xor                  = h.xor;
    this.cmp_required         = h.cmp_required;
    this.activeX              = h.activeX;   // synch activeX to hidden field before submission
    this.isHtmlDoc            = h.isHtmlDoc; // is portfolio with body and html
    this.img_check            = h.img_check;
    this.empty_value_warn     = h.empty_value_warn;
    this.valid_system_role_id  = h.valid_system_role_id;
    this.required              = h.required;
    this.min_value_name	      = h.min_value_name;
    this.check_max_min	      = h.check_max_min;
    
    if ( document.all && document.getElementById(h.name+'_ax') )
    {
        this.axobj = document.getElementById(h.name+'_ax');
    }

    // Add here anything you need to validate
}


// Do actual check here
function inputTextCheck()
{
    if ( this.shouldFocus === undefined )
    {
      this.shouldFocus = true;
    }
    
    var element = eval(this.element);
    var cmp_element = eval(this.cmp_element);
    if ( typeof element != 'undefined' )
    {
        var focusElement = element;
        if ( this.axobj )
        {
            focusElement = this.axobj;
        }

        this.custom_alert     = (typeof this.custom_alert     != 'undefined') ? this.custom_alert     : '';
        this.custom_alert_cmp = (typeof this.custom_alert_cmp != 'undefined') ? this.custom_alert_cmp : '';

        this.ref_label = (typeof this.ref_label != 'undefined') ? this.ref_label
        : JS_RESOURCES.getFormattedString('field_name.substitute', new Array(element.name));
        var val    = element.value;
        if ( val == null || !val.replace(/<p><\/p>/gi,'').trim() )
        {
            val='';
        }

        if ( this.activeX && isEmptyWysiwyg(element) )
        {
            element.value = '';
            val = '';
        }

        if ( typeof eval(this.formatElement) != "undefined" )
        {
            //Check if it is a mathml where;
            if ( /<APPLET ID="(\d+)" NAME="(\w+)"/.test(element.value) )
            {
                if ( getRadioValue(eval(this.formatElement)) == 'P' )
                {
                    if ( !confirm(JS_RESOURCES.getString('validation.plain_text.confirm')) )
                    {
                        if ( this.shouldFocus )
                        {
                          element.focus();
                        }
                        return false;
                    }
                }
            }
        }

        if ( this.trim )
        {
            val = val.trim();
            element.value = val;
        } //Remove leading & trailing spaces if needed

        if ( typeof cmp_element != 'undefined' )
        {
            if ( this.xor )
            {
                if ( val.trim()=='' ^ cmp_element.value.trim()=='' )
                {
                    if ( val.trim()=='' )
                    {
                        alert( this.custom_alert ? this.custom_alert :
                               JS_RESOURCES.getFormattedString('validation.cmp_field.required',
                                                               new Array(this.ref_label, this.cmp_ref_label)));
                        if ( this.shouldFocus )
                        {                                       
                          shiftFocus(focusElement, this.activeX);
                        }
                    }
                    else
                    {
                        alert(this.custom_alert_cmp ? this.custom_alert_cmp :
                              JS_RESOURCES.getFormattedString('validation.cmp_field.required',
                                                              new Array(this.cmp_ref_label, this.ref_label)));
                        if ( this.shouldFocus )
                        {
                          cmp_element.focus();
                        }
                    }
                    return false;
                }
            }
        }

        if ( this.disable_script )
        {
            if ( typeof eval(this.formatElement) == "undefined" || getRadioValue(eval(this.formatElement)) != 'P' )
            {
                var re = /<\s*script/ig;
                var re1 = /<\s*\/\s*script\s*>/ig;
                val = val.replace(re,'<disabled-script');
                val = val.replace(re1,'</disabled-script>');
                var re2 = /href\s*=\s*(['"]*)\s*javascript\s*:/ig;
                val = val.replace(re2,"href=$1disabled-javascript:");
                element.value = val;
            }
        }

        if ( this.valid_number )
        {
            var trimmedVal = val.trim();
            //added this check bcoz for numeric fields which are not required, this function was not working
            if ( trimmedVal!="" )
            {
                var numVal = parseInt(trimmedVal);
                var isValidNum = !isNaN(numVal)
                if ( isValidNum )
                {
                    isValidNum = !isNaN(numVal) && (numVal.toString().length == trimmedVal.length);
                }
                if ( !isValidNum )
                {
                    alert(JS_RESOURCES.getFormattedString('validation.number', new Array(this.ref_label)));
                    if ( this.shouldFocus )
                    {
                      element.focus();
                    }
                    return false;
                }
                if (this.nonnegative && numVal<0)
                {
                    alert(JS_RESOURCES.getFormattedString('validation.negative', new Array(this.ref_label)));
                    if ( this.shouldFocus )
                    {
                      element.focus();
                    }
                    return false;
                }
                if (this.min_value && numVal<this.min_value)
                {
                    alert(JS_RESOURCES.getFormattedString('validation.invalid_value', new Array(this.ref_label)));
                    if ( this.shouldFocus )
                    {
                      element.focus();
                    }
                    return false;
                }
            }
        }

        if ( this.valid_float )
        {
            var trimmedVal = val.trim();

            var numFormat;
            if ( this.allow_negative_float )
                numFormat = LOCALE_SETTINGS.getString('float.allow.negative.format');
            else
                numFormat = LOCALE_SETTINGS.getString('float.format');

            var numVal, isValidNum;
            if ( typeof( numFormat ) != 'undefined' )
            {
                //hand parse for l10n
                var re = new RegExp( numFormat );
                isValidNum = trimmedVal.search( re ) == 0;
            }
            else
            {
                //try to use platform native (non-localized)
                numVal = parseFloat(trimmedVal);
                isValidNum = !isNaN(numVal);
                if ( isValidNum && numVal.toString().length != trimmedVal.length )
                {
                    /* Allow strings with trailing zeros to pass */
                    var re = /^[\.0]+$/;
                    isValidNum = re.test(trimmedVal.substring(numVal.toString().length));
                }
            }
            if ( !isValidNum )
            {
                alert(JS_RESOURCES.getFormattedString('validation.number', new Array(this.ref_label)));
                if ( this.shouldFocus )
                {
                  element.focus();
                }
                return false;
            }
        }

        if ( this.valid_percent )
        {
            if ( !isPercent(val) )
            {
                alert(JS_RESOURCES.getFormattedString('validation.percent', new Array(this.ref_label)));
                if ( this.shouldFocus )
                {
                  element.focus();
                }
                return false;
            }
        }

        if ( this.valid_efloat )
        {
            if ( !isNumeric(val) )
            {
                alert(JS_RESOURCES.getFormattedString('validation.number', new Array(this.ref_label)));
                if ( this.shouldFocus )
                {
                  var focusElement = (this.focusElement ? this.focusElement : this.element);
                  if ( focusElement.focus )
                  {
                      focusElement.focus();
                  }
                }
                return false;
            }
        }
        
        if(this.check_max_min)
        {
        	if(_getNumber(val)<_getNumber(document.forms[0][this.min_value_name].value))
        	{
        		alert(JS_RESOURCES.getFormattedString('validation.maximum_less_than.minimum', new Array(this.ref_label)));
        		var focusElement = (this.focusElement ? this.focusElement : this.element);
        		 if ( focusElement.focus )
                 {
                     focusElement.focus();
                 }
        		return false;
        	}
        }

        if ( this.valid_email )
        {
            if ( val.trim() == '' )
            {
                if ( confirm(JS_RESOURCES.getString('warning.email')) )
                {
                    return true;
                }
                else
                {
                    if ( this.shouldFocus )
                    {
                      element.focus();
                    }
                    return false;
                }
            }
            else
            {
                re = /^(['`a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9])+$/;
                if ( !re.test(val) )
                {
                    alert(JS_RESOURCES.getFormattedString('validation.email', new Array(this.ref_label)));
                    if ( this.shouldFocus )
                    {
                      element.focus();
                    }
                    return false;
                }
            }
        }

        // confirms via javascript pop-up if input field is empty;
        // user can click Ok to proceed or cancel to go back with the element focused
        // the message that pops up is the message passed in with ref_label
        if ( this.empty_value_warn )
        {
            if ( val.trim() == '' )
            {
                if ( confirm(this.ref_label) )
                {
                    return true;
                }
                else
                {
                    if ( this.shouldFocus )
                    {
                      element.focus();
                    }
                    return false;
                }
            }
        }

if ( val.length < this.minlength )
        {
            if ( this.minlength == 1 )
            {
                alert(this.custom_alert ? this.custom_alert
                      : JS_RESOURCES.getFormattedString('validation.required', new Array(this.ref_label)));
            }
            else
            {
                alert(this.custom_alert ? this.custom_alert
                      : JS_RESOURCES.getFormattedString('validation.minimum_length',
                                                        new Array(this.minlength, this.ref_label)));
            }
            if ( this.shouldFocus )
            {
              shiftFocus(focusElement, this.activeX);
            }
            return false;
        }
        
        var extra = 0;
  		if (navigator.appName=="Netscape" && 
      		parseInt(navigator.appVersion)>=5) {
     		var index = val.indexOf('\n');
     		while(index != -1) {
       			extra += 1;
       			index = val.indexOf('\n',index+1);
     		}
  		}
		if ( this.maxlength < val.length + extra )
        {
        	var newlength = val.length + extra;
            if ( (newlength - this.maxlength) > 1 )
            {
                alert(JS_RESOURCES.getFormattedString('validation.maximum_length.plural',
                                                      new Array(this.ref_label,this.maxlength,(newlength-this.maxlength))));
            }
            else
            {
                alert(JS_RESOURCES.getFormattedString('validation.maximum_length.singular',
                                                      new Array(this.ref_label,this.maxlength)));
            }
            if ( this.shouldFocus )
            {
              shiftFocus(focusElement, this.activeX);
            }
            return false;
        }

        // required_url, unlike valid_url, flags empty strings as invalid URLs.
        if ( this.required_url )
        {
            if ( val.trim() == '' )
            {
                alert(JS_RESOURCES.getFormattedString('validation.required', new Array(this.ref_label)));
                return false;
            }
            if ( !isValidUrl(val) )
            {
                alert(JS_RESOURCES.getFormattedString('validation.url', new Array(this.ref_label)));
                if ( this.shouldFocus )
                {
                  element.focus();
                }
                return false;
            }
        }

        if ( this.valid_url )
        {
            if ( val.trim()=='' )
                return true;

            var oRegExp = /[^:]+:\/\/[^:\/]+(:[0-9]+)?\/?.*/;
            if ( !oRegExp.test(val) )
            {
                alert(JS_RESOURCES.getFormattedString('validation.url', new Array(this.ref_label)));
                if ( this.shouldFocus )
                {
                  element.focus();
                }
                return false;
            }
        }

        if ( typeof(this.regex) == 'string' )
        {
            this.regex=eval(this.regex);
        }

        if ( (typeof(this.regex) == 'object' || typeof(this.regex) == 'function') && val.trim() != '' )
        {
            re =this.regex;
            if ( this.regex_match && val.search(re) == -1 )
            {
                alert(this.regex_msg + this.ref_label + '.');
                if ( this.shouldFocus )
                {
                  shiftFocus(focusElement, this.activeX);
                }
                return false;
            }
            if ( !this.regex_match && re.test(val) )
            {
                alert(this.regex_msg + this.ref_label + '.');
                if ( this.shouldFocus )
                {
                  shiftFocus(focusElement, this.activeX);
                }
                return false;
            }
        }

        if ( this.invalid_chars )
        {
            var arr = val.invalidChars(this.invalid_chars);

            if ( arr && arr.length )
            {
                alert(JS_RESOURCES.getFormattedString('validation.invalid_chars',
                                                      new Array(this.ref_label, arr.join(', '))));
                if ( this.shouldFocus )
                {
                  shiftFocus(focusElement, this.activeX);
                }
                return false;
            }
        }

        if ( this.verify )
        {
            var chk_field = document.forms[0][element.name.replace(/_inp$/,'_chk')];
            var field     = document.forms[0][element.name.replace(/_inp$/,'')];

            if ( chk_field.value != val )
            {
                alert(JS_RESOURCES.getFormattedString('validation.mismatch', new Array(this.ref_label)));
                if ( this.shouldFocus )
                {
                  chk_field.focus();
                }
                return false;
            }
            // Encode password
            if ( element.type == 'password' )
            {
                element.value = element.value.trim();
                if ( element.value != '' )
                {
                    element.value = field.value = chk_field.value = calcMD5(element.value);
                }
                else
                {
                    alert(JS_RESOURCES.getString('validation.password'));
                    element.value = field.value ='';
                    if ( this.shouldFocus )
                    {
                      element.focus();
                    }
                    return false;
                }
            }
        }

        if ( this.cmp_required && element.value.trim()!='' )
        {
            if ( !cmp_element.value.trim().length )
            {
                alert(JS_RESOURCES.getFormattedString('validation.cmp_field.rejected',
                                                      new Array(this.ref_label, this.cmp_ref_label)));
                if ( this.shouldFocus )
                {
                  cmp_element.focus();
                }
                return false;
            }
        }

        if ( this.img_check )
        {
            return image_check(element);
        }

		
		//AS-102122, if a image tag without ALT properties <img src="1.jpg">, add a null ALT for it. <img src="1.jpg" alt="">
		imgTag_check(element,0);
        

        // System role ids cannot begin with "BB" as of 7.2; such ids are reserved for solely for Blackboard use
        // Checks field to see if string begins with "BB" case-insensitive and if so, alert the user
        if ( this.valid_system_role_id )
        {
            if ( element.value.indexOf('BB') == 0 || element.value.indexOf('bb') == 0 )
            {
                alert(this.custom_alert ? this.custom_alert : JS_RESOURCES.getFormattedString('validation.system_role.reserve', new Array(this.ref_label)));
                if ( this.shouldFocus )
                {
                  element.focus();
                }
                return false;
            }
            else
            {
                return true;
            }
        }

    }
    return true;
}

///////////////////End of object inputText///////////////////
//check ALT propertity for <img tag, if there isn't ALT propertiry, add ALT="" for this tag
function imgTag_check(element , start){
	var imgStart = element.value.indexOf("<img",start); // img: <img src=... >
	if (imgStart > -1 ){
		var end = element.value.indexOf(">",imgStart);
		var imgData = element.value.substring(imgStart, end+1); //  <img src=... >
		if(imgData.indexOf("alt") == -1){
			imgData = "<img alt=\"\" " + imgData.substring(4);
			element.value = element.value.substring(0,imgStart) + imgData + element.value.substring(end);
		}
		imgTag_check(element, end);
	}
}

function image_check(element)
{

    ext = element.value.match(/.*\.(.*)/);
    ext = ext ? ext[1] :'';
    re = /gif|jpeg|png|tif|bmp|jpg/i;
    if ( ! re.test(ext) && element.value )
    {
        if ( ! confirm(JS_RESOURCES.getFormattedString('validation.image_type', new Array(ext))) )
        {
            element.focus();
            return false;
        }
    }
    return true;
}

/************************************************************
* Object: inputDate. Use this object to validate that the
* associated date fields are not empty
************************************************************/
function inputDate(h)
{
    this.element_mm        = 'document.forms[0]["'+h.name+'_0_mm"]';
    this.element_dd        = 'document.forms[0]["'+h.name+'_0_dd"]';
    this.element_yyyy      = 'document.forms[0]["'+h.name+'_0_yyyy"]';

    this.fieldName      = h.name;
    this.ref_label      = h.ref_label;

    this.custom_alert     = h.custom_alert;
    this.custom_alert_cmp = h.custom_alert_cmp;

    this.check          = inputDateCheck;

    // Add here anything you need to validate
}

// Do actual check here
function inputDateCheck()
{
    var element_mm   = eval(this.element_mm);
    var element_dd   = eval(this.element_dd);
    var element_yyyy = eval(this.element_yyyy);

    if ( typeof element_mm != 'undefined' && element_dd !='undefined' && element_yyyy !='undefined' )
    {
        this.custom_alert = (typeof this.custom_alert != 'undefined') ? this.custom_alert : '';

        this.ref_label = (typeof this.ref_label != 'undefined') ? this.ref_label
        : JS_RESOURCES.getFormattedString('field_name.substitute', new Array(element.name));

        if ( element_mm.selectedIndex == -1 || element_dd.selectedIndex == -1 || element_yyyy == -1 )
        {
            alert(this.custom_alert ? this.custom_alert
                  : JS_RESOURCES.getFormattedString('validation.date.required', new Array(this.ref_label)));

            if ( element_mm.selectedIndex == -1 )
                element_mm.focus();
            else if ( element_dd.selectedIndex == -1 )
                element_dd.focus();
            else
                element_yyyy.focus();

            return false;
        }
    }

    return true;
}
///////////////////End of object inputDate///////////////////

/************************************************************
* Object: inputTime. Use this object to validate that the
* associated time fields are not empty
************************************************************/
function inputTime(h)
{
    this.element_hh        = 'document.forms[0]["'+h.name+'_0_hh"]';
    this.element_mi        = 'document.forms[0]["'+h.name+'_0_mi"]';
    this.element_am        = 'document.forms[0]["'+h.name+'_0_am"]';

    this.fieldName      = h.name;
    this.ref_label      = h.ref_label;

    this.custom_alert     = h.custom_alert;
    this.custom_alert_cmp = h.custom_alert_cmp;

    this.check          = inputTimeCheck;

    // Add here anything you need to validate
}

// Do actual check here
function inputTimeCheck()
{
    var element_hh   = eval(this.element_hh);
    var element_mi   = eval(this.element_mi);
    var element_am   = eval(this.element_am);

    if ( typeof element_hh != 'undefined' && element_mi !='undefined' && element_am !='undefined' )
    {
        this.custom_alert = (typeof this.custom_alert != 'undefined') ? this.custom_alert : '';

        this.ref_label = (typeof this.ref_label != 'undefined') ? this.ref_label
        : JS_RESOURCES.getFormattedString('field_name.substitute', new Array(element.name));

        if ( element_hh.selectedIndex == -1 || element_mi.selectedIndex == -1 || element_am == -1 )
        {
            alert(this.custom_alert ? this.custom_alert
                  : JS_RESOURCES.getFormattedString('validation.time.required', new Array(this.ref_label)));

            if ( element_hh.selectedIndex == -1 )
                element_hh.focus();
            else if ( element_mi.selectedIndex == -1 )
                element_mi.focus();
            else
                element_am.focus();

            return false;
        }
    }

    return true;
}

///////////////////End of object inputTime///////////////////

/************************************************************
* Object: inputSelect. Use this object to validate that the
* associated select field is not empty
************************************************************/
function inputSelect(h)
{
    this.element        = 'document.forms[0]["'+h.name+'"]';

    this.fieldName      = h.name;
    this.ref_label      = h.ref_label;
    
    this.minSelected = h.minSelected;
    this.maxSelected = h.maxSelected;
    this.title      = h.title;
    this.isMultiSelect = h.isMultiSelect;

    this.custom_alert     = h.custom_alert;
    this.custom_alert_cmp = h.custom_alert_cmp;

    this.check          = inputSelectCheck;

    // Add here anything you need to validate
}

// Do actual check here
function inputSelectCheck()
{
    var element   = eval(this.element);
    var checked = 0;
    if ( typeof element != 'undefined' )
    {
        if ( this.isMultiSelect) 
        {
            if( this.minSelected )
            {
              //check that at least minSelected number of options is selected //bsomala
              
              checked = element.options.length;
              
              if(checked < this.minSelected)
              { 
              	alert(this.title+' -- '+JS_RESOURCES.getFormattedString('validation.multiSelect.minItems', [this.minSelected]));
	            element.focus();
	            return false;
              }
            }
            checked = 0;
            if ( this.maxSelected )
            {
              checked = element.options.length;
              
              if(checked > this.maxSelected)
              {
                alert(this.title+' -- '+JS_RESOURCES.getFormattedString('validation.multiSelect.maxItems', [this.maxSelected]));
	            element.focus();
	            return false;
              }
            }
        }
        else
        {
	        this.custom_alert = (typeof this.custom_alert != 'undefined') ? this.custom_alert : '';
	
	        this.ref_label = (typeof this.ref_label != 'undefined') ? this.ref_label
	        : JS_RESOURCES.getFormattedString('field_name.substitute', new Array(element.name));
	
	        if ( (element.selectedIndex == -1) || (element.options[element.selectedIndex].value == "") )
	        {
	            alert(this.custom_alert ? this.custom_alert
	                  : JS_RESOURCES.getFormattedString('validation.required', new Array(this.ref_label)));
	            element.focus();
	            return false;
	        }
        }
    }

    return true;
}

///////////////////End of object inputSelect///////////////////

/************************************************************
* Object: inputFile. Use this object to validate that the file upload
is not empty. IMPORTANT: file type is READ ONLY
************************************************************/
function inputFile(h)
{
    this.element        = 'document.forms[0]["'+h.name+'"]';
    this.fieldName      = h.name;
    this.ref_label      = h.ref_label;

    this.custom_alert     = h.custom_alert;
    this.custom_alert_cmp = h.custom_alert_cmp;

    this.invalid_chars  = h.invalid_chars;
    this.minlength      = h.minlength;
    this.img_check      = h.img_check;
    this.check          = inputFileCheck;

    // Add here anything you need to validate
}


// Do actual check here
function inputFileCheck()
{

    var element = eval(this.element);
    if ( typeof element != 'undefined' )
    {

        this.custom_alert     = (typeof this.custom_alert     != 'undefined') ? this.custom_alert     : '';

        this.ref_label = (typeof this.ref_label != 'undefined') ? this.ref_label
        : JS_RESOURCES.getFormattedString('field_name.substitute', new Array(element.name));
        var val    = element.value;


        if ( this.invalid_chars )
        {
            var arr = val.invalidChars(this.invalid_chars);

            if ( arr && arr.length )
            {
                alert(JS_RESOURCES.getFormattedString('validation.invalid_chars',
                                                      new Array(this.ref_label, arr.join(', '))));
                shiftFocus(focusElement, false);
                return false;
            }
        }

        if ( val.length < this.minlength )
        {
            if ( this.minlength == 1 )
            {
                alert(this.custom_alert ? this.custom_alert
                      : JS_RESOURCES.getFormattedString('validation.required', new Array(this.ref_label)));
            }
            else
            {
                alert(this.custom_alert ? this.custom_alert
                      : JS_RESOURCES.getFormattedString('validation.minimum_length',
                                                        new Array(this.minlength, this.ref_label)));
            }

            return false;
        }

        if ( this.img_check )
        {
            return image_check(element);
        }

    }
    return true;
}

///////////////////End of object inputFile///////////////////








/************************************************************
*    Object: Check_EventTime. Use this object to make sure
*    that the end time is not before the start time, confirm pastdue time,
*    check duration of the event.
*************************************************************/

function Check_EventTime(obj)
{
    if ( eval("document.forms[0]['"+obj.name+"']") )
    {
        this.start      = "document.forms[0]['"+obj.name+"']";
        this.end        = "document.forms[0]['"+obj.cmp_field+"']";
        //restrict flags fields
        this.restrict   = "document.forms[0]['"+obj.restrict_flag+"']";
        this.cmp_restrict="document.forms[0]['"+obj.cmp_restrict_flag+"']";
    }
    else
    {
        this.start      = "document.forms[1]['"+obj.name+"']";
        this.end        = "document.forms[1]['"+obj.cmp_field+"']";
        //restrict flags fields
        this.restrict   = "document.forms[1]['"+obj.restrict_flag+"']";
        this.cmp_restrict="document.forms[1]['"+obj.cmp_restrict_flag+"']";
    }

    this.ref_lbl    = obj.ref_label;
    this.cmp_ref_lbl= obj.cmp_ref_label;
    this.notEqual   = obj.duration;
    this.pastDue    = obj.past_due;
    this.show_end_time = obj.show_end_time;
    // define method
    this.check      = Check_EventTime_check;
}

function Check_EventTime_check()
{
    var start, end, restr, cmp_restr;
    start = eval(this.start);     // first datetime field
    end   = eval(this.end);         // second datetime field to be compared with first
    restr = eval(this.restrict);    // Restrict checkbox field
    cmp_restr = eval(this.cmp_restrict);  // Restrict checkbox field to compare to
    restr     = (typeof(restr)     != 'undefined') ? restr.checked : true;      // True if restrict checkbox
    cmp_restr = (typeof(cmp_restr) != 'undefined') ? cmp_restr.checked : true;  // is checked or not defined

    // Update time in hidden field
    // Set time to empty string if it is not restricted
    if ( !restr )
    {
        start.value = '';
    }
    if ( !cmp_restr || (this.show_end_time && !restr) )
    {
        end.value   = '';
    } // Second field has to be set also
    start = start.value;
    if ( typeof end != 'undefined' )
    {
        end = end.value;
    }
    // Do not compare fields if at least one checkbox is unchecked
    if ( !restr || !cmp_restr )
    {

        this.notEqual = 0;
    }
    // Do not test for past due if restiction is not applied

    if ( !restr )
    {
        this.pastDue = 0;
    }
    if ( this.pastDue )
    {
        var confirm;
        var start_ms = Date.parse(start.replace(/-/g,'/'));
        if ( start_ms < Date.parse(new Date())-this.pastDue*1000*60 )
        {
            if ( !window.confirm(JS_RESOURCES.getFormattedString('validation.date_past.confirm', new Array(this.ref_lbl))) )
            {
                return false;
            }
        }
    }
    if ( (document.forms[0].restrict_start && document.forms[0].restrict_end)||
         (document.forms.length > 1 && document.forms[1].restrict_start && document.forms[1].restrict_end) )
    {
        if ( (document.forms[0].restrict_start && document.forms[0].restrict_end && document.forms[0].restrict_start.checked && document.forms[0].restrict_end.checked) ||
             (document.forms.length > 1 && document.forms[1].restrict_start && document.forms[1].restrict_end && document.forms[1].restrict_start.checked && document.forms[1].restrict_end.checked) )
        {
            if ( start > end && this.notEqual )
            {
                alert(JS_RESOURCES.getFormattedString('validation.date_past',
                                                      new Array(this.cmp_ref_lbl, this.ref_lbl)));
                return false;
            }
            else if ( end == start && this.notEqual )
            {
                alert(JS_RESOURCES.getFormattedString('validation.date_equal',
                                                      new Array(this.cmp_ref_lbl, this.ref_lbl)));
                return false;
            }
        }
    }
    else
    {
        if ( start > end && this.notEqual )
        {
            alert(JS_RESOURCES.getFormattedString('validation.date_past',
                                                  new Array(this.cmp_ref_lbl, this.ref_lbl)));
            return false;
        }
        else if ( end != undefined && end == start && this.notEqual )
        {
            alert(JS_RESOURCES.getFormattedString('validation.date_equal',
                                                  new Array(this.cmp_ref_lbl, this.ref_lbl)));
            return false;
        }
    }
    return true;
}
/*
 * SCR  17696
 * This validation check should be used in the date widgets instead of the earlier one
 * as that has the chackboxes names hardcoded in them. The existing date wodgets
 * use it, but going ahead this should be the used. It helps specially when there are
 * multiple date widgets on the same page.
*/
function Check_EventTime_multiple(obj)
{
    //if (eval("document.forms[0]['"+obj.name+"']")) {   //Removing this check, as it causes javascript error
    // SCR 18189
    this.start      = "document.forms[0]['"+obj.name+"']";
    this.end        = "document.forms[0]['"+obj.cmp_field+"']";
    //restrict flags fields
    this.restrict   = "document.forms[0]['"+obj.restrict_flag+"']";
    this.cmp_restrict="document.forms[0]['"+obj.cmp_restrict_flag+"']";
    /*} else {
      this.start      = "document.forms[1]['"+obj.name+"']";
      this.end        = "document.forms[1]['"+obj.cmp_field+"']";
      restrict flags fields
      this.restrict   = "document.forms[1]['"+obj.restrict_flag+"']";
      this.cmp_restrict="document.forms[1]['"+obj.cmp_restrict_flag+"']";
    }   */

    this.ref_lbl    = obj.ref_label;
    this.cmp_ref_lbl= obj.cmp_ref_label;
    this.notEqual   = obj.duration;
    this.pastDue    = obj.past_due;
    this.show_end_time = obj.show_end_time;
    // define method
    this.check      = Check_EventTime_check_multiple;
}

function Check_EventTime_check_multiple()
{
    var start, end, restr, cmp_restr;
    start = eval(this.start);       // first datetime field
    end   = eval(this.end);         // second datetime field to be compared with first
    restr = eval(this.restrict);    // Restrict checkbox field
    cmp_restr = eval(this.cmp_restrict);  // Restrict checkbox field to compare to
    restr     = (typeof(restr)     != 'undefined') ? restr.checked : true;      // True if restrict checkbox
    cmp_restr = (typeof(cmp_restr) != 'undefined') ? cmp_restr.checked : true;  // is checked or not defined

    // Update time in hidden field
    // Set time to empty string if it is not restricted
    if ( !restr )
    {
        start.value = '';
    }
    if ( !cmp_restr || (this.show_end_time && !restr) )
    {
        end.value   = '';
    } // Second field has to be set also
    start = start.value;
    if ( typeof end != 'undefined' )
    {
        end = end.value;
    }
    // Do not compare fields if at least one checkbox is unchecked
    if ( !restr || !cmp_restr )
    {

        this.notEqual = 0;
    }
    // Do not test for past due if restiction is not applied

    if ( !restr )
    {
        this.pastDue = 0;
    }
    if ( this.pastDue )
    {
        var confirm;
        var start_ms = Date.parse(start.replace(/-/g,'/'));
        if ( start_ms < Date.parse(new Date())-this.pastDue*1000*60 )
        {
            if ( !window.confirm(JS_RESOURCES.getFormattedString('validation.date_past.confirm', new Array(this.ref_lbl))) )
            {
                return false;
            }
        }
    }
    if ( restr && cmp_restr )
    {
        //This block has been aded due to SCR 17696.
        //Reason : if this method is directly called from a JSP page which is not a part of
        // the existing date widgets, and the parameters of stsrt date, end date, start checkbox and
        // end checkbox are passed, and additionally the page has another
        if ( start > end && this.notEqual )
        {
            alert(JS_RESOURCES.getFormattedString('validation.date_past',
                                                  new Array(this.cmp_ref_lbl, this.ref_lbl)));
            return false;
        }
        else if ( end == start && this.notEqual )
        {
            alert(JS_RESOURCES.getFormattedString('validation.date_equal',
                                                  new Array(this.cmp_ref_lbl, this.ref_lbl)));
            return false;
        }
    }
    return true;
}   
	
/*We always need time in our favorite format
*/
function sql_datetime(dat)
{
    var year = dat.getFullYear();
    var mon  = dat.getMonth();
    mon++;                      mon = (mon<10)?'0'+mon:mon;
    var day = dat.getDate();    day = (day<10)?'0'+day:day;
    hh      = dat.getHours();   hh  = (hh<10)?'0'+hh:hh;
    mi      = dat.getMinutes(); mi  = (mi<10)?'0'+mi:mi;
    ss      = dat.getSeconds(); ss  = (ss<10)?'0'+ss:ss;
    return  year+'-'+mon+'-'+day+' '+hh+':'+mi+':'+ss;
}
///////////////////End of object Check_EventTime/////////////

/********************************************************************************
* Object DoubleSubmit():
* Use this object to prevent multiple times form submission
* Second argument is wait image source; first argument is image name (string) or
* instance of ImageSwapper object created for submit button (if it has rollovers)
*********************************************************************************/

// Prevent multiple form submission
function DoubleSubmit()
{


    this.submitted = 0;
    this.check = checkDoubleSubmit;
}

function checkDoubleSubmit()
{
    if ( this.submitted > 0 )
    {
        alert (JS_RESOURCES.getString('notification.submit'));
        return false;
    }
    else
    {
        this.submitted++;
    }
    return true;
}
///////////////////End of Object DoubleSubmit()//////////////////

/********************************************************************************
* Object RadioCheckBox():
* Use this object to make sure that at least one item is selected from the group of
* radio/checkbox groups. Just attach this code to checkbox/radio group (refered below as 'element'):
* formCheckList.addElement(new RadioCheckBox({name:'element or subgroup name',group:'group name',ref_label:"group label in alerts"}));
*********************************************************************************/
// Constructor function
function RadioCheckBox(h)
{
    return h;
}

function CheckGroup(h)
{
    this.name       = h.group;
    this.ref_label  = h.ref_label;
    this.elements   = new Array();
    this.addElement = groupAddElement;
    this.check      = checkGroupChecked;
}

function groupAddElement(h)
{
    this.elements[this.elements.length]   = h.name;
}

function checkGroupChecked()
{
    var list = this.elements;
    var chk  = false;
    for ( var i = 0; i < list.length; i++ )
    {
        if ( groupIsChecked(list[i]) )
        {
            return true;
        }
    }

    var msg = null;
    var group = document.forms[0][list[0]];
    group = (typeof group[0] != 'undefined') ? group[0]:group;

    if ( group.type == "radio" )
        msg = JS_RESOURCES.getFormattedString('validation.radio.required', new Array(this.ref_label));
    else
        msg = JS_RESOURCES.getFormattedString('validation.option.required', new Array(this.ref_label));

    alert(msg);
    group.focus();
    return false;
}

function groupIsChecked(groupName)
{
    var group = eval('document.forms[0]["'+groupName+'"]');
    var checked = false;
    if ( typeof group != 'undefined' )
    {
        if ( group.length  > 1 )
        {
            for ( var i=0;i< group.length; i++ )
            {
                if ( group[i].checked )
                {
                    checked = true;
                    return checked;
                }
            }
        }
        else
        {
            if ( group.checked )
            {
                checked = true;
                return checked;
            }
        }
    }
    return checked;
}
///////////////////End of Object CheckGroup()////////////////////







/********************************************************************************
* Object selector():
* Use this object to make sure that at least one item is available in the Selector element (see PickerElement.java)
* For use when Selector is marked Required:
* formCheckList.addElement(new CheckSelector({name:'element or subgroup name',ref_label:"group label in alerts"}));
*********************************************************************************/
// Constructor function
function selector(h)
{

    this.element        = 'document.forms[0]["'+h.name+'"]';
    this.fieldName      = h.name;
    this.ref_label      = h.ref_label;

    this.custom_alert     = h.custom_alert;
    this.custom_alert_cmp = h.custom_alert_cmp;

    this.required       = h.required;
    this.check          = selectorCheck;

    // Add here anything you need to validate
}

// Do actual check here
function selectorCheck()
{
  if(this.required)
  {
    var isAvailable = selectorElementAvailable(this.fieldName);
    this.custom_alert     = (typeof this.custom_alert     != 'undefined') ? this.custom_alert     : '';
    this.ref_label = (typeof this.ref_label != 'undefined') ? this.ref_label
    : JS_RESOURCES.getFormattedString('field_name.substitute', new Array(element.name));
    if ( !isAvailable )
    {
      alert(this.custom_alert ? this.custom_alert
              : JS_RESOURCES.getFormattedString('validation.required', new Array(this.ref_label)));
      return false;
    }
  }
  return true;
}

function selectorElementAvailable(groupName)
{
    // we need at least one "Remove" checkbox to be present and unchecked (one element is added but not removed)
    var group = eval('document.forms[0]["'+groupName+'"]');
    var available = false;
    if ( typeof group != 'undefined' )
    {
        if ( group.length  > 1 )
        {
            for ( var i=0;i< group.length; i++ )
            {
                if ( !group[i].checked )
                {
                    available = true;
                    return available;
                }
            }
        }
        else
        {
            if ( !group.checked )
            {
                available = true;
                return available;
            }
        }
    }
    return available;
}
///////////////////End of Object CheckSelector()////////////////////














//////////////// Start some useful generic functions ////////////


/*  Function ltrim(): Remove leading  spaces in strings:
    Usage:trimmedString = originalString.ltrim();
*/
function ltrim()
{
    return this.replace( /^\s+/g,'');
}
String.prototype.ltrim = ltrim;

/*  Function rtrim(): Remove trailing spaces in strings:
    Usage:trimmedString = originalString.rtrim();
*/
function rtrim()
{
    return this.replace( /\s+$/g,'');
}
String.prototype.rtrim = rtrim;


/*  Function trim(): Remove leading and trailing spaces in strings:
    Usage:trimmedString = originalString.trim();
*/
function trim()
{
    return this.rtrim().ltrim();;
}
String.prototype.trim = trim;

/*
// Function trim_all is same as trim() but it treats string as multiple lines
function trim_all() {
    return this.replace( /^\s+|\s+$/gm,'');
}

//Function nice_striper will remove all whitespaces except new line from the string
function nice_striper {
    return this.trim_all().replace(/(.)+\s+/gm,\1);
}
*/


/* Function invalidChars(): Returns an array of illegal chars
   Usage: var listOfChars = myStringToSearch.invalidChars(regularExpression);
   regularExpression = /[illegal chars]/g; Sample re = /[! &^$#]/g
*/
function invalidChars (re)
{
    var chrs = this.match(re);
    if ( chrs )
    {
        for ( j=0;j<chrs.length;j++ )
        {
            if ( chrs[j]==' ' )
            {
                chrs[j]=JS_RESOURCES.getString('invalid_char.space');
            }
            else if ( chrs[j]==',' )
            {
                chrs[j]=JS_RESOURCES.getString('invalid_char.comma');
            }
            else if ( chrs[j]=='\\' )
            {
                chrs[j]='\\\\';
            }
        }
    }
    return chrs;
}
String.prototype.invalidChars = invalidChars;

/** Function getRadioValue(): Returns selected value for group of radio buttons
* Usage: var selectedValue = getRadioValue(radio); radio - reference to radio group
*/
function getRadioValue(radio)
{
    for ( var i=0;i< radio.length;i++ )
    {
        if ( radio[i].checked )
        {
            return radio[i].value;
        }
    }
}

/** Function isEmptyWysiwyg(): Checks WYSIWYG control for value
*/
function isEmptyWysiwyg(field)
{
    // first remove any HTML tags from the value, then check if it's empty (all spaces or &nbsp;s)
    // explicitly adding the unicode non-breaking space and line feed/break since IE and safari
    // don't seem to include them in \s
    var EMPTY_REGEXP = /^(\s|\u00A0|\u2028|\u2029|&nbsp;)*$/i;   
   // Input is not empty if it contains one of the following tags: img/object/embed
    var SPECIALTAGS = /(<\s*(img)|(object)|(embed)|(hr)|(applet))/i;
    if ( typeof(field) != 'undefined' && typeof(field.value) == 'string' && field.value != null )
    {
        var notags = field.value.replace(/<.*?>/g,'');
        var result = EMPTY_REGEXP.test(notags);
        
        return  ( result && !SPECIALTAGS.test(field.value) );
        
    }
    return true;
}

/** Function isValidUrl(): Checks if given string is in the general URL format
*/
var VALID_URL_REGEXP = /[^:]+:\/\/[^:\/]+(:[0-9]+)?\/?.*/;
function isValidUrl(string)
{
    return( VALID_URL_REGEXP.test(string) );
}

/** Numeric
*/
var EFLOAT_REGEXP = LOCALE_SETTINGS.getString('efloat.format');
var THOUSANDS_SEP = LOCALE_SETTINGS.getString('number_format.thousands_sep');
function isNumeric(string)
{
    string = string.trim();
    string = string.replace(THOUSANDS_SEP, '');
    if ( string.search( new RegExp(EFLOAT_REGEXP) ) == 0 )
    {
        var floatValue = parseFloat(string);
        return !isNaN(floatValue);
    }
    return false;
}

function _getNumber(string)
{
	string = string.trim();
    string = string.replace(THOUSANDS_SEP, '');
    if ( string.search( new RegExp(EFLOAT_REGEXP) ) == 0 )
    {
        return parseFloat(string);
    }
}

/** Float between 0 and 100
*/
var FLOAT_REGEXP = LOCALE_SETTINGS.getString('float.format');
function isPercent(string)
{
    string = string.trim();
    if ( string.search( new RegExp(FLOAT_REGEXP) ) == 0 )
    {
        var floatValue = parseFloat(string);
        return( !isNaN(floatValue)  && floatValue >= 0 && floatValue <= 100 );
    }
    return false;
}

/*Function submitForm()
  Call this function to validate and submit form
*/
function submitForm()
{
    if ( validateForm() )
    {
        document.forms[0].submit();
    }
}

/*Function validateForm()
* Call this function onSubmit inside <form> tag
*/
function validateForm()
{

    // Set textarea value to VTBE contents
    if ( typeof(finalizeEditors) == "function" )
    {
        finalizeEditors();
    }

    var ismath = ( typeof(api) != 'undefined' && api != null ); // True if webeq is there

    /* Transform equations place holders into html before validation */
    if ( ismath )
    {
        api.setHtml();
    }

    if ( skipValidation )
    {
        return true;
    }

    /* Validate form */
    var valid = formCheckList.check();

    /*Check for invalid answers if any present */
    var invalidAnswersArray = new Array();
    if ( typeof(invalidAnswers) == 'object' && invalidAnswers.length > 0 )
    {
        for ( var i = 0; i < invalidAnswers.length; ++i )
        {
            invalidAnswersArray.push( invalidAnswers[i] );
        }
    }
    if ( typeof(invalidAnswersTmp) == 'object' && invalidAnswersTmp.length > 0 )
    {
        for ( var i = 0; i < invalidAnswersTmp.length; ++i )
        {
            invalidAnswersArray.push( invalidAnswersTmp[i] );
        }
    }
    var stringArg = '';
    if ( invalidAnswersArray.length > 0 )
    {
        var lastIndex = invalidAnswersArray.length - 1;
        for ( var x = 0; x < invalidAnswersArray.length; x++ )
        {
            stringArg += invalidAnswersArray[x];
            if ( x < lastIndex )
            {
                if ( ( (x+1) % 10 ) == 0 )
                {
                    stringArg += ",\n";
                }
                else
                {
                    stringArg += ",";
                }
            }
        }
    }
    if ( stringArg != '' && valid )
    {
        var msgKey;
        if ( invalidAnswersArray.length == 1 )
        {
            msgKey = 'assessment.incomplete.confirm.single';
        }
        else if ( invalidAnswersArray.length > 1 )
        {
            msgKey = 'assessment.incomplete.confirm';
        }
        if ( !confirm( JS_RESOURCES.getFormattedString( msgKey, new Array(stringArg) ) ) )
        {
            valid = false; // User decided not to submit
        }

        invalidAnswersTmp = []; // Clearing up
    }

    /* Go back to placeholders if validation failed (valid == false) */
    if ( ismath && !valid )
    {
        api.setMathmlBoxes();
    }

    /* If everything is OK and ready to go,check that the form was not already submitted */
    if ( valid && dblSubmit != false )
    {
        valid = dblSubmit.check();
    }

    return valid;
}

/*Function boxSelector()
* Use this function to select, unselect or invert selection for specified checkbox groups
* Call: boxSelector(['name1','name2',...,'namen'],action), here action is 'select', or 'unselect', or 'invert'
*/
function boxSelector(list,action)
{
    var action = (action == 'select') ? true : (action == 'unselect') ? false : action;
    for ( var i=0;i<list.length;i++ )
    {
        var group = 'document.forms[0]["'+list[i]+'"]';
        if ( typeof (group = eval(group)) != 'undefined' )
        {
            if ( action == 'invert' )
            {
                for ( var j=0;j<group.length;j++ )
                {
                    group[j].checked = !group[j].checked;
                }
            }
            else
            {
                for ( var j=0;j<group.length;j++ )
                {
                    group[j].checked = action;
                }
            }
        }
    }
}


function setHidden (from,to)
{
    var hide = eval(to);
    hide.value = from.value;
}


//////////////////////////////////////////////////////////////////
/**
* Check_Answer object was added by request specified in mscr 524
* to provide validation to student answers
* Variable invalidAnswers has to be added to the page where assessment is submitted
* It should contain the list of unfinished questions excluding  question(s) on current page
* Check_Answer object will perform final validation and display all unfinished questions in confirm box
*/

var invalidAnswers = new Array(); // the java code will populate this array on final QbyQ page
/** Object constructor for answers walidation
*
*/

function Check_Answer (vobj)
{
    if ( typeof(window.invalidAnswersTmp)=='undefined' )
    {
        window.invalidAnswersTmp=[];
    }
    this.form       = 'document.forms[0]';
    this.element    = 'document.forms[0]["'+vobj.name+'"]';
    this.name       = vobj.name;
    this.answerChk  = true; //Check_Answer is special check, it makes a list of unfinished questions and always return true
    this.ref_label  = vobj.ref_label;
    this.check      = Check_Answer_check;
}

function Check_Answer_check()
{

    //create form element object
    el = eval(this.element);

    //Extract question type information from element name
    var qtype =  /^(\w+)-/.exec(this.name);
    if ( !qtype )
    {
        qtype =  /^([^_]+)_/.exec(this.name);
    }
    qtype = qtype[1];
    if ( qtype == 'ma' )
    {
        qtype = /-\d+$/.test(this.name) ? 'mat' : 'ma';
    }

    // Perform actual check-up
    if ( qtype == 'tf' || qtype == 'mc' || qtype == 'ma' || qtype == 'eo' )
    {
        if ( !isChecked(el) )
        {
            invalidAnswersTmp[invalidAnswersTmp.length]=this.ref_label;
        }
    }
    else if ( qtype == 'ord' || qtype == 'mat' )
    {
        if ( el.selectedIndex == 0 && this.ref_label != invalidAnswersTmp[invalidAnswersTmp.length-1] )
        {
            invalidAnswersTmp[invalidAnswersTmp.length]= this.ref_label;
        }
    }
    else if ( qtype == 'fitb' || qtype == 'essay' || qtype == 'num' || qtype == 'calc' || qtype == 'hs' || qtype == 'jumbled_sentence' || qtype == 'fib_plus' || qtype == 'quiz_bowl' )
    {
        var val = el.value;
        if ( val == null || !val.replace(/<p><\/p>/gi,'').trim() )
        {
          val='';
        }

        if ( isEmptyWysiwyg(el) )
        {
          el.value = '';
          val = '';
        }
    
        if ( val.trim().length < 1 )
        {
            invalidAnswersTmp[invalidAnswersTmp.length]= this.ref_label;
        }
    }
    else if ( qtype == 'file' )
    {
        var haveFile = false;

        var hiddenField = eval(this.form + '.elements["' + this.name + '-override"]');
        if ( hiddenField && hiddenField.value == "true" )
        {
            haveFile = true;
        }

        el = eval(this.form + '.elements["' + this.name + '_attachmentType"]');
        if ( !haveFile && el && (!el.value == "") )
        {
            haveFile = true;
        }

        if ( !haveFile )
        {
            invalidAnswersTmp[invalidAnswersTmp.length]= this.ref_label;
        }
    }

    // eliminate duplicates
    // TODO: think of a better way to do this
    if ( invalidAnswersTmp.length > 0 )
    {
        var tmpArray = [];
        var tmpObject = new Object();
        for ( var i = 0; i < invalidAnswersTmp.length; ++i )
        {
            if ( !tmpObject[invalidAnswersTmp[i]] )
            {
                tmpObject[invalidAnswersTmp[i]] = true;
                tmpArray[tmpArray.length] = invalidAnswersTmp[i];
            }
        }
        invalidAnswersTmp = tmpArray;
    }

    return true; //Always true, we can make decision later through confirm
}

// Test if at least one member of radio or checkbox group is selected
function isChecked(grp)
{
    for ( var i=0;i< grp.length;i++ )
    {
        if ( grp[i].checked )
        {
            return true;
        }
    }
    return false;
}

// wrapper function for focus() calls
function shiftFocus(el, isVTBE)
{
    if ( typeof(el) != 'undefined' )
    {
        if ( typeof(isVTBE) != 'undefined' && isVTBE && typeof(editors) != 'undefined' && typeof(editors[el.name].focusEditor) == 'function' )
        {
            editors[el.name].focusEditor();
        }
        else if ( !el.disabled && !el.readOnly && el.type != "hidden" )
        {
            el.focus()
        }
    }
    return;
}

/**
 * A validator that checks to see that a certain radio button in a group is
 * selected.  This is intended to be used for conditional validation --
 * validators that only apply when a certain radio button selection is made.
 * Note that if there are no selected values, this validator will return false
 * when checked.
 *   - name - radio button group to check
 *   - value - the radio button value to check for selection
 */
function RadioButtonValueValidator( name, value )
{
    this.element = document.forms[0][name];
    this.value = value;
    this.check = RadioButtonValueValidator_check;
}

function RadioButtonValueValidator_check()
{
    for ( var i = 0; i < this.element.length; i++ )
    {
        if ( this.element[i].value == this.value )
            return this.element[i].checked;
    }
    return false;
}

/**
 * A validator that performs a logical, short-circuit OR on its two arguments.
 */
function OrValidator( first, second )
{
    this.first = first;
    this.second = second;
    this.check = OrValidator_check;
}

function OrValidator_check()
{
    return this.first.check() || this.second.check();
}

/* This is a sample code that has to be added to every corresponding form element in take assessment page,
where you perform question validation for completness;
ref_lablel value is used to refer to element, name is field full name:

<script type="text/javascript">
formCheckList.addElement(new Check_Answer({ref_label:"Question 3",name:"tf-ans-_190_1"}));
</script>

*/

  
