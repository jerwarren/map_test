var elem;
var panzoom;
const mapLegend = document.querySelector("#map-legend");
const mapNav = document.querySelector("#map-nav");
const venuesContainer = document.querySelector("#venues-container");
const filtersContainer = document.querySelector("#filters-container");
var categories = [];
var venues = [];

var Shuffle, ShuffleElement, ShuffleSizer, shuffleInstance;


function clearVenues(){
    allVenues = document.querySelectorAll('path[id^="Venue"]');
    
    for (let i = 0; i < allVenues.length -1; i++) {
        allVenues[i].style.opacity = 1;
        allVenues[i].setAttribute("fill", "lightgrey");
        allVenues[i].setAttribute("stroke", "black");
        allVenues[i].setAttribute("stroke-width", "0.5");
        
    }

    allPaths = document.querySelectorAll('path[id^="Path"]');
    for (let i = 0; i < allPaths.length; i++) {
        allPaths[i].style.display = "none";
    }
}

function select(venue){

    clearVenues();
    venue = venue.replace("&amp;", "&");

    myVenue = document.querySelector('svg path[id="Venue - '+venue+'"]');
    panzoom.zoom(0.01);

    setTimeout(function(){
        var rect = myVenue.getBoundingClientRect();
        var x = rect.left + rect.width/2;
        var y = rect.top + rect.height/2;
        var mid_y = window.innerHeight / 2;
        var mid_x = window.innerWidth / 2;
        var offset_x = (mid_x - x)/2;
        var offset_y = (mid_y - y)/2;
        
        //console.log(mid_x, mid_y, offset_x, offset_y)
        panzoom.zoomToPoint(2, { clientX: x, clientY: y});
        setTimeout(function(){
            setTimeout(function(){
                panzoom.pan(offset_x, offset_y, {relative: true});
                mapNav.classList.remove("open")
            }, 5)
        }, 5)
        
    }, 50)
    

    myVenue.setAttribute("fill", "#24489F");
    myVenue.setAttribute("stroke", "#ffbc02");
    myVenue.setAttribute("stroke-width", "2");
    myVenue.style.opacity = 1;
}

function categorySelect(filter, element){
    console.log(filter)
    var categoryChips = document.querySelectorAll("#filters-container div");
    console.log(categoryChips)
    categoryChips.forEach(function(chip){
        chip.classList.remove("selected");
    });

    element.classList.add("selected");
    shuffleInstance.filter([filter]);

}
function getPositionXY(element) {
    var rect = element.getBoundingClientRect();
    var x =rect.left + (rect.width/2);
    var y = rect.top + (rect.height/2);
    document.elementFromPoint(x, y).click();
}

function setupZoom(){
    parent = document.querySelector("body");
    elem = document.querySelector('svg');
    panzoom = Panzoom(elem, {
        maxScale: 2,
        minScale: 0.1,
        contain: 'outside',
    })
    elem.addEventListener('panzoomchange', (event) => {
    })

    /*  venues = document.querySelectorAll('svg path[id^="Venue"]');
        venues.forEach(function(venue){
            venue.addEventListener("click", (event) => {
                panzoom.zoomToPoint(2, { clientX: event.clientX, clientY: event.clientY });
            })
    }) */
    
    
    
    setTimeout(function(){
        panzoom.zoom(0.1);
        setTimeout(function(){
            panzoom.pan(-1225, -1520, {animate: true});
        }, 100);
    }, 100);
    
    

    // Panning and pinch zooming are bound automatically (unless disablePan is true).
    elem.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);
    mapLegend.addEventListener('click', function(){
        mapNav.classList.add("open")
    });
    document.querySelector("#close").addEventListener('click',function(){
        mapNav.classList.remove("open");
        mapNav.classList.add("closed");

    })
}

function bootstrap(){
    fetch('tmp-data.json').then(function (response) {
        return response.json();
       
    })
    .then(function(data){
        venues = data.venues[0];
        categories = data.categories[0];
        venuesString = "";
        venues.forEach(function(venue){
            venuesString += `<li class="venue-item sizer" onclick="select('${venue.venueName}');" data-groups='${JSON.stringify(venue.categories).replace("[[", "[").replace("]]","]")}'><i class="material-icons">dining</i>${venue.venueName}</li>`;
        })
        categoriesString = "";
        categories.forEach(function(category){
            categoriesString += `<div onclick="categorySelect('${category}', this)">${category}</div>`;
        })
        venuesContainer.innerHTML = venuesString;
        filtersContainer.innerHTML = categoriesString;

        Shuffle = window.Shuffle;
        ShuffleElement = document.querySelector('#venues-container');

        shuffleInstance = new Shuffle(ShuffleElement, {
        itemSelector: '.venue-item',
        sizer: document.querySelector(".sizer")
        });
        shuffleInstance.filter();
    })

}