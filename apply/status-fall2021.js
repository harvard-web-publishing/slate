/* ADD OR REMOVE FIXED CLASS TO NAVBAR WHEN SCROLLED */

var scrollPosition = window.scrollY;
var logoContainer = document.getElementById("subtabs--container");

window.addEventListener("scroll", function () {
  scrollPosition = window.scrollY;

  if (scrollPosition >= 30) {
    logoContainer.classList.add("fixed");
  } else {
    logoContainer.classList.remove("fixed");
  }
});

/* BUILD THE SIDE NAVIGATION  */

function createNaveListItems(documentParts, listItemsArray) {
    documentParts.forEach(function (part) {
      var partId = part.id;
      var partHeading = part.getElementsByTagName("h3")[0];
      var partTitle = partHeading.innerHTML;
      var listItem = document.createElement("li");
      var anchor = document.createElement("a");
      var anchorLink = "#" + partId;
      var anchorText = document.createTextNode(partTitle);

      anchor.setAttribute("href", anchorLink);
      anchor.appendChild(anchorText);
      listItem.appendChild(anchor);
      listItem.addEventListener("click", function(e){
        //prevent tabs from reloading and scroll to the element
        e.preventDefault();
        var yOffset = -90; 
        var yPosition = part.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: yPosition , behavior: 'smooth'});
      })

      if(listItemsArray.length < documentParts.length) {
        listItemsArray.push(listItem);
      }
      
    });
  }

  function createNav(anchorsList, navParentElement) {
    var navigation = document.createElement("nav");
    var navUl = document.createElement("ul");

    anchorsList.forEach(function (anchor) {
      navUl.appendChild(anchor);
    });

    navigation.appendChild(navUl);
    navParentElement.appendChild(navigation);
  }

  function loadNav(state, documentParts, navListItems, navContainer) {
    if (state) {
      createNaveListItems(documentParts, navListItems);
      createNav(navListItems, navContainer);
    }
  }


window.onload = function () {
  var parts;
  var listItems = [];
  var sidebar;
  var tabs = document.querySelectorAll("a[data-tab]");

  var checkExists = setInterval(function () {
    //check if extists
    parts = document.querySelectorAll(".col-2 .part");
    sidebar = document.getElementById("panel-anchors");

    var isLoaded = (parts.length > 0 && sidebar) ? true : false;

    loadNav(isLoaded, parts, listItems, sidebar);

  }, 100); // check every 100ms

  //clear interval
  setTimeout(function(){
    clearInterval(checkExists)
  }, 1000);


  //load nav when tabs clicked
  tabs.forEach(function(tab) {
      
      tab.addEventListener("click", function(){

        parts = null;
        sidebar = null;
        listItems = [];
        
        var checkExists = setInterval(function () {
    
          parts = document.querySelectorAll(".col-2 .part");
          sidebar = document.getElementById("panel-anchors");
    
          var isLoadedAgain = (parts.length > 0 && sidebar && !sidebar.innerHTML) ? true : false;
    
          loadNav(isLoadedAgain, parts, listItems, sidebar);
     
        }, 100);
    
    //clear interval
      setTimeout(function(){
        clearInterval(checkExists)
      }, 1000);

      })

  })

};
