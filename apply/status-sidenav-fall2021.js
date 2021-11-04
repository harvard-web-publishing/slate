var parts = document.querySelectorAll('.col-2 .part');
  var listItems = [];
  var sidebar = document.getElementById('panel-anchors');
  
  function createNaveListItems(documentParts, listItemsArray) {
    documentParts.forEach(function(part) {
      var partId = part.id;
      var partHeading = part.getElementsByTagName('h3')[0];

      if(partHeading) {
        var partTitle = partHeading.innerHTML;
        var listItem = document.createElement('li');
        var anchor = document.createElement('a');
        var anchorLink = '#' + partId;
        var anchorText = document.createTextNode(partTitle);
  
        anchor.setAttribute('href', anchorLink );
        anchor.appendChild(anchorText);
        listItem.appendChild(anchor);
  
        listItem.addEventListener("click", function(e){
          //prevent tabs from reloading and scroll to the element
          e.preventDefault();
          var yOffset = -90; 
          var yPosition = part.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({top: yPosition , behavior: 'smooth'});
        })  
  
        listItemsArray.push(listItem);
      }

     });
  }

  
  
 
  function createNav(anchorsList, navParentElement) {
    var navigation = document.createElement('nav');
    var navUl = document.createElement('ul');

    anchorsList.forEach(function(anchor){
        navUl.appendChild(anchor);
      }
    )
    
     navigation.appendChild(navUl);
     navParentElement.appendChild(navigation);
  }
  
  createNaveListItems(parts, listItems);
  createNav(listItems, sidebar);