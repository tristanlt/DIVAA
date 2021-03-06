
function initDemoMap(){
//BASE TILE LAYER 1
  var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, ' +
    'AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });
//BASE TILE LAYER 2
  var Esri_DarkGreyCanvas = L.tileLayer(
    "http://{s}.sm.mapstack.stamen.com/" +
    "(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/" +
    "{z}/{x}/{y}.png",
    {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, ' +
      'NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    }
  );
//BASE TILE LAYER 3
  var Stamen_Toner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by Stamen Design, CC BY 3.0 &mdash; Map data &copy; OpenStreetMap',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  });
//BASE TILE GROUP LAYER
  var baseLayers = {
    "Satellite": Esri_WorldImagery,
    "Grey ": Esri_DarkGreyCanvas,
    "Black" : Stamen_Toner
  };
//MAP STRUCTURE
  var map = L.map('map', {
    layers: [ Esri_WorldImagery ],
    minZoom : 3,
    worldCopyJump: true,
    inertia: false
  });
//MENU CREATION
  var layerControl = L.control.layers(baseLayers);
  layerControl.addTo(map);
  map.setView([40, -20], 4);
//MOUSE POSITION BOTTOM LEFT
  L.control.mousePosition().addTo(map);
//CREDIT FOR LOPS LOGO
  var credctrl = L.controlCredits({
  image: "dist/lops.png",
  link: "http://www.umr-lops.fr/",
  text: "<center><b>Laboratoire<br>d'Oceanographie<br>Physique<br>et Spatiale<br>IFREMER 2017</b></center>",
  width: 96,
  height: 88
  }).addTo(map);
//INIT RETURN FUNCTION
  return {
    map: map,
    layerControl: layerControl
  };
}

// MAP CREATION
var mapStuff = initDemoMap();
var map = mapStuff.map;
// MENU
var layerControl = mapStuff.layerControl;
//ICON FOR SELECTED FLOAT
ico0 = {iconShape: 'doughnut', borderWidth: 4, borderColor: '#50f308'};
var curmarker = L.marker([0,0],{icon: L.BeautifyIcon.icon(ico0)});
//TRAJ LAYER, EMPTY AT START
var majaxLayer=L.layerGroup();
map.addLayer(majaxLayer);
//SIDE PANEL
var sidebar = L.control.sidebar('sidebar', {
  closeButton: true,
  position: 'left',
  autoPan: 'off'
});
map.addControl(sidebar);

//DATA LAYERS
// AVISO
$.getJSON('data/aviso.json', function (data) {
  var velocityLayer1 = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType : 'Aviso Surface currents',
      displayPosition: 'bottomleft',
      displayEmptyString: 'No current data'
    },
    data: data,
    maxVelocity: 1,
    velocityScale: 0.3
  });
  htmlName1='<font color="red">Aviso Currents: '+WDate+'</font> <a target="_blank" href="https://www.aviso.altimetry.fr/en/data/products/sea-surface-height-products/global/madt-h-uv.html"><img src="dist/info.png" height="15" width="15"></a>'
  layerControl.addOverlay(velocityLayer1, htmlName1);
});

// AVISO MDT
$.getJSON('data/aviso_mdt.json', function (data) {
  var velocityLayer2 = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType : 'Aviso Surface currents',
      displayPosition: 'bottomleft',
      displayEmptyString: 'No current data'
    },
    data: data,
    maxVelocity: 1,
    velocityScale: 0.3
  });
  htmlName2='<font color="red">Aviso mdt2013</font> <a target="_blank" href="https://www.aviso.altimetry.fr/fr/donnees/produits/produits-auxiliaires/mdt.html"><img src="dist/info.png" height="15" width="15"></a>'
  layerControl.addOverlay(velocityLayer2, htmlName2);
});

// ANDRO
$.getJSON('data/andro_gm.json', function (data) {
  var velocityLayer3 = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType : 'Andro deep velocity',
      displayPosition: 'bottomleft',
      displayEmptyString: 'No velocity data'
    },
    data: data,
    maxVelocity: 1,
    velocityScale: 0.3
  });
  htmlName3='<font color="red">Andro deep velocity</font> <a target="_blank" href="https://wwz.ifremer.fr/lpo/Produits/ANDRO"><img src="dist/info.png" height="15" width="15"></a>'
  layerControl.addOverlay(velocityLayer3, htmlName3);
  map.addLayer(velocityLayer3); //Default display when page loads
});

//ARGO DAY
ico1 = {iconShape: 'circle-dot', borderWidth: 4, borderColor: '#fdfe02'};
ico2 = {iconShape: 'circle-dot', borderWidth: 4, borderColor: '#ffffff'};

var mapdata=Data_ARGO;
var argomarkers = L.layerGroup();
for (var i = 0; i < mapdata.length; i++)
{
  if(mapdata[i].Institution == 'IF') {
    var marker = L.marker([mapdata[i].latitude,mapdata[i].longitude],{title: mapdata[i].Platform,icon: L.BeautifyIcon.icon(ico1)});
  }
  else {
    var marker = L.marker([mapdata[i].latitude,mapdata[i].longitude],{title: mapdata[i].Platform,icon: L.BeautifyIcon.icon(ico2)});
  }
  //ONCLIK, CALL SUBMARKERCLICK FUNCTION (SIDE PANEL + TRAJ)
  marker.on('click',L.bind(SubMarkerClick,null,mapdata[i]));
  marker.addTo(argomarkers);
};
htmlName4='<font color="blue">Argo floats : '+WDate+'</font> <a target="_blank" href="http://www.umr-lops.fr/SO-Argo/Home/"><img src="dist/info.png" height="15" width="15"></a>'
layerControl.addOverlay(argomarkers, htmlName4);

//ARGO 7 DAYS
var mapdata2=Data_ARGO7;
var argomarkers2 = L.layerGroup();
for (var i = 0; i < mapdata2.length; i++)
{
  if(mapdata2[i].Institution == 'IF') {
    var marker = L.marker([mapdata2[i].latitude,mapdata2[i].longitude],{title: mapdata2[i].Platform,icon: L.BeautifyIcon.icon(ico1)});
  }
  else {
    var marker = L.marker([mapdata2[i].latitude,mapdata2[i].longitude],{title: mapdata2[i].Platform,icon: L.BeautifyIcon.icon(ico2)});
  }
  //ONCLIK, CALL SUBMARKERCLICK FUNCTION (SIDE PANEL + TRAJ)
  marker.on('click',L.bind(SubMarkerClick,null,mapdata2[i]));
  marker.addTo(argomarkers2);
};
htmlName5='<font color="blue">Argo floats : 7 days</font> <a target="_blank" href="http://www.umr-lops.fr/SO-Argo/Home"><img src="dist/info.png" height="15" width="15"></a>'
layerControl.addOverlay(argomarkers2, htmlName5);
map.addLayer(argomarkers2);

//SIDE PANEL MANAGEMENT
function SubMarkerClick(smarker) {
  //DOUGHNUT MARKER ON THE SELECTED FLOAT
  curmarker.setLatLng([smarker.latitude,smarker.longitude]);
  curmarker.addTo(map);
  //CLEAR ANY EXISTING TRAJECTORIES
  majaxLayer.clearLayers();
  //ERDDAP URLs
  ti=smarker.Time;
  pl=smarker.Platform;
  inst=smarker.Institution;
  tempurl="http://www.ifremer.fr/erddap/tabledap/ArgoFloats.png?temp,pres,psal&time="+ti.substr(0,4)+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+"%3A"+ti.substr(10,2)+"%3A"+ti.substr(12,2)+"Z&platform_number=%22"+pl+"%22&.draw=linesAndMarkers&.yRange=%7C%7Cfalse";
  psalurl="http://www.ifremer.fr/erddap/tabledap/ArgoFloats.png?psal,pres,temp&time="+ti.substr(0,4)+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+"%3A"+ti.substr(10,2)+"%3A"+ti.substr(12,2)+"Z&platform_number=%22"+pl+"%22&.draw=linesAndMarkers&.yRange=%7C%7Cfalse";
  trajurl="http://www.ifremer.fr/erddap/tabledap/ArgoFloats.png?longitude,latitude,time&time%3E="+(Number(ti.substr(0,4))-1).toString()+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+"%3A"+ti.substr(10,2)+"%3A"+ti.substr(12,2)+"Z&platform_number=%22"+pl+"%22&.draw=linesAndMarkers";
  sidebar.setContent("<b>Float </b>: "+ pl +
  "<br><b>Profile date </b>: " + ti +
  "<br><b>DAC </b>: " + inst +
  "<br><b>TEMPERATURE PROFILE</b>" +
  "<br><img src=\""+tempurl+"\" alt=\"not available\"><br>" +
  "<br><b>PRACTICAL SALINITY PROFILE</b>" +
  "<br><img src=\""+psalurl+"\" alt=\"not available\"><br>" +
  "<br><b>LAST YEAR TRAJECTORY</b>" +
  "<br><img src=\""+trajurl+"\" alt=\"not available\"><br>");
  sidebar.show();
  //TEST ACCES ERDAPP VIA AJAX FOR TRAJECTORIES
  $.ajax({
        //http://www.ifremer.fr/erddap/tabledap/ArgoFloats.geoJson?time%2Clatitude%2Clongitude&platform_number=%226901603%22&time%3E=2017-01-01T00%3A00%3A00Z&time%3C=2017-09-20T17%3A18%3A20Z
        //url:"http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?time%2Clatitude%2Clongitude&platform_number=%22"+pl+"%22&time%3E="+(Number(ti.substr(0,4))-1).toString()+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+"%3A"+ti.substr(10,2)+"%3A"+ti.substr(12,2)+"Z&orderBy(%22time%22)",
        url:"http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?time%2Clatitude%2Clongitude&platform_number=%22"+pl+"%22&orderBy(%22time%22)",
        dataType: 'json',
        success:function(data){
          var mlatlon=[];
          for (var i = 0; i < data.table.rows.length; i++)
            {
              mlatlon.push([data.table.rows[i][1],data.table.rows[i][2]]);
            };
            var mpoly = L.polyline(mlatlon, {color: '#45f442', smoothFactor: 2}).addTo(majaxLayer);
            //map.fitBounds(mpoly.getBounds(),{padding:[400,200]});
          //console.log(data.table);
          }
      });
}
//REMOVE MARKER AND TRAJ WHEN CLOSING PANEL
sidebar.on('hide', function () {
     map.removeLayer(curmarker);
     majaxLayer.clearLayers();
 });

//SEARCH TOOL
var controlSearch = new L.Control.Search({layer: argomarkers2, initial: false, position:'topleft'});
map.addControl( controlSearch );
