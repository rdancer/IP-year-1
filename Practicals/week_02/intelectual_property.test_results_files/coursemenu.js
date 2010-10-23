var courseMenu = {};

courseMenu.Util = {};

courseMenu.Util.getTocItemTemplate = function( type, isHidden, isEmpty, menuGeneratorUrl )
{
    var template = '';
    var url = ( menuGeneratorUrl ) ? menuGeneratorUrl : '/webapps/blackboard/execute/getCourseMenuContextMenu';
    var closeStr = page.bundle.getString("closeStr");
    var moreOptionsStr = page.bundle.getString("moreOptionsStr");
    var contextMenuTemplate = 
      "<span class='contextMenuContainer' bb:menuGeneratorURL='" + url + "' bb:contextParameters='course_id=<&= courseId &>&toc_id=<&= id &>'>" +  
      "<a class='cmimg editmode' href='#contextMenu' title='" + moreOptionsStr + "'><img src='/images/ci/icons/cm_arrow.gif' alt='" + moreOptionsStr + "'></a> " +
      "<div id='menudiv' class='cmdiv' style='display:none;'> "+
       "<ul><li class='contextmenubar_top'><a title='" + closeStr + "' href='#close'><img alt='" + closeStr + "' src='/images/ci/ng/close_mini.gif'></a></li></ul></div></span>";

    if ( type == 'DIVIDER' )
    {
      template = "<li class='divider' id='paletteItem:<&= id &>'><span class='reorder editmode'>&nbsp;</span><hr>";
    }
    else if ( type == 'SUBHEADER' )
    {
      template = "<li class='subhead' id='paletteItem:<&= id &>'><span class='reorder editmode'>&nbsp;</span><h3><span><&= name &></span></h3>";
    }
    else
    {
      var liClass = (isHidden || isEmpty) ? 'clearfix invisible editmode' : 'clearfix'; 
      template = "<li id='paletteItem:<&= id &>' class='"+ liClass +"'><span class='reorder editmode'>&nbsp;</span>";
      template += "<a href='<&= href &>' target='<&= target &>'><span><&= name &></span>";
      if ( isHidden )
      {
      	var hiddenStr = page.bundle.getString("hiddenStr");
        template += "<span class='cmLink-hidden' title='" + hiddenStr + "'><img src='/images/spacer.gif' alt='" + hiddenStr + "'/></span>";
      }
      if ( isEmpty )
      {
      	var emptyStr = page.bundle.getString("emptyStr");
        template += "<span class='cmLink-empty' title='" + emptyStr + "'><img src='/images/spacer.gif' alt='" + emptyStr + "'/></span>";
      }
      template += "</a>";
    }
    return template + contextMenuTemplate;
};


/**
 * Controls the dynamic course menu behaviour.
 */
courseMenu.CourseMenu = Class.create();
courseMenu.CourseMenu.prototype = 
{
  initialize: function( menuActionUrl, menuGeneratorUrl )
  {
    this.menuActionUrl = '/webapps/blackboard/execute/doCourseMenuAction';
  	if( menuActionUrl )
  	{
  		this.menuActionUrl= menuActionUrl;
  	}
  	
  	this.menuGeneratorUrl = '/webapps/blackboard/execute/getCourseMenuContextMenu';
  	if( menuGeneratorUrl ) 
  	{
  		this.menuGeneratorUrl = menuGeneratorUrl;
  	}
  	var addButton = $('addCmItem'); // open the flyout form relative to this element
  	this.editMode = false;
  	if ( addButton )
  	{
        this.editMode = true;
	  	var reorderButton = $('courseMenuPalette_reorderControlLink');  // focus will be set to this element after closing the flyout form
	  	var addNewMenuItemFunc = this._addNewMenuItem.bind( this );
	  	var afterModifyItemFunc = this._afterModifyItem.bind( this );
	  	
	  	
		// Initialize flyout forms
		new flyoutform.FlyoutForm({	linkId:'addContentAreaButton',
									formDivId:'addContentAreaForm',
									openRelativeItem:addButton,
									customPostSubmitHandler:addNewMenuItemFunc,
									onCloseFocusItem:reorderButton });
									
		new flyoutform.FlyoutForm({	linkId:'addToolLinkButton',
									formDivId:'addToolLinkForm',
									openRelativeItem:addButton,
									customPostSubmitHandler:addNewMenuItemFunc,
									onCloseFocusItem:reorderButton });
									
		if( $('addToolLinkButton') )
		{
		  Event.observe( 'addToolLinkButton', 'click', function()
	  	  {
	  		// dynamically load the tool select if not already done
	  		if ($("toolSelect").length == 0)
	  		{
				CourseMenuDWRFacade.getCourseTools(course_id, function( tools )
				{	
					dwr.util.addOptions( "toolSelect", tools);
				});
	  		}
	  		$("toolSelect").selectedIndex = 0;
	  	  });
	  	}
	
		new flyoutform.FlyoutForm({	linkId:'addCourseLinkButton',
									formDivId:'addCourseLinkForm',
									openRelativeItem:addButton,
									customPostSubmitHandler:addNewMenuItemFunc,
									onCloseFocusItem:reorderButton });
	
		new flyoutform.FlyoutForm({	linkId:'addExternalLinkButton',
									formDivId:'addExternalLinkForm',
									openRelativeItem:addButton,
									customPostSubmitHandler:addNewMenuItemFunc,
									onCloseFocusItem:reorderButton });
	
		new flyoutform.FlyoutForm({	linkId:'addModulePageButton',
									formDivId:'addModulePageForm',
									openRelativeItem:addButton,
									customPostSubmitHandler:addNewMenuItemFunc,
									onCloseFocusItem:reorderButton });
	
		new flyoutform.FlyoutForm({	linkId:'addSubHeaderButton',
									formDivId:'addSubheaderForm',
									openRelativeItem:addButton,
									customPostSubmitHandler:addNewMenuItemFunc,
									onCloseFocusItem:reorderButton });
	
		new flyoutform.FlyoutForm({	formDivId:'addDividerForm',
									customPostSubmitHandler:addNewMenuItemFunc });

		// when adding dividers, no need show form, just submit it 
		if( $('addDividerButton') )
		{
		  Event.observe( 'addDividerButton', 'click', function()
	  	  {
		    flyoutform.flyoutForms[ 'addDividerForm' ].submit();
	  	  });
	  	}
	  	
		// opening of modify... flyout forms is handled via context menu rather than button
		new flyoutform.FlyoutForm({	formDivId:'modifyCourseLinkForm',
									resetFormOnOpen:false,
									customPostSubmitHandler:null});
		
		new flyoutform.FlyoutForm({	formDivId:'modifyExternalLinkForm',
									resetFormOnOpen:false,									
									customPostSubmitHandler:this._afterModifyExternalLinkItem.bind( this ) });
									
		//new flyoutform.FlyoutForm({	formDivId:'renameSubHeaderForm',
		//				resetFormOnOpen:false,									
		//			customPostSubmitHandler:this.saveRenamedSubHeaderItem.bind( this ) });							

	    if( $('pickerLink') )Event.observe( 'pickerLink', 'click', this._showCourseLinkPicker.bindAsEventListener( this ) );
        if( $('modifyCourseLinkPickerLink') ) Event.observe( 'modifyCourseLinkPickerLink', 'click', this._showModifyCourseLinkPicker.bindAsEventListener( this ) );        
    }
	// Hack for Safari for links in a new window
    if ( inNewWindow && inNewWindow == true )
    {
      this.inNewWindow = true;
      $A(document.getElementsByTagName('a')).each( function( item )
      {
        if ( item.target == 'content' )
        {
          Event.observe(item, "click", this._targetParentWindow.bindAsEventListener( this, item ));
        }
      }.bind(this));
    }
    else
    {
      this.inNewWindow = false;
    }  
    	
	this.courseMapLink = $('courseMapButton');
	if ( this.courseMapLink )
	{
	  Event.observe( this.courseMapLink, 'click', this._showCourseMenuInWindow.bindAsEventListener( this ));
	}

    this.quickViewLink = $('quickViewLink');
    this.quickViewContainer = $('courseMenuPalette_contents');
    if ( this.quickViewLink )
    {
      Event.observe( this.quickViewLink, 'click', this._showQuickView.bindAsEventListener( this ) );
    }   
	
	this.expandAllLink = $('expandAllLink');
    if ( this.expandAllLink )
    {
      Event.observe( this.expandAllLink, 'click', this._detailViewExpandAll.bindAsEventListener( this ) );
    }
    
    this.collapseAllLink = $('collapseAllLink');
    if ( this.collapseAllLink )
    {
      Event.observe( this.collapseAllLink, 'click', this._detailViewCollapseAll.bindAsEventListener( this ) );
    }

	this.detailViewLink = $('detailViewLink');
	this.detailViewLink2 = $('detailViewLink2');
	if ( this.detailViewLink )
	{
	  Event.observe( this.detailViewLink, 'click', this._showDetailView.bindAsEventListener( this ) );
	  var courseMenuDivs = $('courseMenuPalette').getElementsByTagName('div');
	  var courseMenuContents = null;
	  for ( var i = 0; i < courseMenuDivs.length; i++ )
	  {
	    if ( page.util.hasClassName( courseMenuDivs[i], 'navPaletteContent') )
	    {
	      courseMenuContents = $(courseMenuDivs[i]);
	    }
	  }
	  this.detailViewContainer = new Element("div", { id: 'courseMenu_folderView', 'class': 'treeContainer',style: 'display: none;' });
	  courseMenuContents.appendChild(this.detailViewContainer);
      this.tree = null;
      $(this.detailViewLink2.getElementsByTagName('a')[0]).addClassName('options');
      this.detailViewLink2.hide();
      if ( this.detailViewLink.hasClassName('active') )
      {
        // show the folder view initially if it's the active one
        this._showDetailView();
      }
	}
	
	this.refreshLink = $('refreshMenuLink');
	if ( this.refreshLink )
	{
	  Event.observe( this.refreshLink, 'click', this._refreshMenu.bindAsEventListener(this) );
	}
	
	this.quickEnrollLink = $('quickEnrollLink');
	if ( this.quickEnrollLink)
	{
	  Event.observe( this.quickEnrollLink, 'click', this._quickEnrollToggle.bindAsEventListener(this) );
	}
	var renameSubHeaderInputBox = $("renameSubHeaderInputBox")
	if ( renameSubHeaderInputBox )
	{
	  Event.observe( renameSubHeaderInputBox, "keydown", this.onKeyDown.bindAsEventListener( this ) );
	}
	
	var renameSubHeaderForm = $('renameSubHeaderForm');
	if ( renameSubHeaderForm )
	{
      renameSubHeaderForm.remove();
      document.body.appendChild( renameSubHeaderForm );
    }
	
	this.initPaletteState();
	this._updateSubheaders();
  },
  
  /**
   * Update the appearance of subheader names in the accessible drag and drop window
   * for course menu toc reordering to "Subheader: [subheader_name]".
   * And, of course, this applies in course menu edit mode only.
   */
  _updateSubheaders: function( )
  {
    if( this.editMode == true )
    {
      // create a map of option values to options
      var optionMap = {};
      var sel = $('courseMenuPalette_pageListReorderControlSelect');
      $A(sel.options).each( function( o )
      { 
        optionMap[o.value] = o;
      });

      var lst = $('courseMenuPalette_contents');
      $A(lst.getElementsByTagName("li")).each( function( listItem ) 
      { 
        if ( $(listItem).hasClassName('subhead') )
        {
          // isolate id (after last colon)
          var id = listItem.id;
          id = id.substr( id.lastIndexOf(':') + 1 );
          var option = optionMap[id];
          // prepend "Subheader: " to option label
          $(option).update( page.bundle.getString("subheaderColonStr", option.innerHTML) ); 
        }
      });
    }
  },

  _targetParentWindow: function( event, item )
  {
    Event.stop( event );
    window.opener.top.content.location = item.href;
  },

/**
 * Deletes a course menu item for the given item (toc) id
 * 	Prompts the user for confirmation before deleting
 *	Calls the server to remove the Toc
 *	The current doc location is sent as a retUrl param to allow reloading the current
 *		page after deleting the item.
 */
  deleteItem: function( toc_id )
  {
  	new Ajax.Request( this.menuActionUrl + '?method=getTocRemoveMessage&course_id='+course_id+'&toc_id='+toc_id , {
  	onSuccess: function(transport, json) {  		  		
  		var result = transport.responseText.evalJSON( true );
  		var retUrl = escape(document.location.href);
  		if ( result.success == "true" )
		  {
	  		if (confirm(result.removalMessage))
	    	{ 
			  new Ajax.Request(result.actionUrl + "?method=removeToc&course_id="+course_id+"&toc_id="+toc_id+'&retUrl='+retUrl , {
  			  onSuccess: function(transport, json) {  		  		
  				  var result = transport.responseText.evalJSON( true );  		
  				  if ( result.success == "true" )
		  			{
		  				top.content.location = result.refreshUrl;
		 			}
		 		  else
		 			{
		 				new page.InlineConfirmation("error", result.errorMessage, false ); 
		 			} 	    
	  			}
			   });
			}
		  }
		 else
		 {
		 	new page.InlineConfirmation("error", result.errorMessage, false ); 
		 } 	    
	  }
	});    
  },
  
  toggleItemAvailability: function( toc_id, isEntryPoint )
  {
    var changeEntryPont = true;
  	if ( isEntryPoint ) 
  	{
  		var entryPointChangeConfirmStr = page.bundle.getString("entryPointChangeConfirmStr");
  		changeEntryPont = confirm ( entryPointChangeConfirmStr );
  	}
	if(  changeEntryPont ) 
	{
	  	var url = this.menuActionUrl + "?method=toggleTocAvailability&course_id="+course_id+"&toc_id="+toc_id+"&retUrl="+escape(document.location.href);
	    window.location.href = url;  	
	}
  },
  
  modifyCourseLink: function( toc_id )
  {
  	var courseLinkId = 'paletteItem:' + toc_id;
  	new Ajax.Request(this.menuActionUrl + '?method=getCourseLinkTitle&course_id='+course_id+'&toc_id='+toc_id, {
  	onSuccess: function(transport, json) {  		  		
  		var result = transport.responseText.evalJSON( true );  		
  		if ( result.success == "true" )
		  {
		  	$('modifiedLinkLocation').value = result.linkLocation;
		  	$('modifyCourseLinkFormTocId').value = toc_id;
		  	$('modifiedLinkId').value = result.linkedItemId;
		  	$('modifiedLinkType').value = result.linkedItemType;
		    flyoutform.flyoutForms[ 'modifyCourseLinkForm' ].open( $(courseLinkId).down('a') );
		  }
		 else
		 {
		 	new page.InlineConfirmation("error", result.errorMessage, false ); 
		 } 	    
	  }
	});   	
  },
  
  modifyExternalLink: function( toc_id )
  {
  	var externalLinkId = 'paletteItem:' + toc_id;
  	new Ajax.Request(this.menuActionUrl + '?method=getExternalLinkUrl&course_id='+course_id+'&toc_id='+toc_id, {
  	onSuccess: function(transport, json) {  		  		
  		var result = transport.responseText.evalJSON( true );  		
  		if ( result.success == "true" )
		  {
		  	$('modifyExternalLinkFormTocId').value = toc_id;
		  	$('externalLinkUrlInputId').value = result.linkUrl;
		    flyoutform.flyoutForms[ 'modifyExternalLinkForm' ].open( $(externalLinkId).down('a') );
		  }
		 else
		 {
		 	new page.InlineConfirmation("error", result.errorMessage, false ); 
		 } 	    
	  }
	});   	
  },
  
  toggleItemLaunchInd: function( toc_id )
  {  	
    var tocId = 'paletteItem:' + toc_id; 
    new Ajax.Request(this.menuActionUrl + '?method=toggleTocLaunchIndex&course_id='+course_id+'&toc_id='+toc_id, {
  	onSuccess: function(transport, json) {  		  		
  		var result = transport.responseText.evalJSON( true );
  		if ( result.success == "true" )
		  {	
		  	$(tocId).down('a').setAttribute("target",result.windowType);
		  	$(tocId).down('a').setAttribute("href",result.href);
		  	$('toggleTocLaunchIndex:' + toc_id).innerHTML = result.menuItem;	  		
		  }
		 else
		 {
		 	new page.InlineConfirmation("error", result.errorMessage, false ); 
		 } 	    		
	  }
	});
  },  
    
  toggleItemGuestAccess: function( toc_id )
  { 
    var url = this.menuActionUrl + "?method=modifyGuestAccessibility&course_id="+course_id+"&toc_id="+toc_id+"&retUrl="+escape(document.location.href);
	window.location.href = url;
  },
   
  toggleItemObserverAccess: function( toc_id )
  {
    var url = this.menuActionUrl + "?method=modifyObserverAccessibility&course_id="+course_id+"&toc_id="+toc_id+"&retUrl="+escape(document.location.href);
	window.location.href = url;
  },
    
  renameItem: function( toc_id, targetType )
  {
   var subHeaderId = 'paletteItem:' + toc_id; 
   this.renameTocId = toc_id;
   if(targetType)
   {
     this.renameTargetType = targetType;
     var val = $(subHeaderId).down('h3').down('span').innerHTML;
     $('renameSubHeaderInputBox').value = val;
     Position.clone($(subHeaderId).down('h3').down('span'),$("renameSubHeaderForm"),{ setLeft: true, setTop: true, setWidth: false, setHeight: false } );   
   }
   else
   {
     this.renameTargetType = '';
     var val = $(subHeaderId).down('a',0).down('span',0).innerHTML;
     $('renameSubHeaderInputBox').value = val;
     Position.clone($(subHeaderId).down('a',0).down('span',0),$("renameSubHeaderForm"),{ setLeft: true, setTop: true, setWidth: false, setHeight: false } );   
   }   
   $("renameSubHeaderForm").setStyle({display : 'block'});
   if (!this.modalOverlay)
   {
   	this.modalOverlay = new modalOverlay( $("renameSubHeaderForm") );
   }
   this.modalOverlay.setDisplay( true );
   $("renameSubHeaderInputBox").focus(); 
   $("renameSubHeaderInputBox").select();    
  }, 
  
  onKeyDown: function( event )
  {
	if (event.keyCode == Event.KEY_ESC)
	{
	    Event.stop( event );
	    this.cancelRename();
	}

	else if(event.keyCode == Event.KEY_RETURN){
		Event.stop( event );
		this.saveRenamedSubHeaderItem();			
	}
  },
  
  cancelRename: function()
  {
  	this.modalOverlay.setDisplay( false );
    $("renameSubHeaderForm").setStyle({display : 'none'}); 
  },
    
  saveRenamedSubHeaderItem: function()
  {
  	var toc_id = this.renameTocId;
  	var new_name = $("renameSubHeaderInputBox").value;
  	
  	if(!new_name.blank())
  	{  	
	  	var subHeaderId = 'paletteItem:' + toc_id;
	  	new Ajax.Request(this.menuActionUrl + '?method=renameSubHeader&course_id='+course_id+'&toc_id='+toc_id+'&new_name='+encodeURIComponent(new_name), {
	  	  onSuccess: function(transport, json) {  		  		
	  		var result = transport.responseText.evalJSON( true );
	  		if ( result.success == "true" )
			  {
			  	var newValue = $('renameSubHeaderInputBox').value;
			  	$('renameSubHeaderInputBox').value = '';
		  		$("renameSubHeaderForm").setStyle({display : 'none'}); 
		  		if(this.renameTargetType == "subheader")
		  		{
			  	  $(subHeaderId).down('h3').down('span').innerHTML = newValue;
		  		}
		  		else
		  		{
		  		  $(subHeaderId).down('a',0).down('span',0).innerHTML = newValue; 	
		  		}
			  }
			 else
			 {
			 	$("renameSubHeaderForm").setStyle({display : 'none'}); 
			 	new page.InlineConfirmation("error", result.errorMessage, false ); 
			 } 	    		
	  		 this.modalOverlay.setDisplay( false );
		  }.bind(this)
		});  
  	}
  	else
  	{
  		this.cancelRename();
  	}  
  },
  
  _afterModifyItem: function ( result)
  {
  	$('observerEnabledId').removeAttribute("checked");
	$('guestEnabledId').removeAttribute("checked");
  },
  
  _afterModifyExternalLinkItem: function ( result)
  {
  	var tocId = 'paletteItem:' + $('modifyExternalLinkFormTocId').value; 
    $(tocId).down('a').setAttribute("href",result.linkUrl);  	
  },

  _addNewMenuItem: function( result )
  {
    var newItem = result.returnData;
    var template = courseMenu.Util.getTocItemTemplate( newItem.type, newItem.enabled == 'false', newItem.empty == 'true', this.menuGeneratorUrl );
    // create the appropriate html for the menu item using a template and the returned data, 
    // then add it to the bottom of the coursemenu
    var syntax = /(^|.|\r|\n)(\<\&=\s*(\w+)\s*\&\>)/; //matches symbols like '<&= field &>'
	var t = new Template( template, syntax );
	var d = t.evaluate( newItem );
	$('courseMenuPalette_contents').insert({bottom: d});
	
    // add a select option for the item to the accessibleToolSelect
    var sel = $('courseMenuPalette_pageListReorderControlSelect');
    var itemName = newItem.name;
    if ( newItem.type == 'SUBHEADER' )
      itemName = page.bundle.getString("subheaderColonStr", itemName);

    sel.options[sel.length] = new Option( itemName, newItem.id );
	
	// re-init DND by disabling and enabling it so new item is dragable
	var dnd = dragdrop.controllers.find( function( dndController )
	{
	  return ( dndController.itemContainer && dndController.itemContainer.id == 'courseMenuPalette_contents');	  
	}.bind(this));
	dnd.disableDragAndDrop();
	dnd.enableDragAndDrop();
	dnd.calculateItemOrder();
	
	// add behavior to context menu of new item 
	var items = $('courseMenuPalette_contents').childNodes;
	var lastItem = items[items.length-1];
	var contextMenu = lastItem.down( ".contextMenuContainer" );
	if ( contextMenu )
	{
	  new page.ContextMenu( contextMenu );
	}
  },

  _showCourseMenuInWindow: function( event )
  {
    if ( event )
    {
      Event.stop( event );
    }
    lpix = screen.width - 800; 
    remote = window.open('/webapps/blackboard/content/courseMenu.jsp?course_id='+course_id+'&newWindow=true', 'newwin', 'width=220,height=440,resizable=yes,scrollbars=yes,status=no,top=20,left='+lpix); 
    if (remote != null) 
    { 
      remote.focus(); 
      if (remote.opener == null) remote.opener = self; 
      window.top.name = 'bbWin';
      //hack for IE
      if(top.attachEvent)
      {
         top.attachEvent("onunload",function(){ if ( window.remote) remote.close();}); 
      }
      else
      {
         Event.observe(top, "unload", function(){ if ( window.remote) remote.close();});    
      }   
    } 
  },

  _showCourseLinkPicker: function( )
  {
    lpix = screen.width - 800; 
    remote = window.open('/webapps/blackboard/execute/course/courseMapPicker?displayMode=courseLinkPicker&course_id='+course_id, 'picker_browse', 'width=250,height=350,resizable=yes,scrollbars=yes,status=yes,top=20,left='+lpix); 
    if (remote != null) 
    { 
      remote.focus(); 
      if (remote.opener == null) remote.opener = self; 
      remote.opener.inputItemPathToSet = $('linkLocation');     
      remote.opener.inputItemPKToSet = $('linkId');     
      remote.opener.inputItemTypeToSet = $('linkType');     
      remote.opener.callBack = this._linkPickerCallback.bind( this );     
      window.top.name = 'bbWin'; 
    } 
  },
  
  _showModifyCourseLinkPicker: function( )
  {
    lpix = screen.width - 800; 
    remote = window.open('/webapps/blackboard/execute/course/courseMapPicker?displayMode=courseLinkPicker&course_id='+course_id, 'picker_browse', 'width=250,height=350,resizable=yes,scrollbars=yes,status=yes,top=20,left='+lpix); 
    if (remote != null) 
    { 
      remote.focus(); 
      if (remote.opener == null) remote.opener = self; 
      remote.opener.inputItemPathToSet = $('modifiedLinkLocation');     
      remote.opener.inputItemPKToSet = $('modifiedLinkId');     
      remote.opener.inputItemTypeToSet = $('modifiedLinkType');     
      remote.opener.callBack = this._ModifyLinkPickerCallback.bind( this );     
      window.top.name = 'bbWin'; 
    } 
  },
  
  _ModifyLinkPickerCallback: function( )
  {
		flyoutform.flyoutForms[ 'modifyCourseLinkForm' ].updateSubmitButtonEnable();
  },  

  _linkPickerCallback: function( )
  {
		flyoutform.flyoutForms[ 'addCourseLinkForm' ].updateSubmitButtonEnable();
  },
  
  _showDetailView: function( event )
  {
    if ( event )
    {
      Event.stop( event );
    }
    
    if ( !this.detailViewLink.hasClassName('active') )
    {
      CourseMenuDWRFacade.setMenuDisplayMode(course_id, true);
    }
    
    if ( this.quickViewLink )
    {
      this.quickViewLink.removeClassName('active');
    }
    this.detailViewLink.addClassName('active');
    this.detailViewLink.hide();
    this.detailViewLink2.addClassName('active');
    this.detailViewLink2.show();

    // set the curently active palette contents container so expand/collapse on palette will work
    page.PaletteController.setActivePaletteContentsContainer( "courseMenuPalette", this.detailViewContainer );

    var keyboardDndLink = $('courseMenuPalette_reorderControlLink');
    if ( keyboardDndLink )
    {
      keyboardDndLink.up().hide();
    }
    var addItemLink = $('addCmItem');
    if ( addItemLink )
    {
      addItemLink.hide();
    }
    this.quickViewContainer.hide();
    this.detailViewContainer.show();
    
    if ( this.tree == null || this.editMode )
    {
      var displayMode = "courseMenu";
      if ( this.inNewWindow )
      {
        displayMode = "courseMenu_newWindow";
      }
      this.tree = new dynamictree.Tree( this.detailViewContainer, null, '/webapps/blackboard/execute/course/menuFolderViewGenerator', 'course_id='+course_id+'&displayMode='+displayMode+'&editMode='+this.editMode, true );
    }
    
  },
  
  _detailViewExpandAll: function( event )
  {
    Event.stop( event );
    if ( this.tree )
    {
      this.tree.expandAll();
    }
  },
  
  _detailViewCollapseAll: function( event )
  {
    Event.stop( event );
    if ( this.tree )
    {
      this.tree.collapseAll();
    }
  },
  
  _showQuickView: function( event )
  {
    if ( event )
    {
      Event.stop( event );
    }
    
    this.quickViewLink.addClassName('active');

    // set the curently active palette contents container so expand/collapse on palette will work
    page.PaletteController.setActivePaletteContentsContainer( "courseMenuPalette", this.quickViewContainer );

    if ( this.detailViewLink )
    {
      this.detailViewLink.removeClassName('active');
      this.detailViewLink.show();
      this.detailViewLink2.removeClassName('active');
      this.detailViewLink2.hide();
    }
    var keyboardDndLink = $('courseMenuPalette_reorderControlLink');
    if ( keyboardDndLink )
    {
      keyboardDndLink.up().show();
    }
    var addItemLink = $('addCmItem');
    if ( addItemLink )
    {
      addItemLink.show();
    }
    this.quickViewContainer.show();
    this.detailViewContainer.hide();
    
    CourseMenuDWRFacade.setMenuDisplayMode(course_id, false);
  },
  
  _refreshMenu: function( event )
  {
    Event.stop( event );
    var loc = window.location + '';
    var hashLoc = loc.indexOf("#");
    if ( hashLoc >= 0 )
    {
      loc = loc.substring(0, hashLoc);
    }
    if ( loc.indexOf('refreshCourseMenu') < 0 )
    {        
      if ( loc.indexOf('?') >= 0 )
      {
        loc = loc + '&refreshCourseMenu=true';  
      }
      else
      {
        loc = loc + '?refreshCourseMenu=true';
      }
    }
    window.location = loc;
  },
  
  _quickEnrollToggle: function( event )
  {
    Event.stop( event );
    if ( this.quickEnrollLink.hasClassName("quickEnrolled") )
    {
      if ( confirm( confirmQuickUnenrollMsg ) )
      {
        window.location = this.menuActionUrl + '?method=quickEnrollToggle&course_id='+course_id+'&retUrl='+escape(document.location.href);
      }
    }
    else
    {
      if ( confirm( confirmQuickEnrollMsg ) )
      {    
      	window.location = this.menuActionUrl + '?method=quickEnrollToggle&course_id='+course_id+'&retUrl='+escape(document.location.href);
      }
    }
  },
  
  initPaletteState: function()
  {
    UserDataDWRFacade.getStringTempScope( 'courseMenuPalette_contents' + course_id, this.getCourseMenuPaletteStateResponse.bind( this ) );
    UserDataDWRFacade.getStringTempScope( 'myGroups_contents' + course_id, this.getMyGroupsPaletteStateResponse.bind( this ) );
    UserDataDWRFacade.getStringTempScope( 'controlPanelPalette_contents' + course_id, this.getControlPanelPaletteStateResponse.bind( this ) );
  }, 
  
  getCourseMenuPaletteStateResponse : function ( paletteState  ) 
  {
    this.getPaletteStateResponse( paletteState, 'courseMenuPalette' );
  },
  
  getMyGroupsPaletteStateResponse : function ( paletteState  ) 
  {
    this.getPaletteStateResponse( paletteState, 'myGroups' );
  },
  
  getControlPanelPaletteStateResponse : function ( paletteState  ) 
  {
    this.getPaletteStateResponse( paletteState, 'controlPanelPalette' );
  },
  
  getPaletteStateResponse : function ( paletteState, id )
  { 
    if ( $(id) == null ) //If the palette doesn't exist on the page, don't do anything
    {
      return;
    }
  
    var paletteItem = $(page.PaletteController.getDefaultContentsContainerId(id));
    
    // if the course menu palette, get the currently active contents container
    if( id == 'courseMenuPalette' )
    {
      // get the active palette content container element (List VS Folder view)
      paletteItem = this.quickViewContainer;
      if( this.detailViewLink && this.detailViewLink.hasClassName('active') )
        paletteItem = this.detailViewContainer;    
    }

    var originalPaletteState = paletteItem.style.display;
    if( originalPaletteState != 'none' && originalPaletteState != 'block' )
    {
      originalPaletteState = 'block';
    }
    var cachedPaletteState = 'block';
    if ( paletteState.length > 0 ) 
    {
      if ( paletteState == 'none' || paletteState == 'block' )
        cachedPaletteState = paletteState; 
       else 
         cachedPaletteState = 'block';
    } 
    
    if ( originalPaletteState != cachedPaletteState ) 
    {
      //because we want the menu to be in the cached state, 
      //we pass in the opposite so that expandCollapse changes the menu state.
      // pass true for 2nd param to supress persisting state on init
      page.PaletteController.hideNavPalette(id, true);
    } 
  }  
     
};  

function collapsePalettesForGroupSpace(groupId)
{
  // collapse the course menu palette
  var activePalContentsContainer = page.PaletteController.setActivePaletteContentsContainer("courseMenuPalette");
  activePalContentsContainer.style.display="block";
  page.PaletteController.hideNavPalette('courseMenuPalette');
      
  // expand the group in the my groups palette that was clicked
  // the my groups palette may not exist on the doc yet if current user isn't part of a group
  var myGroupsPalette = $('myGroups_contents');
  if( myGroupsPalette )
  {
    myGroupsPalette.style.display="none";
    page.PaletteController.hideNavPalette('myGroups');

    var groupmenulink = ('mygroups.' + groupId + '_groupExpanderLink');
    var itemExpanderObj = page.ItemExpander.itemExpanderMap[groupmenulink];
    if( itemExpanderObj && !itemExpanderObj.expanded )
    {
      itemExpanderObj.onToggleClick();
    }
  }  
  
  // collapse the control panel palette
  if( $('controlPanelPalette_contents') != null ) 
  {
    $('controlPanelPalette_contents').style.display="block";
    page.PaletteController.hideNavPalette('controlPanelPalette');
  }
}


