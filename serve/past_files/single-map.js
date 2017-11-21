// JavaScript Document

//global variables for overlay map:
var map,
    bingmap,
    countryCode,
    mapSettings = {},
    pinSettings = {},
    markers = [],
    panels = [],
    defaultIcon = {},
    activeIcon = {};//,
    //$ = require('jquery');

$(document).ready(function() {

  //Init the Attraction Overlay map:
  $('#static-map').click( function() {
    livebox('attractions-map');
    //initPOIMap();
    getip();
  });

  $('a.static-map').click( function(e) {
    e.preventDefault();
    livebox('attractions-map');
    //initPOIMap();
    getip();
  })

  $('.attractions-search').click(function(e){
    $('.search.poi-panel').toggleClass('is-open');
  });

  //Attractions Search:
  $('#attractions-search').change( function() {
    AttractionsSearch($(this).val());
  });
  $('#attractions-search').keyup( function() {
    AttractionsSearch($(this).val());
  });

  //POI click:
  $('.poi-desc, .poi-name-cont').click( function() {

    var maptype = urlParam('map');
    if (maptype == 'bing') {

      bingmap = new Microsoft.Maps.Map('#poiMap', {
        credentials: 'ea1QFboXIZokgkFDnxQD~ya5TTKkCPi86SKt5ASRWHg~Ap5KWiQLta7sAu32KxCBL8drMOePrKk46xkpRF61NngyCpbHVI4YcndKkQ3GzwxX',
        center: new Microsoft.Maps.Location($(this).attr('data-latitude'), $(this).attr('data-longitude')),
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        zoom: 14
      });

      var infoWindowContent = '';
      infoWindowContent += '<div class="poi_inside_panel">'+
            '<div class="poi_img">'+
              '<img src="' + $(this).attr('data-media') + '" alt="">'+
            '</div>'+
            '<div class="poi_info_wrapper">'+
              '<div class="poi_inside_title">' + $(this).attr('data-name') + '</div>'+
              '<div class="poi_address">' + $(this).attr('data-address') + '</div>'+
              '<div class="poi_bottom">'+
                //hours+
                '<div class="poi_distance">' +
                  //'<i class="fa fa-map-marker" aria-hidden="true"></i>' + Math.round(distance)+' m'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>';

      var infobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location($(this).attr('data-latitude'), $(this).attr('data-longitude')), {
          visible: true,
          title: $(this).attr('data-name'),
          description: infoWindowContent,
        });
        bingmap.entities.push(infobox);
        infobox.setMap(bingmap);

      //Get Map settings:
      var mapC = document.getElementById('poiMap');

      mapSettings.latitude = mapC.getAttribute('data-latitude');
      mapSettings.longitude = mapC.getAttribute('data-longitude');
      brand = mapC.getAttribute('data-brand');
      logo = mapC.getAttribute('data-brand-logo');

      var pinLayer = new Microsoft.Maps.EntityCollection();
      var infoboxLayer = new Microsoft.Maps.EntityCollection();
      var infobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0), { visible: false, offset: new Microsoft.Maps.Point(0, 20) });
      infoboxLayer.push(infobox);

      $.each(poi.items, function (index, pin) {
        var pinLocation = new Microsoft.Maps.Location(pin.latitude, pin.longitude);
        var newPin = new Microsoft.Maps.Pushpin(pinLocation, { text: pin.name });

        if(pin.address1 != '' && pin.address2 != '') {
          pin.address = pin.address1 + ', ' + pin.address2 + '<br />';
        } else if(pin.address1 != '') {
          pin.address = pin.address1 + '<br />';
        } else if(pin.address2 != '') {
          pin.address = pin.address2 + '<br />';
        } else {
          pin.address = '';
        }
        pin.address += pin.city;
        if(pin.city != '' && pin.country != '')
          pin.address += ', ';
        pin.address += pin.country;


        var infoWindowContent = '';
        infoWindowContent += '<div class="poi_inside_panel">';
        if(pin.img_medium != '') {
          infoWindowContent +=  '<div class="poi_img">'+
                                  '<img src="' + pin.img_medium + '" alt="">'+
                                '</div>';
        }
        infoWindowContent +=  '<div class="poi_info_wrapper">'+
                                '<div class="poi_inside_title">' + pin.name + '</div>'+
                                '<div class="poi_address">' + pin.address + '</div>'+
                                '<div class="poi_bottom">'+
                                  //hours+
                                  '<div class="poi_distance">' +
                                    //'<i class="fa fa-map-marker" aria-hidden="true"></i>' + Math.round(distance)+' m'+
                                  '</div>'+
                                '</div>'+
                              '</div>'+
                            '</div>';

        var infobox = new Microsoft.Maps.Infobox(pinLocation, {
          title: pin.name,
          description: infoWindowContent,
          visible: false
        });
        infobox.setMap(bingmap);

        Microsoft.Maps.Events.addHandler(newPin, 'click', function(){
          infobox.setOptions({ visible: true, title: pin.name, description: infoWindowContent });
        });

        pinLayer.push(newPin);
        infoboxLayer.push(infobox);
      });

      bingmap.entities.push(pinLayer);
      bingmap.entities.push(infoboxLayer);

    } else {
      if (!$('.poi-panel-wrapper').hasClass('slick-initialized')) {
        //reset all panels and POI panels:
        hidePanels();

        //mark this selected panel
        pId = $(this).closest('.poi-panel').attr('id').substr(4);
        cPanel = $('#' + 'poi_' + pId);
        showPanel(pId);
      }
    }
  });

    var isPin = false;
    setTimeout(function () {
        $('#poiMap  .gmnoprint img').attr('tabindex', 0);
        $('#poiMap  .gmnoprint img').on("focus", function (index) {
            try {
                isPin = this.src.indexOf("marker") >= 0;
                if (isPin) {
                    $(this).parent().css('opacity', '.6');
                    $('#poiMap  .gmnoprint img').css('border', '3px solid orange');
                } else {
                    if ($('#poiMap  .gmnoprint img')[index]) {
                        $('#poiMap  .gmnoprint img')[index].focus();
                    }
                }
            } catch (err) {
            }
        }).on("blur", function () {
            try {
                $(this).css('border', '0px solid white');
                isPin ? $(this).parent().css('opacity', .1) : $(this).parent().css('opacity', .9);
            }
            catch (err) {
            }
        });
    }, 1500);
});




$(window).on('load', function() {
  if($('.poi-locations').is(':visible')) {
    //initPOIMap();
    getip();
  }
});

function initMap2() {
  //Get Map settings:
  map = document.getElementById('map');
  var mapSettings = {};
  mapSettings.latitude = Number(map.getAttribute('data-latitude'));
  mapSettings.longitude = Number(map.getAttribute('data-longitude'));
  mapSettings.title = map.getAttribute('data-title');
  mapSettings.address = map.getAttribute('data-address');
  mapSettings.titlePanel = '<div><h1>' + mapSettings.title + '</h1></div>';
  //console.log(mapSettings);

  //Start basic map:
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: mapSettings.latitude, lng: mapSettings.longitude },
      scaleControl: false,
      zoom: 15,
      zoomControl: false
  });

  //location name
  tip = new google.maps.Size({ height: 0, width: 0 });
  titlePanel = new google.maps.InfoWindow({
      content: mapSettings.titlePanel,
      //maxWidth: '80%',
      pixelOffset: tip
  })
  titlePanel.open(map);
}

function initPOIMap() {
  // Create slider for mobile
  mobilePOISlider();
  // Watch for media query changes
  $(window).on('changed.zf.mediaquery', function(event, newSize, oldSize) {
    mobilePOISlider();
  });

  //add the isOpen to the infoWindow Prototype:
  google.maps.InfoWindow.prototype.isOpen = false;
  //Get Map settings:
  var mapC = document.getElementById('poiMap');
  if(mapC != undefined) {
    //var mapSettings = {};
    mapSettings.latitude = Number(mapC.getAttribute('data-latitude'));
    mapSettings.longitude = Number(mapC.getAttribute('data-longitude'));
    brand = mapC.getAttribute('data-brand');
    logo = mapC.getAttribute('data-brand-logo');
    switch(brand) {
      case 'radisson-red':
        pinSettings.activeColor = '#FFF';
        pinSettings.color = '#FFF';
        fontFamily = '"Knockout 49 A", "Knockout 49 B"';
        fontSize = '1rem';
        activeIconUrl = '/templates/main/images/icons/icon-map-marker-active-red.svg';
        break;
      case 'radisson':
        pinSettings.activeColor = '#000';
        pinSettings.color = '#FFF';
        fontFamily = '"Proxima N W01 Smbd",  Arial, sans-serif';
        fontSize = '12px';
        activeIconUrl = '/templates/main/images/icons/icon-map-marker-active-green.svg';
        break;
      default:
        pinSettings.activeColor = '#FFF';
        pinSettings.color = '#FFF';
        fontFamily = '"Proxima N W01 Smbd",  Arial, sans-serif';
        fontSize = '12px';
        activeIconUrl = '/templates/main/images/icons/icon-map-marker-active.svg';
    }
    mapSettings.titlePanel = '<div class="poi_logo"><img src="' + logo + '" alt="' + brand + '" /></div>';

    defaultIcon = {
      url: '/templates/main/images/icons/icon-map-marker.svg',
      size: new google.maps.Size(28, 38),
      scaledSize: new google.maps.Size(28, 38),
      labelOrigin: new google.maps.Point(14,14),
    };
    activeIcon = {
      url: activeIconUrl,
      size: new google.maps.Size(35, 47),
      scaledSize: new google.maps.Size(34, 46),
      labelOrigin: new google.maps.Point(17,18),
    };

    //Start map:
    map = new google.maps.Map(mapC, {
        center: {lat: mapSettings.latitude, lng: mapSettings.longitude },
        scaleControl: false,
        zoom: 15,
        zoomControl: (Foundation.MediaQuery.atLeast('large')) ? true : false
    });

    //Add location panel:
    titlePanel = new google.maps.InfoWindow({
        content: mapSettings.titlePanel,
        position: { lat: mapSettings.latitude, lng: mapSettings.longitude },
        zIndex: 1,
    });
    google.maps.event.addListener(titlePanel, 'domready', function() {
       var iwOuter = $('.gm-style-iw');
       var iwParent = iwOuter.parent();
       var iwBackground = iwOuter.prev();

       iwParent.addClass('gm-style-iw-outer');
       iwParent.addClass('gm-style-iw-outer-logo');
       iwOuter.addClass('gm-poi');
       iwOuter.addClass('gm-poi-logo');

       // Remove the background shadow DIV
       iwBackground.children(':nth-child(2)').css({'display' : 'none'});

       // Remove the white background DIV
       iwBackground.children(':nth-child(4)').css({'display' : 'none'});
    });
    titlePanel.open(map);

    //Add markers:
    var cItem = 0;
    poi.items.forEach( function(cPoi) {
      cMarkerLabel = { color: pinSettings.color,
          fontFamily: fontFamily,
          fontSize: fontSize,
          text: (cItem + 1).toString()
      };
      markers[cItem] = new google.maps.Marker({ icon: defaultIcon,
          label: cMarkerLabel,
          map: map,
          position: { lat: cPoi.latitude, lng: cPoi.longitude },
          title: cPoi.name
      });

      // get distance from property with geometry library
      // Will need to be replaced with a cached one that comes from the CMS
      // Also remove '&amp;libraries=geometry' from js-footer.xsl
      var distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(cPoi.latitude, cPoi.longitude),
        new google.maps.LatLng(mapSettings.latitude, mapSettings.longitude)
      );
      if(countryCode == 'US')
        distance = (distance > 160.93)? (distance/1609.34).toFixed(1) + ' Mi.' : Math.floor(distance/.3048) + ' ft.';
      else
        distance = (distance > 100)? (distance/1000).toFixed(1) + ' km.' : distance + ' m.';

      // Show hours data for today only
      hours = (cPoi.hours != '')? '<div class="poi_hours">' + '<i class="fa fa-clock-o" aria-hidden="true"></i> ' + cPoi.hours + '</div>' : '';
      
      iwContent = '<div class="poi_inside_panel">';
      if(cPoi.img != '') {
        iwContent += '<div class="poi_img">'+
                      '<img src="' + cPoi.img + '" alt="">'+
                    '</div>' +
                    '<div class="poi_info_wrapper">';
      } else
        iwContent +='<div class="poi_info_wrapper _noimg">';
      iwContent +=    '<div class="poi_inside_title">' + cPoi.name + '</div>'+
                      '<div class="poi_address">'+
                        cPoi.address1 + ', '+cPoi.address2+'<br/>'+cPoi.city+', '+cPoi.country+'' +
                      '</div>'+
                      '<div class="poi_bottom">'+
                        hours +
                        '<div class="poi_distance">' +
                          '<i class="fa fa-map-marker" aria-hidden="true"></i>' +
                          distance +
                        '</div>'+
                      '</div>'+
                    '</div>'+
                  '</div>';

      panels[cItem] = new google.maps.InfoWindow({
          content: iwContent,
          position: { lat: cPoi.latitude, lng: cPoi.longitude },
          maxWidth: 260,
          pixelOffset: new google.maps.Size(0, -40),
      });

      // Add distance to sidebar
      $('#poi_'+cItem+' .poi-distance-name').find('span').text(distance);

      google.maps.event.addListener(panels[cItem], 'domready', function() {
         var iwOuter = $('.gm-style-iw');
         var iwParent = iwOuter.parent();
         var iwBackground = iwOuter.prev();

         iwParent.addClass('gm-style-iw-outer');
         iwOuter.addClass('gm-poi');

         // Remove the background shadow DIV
         iwBackground.children(':nth-child(2)').css({'display' : 'none'});

         // Remove the white background DIV
         iwBackground.children(':nth-child(4)').css({'display' : 'none'});
      });

      cItem++;
    });

    //If mobile/Tablet, point to the first pin
    if (!Foundation.MediaQuery.atLeast('large')) showPanel('0');

    //Markers functionality:
    $(markers).each(function(index, element) {
      if(this.constructor.name != 'Window') {
        google.maps.event.addListener(markers[index], 'click', function(event) {
          showPanel(index);
        });
      }
    });

    //Panels (infoWindows) functionality:
    $(panels).each(function(index, element) {
      if(this.constructor.name != 'Window') {
        google.maps.event.addListener(panels[index], 'closeclick', function(event) {
          panels[index].isOpen = false;
          markers[index].setVisible(true);
          panel = $('#' + 'poi_' + index);
        });
      }
    });
  }
}

//show panel:
function showPanel(ix) {
  //unselect everyone:
  $('.poi-panel.is-active').removeClass('is-active');

  //Hide all open panels:
  hidePanels();

  //work with our current marker / panel:
  panel = $('#' + 'poi_' + ix + ':visible');
  $(panel).each( function() {
    $(this).addClass('is-active');
  })

  if (Foundation.MediaQuery.atLeast('large')) {
    panels[ix].open(map);
    panels[ix].isOpen = true;
    markers[ix].setVisible(true);
  } else {
    updateIcons(ix);
    markers[ix].setVisible(true);
    pmpanels = $('.poi-panel-wrapper-mob .poi-panel:not(.slick-cloned)');
    if(!$(pmpanels[ix]).hasClass('slick-active')) {
      $('.poi-panel-wrapper-mob').slick('slickGoTo', ix, false);
    }
  }

  //Fit the map to the mark and the hotel
  var bounds = new google.maps.LatLngBounds();
  markPos = markers[ix].position;
  bounds.extend(markPos);
  propPos = new google.maps.LatLng(mapSettings.latitude, mapSettings.longitude);
  bounds.extend(propPos);
  map.fitBounds(bounds);
  map.panToBounds(bounds);
  map.setZoom(map.getZoom()-1);
  if (Foundation.MediaQuery.atLeast('large')) {
    map.setZoom(map.getZoom()-1);
    if(map.getZoom()> 17){
      map.setZoom(17);
    }
  }
}

function updateIcons(index) {
  for (var i = 0; i < markers.length; i++) {
    currentLabel = markers[i].getLabel();
    if(i == index) {
      currentLabel.color = pinSettings.activeColor;
      markers[index].setIcon(activeIcon);
    } else {
      currentLabel.color = pinSettings.color;
      markers[i].setIcon(defaultIcon);
    }
    markers[i].setLabel(currentLabel);
  }
}

//hide all info panels:
function hidePanels() {
  $(panels).each(function(i, element) {
    if(this.constructor.name != 'Window') {
      if(panels[i].isOpen == true) {
        panels[i].close();
        panels[i].isOpen = false;
        markers[i].setVisible(true);
      }
    }
  });
}

function mobilePOISlider() {
  if (!Foundation.MediaQuery.atLeast('large') && !$('.poi-panel-wrapper-mob').hasClass('slick-initialized')) {
    $('.poi-panel-wrapper-mob').slick({
      arrows: false,
      dots: false,
      focusOnSelect: true
    });
    $('.poi-panel-wrapper-mob').on('afterChange', function(event, slick, currentSlide){
      panels = $('.poi-panel-wrapper-mob .poi-panel:not(.slick-cloned)');
      showPanel($(panels[currentSlide]).prop('id').substring(4));
    });
  } else if (Foundation.MediaQuery.atLeast('large') && $('.poi-panel-wrapper-mob').hasClass('slick-initialized')) {
    $('.poi-panel-wrapper-mob').slick('unslick');
  }
}

function mobileBingPOISlider() {
  if (!Foundation.MediaQuery.atLeast('large') && !$('.poi-panel-wrapper').hasClass('slick-initialized')) {
    $('.poi-panel-wrapper').slick({
      arrows: false,
      dots: false,
      focusOnSelect: true
    });
    $('.poi-panel-wrapper').on('beforeChange', function(event, slick, currentSlide, nextSlide){
      //unselect everyone:
      $('.poi-panel.is-active').removeClass('is-active');
    });
  } else if (Foundation.MediaQuery.atLeast('large') && $('.poi-panel-wrapper').hasClass('slick-initialized')) {
    $('.poi-panel-wrapper').slick('unslick');
  }
}

function AttractionsSearch(searchFor) {
  // Slick filtering
  if ($('.poi-panel-wrapper').hasClass('slick-initialized')) {
    $('.poi-panel-wrapper').slick('slickUnfilter');
  }

  if(searchFor == '') {
    //end of search, go back to normal
    poi.items.forEach( function(cPoi, index) {
      $('div#poi_' + index).addClass('is-match');
      markers[index].setVisible(true);
    });
  } else {
    //show the matched items. Hide the others:

    //match smallcaps vs smallcaps
    searchFor = searchFor.toLowerCase();

    hidePanels();
    poi.items.forEach( function(cPoi, index) {
      if(cPoi.name.toLowerCase().indexOf(searchFor) >= 0) {
        $('div#poi_' + index).addClass('is-match');
        markers[index].setVisible(true);
      } else {
        $('div#poi_' + index).removeClass('is-match');
        markers[index].setVisible(false);
      }
    });

    if ($('.poi-panel-wrapper').hasClass('slick-initialized')) {
      $('.poi-panel-wrapper').slick('slickFilter','.is-match');
      var currentIndex = parseInt($('.poi-panel-wrapper .slick-current').attr('id').replace('poi_',''));
      showPanel(currentIndex);
    }
  }
}

// Bing map with geolocation
function initBingMap() {
  // Create slider for mobile
  mobileBingPOISlider();
  // Watch for media query changes
  $(window).on('changed.zf.mediaquery', function(event, newSize, oldSize) {
    mobileBingPOISlider();
  });

  var mapSettings = {};
  //Get Map settings:
  var mapC = document.getElementById('poiMap');

  mapSettings.latitude = mapC.getAttribute('data-latitude');
  mapSettings.longitude = mapC.getAttribute('data-longitude');

  const map = new Microsoft.Maps.Map('#poiMap', {
    credentials: 'ea1QFboXIZokgkFDnxQD~ya5TTKkCPi86SKt5ASRWHg~Ap5KWiQLta7sAu32KxCBL8drMOePrKk46xkpRF61NngyCpbHVI4YcndKkQ3GzwxX',
    center: new Microsoft.Maps.Location(mapSettings.latitude, mapSettings.longitude),
    mapTypeId: Microsoft.Maps.MapTypeId.road,
    zoom: 14
  });

  var pinLayer = new Microsoft.Maps.EntityCollection();
  var infoboxLayer = new Microsoft.Maps.EntityCollection();
  var infobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0), { visible: false, offset: new Microsoft.Maps.Point(0, 20) });
  infoboxLayer.push(infobox);

  $.each(poi.items, function (index, pin) {
    var pinLocation = new Microsoft.Maps.Location(pin.latitude, pin.longitude);
    var newPin = new Microsoft.Maps.Pushpin(pinLocation, { text: pin.name });


    if(pin.address1 != '' && pin.address2 != '') {
      pin.address = pin.address1 + ', ' + pin.address2 + '<br />';
    } else if(pin.address1 != '') {
      pin.address = pin.address1 + '<br />';
    } else if(pin.address2 != '') {
      pin.address = pin.address2 + '<br />';
    } else {
      pin.address = '';
    }
    pin.address += pin.city;
    if(pin.city != '' && pin.country != '')
      pin.address += ', ';
    pin.address += pin.country;


    var infoWindowContent = '';
    infoWindowContent += '<div class="poi_inside_panel">'+
            '<div class="poi_img">'+
              '<img src="' + pin.img + '" alt="">'+
            '</div>'+
            '<div class="poi_info_wrapper">'+
              '<div class="poi_inside_title">' + pin.name + '</div>'+
              '<div class="poi_address">'+
                pin.address1 + ', '+pin.address2+'<br/>'+pin.city+', '+pin.country+'' +
              '</div>'+
              '<div class="poi_bottom">'+
                //hours+
                '<div class="poi_distance">' +
                  //'<i class="fa fa-map-marker" aria-hidden="true"></i>' + Math.round(distance)+' m'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>';

    var infobox = new Microsoft.Maps.Infobox(pinLocation, {
      title: pin.name,
      description: infoWindowContent,
      visible: false
    });
    infobox.setMap(map);

    Microsoft.Maps.Events.addHandler(newPin, 'click', function(){
      infobox.setOptions({ visible: true, title: pin.name, description: infoWindowContent });
    });

    pinLayer.push(newPin);
    infoboxLayer.push(infobox);
  });

  map.entities.push(pinLayer);
  map.entities.push(infoboxLayer);
}

// function for getting url parameters
function urlParam(name) {
  const results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results == null){
    return null;
  }
  else {
    return results[1] || 0;
  }
}

// get user's ip address, then get user's location from ip address
// this is only so large because we need to force a Chinese IP address manually
// ultimately we should only need the ajax call inside the else statement
function getip() {
  var maptype = urlParam('map');
  var iplocation = urlParam('iplocation');
  $.ajax({
    url: 'https://api.ipify.org?format=json',
    type: 'GET',
    success: function(data) {
      console.log(data);
      if (iplocation == 'CN') {
        $.ajax({
          // Chinese IP address for testing purposes
          url: 'https://freegeoip.net/json/1.0.63.255',
          type: 'GET',
          success: function(location) {
            countryCode = location.country_code;
            console.log(location);
            if (location.country_code == 'CN') {
              if (maptype == 'bing') {
                $('.map-type').append('Bing Map');
                initBingMap();
              } else {
                $('#map-api').attr('src', 'https://maps.google.cn/maps/api/js?key=AIzaSyDDZB4FQ8K7d5nqS9ZmgBpCTdiOI-KXerA');
                initPOIMap();
              }
            } else {
              $('#map-api').attr('src', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDDZB4FQ8K7d5nqS9ZmgBpCTdiOI-KXerA');
              initPOIMap();
            }
          }
        });
      } else {
        $.ajax({
          // Dynamic location from IP address
          url: 'https://freegeoip.net/json/' + data.ip,
          type: 'GET',
          success: function(location) {
            console.log(location);
            countryCode = location.country_code;
            if (location.country_code == 'CN') {
              if (maptype == 'bing') {
                initBingMap();
              } else {
                $('#map-api').attr('src', 'https://maps.google.cn/maps/api/js?key=AIzaSyDDZB4FQ8K7d5nqS9ZmgBpCTdiOI-KXerA');
                initPOIMap();
              }
            } else {
              $('#map-api').attr('src', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDDZB4FQ8K7d5nqS9ZmgBpCTdiOI-KXerA');
              initPOIMap();
            }
          }
        });
      }
    }
  });
}
