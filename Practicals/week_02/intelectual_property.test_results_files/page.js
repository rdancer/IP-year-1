var page = {};

page.isLoaded = false;

/**
 * Utility for adding and using localized messages on the page.
 */
page.bundle = {};
page.bundle.messages = {};
page.bundle.addKey = function( key, value )
{
  page.bundle.messages[key] = value;
};
page.bundle.getString = function( key /*, arg1, arg2, ..., argN */ )
{
  var result = page.bundle.messages[key];
  if ( result == null )
  {
     return "!!!!" + key + "!!!!!";
  }
  else
  {
     if ( arguments.length > 1 )
     {
       for ( var i = 1; i < arguments.length; i++ )
       {
         result = result.replace( new RegExp("\\\{"+(i-1)+"\\\}","g"), arguments[i] );
       }
     }
     return result;
  }
};

/**
 * Provides support for lazy initialization of javascript behavior when a certain
 * event happens to a certain item.
 */
page.LazyInit = function( event, eventTypes, initCode )
{
  var e = event || window.event;
  var target = Event.element( event );
  // This is because events bubble and we want a reference
  // to the element we registered the handlers on.
  if ( !target.hasClassName("jsInit") ) 
  {
     target = target.up(".jsInit");
  }
  for (var i = 0; i < eventTypes.length; i++ )
  {
    target['on'+eventTypes[i]] = null;
  }
  eval( initCode ); //initCode can reference "target"
}

/**
 * Evaluates any <script> tags in the provided string in the global scope.
 * Useful for evaluating scripts that come back in text from an Ajax call.
 */
page.globalEvalScripts = function( str )
{
   //Get any external scripts
   var externalScriptRE = '<script[^>]*src=["\']([^>"\']*)["\'][^>]*>([\\S\\s]*?)<\/script>'; 
   var scriptMatches = str.match( new RegExp( externalScriptRE, 'img' ) );
   if ( scriptMatches && scriptMatches.length > 0 )
   {
     $A(scriptMatches).each( function( scriptTag ) {
	   var matches = scriptTag.match( new RegExp( externalScriptRE, 'im') );
	   if ( matches && matches.length > 0 && matches[1] != '' )
	   {
		  var scriptElem = new Element('script', { type: 'text/javascript', src: matches[1] });
		  var head = $$('head')[0];
		  head.appendChild( scriptElem );
	   }
     });
   }
   
   //Evaluate any inline script
   str.extractScripts().each(function(script) { 
	   if ( script != '' )
	   {
		 if ( Prototype.Browser.IE && window.execScript )
		 {
		   window.execScript( script );
		 }
		 else
		 {
	       var scriptElem = new Element('script', { type: 'text/javascript' } );
	       var head = $$('head')[0];
	       script = document.createTextNode( script );
	       scriptElem.appendChild( script );
	       head.appendChild( scriptElem );
	       head.removeChild( scriptElem );
		 }
	   }
   });
}

/**
 * Contains page-wide utility methods
 */
page.util = {};
/**
 * Returns whether the specific element has the specified class name. 
 * Same as prototype's Element.hasClassName, except it doesn't extend the element (which is faster in IE).
 */
page.util.hasClassName = function ( element, className )
{
  var elementClassName = element.className;
  if (elementClassName.length == 0) return false;
  if (elementClassName == className ||
      elementClassName.match(new RegExp("(^|\\s)" + className + "(\\s|$)")))
    return true;
  return false;
}

page.util.isRTL = function ()
{
  var els = document.getElementsByTagName("html");
  var is_rtl = (typeof(els) != 'undefined'
          && els != null
          && typeof(els.length) != 'undefined'
          && els.length == 1
          && typeof(els[0].dir) != 'undefined'
          && els[0].dir == 'rtl');
  return is_rtl ;
}

page.util.showPreviewDivs = function ()
{ 
  if ( $('containerdiv') != null )
  {
    // show preview divs and hide dummy preview divs
	$('containerdiv').getElementsBySelector("div.previewDiv").each( function( div )
	{
        div.show();
	});
	$('containerdiv').getElementsBySelector("div.dummyPreviewDiv").each( function( div )
	{
      div.remove();
	});
  }
}

// hide preview divs which may contain embedded objects such as Quicktime so popup can appear
page.util.hidePreviewDivs = function ( popupDiv )
{ 
  if ( $('containerdiv') != null )
  {
	$('containerdiv').getElementsBySelector("div.previewDiv").each( function( div )
	{
      if (!page.util.elementsOverlap( popupDiv, div)) return;

	  // show a dummy div in its place to maintain page element positioning
      var dummyPreviewDiv = $(document.createElement('div'));
      dummyPreviewDiv.addClassName('dummyPreviewDiv');
      dummyPreviewDiv.clonePosition(div);
      dummyPreviewDiv.setStyle({backgroundColor: '#000', width: div.getHeight()  + "px"});
	  div.insert( { before: dummyPreviewDiv } );
      div.hide();
	});
  }
}
	

page.util.elementsOverlap = function ( e1, e2 )
{ 
  var pos1 = e1.cumulativeOffset();
  var l1 = pos1.left;
  var t1 = pos1.top;
  var r1 = l1 + e1.getWidth();
  var b1 = t1 + e1.getHeight();
  var pos2 = e2.cumulativeOffset();
  var l2 = pos2.left;
  var t2 = pos2.top;
  var r2 = l2 + e2.getWidth();
  var b2 = t2 + e2.getHeight();
  return (l1 < r2) && (r1 > l2) && (t1 < b2) && (b1 > t2);
}


/**
 * Class for controlling the menu-collapser.  Also ensures the menu is the right height
 */
page.PageMenuToggler = Class.create();
page.PageMenuToggler.prototype = 
{
  initialize: function( isMenuOpen )
  {
    page.PageMenuToggler.toggler = this;
    this.isMenuOpen = isMenuOpen;
    this.puller = $('puller');
    this.menuPullerLink = $(this.puller.getElementsByTagName('a')[0]);
    this.menuContainerDiv = $('menuWrap');
    this.navigationPane = $('navigationPane');
    this.contentPane = $('contentPanel') || $('contentPane');
    this.navigationPane = $('navigationPane');
    this.locationPane = $(this.navigationPane.parentNode);
    this.breadcrumbBar = $('breadcrumbs'); 
    
    this.menu_pTop = parseInt(this.menuContainerDiv.getStyle('paddingTop'));
    this.menu_pBottom = parseInt(this.menuContainerDiv.getStyle('paddingBottom'));
    this.loc_pTop = parseInt(this.locationPane.getStyle('paddingTop'));
    if ( this.breadcrumbBar != null )
    {
      this.bc_pTop = parseInt(this.breadcrumbBar.getStyle('paddingTop'));
      this.bc_pBottom = parseInt(this.breadcrumbBar.getStyle('paddingBottom'));
    }
    else
    {
      this.bc_pTop = 0;
      this.bc_pBottom = 0;
    }
   
    this.windowDim = document.viewport.getDimensions();
    this.toggleListeners = [];
	//Fix the menu size
	this.onResize(null, true);
	// Doesn't work in IE or Safari..
    //Event.observe( window, 'resize', this.onResize.bindAsEventListener( this ) );
    Event.observe( this.menuPullerLink, 'click', this.onToggleClick.bindAsEventListener( this ) );
  },
  addToggleListener: function( listener )
  {
    this.toggleListeners.push( listener );
  },
  notifyToggleListeners: function( event, isOpen )
  {
    this.toggleListeners.each( function( listener )
    {
      listener( event, isOpen );
    });
  },
  getAvailableResponse : function ( req  ) 
  {
    var originalMenuOpen = this.isMenuOpen ;
    if ( req.responseText.length > 0 ) 
    {
      if ( req.responseText == 'true' ) 
        this.isMenuOpen = true;
      else 
        this.isMenuOpen = false;
    } 
    
    if ( originalMenuOpen != this.isMenuOpen ) 
    {
      this.notifyToggleListeners( this.isMenuOpen );
      this.menuContainerDiv.toggle();
      this.puller.toggleClassName("pullcollapsed");
      this.contentPane.toggleClassName("contcollapsed");
      this.navigationPane.toggleClassName("navcollapsed");
    } 
  },  
  onToggleClick: function( event )
  {
    var isMenuOpen = true;
    this.menuContainerDiv.toggle();
    this.puller.toggleClassName("pullcollapsed");
    this.contentPane.toggleClassName("contcollapsed");
    this.navigationPane.toggleClassName("navcollapsed");
    if ( this.isMenuOpen )
    {      
      this.isMenuOpen = false;
      key = "coursemenu.show";
    }
    else
    {                 
      this.isMenuOpen = true;   
      key = "coursemenu.hide";
    }
    this.menuPullerLink.title = page.bundle.messages[key];
    $('expander').alt = page.bundle.messages[key];
    this.notifyToggleListeners( event, this.isMenuOpen );
    UserDataDWRFacade.setStringPermScope( 'courseMenuToggle', this.isMenuOpen );
    Event.stop( event );
  },
  onResize: function( event, ignoreDim )
  {
    var dim = document.viewport.getDimensions();
    if ( ignoreDim == true || (dim.width != this.windowDim.width || dim.height != this.windowDim.height) )
    {
        this.windowDim = dim;
	    var windowHeight = dim.height;
	    var breadcrumbHeight = 0;
	    if ( this.breadcrumbBar != null )
	    {
	      breadcrumbHeight = this.breadcrumbBar.getHeight();
	    }
	    var menuHeight = this.menuContainerDiv.getHeight();
	    var contentHeight = this.contentPane.getHeight();
	    var scrollOffset = document.viewport.getScrollOffsets().top;
	    var newHeight = windowHeight - breadcrumbHeight - this.loc_pTop - this.bc_pTop - this.bc_pBottom + scrollOffset;
	    var maxHeight = ( menuHeight > contentHeight ) ? menuHeight : contentHeight;
	    if ( maxHeight >= newHeight )
	    {
	      this.contentPane.setStyle({height: ''});
	      this.navigationPane.setStyle({height: ''});
	      (function() 
	      {
	        var menuHeight = this.menuContainerDiv.getHeight();
	        var contentHeight = this.contentPane.getHeight();
	        var maxHeight = ( menuHeight > contentHeight ) ? menuHeight : contentHeight;
	        this.contentPane.setStyle({height: maxHeight + 'px'});
	        this.navigationPane.setStyle({height: maxHeight + 'px'});
	      }.bind(this)).defer();
	    }
	    else
	    {
	      this.contentPane.setStyle({height: newHeight + 'px'});
	      this.navigationPane.setStyle({height: newHeight + 'px'});
	    }
    }
  }  
};
page.PageMenuToggler.toggler = null;

/**
 *  Class for controlling the page help toggler in the view toggle area
 */
page.PageHelpToggler = Class.create();
page.PageHelpToggler.prototype = 
{
  initialize: function( isHelpEnabled, showHelpText, hideHelpText )
  {
	page.PageHelpToggler.toggler = this;
    this.toggleListeners = [];
    this.isHelpEnabled = isHelpEnabled;
    this.showText = showHelpText;
    this.hideText = hideHelpText;
    this.contentPanel = $('contentPanel') || $('contentPane');
    var helperList = [];
    if ( this.contentPanel != null )
    {
    	var allElems = [];
    	allElems = allElems.concat( $A(this.contentPanel.getElementsByTagName('p') ) );
    	allElems = allElems.concat( $A(this.contentPanel.getElementsByTagName('div') ) );
    	allElems = allElems.concat( $A(this.contentPanel.getElementsByTagName('li') ) );
    	allElems = allElems.concat( $A(this.contentPanel.getElementsByTagName('span') ) );
	    for ( var i = 0; i < allElems.length; i++ )
	    {
	      var el = allElems[i];
	      if ( page.util.hasClassName( el, 'helphelp' ) 
	        || page.util.hasClassName( el, 'stepHelp' )
	        || page.util.hasClassName( el, 'taskbuttonhelp' )
	        || page.util.hasClassName( el, 'pageinstructions' ) )
	      {
	        helperList.push( $(el) );
	      }
	    }
	}
    var helpTextToggleLink = $('helpTextToggleLink');
    if ( (helperList == null || helperList.length == 0) ) {
      if ( helpTextToggleLink != null )
      {
        helpTextToggleLink.remove();
      }
    } else {
	    if ( isHelpEnabled != true ) {
	      helperList.invoke( "toggle" );   
	    }
	    if (this.showText == null) {
	      this.showText = page.bundle.getString("viewtoggle.editmode.showHelp");
	    }
	    if (this.hideText == null) {
	      this.hideText = page.bundle.getString("viewtoggle.editmode.hideHelp");
	    }
	    this.toggleLink = helpTextToggleLink;
	    this.toggleImage = $(this.toggleLink.getElementsByTagName('img')[0]);
	    Event.observe( this.toggleLink, "click", this.onToggleClick.bindAsEventListener( this ) );
	    $(this.toggleLink.parentNode).removeClassName('hidden');
	    this.updateUI();
	}
  },
  
  addToggleListener: function( listener )
  {
    this.toggleListeners.push( listener );
  },
  
  notifyToggleListeners: function( event )
  {
    this.toggleListeners.each( function( listener )
    {
      listener( event, this.isHelpEnabled );
    });
  },
  
  updateUI: function( )
  {
    if ( this.isHelpEnabled )
    {
      $("showHelperSetting").value = 'true';
      this.toggleImage.src = "/images/ci/ng/small_help_on2.gif";
      this.toggleLink.setAttribute( "title", this.showText );
      this.toggleImage.setAttribute( "alt", this.showText );
    }
    else
    {
      $("showHelperSetting").value = 'false';
      this.toggleImage.src = "/images/ci/ng/small_help_off2.gif";
      this.toggleLink.setAttribute( "title", this.hideText );
      this.toggleImage.setAttribute( "alt", this.hideText );
    }    
  },
  
  onToggleClick: function( event )
  {
    // Toggle all elements that have the css class "helphelp"
    var helperList = [];
    if ( this.contentPanel != null )
    {
    	var allElems = [];
    	allElems = allElems.concat( $A(this.contentPanel.getElementsByTagName('p') ) );
    	allElems = allElems.concat( $A(this.contentPanel.getElementsByTagName('div') ) );
    	allElems = allElems.concat( $A(this.contentPanel.getElementsByTagName('li') ) );
    	allElems = allElems.concat( $A(this.contentPanel.getElementsByTagName('span') ) );
    	
	    for ( var i = 0; i < allElems.length; i++ )
	    {
	      var el = allElems[i];
	      if ( page.util.hasClassName( el, 'helphelp' ) 
	        || page.util.hasClassName( el, 'stepHelp' )
	        || page.util.hasClassName( el, 'taskbuttonhelp' )
	        || page.util.hasClassName( el, 'pageinstructions' ) )
	      {
	        $(el).toggle();
	      }
	    }
    }
    if ( this.isHelpEnabled )
    {
      this.isHelpEnabled = false;
      UserPageInstructionsSettingDWRFacade.setShowPageInstructions( "false" );
    }
    else
    {
      this.isHelpEnabled = true;
      UserPageInstructionsSettingDWRFacade.setShowPageInstructions( "true" );
    }    
	this.updateUI();
    this.notifyToggleListeners( event );
    Event.stop( event );
  }
};

/**
 * Class for controlling the display of a context menu.
 */
page.ContextMenu = Class.create();
page.ContextMenu.prototype = 
{
  initialize: function( contextMenuContainer )
  {
    page.ContextMenu.registerContextMenu( this );
    this.contextMenuDiv = $(contextMenuContainer.getElementsByTagName("div")[0]);
    this.contextMenuDiv.setStyle({zIndex: 200});
    this.displayContextMenuLink = contextMenuContainer.down("a");
    this.closeContextMenuLink = contextMenuContainer.down(".contextmenubar_top").down(0);
    this.uniqueId = this.displayContextMenuLink.id.split('_')[1];
    this.contextParameters = contextMenuContainer.readAttribute("bb:contextParameters");
    this.menuGeneratorURL = contextMenuContainer.readAttribute("bb:menuGeneratorURL");
    this.nav = contextMenuContainer.readAttribute("bb:navItem");
    this.enclosingTableCell = contextMenuContainer.up("td");
    this.menuOrder = contextMenuContainer.readAttribute("bb:menuOrder");
    this.overwriteNavItems = contextMenuContainer.readAttribute("bb:overwriteNavItems");
    
    if(this.menuOrder != null)
    {
      this.menuOrder = this.menuOrder.split(',');
    }
    if(this.contextParameters == null)
    {
    	this.contextParameters = ""; 	
    }
    if(this.menuGeneratorURL == null)
    {
  		this.menuGeneratorURL = ""; 	
    }
    if(this.nav == null)
    {
  		this.nav = ""; 	
    }
  	this.dynamicMenu = false;
  	
  	if(this.menuGeneratorURL != null && this.menuGeneratorURL != "")
  	{
  		this.dynamicMenu = true;
  	}
  	
    if(this.dynamicMenu)
    {
     Event.observe( this.displayContextMenuLink, "click", this.generateDynamicMenu.bindAsEventListener( this ) );
    }
    else
    {
     Event.observe( this.displayContextMenuLink, "click", this.onDisplayLinkClick.bindAsEventListener( this ) );    
    }
    Event.observe( this.closeContextMenuLink, "click", this.onCloseLinkClick.bindAsEventListener( this ) );
    Event.observe( this.contextMenuDiv, "keydown", this.onKeyPress.bindAsEventListener( this ) );

	// adding nowrap to table cell containing context menu 
 	// If no enclosing td is found, try th
 	if( !this.enclosingTableCell )
 	{
 		this.enclosingTableCell = contextMenuContainer.up("th");
 	}   
 	 
    if( this.enclosingTableCell )
    {
     	if( !this.enclosingTableCell.hasClassName("nowrapCell") )
     	{    	
     		this.enclosingTableCell.addClassName("nowrapCell");
     	}
     	
     	// if label tag is an immediate parent of context menu span tag, it needs nowrap as well
     	if( this.enclosingTableCell.down("label") && !this.enclosingTableCell.down("label").hasClassName("nowrapLabel"))
     	{
     		this.enclosingTableCell.down("label").addClassName("nowrapLabel");
     	}
    }

    if ( !this.dynamicMenu )
    {
      var contexMenuItems = contextMenuContainer.getElementsBySelector("li > a").each( function (link )
      {
        if ( !link.up('li').hasClassName("contextmenubar_top") )
        {
          Event.observe( link, 'focus', this.onAnchorFocus.bindAsEventListener( this ) );
          Event.observe( link, 'blur', this.onAnchorBlur.bindAsEventListener( this ) );
        }
      }.bind( this ) );
    }
    
    // relocate the context menu div to the bottom of the page so that its CSS won't get messed up by parent tags
    Element.remove( this.contextMenuDiv );
    document.body.appendChild( this.contextMenuDiv );
  },
  
  onKeyPress: function( event )
  {
    var key = event.keyCode || event.which;
    if ( key == Event.KEY_UP )
    {  
      var elem = Event.element ( event );
      var children = this.contextMenuDiv.getElementsBySelector("li > a");
      var index = children.indexOf( elem );
      if ( index > 0 )
      {
        children[index - 1].focus();
      } 
      Event.stop( event );
    }
    else if ( key == Event.KEY_DOWN )
    {
      var elem = Event.element ( event );
      var children = this.contextMenuDiv.getElementsBySelector("li > a");
      var index = children.indexOf( elem );
      if ( index < ( children.length - 1 ) )
      {
        children[index + 1].focus();
      }   
      Event.stop( event );
    }
    else if ( key == Event.KEY_ESC )
    {
      this.close();
      this.displayContextMenuLink.focus();
      Event.stop( event );
    }
    else if ( key == Event.KEY_TAB )
    {
      var elem = Event.element ( event );
      var children = this.contextMenuDiv.getElementsBySelector("li > a");
      var index = children.indexOf( elem );
      if ( (!event.shiftKey && index == children.length - 1) || (event.shiftKey && index == 0))
      {
        this.close();
        this.displayContextMenuLink.focus();
        Event.stop( event );
      }   
    }
  },
  
  onAnchorFocus: function ( event )
  {
    Event.element( event ).setStyle({ backgroundColor: '#FFFFFF' });
  },
  
  onAnchorBlur: function( event )
  {
    Event.element( event ).setStyle({ backgroundColor: '' });
  },
  
  afterMenuGeneration: function( req )
  {
  	if(this.dynamicMenu)
    {  
	    this.dynamicMenu =  false;
	    try
	    {
		  var result = req.responseText.evalJSON( true );
		  if ( result.success == "true" )
		  {
            // append uniqueId to each li
            var menuHTML = result.contentMenuHTMLList.replace(/(<li.*?id=")(.*?)(".*?>)/g,"$1$2_"+this.uniqueId+"$3");
		    this.contextMenuDiv.insert({bottom:menuHTML});
		  	$A(this.contextMenuDiv.getElementsByTagName("ul")).each( function( list, index ) 
		  	{
		  	  list.id = 'cmul'+index+'_'+this.uniqueId;
		  	}.bind(this) );
		    var contexMenuItems = this.contextMenuDiv.getElementsBySelector("li > a").each( function (link )
            {
              if ( !link.up('li').hasClassName("contextmenubar_top") )
              {
                Event.observe( link, 'focus', this.onAnchorFocus.bindAsEventListener( this ) );
                Event.observe( link, 'blur', this.onAnchorBlur.bindAsEventListener( this ) );
               }
            }.bind( this ) );
		  }
		  else
		  {
		  	new page.InlineConfirmation("error", result.errorMessage, false );        
		  }
		}
	    catch ( e )
	    {
	       new page.InlineConfirmation("error", result.errorMessage, false );        
	    }
    }
    
    this.showMenu();
    //focus on the first menu item 
    (function() { this.contextMenuDiv.down("a").focus(); }).bind(this).defer();         
  },
  
  showMenu : function()
  {
    this.reorderMenuItems(); 
    var offset = Position.cumulativeOffset( this.displayContextMenuLink );
    this.contextMenuDiv.setStyle({display: "block"});
    var width = this.contextMenuDiv.getWidth();
    var bodyWidth = $(document.body).getWidth();
    if ( page.util.isRTL() )
    {
      offset[0] = offset[0] + this.displayContextMenuLink.getWidth() - width;
    }
    if ( offset[0] + width > bodyWidth )
    {
      offset[0] = offset[0] - width + 30;
    }
    var ypos = offset[1] + this.displayContextMenuLink.getHeight() + 17;
    this.contextMenuDiv.setStyle({ left: offset[0] + "px", top: ypos + "px"});
    if ( !this.shim ) this.shim = new page.popupShim( this.contextMenuDiv ); 
    this.shim.open();
	page.util.hidePreviewDivs( this.contextMenuDiv );
  },

  reorderMenuItems : function()
  { 
    if ( !this.menuOrder || this.menuOrder.length < 2 ) return;

    var orderMap = {};
    var closeItem = null;
    var extraItems = new Array();  // items not in order

    // Gather up all of the <li> tags in the menu and stick them in a map/object of id to the li object 
    $A(this.contextMenuDiv.getElementsByTagName("li")).each( function( listItem ) 
     {
       if (listItem.hasClassName("contextmenubar_top"))
       {
         closeItem = listItem;
       }
       else 
       {         
	   if (this.menuOrder.indexOf(listItem.id) > -1) 	
         {
           orderMap[listItem.id] = listItem;  // add item to map
         }
         else
         {
           extraItems.push(listItem); // listItem id not specified in menuOrder, so add listItem to extraItems
         }
       }
     }.bind(this) );

    // Remove all the content from the context menu div
    $A(this.contextMenuDiv.getElementsByTagName("ul")).each( function( list ) 
	{
        Element.remove(list);
 	}.bind(this) );

    // Re-add the special "close" item as the first item.
    var ulElement = $(document.createElement("ul"));
    this.contextMenuDiv.insert({bottom:ulElement});
    ulElement.insert({bottom:closeItem});

    // Loop through the order, adding a <ul> at the start, and starting a new <ul> whenever a "*separator*" 
    //  is encountered, and adding the corresponding <li> for each of the ids in the order using the map/object
    this.menuOrder.each( function( id ) 
     {
       if (id == "*separator*")
       {
         ulElement = $(document.createElement("ul"));
         this.contextMenuDiv.insert({bottom:ulElement});
       }
       else
       {
         ulElement.insert({bottom:orderMap[id]});
       }
     }.bind(this) );


     // Add any extraItems to thier own ul
     if (extraItems.length > 0)
     {
       ulElement = $(document.createElement("ul"));
       this.contextMenuDiv.insert({bottom:ulElement});
       extraItems.each( function( lineItem )
	  {
          ulElement.insert({bottom:lineItem});
 	  }.bind(this) );
     }

    // Remove any empty ULs and ensure that the added <ul>s have id of form "cmul${num}_${uniqueId}"
    $A(this.contextMenuDiv.getElementsByTagName("ul")).findAll( function( list )
    {
      if ( list.childElements().length == 0 )
      {
        list.remove(); return false;
      }
      else
      {
        return true;
      }
    }).each( function( list, index ) 
	{
	  list.id = 'cmul'+index+'_'+this.uniqueId;
 	}.bind(this) );
    
    this.menuOrder = null;  // only re-order once

  },
  
  generateDynamicMenu : function(event)
  { 
  	page.ContextMenu.closeAllContextMenus();
    if(this.dynamicMenu)
    {  	
	  	var context_parameters = this.contextParameters;
	    var menu_generator_url = this.menuGeneratorURL;
	    var nav = this.nav;
	    var overwriteNavItems = this.overwriteNavItems;
	  	  	
	  	if ( context_parameters != null && context_parameters != "" )
	    {
	      context_parameters = context_parameters.toQueryParams();        	
	    }
	    else
	    {
	      context_parameters = {};
	    }
	         	  	
	  	var params = Object.extend({nav_item: nav }, context_parameters );
	    params = Object.extend( params, { overwriteNavItems : overwriteNavItems } );
	    
	    new Ajax.Request(menu_generator_url,
	    {
	      method: 'post',
	      parameters: params,      
	      onSuccess: this.afterMenuGeneration.bind( this )
	    });
    }
    else{    	
    	this.afterMenuGeneration(this);    	
    }
    $(event).preventDefault();
  },  
  
  
  onDisplayLinkClick: function( event )
  {  	
    page.ContextMenu.closeAllContextMenus();
    if(this.dynamicMenu)
    {
     this.generateDynamicMenu(event);
     this.dynamicMenu = false;
    }    
    else
    {
      this.showMenu();
      //focus on the first menu item
      (function() { this.contextMenuDiv.down("a").focus(); }).bind(this).defer(); 
      $(event).preventDefault();     
    }
  },
  
  onCloseLinkClick: function( event )
  {
    this.close();
    this.displayContextMenuLink.focus();
    Event.stop( event );
  },
  
  close: function()
  {
    page.util.showPreviewDivs();
    this.contextMenuDiv.setStyle({display: "none"});
    if ( this.shim ) this.shim.close();
  }
};
// "static" methods
page.ContextMenu.contextMenus = [];
page.ContextMenu.registerContextMenu = function( menu )
{
  page.ContextMenu.contextMenus.push( menu );
};
page.ContextMenu.closeAllContextMenus = function( event )
{
  if ( event )
  {
    var e = Event.findElement( event, 'a' );
    if ( e && e.href.indexOf("#contextMenu") >= 0 )
    {
      Event.stop( event );
      return;
    }
  }

  page.ContextMenu.contextMenus.each( function( menu )
  {
    if ( menu != this )
    {
      menu.close();
    }
  });
};

/**
 *  Enables flyout menus to be opened using a keyboard or mouse.  Enables
 *  them to be viewed properly in IE as well.
 */
page.FlyoutMenu = Class.create();
page.FlyoutMenu.prototype = 
{
  initialize: function( subMenuListItem )
  {
    this.subMenuListItem = subMenuListItem;
    this.nextTabStop = subMenuListItem;
    this.menuLink = $(subMenuListItem.getElementsByTagName('a')[0]);
    this.subMenu = $(subMenuListItem.getElementsByTagName('ul')[0]);
    
    this.actionBar = $('actionbar');
    this.isMenuInActionBar = false;
    if ( this.actionBar )
    {
    	this.isMenuInActionBar = (this.subMenuListItem.up('div.actionBar') != null );
    	this.actionBarLIs = this.actionBar.getElementsBySelector('li');
    	
    	this.originalActionBarZIndex = this.actionBar.getStyle('zIndex');
    	if ( this.actionBarLIs.length > 0 )
    	{
    		this.originalActionBarItemZIndex = this.actionBarLIs[0].getStyle('zIndex');
    	}
    }
    
    Event.observe( this.menuLink, 'mouseover', this.onOpen.bindAsEventListener( this ) );
    Event.observe( subMenuListItem, 'mouseout', this.onClose.bindAsEventListener( this ) );
    Event.observe( this.menuLink, 'click', this.onLinkOpen.bindAsEventListener( this ) );
    Event.observe( this.subMenuListItem, 'keydown', this.onKeyPress.bindAsEventListener( this ) );

    $A( this.subMenu.getElementsByTagName('li') ).each ( function( li )
    {
      $A(li.getElementsByTagName('a')).each( function( link )
      {
        Event.observe( link, 'focus', this.onAnchorFocus.bindAsEventListener( this ) );
        Event.observe( link, 'blur', this.onAnchorBlur.bindAsEventListener( this ) );
        Event.observe( link, 'click', this.onLinkClick.bindAsEventListener( this, link ) );
      }.bind( this ) );
    }.bind( this ) );    
  },
  onKeyPress: function( event )
  {
    var key = event.keyCode || event.which;
    if ( key == Event.KEY_UP )
    {  
      var elem = Event.element ( event );
      var children = this.subMenu.getElementsBySelector("li > a");
      var index = children.indexOf( elem );
      if ( index > 0 )
      {
        children[index - 1].focus();
      } 
      else if ( index == 0 )
      {
        this.close();
        this.menuLink.focus();
      }
      Event.stop( event );
    }
    else if ( key == Event.KEY_DOWN )
    {
      var elem = Event.element ( event );
      var children = this.subMenu.getElementsBySelector("li > a");
      var index = children.indexOf( elem );
      if ( index == -1 )
      {
        this.open();
      }
      if ( index < ( children.length - 1 ) )
      {
        children[index + 1].focus();
      }  
      Event.stop( event );
    }
    else if ( key == Event.KEY_ESC )
    {
      this.close();
      this.menuLink.focus();
      Event.stop( event );
    }
    else if ( key == Event.KEY_TAB )
    {
      var elem = Event.element ( event );
      var children = this.subMenu.getElementsBySelector("li > a");
      var index = children.indexOf( elem );
      if ( (!event.shiftKey && index == children.length - 1) || (event.shiftKey && index == 0))
      {
        this.close();
        if (event.shiftKey) {
            this.menuLink.focus();
        } else {
            if (!this.nextTabFound) {
              this.nextTabStop = Selector.handlers.nextElementSibling(this.nextTabStop);
              if (this.nextTabStop != null) {
                  if (typeof(this.nextTabStop.tabindex) == 'undefined') {
                    Element.extend(this.nextTabStop);
                    this.nextTabStop = this.nextTabStop.firstDescendant();
                  }
              }
              this.nextTabFound = true;
            }
    
            this.nextTabStop.focus();
        }
        Event.stop( event );
      }   
    }
    
  },  
  
  onOpen: function( event )
  {
    this.open();
  },
  
  onClose: function( event )
  {
    var to = $(event.relatedTarget || event.toElement);
    if ( to == null || to.up('li.sub') != this.subMenuListItem )
    {
        this.close();
    }
  },
  
  onLinkOpen: function( event )
  {
    this.open();
    this.subMenu.down("li > a").focus();  
  },
  
  open: function()
  {
	if ( this.actionBar && !this.isMenuInActionBar )
	{
		this.actionBar.setStyle({zIndex: 0});
		this.actionBarLIs.each( function( li ){
			li.setStyle({zIndex: 0, position: 'static'});
		});
	}

    var menuTop = this.subMenuListItem.getHeight();
    if ( this.subMenu.hasClassName('narrow') )
    {
      menuTop = 0;
    }
    this.subMenu.setStyle({ display: 'block', top: menuTop+'px', left: '0px'});  
    page.util.hidePreviewDivs( this.subMenu );
    var offset = Position.cumulativeOffset( this.subMenuListItem );
    var menuDims = this.subMenu.getDimensions();
    var menuHeight = menuDims.height;
    var menuWidth = this.subMenu.down('a').getWidth();
    var viewportDimensions = document.viewport.getDimensions();
    if ( (offset[1] + menuHeight) > viewportDimensions.height && (offset[1] - menuHeight) > 0 )
    {
        // if menu goes below viewport, show it above button
        this.subMenu.setStyle({ top: '-'+menuHeight+'px' });  
    } 
    if ( (offset[0] + menuWidth) > viewportDimensions.width && ( offset[0] - menuWidth) > 0 )
    {
        var newLeft = -(menuWidth-this.subMenuListItem.getWidth());
        // if menu goes off the edge of the page, show it to the left
        this.subMenu.setStyle({ left: newLeft+'px' });
    }
    if ( page.util.isRTL() )
    {
        var newLeft = this.subMenuListItem.getWidth() - menuWidth - 2;
        this.subMenu.setStyle({ left: newLeft+'px' });
    }
    (function() { 
      if (!this.shim) this.shim = new page.popupShim( this.subMenu);
      this.shim.open();
    }).bind(this).defer();         
    page.util.hidePreviewDivs( this.subMenu );
  },
  
  close: function()
  {
	if ( this.actionBar && !this.isMenuInActionBar )
	{
		this.actionBar.setStyle({zIndex: this.originalActionBarZIndex});
		this.actionBarLIs.each( function( li ){
			li.setStyle({zIndex: this.originalActionBarItemZIndex, position: 'relative'});
		}.bind(this));
	}
	  this.subMenu.setStyle({ top: '-10000px'}); 
	  if ( this.shim ) this.shim.close();
    page.util.showPreviewDivs();
  },  
  
  onLinkClick: function( event, link )
  {
    setTimeout( this.blurLink.bind( this, link), 100);
  },
  
  blurLink: function( link )
  {
    link.blur();
    this.close();
  },
  
  onAnchorFocus: function ( event )
  {
    var link = Event.element( event );
    link.setStyle({ backgroundColor: '#FFFFFF' });
    this.open();
  },
  
  onAnchorBlur: function( event )
  {
    var link = Event.element( event );
    link.setStyle({ backgroundColor: '' });
    this.close();
  }
};

/**
 * Class for providing functionality to menu palettes
 */
page.PaletteController = Class.create();
page.PaletteController.prototype = 
{
  /**
   * Constructor
   *
   * @param paletteIdStr        Unique string identifier for a palette
   * @param expandCollapseIdStr Id value of anchor tag to be assigned 
   *                            the palette expand/collapse functionality
   */
  initialize: function( paletteIdStr, expandCollapseIdStr )
  {
    // palette id string
    this.paletteItemStr = paletteIdStr;
    
    // palette element
    this.paletteItem = $(this.paletteItemStr); 

    // default id string to palette contents container element
    this.defaultContentsContainerId = page.PaletteController.getDefaultContentsContainerId(this.paletteItemStr);
    
    // the currently active palette contents container element
    this.activeContentsContainer = $(this.defaultContentsContainerId);

    // expand/collapse palette toggle element
    this.paletteToggle = $(expandCollapseIdStr);    
    
    if( this.paletteToggle )
      Event.observe(this.paletteToggle, 'click', this.hideNavPalette.bindAsEventListener(this));

    page.PaletteController.registerPaletteBox(this);
  },

  /**
   * Set the currently active palette contents container element
   *
   * @param container palette contents container element
   */
  setActiveContentsContainer: function ( container )
  {
    this.activeContentsContainer = container;
  },

  /**
   * Get the currently active palette contents container element
   *
   * @return palette contents container element
   */
  getActiveContentsContainer: function ()
  {
    return this.activeContentsContainer;
  },

  /*
   * Expand and collapse entire palettes
   *
   * @param event Optional event object if this method was bound to event.
   */
  hideNavPalette: function ( event, doNotPersist )
  {
    // To prevent default event behavior
    if( event )
      Event.stop(event);  

    var itemPalClass = new Array();
    itemPalClass = this.paletteItem.className.split(" ");
    
    var firstDiv = this.paletteItem.getElementsByTagName('div')[0];
    var lastDiv =  this.paletteItem.getElementsByTagName('div')[(this.paletteItem.getElementsByTagName('div').length-1)];
    var h2 = $(this.paletteItemStr+"_paletteTitleHeading"); 
    var accessibleInfoImg = h2.getElementsByTagName('img')[0];
    var expandCollapseLink = h2.getElementsByTagName('a')[0];
        
    var itemList = this.activeContentsContainer;
    
    if( itemList.style.display == "none" )
    {
      itemList.style.display = "block";
      itemPalClass.length = itemPalClass.length - 1;
      this.paletteItem.className = itemPalClass.join(" ");
      lastDiv.className = "bottomRound";
      firstDiv.className = "topRound";
      h2.className = "";
      var itemTitle = expandCollapseLink.innerHTML.stripTags();
      accessibleInfoImg.alt = page.bundle.getString('expandCollapse.collapse.section', itemTitle);
      expandCollapseLink.title = page.bundle.getString('expandCollapse.collapse.section', itemTitle);
    } 
    else
    {
      itemList.style.display = "none";
      itemPalClass[itemPalClass.length] = 'navPaletteCol';
      this.paletteItem.className = itemPalClass.join(" ");  

      if(itemPalClass.indexOf('controlpanel') != -1)
      {
        lastDiv.className = "bottomRound controlpanelCol"; // colors the bottomRound to match the h2 background
      } 

      if(itemPalClass.indexOf('listCm')!=-1)
      {
        lastDiv.className = "bottomRound listCmCol"; // colors the bottomRound to match the h2 background
        firstDiv.className = "topRound listCmCol"; // colors the topRound to match the h2 background
        h2.className = "listCmCol"; // colors h2 background (removes background image)
      } 

      if(itemPalClass.indexOf('tools') != -1)
      {
        lastDiv.className = "bottomRound toolsCol";
        firstDiv.className = "topRound listCmCol";
        h2.className = "toolsCol";
      } 
      var itemTitle = expandCollapseLink.innerHTML.stripTags();
      accessibleInfoImg.alt = page.bundle.getString('expandCollapse.expand.section', itemTitle);
      expandCollapseLink.title = page.bundle.getString('expandCollapse.expand.section', itemTitle); 
    }
    if (doNotPersist) return;
    // get the course id off of the global variable if exists, so that data is saved per user session per course
    var current_course_id = ( (typeof course_id != "undefined") && course_id != null ) ? course_id : "";
    var key = page.PaletteController.getDefaultContentsContainerId(this.paletteItemStr) + current_course_id;
    UserDataDWRFacade.setStringTempScope( key, itemList.style.display );
  }
};

// "static" methods

page.PaletteController.paletteBoxes = [];
page.PaletteController.registerPaletteBox = function( paletteBox )
{
  page.PaletteController.paletteBoxes.push( paletteBox );
};

/**
 * Get the palette controller js object by palette id
 *
 * @param paletteId 
 */
page.PaletteController.getPaletteControllerObjById = function( paletteId )
{
  return page.PaletteController.paletteBoxes.find( function( pb )
         { return ( pb.paletteItemStr == paletteId ); } );
};

/**
 * Hide the contents of a nav palette by palette id
 *
 * @param paletteId
 * @param doNotPersist - optional param to suppress persisting state, default is to persist
 */
page.PaletteController.hideNavPalette = function( paletteId, doNotPersist )
{
  var paletteObj = page.PaletteController.getPaletteControllerObjById( paletteId );  
  paletteObj.hideNavPalette( null, doNotPersist);  
};

/**
 * Set the active palette contents container (element containing the body 
 * contents of a palette). The active contents container is used to toggle
 * visibility when expanding and collapsing menu palettes.
 *
 * @param paletteId
 * @param paletteContentsContainer Optional container to set. 
 *                                 If not given, the palette's active 
 *                                 container will not be changed.
 * @return The new active palette contents container element. 
 *         If no paletteContentsContainer element was passed,
 *         The current active palette contents container element
 *         will be returned.
 */
page.PaletteController.setActivePaletteContentsContainer = function( paletteId, paletteContentsContainer )
{
  var paletteObj = page.PaletteController.getPaletteControllerObjById( paletteId );
  if( paletteContentsContainer )
    paletteObj.setActiveContentsContainer( paletteContentsContainer );      
  return paletteObj.getActiveContentsContainer();
};

/*
 * Get the default palette contents container id string
 *
 * @param paletteId
 */
page.PaletteController.getDefaultContentsContainerId = function( paletteId )
{
  return paletteId + "_contents";
};


/**
 * Class for providing expand/collapse functionality (with dynamic loading)
 */
page.ItemExpander = Class.create();
page.ItemExpander.prototype = 
{
  /**
   * Constructor
   * - expandLink - the link that when clicked will expand/collapse the item
   * - expandArea - the actual area that will get expanded/collapsed (if the item is dynamically loaded, this area will be populated dynamically)
   * - expandText - the text to show as a tooltip on the link for expanding
   * - collapseText - the text to show as a tooltip on the link for collapsing
   * - dynamic - whether the contents are dynamically loaded
   * - dynamicUrl - the URL to get the contents of the item from
   * - contextParameters - additional URL parameters to add when calling the dynamicUrl
   */
  initialize: function( expandLink, expandArea, expandText, collapseText, dynamic, dynamicUrl, contextParameters )
  {
    this.expandLink = $(expandLink);
    this.expandLinkImage = this.expandLink.down('img');
    this.expandArea = $(expandArea);
    // Register the expander so it can be found
    page.ItemExpander.itemExpanderMap[this.expandLink.id] = this;
    this.expandText = expandText.unescapeHTML();    
    this.collapseText = collapseText.unescapeHTML();
    this.dynamic = dynamic;
    this.dynamicUrl = dynamicUrl;
    if ( contextParameters != null && contextParameters != "" )
    {
      this.contextParameters = contextParameters.toQueryParams();
    }
    else
    {
      this.contextParameters = {};
    }
    this.expanded = false;
    this.hasContents = !this.dynamic;

    // get the course id off of the global variable if exists, because data is saved per user session per course
    var current_course_id = ( (typeof course_id != "undefined") && course_id != null ) ? course_id : "";
    UserDataDWRFacade.getStringTempScope( this.expandLink.id + current_course_id, this.getAvailableResponse.bind( this ) );
    Event.observe( this.expandLink, "click", this.onToggleClick.bindAsEventListener( this ) );
  },

  getAvailableResponse : function ( response  ) 
  {
    var originalExpanded = this.expanded ;
    var cachedExpanded = false;
    if ( response.length > 0 ) 
    {
      if ( response == 'true' )
        cachedExpanded = true; 
       else 
         cachedExpanded = false;
    } 
    
    if ( originalExpanded != cachedExpanded ) 
    {
      //because we want the menu to be in the cached state, 
      //we pass in the opposite so that expandCollapse changes the menu state.
      this.expandCollapse(originalExpanded);
    } 
  },  
  
  onToggleClick: function( event )
  {
    if( event != null ) {
      Event.stop( event );
    }
    
    this.expandCollapse(this.expanded);

    // get the course id off of the global variable if exists, so that data is saved per user session per course
    var current_course_id = ( (typeof course_id != "undefined") && course_id != null ) ? course_id : "";
    UserDataDWRFacade.setStringTempScope( this.expandLink.id + current_course_id, this.expanded );
  },
  
  expandCollapse: function(shouldCollapse)
  {
    if ( shouldCollapse ) //Collapse the item
    {
      this.expandArea.hide();
      this.expandLink.title = this.expandText;
      if ( this.expandLinkImage ) this.expandLinkImage.alt = this.expandText;
      if ( this.expandLink.hasClassName("comboLink_active") )
      {
        var combo = this.expandLink.up("li").down(".submenuLink_active");
        this.expandLink.removeClassName("comboLink_active");
        this.expandLink.addClassName("comboLink");
        if ( combo )
        {
          combo.removeClassName("submenuLink_active");
          combo.addClassName("submenuLink");
        }
      }
      else
      {
        this.expandLink.removeClassName("open");
      }
      this.expanded = false;
    }
    else //Expand the item
    {
      if ( this.hasContents )
      {
	  this.expandArea.setStyle({ zoom: 1 });
        this.expandArea.show();
        this.expandLink.title = this.collapseText;
        if ( this.expandLinkImage ) this.expandLinkImage.alt = this.collapseText;
        if ( this.expandLink.hasClassName("comboLink") )
        {
          var combo = this.expandLink.up("li").down(".submenuLink");
          this.expandLink.removeClassName("comboLink");
          this.expandLink.addClassName("comboLink_active");
          if ( combo )
          {
            combo.removeClassName("submenuLink");
            combo.addClassName("submenuLink_active");
          }
        }
        else
        {
          this.expandLink.addClassName("open");
        }
      }
      else if ( this.dynamic )
      {
        this.loadData();
      }
      this.expanded = true;
      
    }
  
  },
  
  loadData: function()
  {
    new Ajax.Request( this.dynamicUrl,
    {
      method: "post",
      parameters: this.contextParameters,
      requestHeaders: { cookie: document.cookie },
      onSuccess: this.afterLoadData.bind( this )
    });
  },
  
  afterLoadData: function( req )
  {
    try
    {
      var result = req.responseText.evalJSON( true );
      if ( result.success != "true" )
      {
        new page.InlineConfirmation("error", result.errorMessage, false );
      }
      else
      {
        this.hasContents = true;
        this.expandArea.innerHTML = result.itemContents;
	  this.expandArea.setStyle({ zoom: 1 });
        this.expandArea.show();
        this.expandLink.title = this.collapseText;
        this.expandLinkImage.alt = this.collapseText;
        if ( this.expandLink.hasClassName("comboLink") )
        {
          var combo = this.expandLink.up("li").down(".submenuLink");
          this.expandLink.removeClassName("comboLink");
          this.expandLink.addClassName("comboLink_active");
          if ( combo )
          {
            combo.removeClassName("submenuLink");
            combo.addClassName("submenuLink_active");
          }
        }
        else
        {
          this.expandLink.addClassName("open");
        }
        this.expanded = true;
      }
    }
    catch ( e )
    {
      //Invalid response
    }
  }  
}
page.ItemExpander.itemExpanderMap = {};
 
/**
 * Class for controlling the "breadcrumb expansion" (i.e. the "..." hiding the inner
 * breadcrumbs)
 */
page.BreadcrumbExpander = Class.create();
page.BreadcrumbExpander.prototype = 
{
  initialize: function( breadcrumbBar )
  {
    var breadcrumbListElement = $(breadcrumbBar.getElementsByTagName('ol')[0]);
    var breadcrumbs = breadcrumbListElement.immediateDescendants();
    if ( breadcrumbs.length > 4 )
    {
      this.ellipsis = document.createElement("li");
      var ellipsisLink = document.createElement("a");
      ellipsisLink.setAttribute("href", "#");
      ellipsisLink.setAttribute("title", page.bundle.getString('breadcrumbs.expand') );
      ellipsisLink.innerHTML = "...";
      this.ellipsis.appendChild( ellipsisLink );
      this.ellipsis = Element.extend( this.ellipsis );
      Event.observe( ellipsisLink, "click", this.onEllipsisClick.bindAsEventListener( this ) );
      this.hiddenItems = $A(breadcrumbs.slice(2,breadcrumbs.length - 2));      
      breadcrumbListElement.insertBefore( this.ellipsis, this.hiddenItems[0] );
      this.hiddenItems.invoke( "hide" );
    }    
  },
  
  onEllipsisClick: function( event )
  {
    this.hiddenItems.invoke( "show" );
    this.ellipsis.hide();
    Event.stop( event );
  }
} 

/**
 * Dynamically creates an inline confirmation.
 */
page.InlineConfirmation = Class.create();
page.InlineConfirmation.prototype = 
{
  initialize: function( type, message, showRefreshLink )
  {
    var cssClass = "bad";
    if ( type == "success" )
    {
      cssClass = "good";
    }
    var contentPane = $('contentPanel') || $('portalPane');
    var receiptHtml = '<div class="receipt '+ cssClass +'">'+
                      '<a name="inlineReceipt" tabindex="-1" style="color:#FFFFFF">'+message+'</a>';
    if ( showRefreshLink )
    {
      receiptHtml += ' <a href="#refresh" onClick="document.location.href = document.location.href; return false;">' + page.bundle.getString("inlineconfirmation.refresh") + '</a>';
    }
    receiptHtml += '<a class="close" href="#close" title="'+ page.bundle.getString("inlineconfirmation.close") +'" onClick="Element.remove( $(this).up(\'div.receipt\') ); return false;"><img alt="'+ page.bundle.getString("inlineconfirmation.close") +'" src="/images/ci/ng/close_mini.gif"></a></div>';
    contentPane.insert({top:receiptHtml});
    contentPane.down('a[name="inlineReceipt"]').focus();
  }
}

page.extendedHelp = function( helpattributes, windowName )
{
	helpwin = window.open('/webapps/blackboard/execute/viewExtendedHelp?'
	             +helpattributes,windowName,'menubar=1,resizable=1,scrollbars=1,status=1,width=480,height=600');
	helpwin.focus();
};

page.decoratePageBanner = function()
{
	var bannerDiv = $('pageBanner');
	var containerDiv = $('contentPanel') || $('contentPane');
	if( ( bannerDiv != null ) && ( containerDiv != null ) )
	{
		// append hasTopBanner class to container div to hide topRound
		containerDiv.addClassName('hasTopBanner');
		
		// hide empty title bar
		if( ( $('pageTitleText') == null ) && ( $('pageTitleDiv') != null ) )
		{
			$('pageTitleDiv').hide();
		}		
	}
};
/**
 * Utility for data collection step manipulation
 */
page.steps = {};
page.steps.HIDE = "hide";
page.steps.SHOW = "show";

/**
 * Hide or show an array of steps given the step ids and 
 * renumber all visible steps on the page.
 * 
 * @param action - either page.steps.HIDE or page.steps.SHOW
 * @param stepIdArr - string array of step ids
 */
page.steps.hideShowAndRenumber = function ( action, stepIdArr )
{
  // hide or show each of the step ids given
  ($A(stepIdArr)).each( function( stepId ) 
  {
      page.steps.hideShow( action, stepId );
  });
  
  // get all DIV elements that contain css class of "steptitle"
  var stepTitleDivs = [];
  $A(document.getElementsByTagName('div')).each( function( div )
  {
    if ( page.util.hasClassName( div, 'steptitle' ) )
    {
      stepTitleDivs.push( $(div) );
    }
  });
  
  // starting at number 1, renumber all of the visible steps
  var number = 1;
  stepTitleDivs.each(function( stepTitleDiv ){
    if( stepTitleDiv.up('div').visible() )
    {
      stepTitleDiv.down('span').update(number);
      number++;
    }
  });
};

/**
 * Hide or show a single step given the step id.
 *
 * @param action - either page.steps.HIDE or page.steps.SHOW
 * @param stepId - string identifier to a single step
 */
page.steps.hideShow = function ( action, stepId )
{  
  if( action == page.steps.SHOW )
  {
    $(stepId).show();
  }    
  else if( action == page.steps.HIDE )
  {
    $(stepId).hide();
  }      
};

page.showChangeTextSizeHelp = function( )
{
  page.extendedHelp('internalhandle=change_text_size&helpkey=change_text_size','change_text_size' ); 
  return false;
};

page.showAccessibilityOptions = function()
{
   var win = window.open('/webapps/portal/execute/changePersonalStyle?cmd=showAccessibilityOptions'
		   ,'accessibilityOptions','menubar=1,resizable=1,scrollbars=1,status=1,width=480,height=600');
   win.focus();
};

page.toggleContrast = function( )
{
  new Ajax.Request('/webapps/portal/execute/changePersonalStyle?cmd=toggleContrast', {
    onSuccess: function(transport, json) {
      var fsWin;
      if (window.top.nav)
      {
        fsWin = window.top;
      }
      else if (window.opener && window.opener.top.nav)
      {
        fsWin = window.opener.top; 
        window.close();
      }         
      if (fsWin)
      { 		  		
        fsWin.nav.location.reload();
        fsWin.content.location.reload();
      }
      else
      {
        window.top.location.reload();
      }
    }
   });
  return false;
};

/**
 * IFrame-based shim used with popups so they render on top of all other page elements (including applets)
 */
page.popupShim = Class.create();
page.popupShim.prototype = 
{
  initialize: function( popup )
  {
    this.popup = popup;
    this.shim = $(document.createElement('iframe'));
    this.shim.setAttribute('frameborder','0');

    if (this.popup.parentNode == document.body) 
    {
      document.body.appendChild(this.shim);
    }
    else 
    {
      this.popup.offsetParent.appendChild(this.shim); 
    }
  },

  open: function( )
  {
    this.popup.setStyle({zIndex: 100});
    this.shim.setStyle({ zIndex: 99, position:'absolute', 
                         top: this.popup.style.top,
                         left: this.popup.style.left,
                         display: "block"
                       });
    this.shim.height = this.popup.getHeight();
    this.shim.width= this.popup.getWidth();
    if ( Prototype.Browser.IE ) {  // iframe was a little too tall on IE. AS-126266
      this.shim.height = this.popup.getHeight()-5;
    }
  },

  close: function( )
  {
    this.shim.hide();
  }
}

/**
 * Class for controlling the vtbe enable toggle.
 */
page.VTBEToggle = Class.create();
page.VTBEToggle.prototype = 
{
  initialize: function()
  {
    var toggleFunc = this.toggleVTBE.bindAsEventListener( this );
    $A(document.getElementsByTagName('div')).each( function( div )
    {
      // add toggle listener for each vtbe switch
      if ( page.util.hasClassName(div, 'vtbeSwitch') )
      {
        var div = $(div);
        var anchor = div.down('a');
        page.VTBEToggle.form = div.up('form');

        Event.observe( anchor, 'click', toggleFunc );

        // save original form data so we can detect unsaved data when toggling VTBE
        if ( page.VTBEToggle.form && !page.VTBEToggle.origFormData )
        {
          page.VTBEToggle.origFormData = Form.serializeElements( page.VTBEToggle.form.getElements(), true );
        }
	  
      }
    });
  },
  
  toggleVTBE: function( event )
  {
    // Stop the event to handle firefox behavior when posting into a page. 
    Event.stop(event);
    // check & warn user of modified form data
    if ( page.VTBEToggle.form && page.VTBEToggle.origFormData )
    {
      var origFormData = page.VTBEToggle.origFormData;
      var currentFormData = Form.serializeElements( page.VTBEToggle.form.getElements(), true );
      for(var i in origFormData) 
      {
	    var origVal = origFormData[i];
	    var currVal = currentFormData[i];
	    if ( currVal && typeof currVal != 'object' && origVal != currVal)
	    {
	      if (!confirm( page.bundle.getString("wysiwyg.visual.editor.confirm.unsaved.changes") ))
	      {
	        return;
	      }
          break;
        }
      }
    }
    // get current state of vtbe, toggle it, then reload page
    UserDataDWRFacade.getStringPermScope( "textbox.wysiwyg", function( wysiwyg )
    { 
      UserDataDWRFacade.setStringPermScope( "textbox.wysiwyg", (wysiwyg == 'Y') ? 'N' : 'Y', function()
      {
        window.location.reload(true);
      });      
    });
  }
}


 /**
  * Set up any JavaScript that will always be run on load (that doesn't depend on
  * any application logic / localization) here.
  *
  * Please leave this at the bottom of the file so it's easy to find.
  *  
  */
FastInit.addOnLoad( function()
{
  Event.observe( document.body, "click", page.ContextMenu.closeAllContextMenus.bindAsEventListener( window ) );
    
  //Initialize accessible flyout menu behavior
  $A(document.getElementsByTagName('ul')).each( function( ul )
  {
    if ( page.util.hasClassName(ul, 'nav') )
    {
      $A(ul.getElementsByTagName('li')).each( function( li )
      {
        if ( page.util.hasClassName( li, 'sub' ) )
        {
          new page.FlyoutMenu( $(li) );
        }
      });
    }
  });
  
  if ( $('breadcrumbs') )
  {
    new page.BreadcrumbExpander($('breadcrumbs'));
  }
  
  page.isLoaded = true;  
});

/**
 * Recursively walks up the frameset stack asking each window to change their
 * document.domain attribute in anticipation of making a cross-site scripting
 * call to an LMS integration.
 * 
 * <p>This should only be called from popup windows, as changing the document.domain
 * value of a window that is going to be reused later could do surprising things.
 * 
 * @param domain Domain name shared by the Learn and LMS servers.
 */
page.setLmsIntegrationDomain = function( domain )
{
  if ( '' == domain )
    return;

  try
  {
    if ( parent.page.setLmsIntegrationDomain )
    {
      parent.page.setLmsIntegrationDomain( domain );
    }
  }
  catch ( err )
  {
    // Ignore
  }

  document.domain = domain;
};

