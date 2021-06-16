var elem;
var panzoom;
const mapLegend = document.querySelector("#map-legend");
const mapNav = document.querySelector("#map-nav");

function clearVenues(){
    allVenues = document.querySelectorAll('path[id^="Venue"]');
    
    for (let i = 0; i < allVenues.length -1; i++) {
        allVenues[i].style.opacity = 1;
        allVenues[i].setAttribute("fill", "lightgrey");
        allVenues[i].setAttribute("stroke", "lightgrey");
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
    panzoom.zoom(0.1);

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
    myVenue.setAttribute("stroke", "#24489F");
    myVenue.style.opacity = 1;
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
        minScale: 1,
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
        console.log("legend click")
    });
}