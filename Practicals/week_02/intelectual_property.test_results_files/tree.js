/**
 *  This module implements a dynamic tree that can be lazily loaded using Ajax
 */
var dynamictree = {};

/**
 *  Images used in the tree
 */
dynamictree.Images = 
{
  EMPTY: '/images/ci/icons/nlstree/blank.gif',
  NONE: '/images/ci/icons/nlstree/lineints.gif',
  NONE_LAST: '/images/ci/icons/nlstree/lineang.gif',
  MINUS: '/images/ci/icons/nlstree/minusb.gif',
  MINUS_LAST: '/images/ci/icons/nlstree/minusnb.gif',
  PLUS: '/images/ci/icons/nlstree/plusb.gif',
  PLUS_LAST: '/images/ci/icons/nlstree/plusnb.gif'
};

/**
 * Types of tree nodes
 * 
 * JSON format of tree nodes:
 *
 * var myNode = {
 *  type: "ROOT"|"NODE"|"HEADER"|"SEPARATOR",
 *  id: "an id to uniquely identify this node, passed to dynamic loading code when the node is expanded",
 *  expanded: true/false (whether this node is initially expanded),
 *  icon: "URL to an icon to display for this node",
 *  contents: "HTML for the contents of the node (usually a link)",
 *  hasChildren: "Whether this node has/can have children",
 *  children: [array of nodes]
 * }
 */
dynamictree.NodeType = 
{
  ROOT: 'ROOT', //the root of a tree, is invisible
  NODE: 'NODE', //a node in a tree
  HEADER: 'HEADER', //a header in a tree
  SEPARATOR: 'SEPARATOR' //a separator in a tree
}

dynamictree.Tree = Class.create();
dynamictree.Tree.prototype = 
{
  /**
   * Creates a new tree.
   *
   * @param container the page element that will contain the tree
   * @param initialTrees a list of ROOT type nodes to initially populate the tree with
   * @param generatorUrl URL to use to dynamically load tree nodes
   * @param contextParameters additional URL parameters to pass to the generator.
   */
  initialize: function( container, initialTrees, generatorUrl, contextParameters, sessionSticky )
  {
    this.container = $(container);
    this.isDynamic = ( generatorUrl != null );
    this.generatorUrl = generatorUrl;
    this.sessionSticky = false;
    if ( sessionSticky != null ) 
        this.sessionSticky = sessionSticky;
    if ( contextParameters != null )
    {
      this.contextParameters = contextParameters.toQueryParams();
    }
    else
    {
      this.contextParameters = {};
    }
    
    this.expandStr = page.bundle.getString("dynamictree.expand");
    this.collapseStr = page.bundle.getString("dynamictree.collapse");
    
    if ( initialTrees != null )
    {
      this.initTree( initialTrees );
    }
    else if ( this.isDynamic ) //dynamically load the initial tree if none is specified
    {
      this.loadInitialTree();
    }
  },
  
  /**
   *  Dynamically load the initial tree (since one wasn't specified)
   */
  loadInitialTree: function()
  {
    var params = Object.extend({ initTree: "true" }, this.contextParameters);
    new Ajax.Request( this.generatorUrl,
    {
      method: 'post',
      parameters: params,
      requestHeaders: { cookie: document.cookie },
      onSuccess: this.afterInitLoad.bind( this )
    });
  },
  
  /**
   * Callback invoked after the whole-tree-load Ajax call returns.
   */
  afterInitLoad: function( req )
  {
    try
    {
      var result = req.responseText.evalJSON( true );
      if ( result.success != 'true' )
      {
        new page.InlineConfirmation("error", result.errorMessage, false );
      }
      else
      {
        this.initTree( result.children );
      }
    }
    catch ( e )
    {
      //Invalid response
    }
  },
  
  /**
   *  Draw the whole tree using the specified array of root nodes.
   */
  initTree: function( treesJson )
  {
    var treeHtml = '';
	for ( var i = 0; i < treesJson.length; i++ )
	{
	  treeHtml += this.getHtmlForNode( treesJson[i], i == (treesJson.length - 1) );
	}
	
	this.container.innerHTML = treeHtml;
	this.container.getElementsBySelector("img.treeNodeToggler").each( function( toggler )
	{
	  var toggleLink = toggler.up('a');
	  var toggleArea = toggler.up('li').down('ul');
	  Event.observe( toggleLink, "click", this.onNodeToggleClick.bindAsEventListener( this, toggleLink, toggler, toggleArea ) );
	}.bind(this));

	this.container.getElementsBySelector("h3").each( function( toggler )
	{
	  var toggleLink = toggler.down('a');
	  var toggleArea = toggler.nextSibling;
	  Event.observe( toggleLink, "click", this.onNodeToggleClick.bindAsEventListener( this, toggleLink, toggler, toggleArea ) );
	}.bind(this));
	
  },
  
  /**
   * Collapse all the nodes in the tree
   */
  collapseAll: function( )
  {
    if ( this.sessionSticky ) 
      {
        var firstParams = Object.extend({ collapseAll: "true" }, this.contextParameters );
        var params = Object.extend({ expandAll: "true" }, firstParams );
        new Ajax.Request( this.generatorUrl,
        {
          method: 'post',
          parameters: params,
          requestHeaders: { cookie: document.cookie },
          onSuccess: this.collapseCallBack.bind( this )
        });   
      }
    this.container.getElementsBySelector("img.treeNodeToggler").each( function( toggler )
    {
      if ( toggler.src.indexOf( dynamictree.Images.NONE ) < 0 && toggler.src.indexOf( dynamictree.Images.NONE_LAST ) < 0 )
      {
	      var toggleLink = toggler.up('a');
	      var toggleArea = toggler.up('li').down('ul');
	      if ( toggler.src.indexOf( dynamictree.Images.MINUS ) >= 0 )
	      {
	        toggler.src = dynamictree.Images.PLUS;
	      } else if ( toggler.src.indexOf( dynamictree.Images.MINUS_LAST ) >= 0 )
	      {
	        toggler.src = dynamictree.Images.PLUS_LAST;      
	      }
	      toggler.alt = this.expandStr;
	      toggleLink.title = this.expandStr;
	      toggleArea.hide();
      }
    }.bind(this));
  },
  
  /**
   * Expand all the nodes in the tree.
   */
  expandAll: function( )
  {
    if ( this.isDynamic ) // If it's dynamic we load the entire tree from the server
    {
      var params = Object.extend({ expandAll: "true" }, this.contextParameters);
      new Ajax.Request( this.generatorUrl,
      {
        method: 'post',
        parameters: params,
        requestHeaders: { cookie: document.cookie },
        onSuccess: this.afterInitLoad.bind( this )
      });      
    }
    else
    {
      this.container.getElementsBySelector("img.treeNodeToggler").each( function( toggler )
      {
        var toggleLink = toggler.up('a');
        var toggleArea = toggler.up('li').down('ul');
        var hasChildren = (toggleArea.down('li') != null);
        if ( hasChildren )
        {       
          if ( toggler.src.indexOf( dynamictree.Images.PLUS ) )
          {
            toggler.src = dynamictree.Images.MINUS;
          } else if ( toggler.src.indexOf( dynamictree.Images.PLUS_LAST ) )
          {
            toggler.src = dynamictree.Images.MINUS_LAST;      
          }
          toggler.alt = this.collapseStr;
          toggleLink.title = this.collapseStr;
          toggleArea.show();
        }
        else
        {
          if ( toggler.src.indexOf( dynamictree.Images.PLUS ) )
          {
            toggler.src = dynamictree.Images.EMPTY;
          } else if ( toggler.src.indexOf( dynamictree.Images.PLUS_LAST ) )
          {
            toggler.src = dynamictree.Images.EMPTY_LAST;      
          }
          toggler.alt = '';
          toggleLink.title = '';
        }
      }.bind(this));    
    }
  },
  
  /**
   *  Event handler for when a use clicks on the [+/-] toggle images
   *  @param event the dom event
   *  @param toggleLink the link used to toggle the node
   *  @param toggleImage the expand/collapse image element for this node
   *  @param toggleArea the html element containing the children of this node.
   */
  onNodeToggleClick: function( event, toggleLink, toggleImage, toggleArea )
  {
    if ( toggleImage.src == null ) 
    {
        if ( toggleImage.className == "treeSubhead-collapsed" )
        {
		  var hasChildren = (toggleArea.down("li") != null)
	      if ( !hasChildren && this.isDynamic )
	      {
	        var id = toggleLink.up('h3').id;
	        var params = Object.extend({ itemId: id }, this.contextParameters);
	        new Ajax.Request( this.generatorUrl,
	        {
	          method: 'post',
	          parameters: params,
	          requestHeaders: { cookie: document.cookie },
	          onSuccess: this.afterNodeLoad.bind( this, toggleLink, toggleImage, toggleArea )
	        });
	      }
	      toggleImage.className = "";
	      toggleArea.show();
	   } else 
	   {
	   	  toggleImage.className = "treeSubhead-collapsed";
	   	  toggleArea.hide();
	   }
    }
    else
    { 
	    if (  toggleImage.src.indexOf( dynamictree.Images.MINUS ) >= 0 || toggleImage.src.indexOf( dynamictree.Images.MINUS_LAST ) >= 0 )
	    {
	      toggleArea.hide();
	      if ( this.sessionSticky ) 
	      {
	        var id = toggleLink.up('li').id;
	        var firstParams = Object.extend({ itemId: id }, this.contextParameters );
	        var params = Object.extend({ collapse: "true" }, firstParams );
	        new Ajax.Request( this.generatorUrl,
	        {
	          method: 'post',
	          parameters: params,
	          requestHeaders: { cookie: document.cookie },
	          onSuccess: this.collapseCallBack.bind( this  )
	        });      
	     }
	      if ( toggleImage.src.indexOf( dynamictree.Images.MINUS ) >= 0 )
	      {
	        toggleImage.src = dynamictree.Images.PLUS;
	      }
	      else
	      {
	        toggleImage.src = dynamictree.Images.PLUS_LAST;
	      }
	      toggleImage.alt = this.expandStr;
	      toggleLink.title = this.expandStr;
	    }
	    else if ( toggleImage.src.indexOf( dynamictree.Images.PLUS ) >= 0 || toggleImage.src.indexOf( dynamictree.Images.PLUS_LAST ) >= 0 )
	    {
	      var hasChildren = (toggleArea.down("li") != null)
	      if ( !hasChildren && this.isDynamic )
	      {
	        var id = toggleLink.up('li').id;
	        var params = Object.extend({ itemId: id }, this.contextParameters);
	        new Ajax.Request( this.generatorUrl,
	        {
	          method: 'post',
	          parameters: params,
	          requestHeaders: { cookie: document.cookie },
	          onSuccess: this.afterNodeLoad.bind( this, toggleLink, toggleImage, toggleArea )
	        });
	      }
	      else 
	      {
	        if ( toggleImage.src.indexOf( dynamictree.Images.PLUS ) >= 0 )
	        {
	          if ( !hasChildren )
	          {
	            toggleImage.src = dynamictree.Images.NONE;
	            toggleImage.alt = '';
	            toggleLink.title = '';
	          }
	          else
	          {
	            toggleImage.src = dynamictree.Images.MINUS;
	            toggleImage.alt = this.collapseStr;
	            toggleLink.title = this.collapseStr;
	            toggleArea.show();
	          }
	        }
	        else
	        {
	          if ( !hasChildren )
	          {
	            toggleImage.src = dynamictree.Images.NONE_LAST;
	            toggleImage.alt = '';
	            toggleLink.title = '';
	          }
	          else
	          {
	            toggleImage.src = dynamictree.Images.MINUS_LAST;
	            toggleImage.alt = this.collapseStr;
	            toggleLink.title = this.collapseStr;
	            toggleArea.show();
	          }
	        }
	      }
     }
    }  
    Event.stop( event );
  },
  /**
    Callback for the Collapse Method:Not doing anything 
  **/
  collapseCallBack: function( event)
  {
  },
  /**
   *  Callback invoked after a node is lazily loaded in (after the [+] is clicked)
   *  @param toggleLink the link used to toggle the node
   *  @param toggleImage the expand/collapse image element for this node
   *  @param toggleArea the html element containing the children of this node.
   *  @param req the XMLHttpRequest used to load the nodes
   */
  afterNodeLoad: function( toggleLink, toggleImage, toggleArea, req )
  {
    try
    {
      var result = req.responseText.evalJSON( true );
      if ( result.success != 'true' )
      {
        new page.InlineConfirmation("error", result.errorMessage, false );
      }
      else
      {
        var children = result.children;
        var hasChildren = (children != null && children.length > 0);
        if ( hasChildren )
        {
          var childrenHtml = '';
          for ( var i = 0; i < children.length; i++ )
          {
            childrenHtml += this.getHtmlForNode( children[i], i == (children.length - 1) );
          }
          toggleArea.innerHTML = childrenHtml;
          toggleArea.show();
          toggleArea.getElementsBySelector("img.treeNodeToggler").each( function( toggler )
          {
            var tLink = toggler.up('a');
            var tArea = toggler.up('li').down('ul');
            Event.observe( tLink, "click", this.onNodeToggleClick.bindAsEventListener( this, tLink, toggler, tArea ) );
          }.bind(this));          
        }
        
        if ( toggleImage.src.indexOf( dynamictree.Images.PLUS ) >= 0 ) 
        {
          if ( !hasChildren )
          {
            toggleImage.src = dynamictree.Images.NONE;
            toggleImage.alt = '';
            toggleLink.title = '';
          }
          else
          {
            toggleImage.src = dynamictree.Images.MINUS;
            toggleImage.alt = this.collapseStr;
            toggleLink.title = this.collapseStr;
          }
        }
        else
        {
          if ( !hasChildren )
          {
            toggleImage.src = dynamictree.Images.NONE_LAST;
            toggleImage.alt = '';
            toggleLink.title = '';
          }
          else
          {
            toggleImage.src = dynamictree.Images.MINUS_LAST;
            toggleImage.alt = this.collapseStr;
            toggleLink.title = this.collapseStr;
          }
        }    
        
        if ( !hasChildren ) //No link anymore
        {
          var parent = toggleLink.up();
          Element.remove( toggleLink );
          parent.insertBefore( toggleImage, parent.firstChild );
        }            
      }
    }
    catch ( e )
    {
      //Invalid response
    }
  },
  
  /**
   *  Generates the HTML for a tree node
   */
  getHtmlForNode: function( node, isLast )
  {
    var result = '';
    if ( node.type == dynamictree.NodeType.ROOT )
    {
      result = '<ul class="tree">';
      var children = node.children;
      if ( children != null && children.length > 0 )
      {
       for ( var i = 0; i < children.length; i++ )
       {
         result += this.getHtmlForNode( children[i], i == (children.length - 1) );
       }
      }
      result += '</ul>';
    }
    else if ( node.type == dynamictree.NodeType.HEADER )
    {
      var colors = "";
  	  if(node.areaColor != null && node.areaColor != "")
  		 colors += node.areaColor; 
  		
  	  if(node.textColor != null && node.textColor != "")
  		 colors += node.textColor;
  		
  	  result = '<li class="subhead"><h3 ';
  		
  	  result +=  'id="' + node.id +'"'; 
  	  result +='class="treeSubhead-collapsed"><a href="#"		style="'+colors+'">' + node.contents + '</a></h3>';
	  var children = node.children;
	  if ( children != null && children.length > 0 )
	  {
	      if ( node.expanded )
	      {
	        result += '<ul>';
	      }
	      else
	      {
	        result += '<ul style="display:none;">';
	      }  		
	       for ( var i = 0; i < children.length; i++ )
	       {
	         result += this.getHtmlForNode( children[i], i == (children.length - 1) );
	       }
	       result += "</ul>";
	  }
	  result += '</li>';
	}    
    else if ( node.type == dynamictree.NodeType.NODE )
    {
      if ( isLast )
      {
        result = '<li class="last" id="'+node.id+'">';
      }
      else
      {
        result = '<li id="'+node.id+'">';
      }    
      var children = node.children;
      var hasChildren = node.hasChildren;
      if ( !hasChildren || ( children != null && children.length > 0 ) )
      {
        if ( children.length > 0 )
        {
          if ( node.expanded )
          {
            var img;
            if ( isLast ) img = dynamictree.Images.MINUS_LAST;
            else img = dynamictree.Images.MINUS;
            result += '<a href="#" class="toggle" title="'+this.collapseStr.escapeHTML()+'"><img src="'+img+'" align="absmiddle" class="treeNodeToggler" width="18" height="18" alt="'+this.collapseStr.escapeHTML()+'"></a>';
          }
          else
          {
            var img;
            if ( isLast ) img = dynamictree.Images.PLUS_LAST;
            else img = dynamictree.Images.PLUS;
            result += '<a href="#" class="toggle" title="'+this.expandStr.escapeHTML()+'"><img src="'+img+'" align="absmiddle" class="treeNodeToggler" width="18" height="18" alt="'+this.expandStr.escapeHTML()+'"></a>';          
          }          
        }
        else
        {
          var img;
          if ( isLast ) img = dynamictree.Images.NONE_LAST;
          else img = dynamictree.Images.NONE;    
          result += '<img src="'+img+'" alt="" align="absmiddle" width="18" height="18">';
        }
      }
      else
      {
        var img;
        if ( isLast ) img = dynamictree.Images.PLUS_LAST;
        else img = dynamictree.Images.PLUS;
        result += '<a href="#" class="toggle" title="'+this.expandStr.escapeHTML()+'"><img src="'+img+'" align="absmiddle" class="treeNodeToggler" width="18" height="18" alt="'+this.expandStr.escapeHTML()+'"></a>';      
      }

      if ( node.icon != null )
      {
        result += '<img align="absmiddle" src="'+node.icon+'" alt="">';
      }
      result += node.contents;
      
      if ( hasChildren )
      {
        if ( children.length > 0 )
        {
          if ( node.expanded )
          {
            result += '<ul>';
          }
          else
          {
            result += '<ul style="display:none;">';
          }
          for ( var i = 0; i < children.length; i++ )
          {
            result += this.getHtmlForNode( children[i], i == (children.length - 1) );
          }
          result += '</ul>';
        }
        else
        {
          result += '<ul style="display:none;"></ul>';
        }   
      }       
      
      result+= '</li>';      
    }
    else if ( node.type == dynamictree.NodeType.HEADER )
    {
      result = '<h3 class="treehead">'+node.contents+'</h3>';
    }
    else if ( node.type == dynamictree.NodeType.SEPARATOR )
    {
      result = '<hr>';
    }
    return result;
  }
};