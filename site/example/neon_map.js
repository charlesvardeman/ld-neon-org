var fst = 0;
var mfo = 0;
var sot = 0;

(function($) {

  $.fn.neonAutoSubmit = function(options) {
    var $this = $(this);

    var settings = {
      container: ''
    };

    $.extend(settings, options);

    function triggerSubmit (e) {
      $this.find('.form-submit[value=Apply]').trigger('click');
      $this.find('input, select').attr('disabled', true);
      $(settings.container).addClass('ajaxing');
    }

    var intId = 0;

    $this
      .find('select, input:not(:text, :submit)')
      .once('neon-auto-submit')
      .change(function (e) {
        clearInterval(intId);

        intId = setTimeout(function(){
          triggerSubmit.call(e.target.form);
        }, 500);
      });

    $this.find('#edit-submit-field-sites').hide();

    // e.keyCode: key
    var discardKeyCode = [
      16, // shift
      17, // ctrl
      18, // alt
      20, // caps lock
      33, // page up
      34, // page down
      35, // end
      36, // home
      37, // left arrow
      38, // up arrow
      39, // right arrow
      40, // down arrow
      9, // tab
      13, // enter
      27  // esc
    ];

    // Don't wait for change event on textfields
    $this
      .find('input:text')
      .filter(':not(.form-autocomplete)')
      .once('neon-auto-submit', function () {
        // each textinput element has his own timeout
        var timeoutID = 0;

        $(this)
          .bind('keydown keyup', function (e) {
            if ($.inArray(e.keyCode, discardKeyCode) === -1) {
              timeoutID && clearTimeout(timeoutID);
            }
          })
          .keyup(function(e) {
            if ($.inArray(e.keyCode, discardKeyCode) === -1) {
              timeoutID = setTimeout($.proxy(triggerSubmit, this.form), 500);
            }
          })
          .bind('change', function (e) {
            if ($.inArray(e.keyCode, discardKeyCode) === -1) {
              timeoutID = setTimeout($.proxy(triggerSubmit, this.form), 500);
            }
          });
      });

    // Handle autocompletes:
    $this
      .find('input:text')
      .filter('.form-autocomplete')
      .once('neon-auto-submit-autocomplete', function() {
        $(this).blur(function(){
          triggerSubmit.call(this.form);
        })
      });

    var addReset = false;


    $this.find('#reset-link').click(function() {
      $this.find('input[type=text]').val('');
      $this.find('input[type=checkbox]').attr('checked','checked');
      $this.find('select').val('');
      triggerSubmit();
      return false;
    });
  }


Drupal.neonMap = function(settings) {

  this.groupObj = {};

  this.plotTypes = {
    distributed_birdGrid: "",
    distributed_basePlot: "distributedBaseplot",
    distributed_mammalGrid: "mammal",
    distributed_mosquitoPlot: "mosquito",
    distributed_tickPlot: "tick",
    tower_basePlot: "towerPlot",
    tower_phenology: "phenology"
  };

  // ICON NAMES
  this.locationTypes = {
    MET_STATION: "metStation",
    S1_LOC: "sensorStation",
    S2_LOC: "sensorStation",
    STAFF_GAUGE: "staffGaugeCamera",
    AOSreachTop: "reach-icon",
    AOSreachBottom: "reach-icon",
    riparian: "riparianAssessment",
    GROUNDWATER_WELL: "groundwaterWell",
    BUOY: "locationmarker",
    INLET_LOC: "sensorStation",
    OUTLET_LOC: "sensorStation",
  };

  featuresObj = [];
  this.markersDBG = [];
  this.markersDBP = [];
  this.markersDMG = [];
  this.markersDMP = [];
  this.markersDTP = [];
  this.markersTBP = [];
  this.markersTP = [];
  this.markersMS = [];
  this.markersSS = [];
  this.markersSG = [];
  this.markersAR = [];
  this.markersRA = [];
  this.markersGW = [];
  this.markersBY = [];
  // this.markersIL = [];
  // this.markersOL = [];

  this.map_project_keys = [];

  // Suppress scrolling back up to top.
  Drupal.ajax.prototype.commands.viewsScrollTop = null;

  var self = this;
  var nodeID = Drupal.settings.neon_map.nodeID;
  //console.log('settings');
  //console.log(settings);
  //console.log(Object.keys(settings.fieldSitesData).length);

  // If we are dealing with an individual aquatic field site, use the World Imagery Map Tiles
  // if ( settings.fieldSitesData[nodeID].types[0].split(' ')[1] === "Aquatic" && Object.keys(settings.fieldSitesData).length == 1) {
  //     var defaults = {
  //         domId: '',
  //         fieldSitesData: {},
  //         domainsDataUrl: '',
  //         paddingBottomRight: [0, 0],
  //         paddingTopLeft: [0, 0],
  //         baseTileLayer: {
  //             url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  //             attribution: 'Tiles © Esri — Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
  //             subdomains: '0123',
  //             minZoom: 0,
  //             maxZoom: 17
  //         }
  //     }
  // // For all other cases (Map of all field sites, individual Terrestrial field sites) use the Nat Geo map tiles
  // } else {
  //     var defaults = {
  //         domId: '',
  //         fieldSitesData: {},
  //         domainsDataUrl: '',
  //         paddingBottomRight: [0, 0],
  //         paddingTopLeft: [0, 0],
  //         baseTileLayer: {
  //             url: 'http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
  //             attribution: 'Tiles © Esri — National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
  //             subdomains: '0123',
  //             minZoom: 2,
  //             maxZoom: 16
  //         }
  //     }
  // }

  //Switch out map layer now to World Topo Map for ALL field site maps
  var defaults = {
    domId: "",
    fieldSitesData: {},
    domainsDataUrl: '',
    paddingBottomRight: [0, 0],
    paddingTopLeft: [0, 0],
    baseTileLayer: {
      url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles © Esri World Topo Map— Esri, HERE, Garmin, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), swisstopo, © OpenStreetMap contributors, and the GIS User Community",
      subdomains: "0123",
      minZoom: 0,
      maxZoom: 18,
    }
  };

  var featuresObj = [];

  $.extend(defaults, settings);
  this.settings = defaults;
  // `console.log(this);

  this.map = L.map(this.settings.domId, {
    scrollWheelZoom: false
  });

  // Add main map layer:
  L.tileLayer(this.settings.baseTileLayer.url, {
    attribution: this.settings.baseTileLayer.attribution,
    subdomains: this.settings.baseTileLayer.subdomains
  }).addTo(this.map);

  //add scalecontrol
  //this.map.addControl(new L.control.scale({position: 'bottomright'}, {maxWidth : 300}, {'imperial': false}, {metric: true}));
  L.control.scale({position: 'bottomright', maxWidth : 100, imperial: false, metric: true}).addTo(this.map);

  if (this.settings.fieldSitesData) {
    // Add sites layer using clusters:
    //this.sitesLayer = L.markerClusterGroup({maxClusterRadius: 20});

    // Add sites layer just using a feature group:
    this.sitesLayer = L.featureGroup();
    var sitesLayer = this.sitesLayer,
    hasLayers = false;

    if(nodeID) {
      var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      });
      L.control.layers(null, {"Satellite": googleSat}, {position: 'topleft', collapsed: false}).addTo(this.map);

      if(typeof(self.settings.fieldSitesData[nodeID].samplingBoundaries) != "undefined") {
        Object.keys(self.settings.fieldSitesData[nodeID].samplingBoundaries).forEach(function (sb_key) {
          var l1 = L.geoJson(JSON.parse(self.settings.fieldSitesData[nodeID].samplingBoundaries[sb_key]), {
            style: function (feature) {
              return {color: '#454c01', weight: '4', fillOpacity: '0', dashArray: '5,7', opacity: '1'};
            }
          }).addTo(self.map);

          //change geoJson color for on/off Satellite layer
          self.map.on('overlayadd', function(e) {
            l1.setStyle({color: '#4BE1BD'});
          });
          self.map.on('overlayremove', function(e) {
            l1.setStyle({color: '#454c01'});
          });
        });
      }


      if(typeof(self.settings.fieldSitesData[nodeID].airshedBoundaries) != "undefined") {
        Object.keys(self.settings.fieldSitesData[nodeID].airshedBoundaries).forEach(function (ab_key) {
          L.geoJson(JSON.parse(self.settings.fieldSitesData[nodeID].airshedBoundaries[ab_key]), {
            style: function (feature) {
              return {color: 'yellow', weight: '6', fillOpacity: '0', opacity: '1'};
            }
          }).addTo(self.map);
        });
      }

      if(self.settings.fieldSitesData[nodeID].map_data) {


        // console.log('self.settings.fieldSitesData[nodeID].types');
        // console.log(self.settings.fieldSitesData[nodeID].types[0]);
        var site_type = self.settings.fieldSitesData[nodeID].types[0].split(' ')[1];

        var map_data = self.settings.fieldSitesData[nodeID].map_data;
        // console.log('self.map_data');
        // console.log(map_data);

        self.map_project_keys = self.settings.fieldSitesData[nodeID].map_project_keys;
        // console.log('self.map_project_keys');
        // console.log(self.map_project_keys);

        self.showDataOnMap(JSON.parse(map_data), site_type);

        // CREATE ICON GROUPS THAT TURN ON AND OFF WITH CHECKBOXES ON LEGEND

        /** TERRESTRIAL **/
        this.groupObj["group_distributed_birdGrid"] = L.featureGroup(this.markersDBG);
        this.groupObj["group_distributed_basePlot"] = L.featureGroup(this.markersDBP);
        this.groupObj["group_distributed_mammalGrid"] = L.featureGroup(this.markersDMG);
        this.groupObj["group_distributed_mosquitoPlot"] = L.featureGroup(this.markersDMP);
        this.groupObj["group_distributed_tickPlot"] = L.featureGroup(this.markersDTP);
        this.groupObj["group_tower_basePlot"] = L.featureGroup(this.markersTBP);
        this.groupObj["group_tower_phenology"] = L.featureGroup(this.markersTP);
        /** AQUATIC **/
        this.groupObj["group_met_station"] = L.featureGroup(this.markersMS);
        this.groupObj["group_sensor_station"] = L.featureGroup(this.markersSS);
        this.groupObj["group_staff_gauge_camera"] = L.featureGroup(this.markersSG);
        // this.groupObj["group_aos_reach"] = L.featureGroup(this.markersAR);
        this.groupObj["group_sampling_reach_boundary"] = L.featureGroup(this.markersAR);
        this.groupObj["group_riparian_assessment"] = L.featureGroup(this.markersRA);
        this.groupObj["group_groundwater_well"] = L.featureGroup(this.markersGW);
        // this.groupObj["group_buoy"] = L.featureGroup(this.markersBY);
        this.groupObj["group_inlet_loc"] = L.featureGroup(this.markersSS);
        this.groupObj["group_outlet_loc"] = L.featureGroup(this.markersSS);

        /** TERRESTRIAL **/
        featuresObj.push(this.groupObj["group_distributed_birdGrid"]);
        featuresObj.push(this.groupObj["group_distributed_basePlot"]);
        featuresObj.push(this.groupObj["group_distributed_mammalGrid"]);
        featuresObj.push(this.groupObj["group_distributed_mosquitoPlot"]);
        featuresObj.push(this.groupObj["group_distributed_tickPlot"]);
        featuresObj.push(this.groupObj["group_tower_basePlot"]);
        featuresObj.push(this.groupObj["group_tower_phenology"]);
        /** AQUATTIC **/
        featuresObj.push(this.groupObj["group_met_station"]);
        featuresObj.push(this.groupObj["group_sensor_station"]);
        featuresObj.push(this.groupObj["group_staff_gauge_camera"]);
        // featuresObj.push(this.groupObj["group_aos_reach"]);
        featuresObj.push(this.groupObj["group_sampling_reach_boundary"]);
        featuresObj.push(this.groupObj["group_riparian_assessment"]);
        featuresObj.push(this.groupObj["group_groundwater_well"]);
        // featuresObj.push(this.groupObj["group_buoy"]);
        featuresObj.push(this.groupObj["group_sensor_station"]);
        featuresObj.push(this.groupObj["group_sensor_station"]);

        var group = L.featureGroup(featuresObj).addTo(this.map);
        this.map.fitBounds(group.getBounds());
      }
    }

    Object.keys(this.settings.fieldSitesData).forEach(function (key) {
      if (typeof(self.settings.fieldSitesData[key].geo) == 'string') {
        geo = JSON.parse(self.settings.fieldSitesData[key].geo);
      }
      // Check if Lat/Long are filled for node

      if(typeof(self.settings.fieldSitesData[key].geo) !== 'undefined') {
        sitesLayer.addLayer(self.makeMarker(self.settings.fieldSitesData[key], site_type));
        hasLayers = true;
      }
    });

    if (hasLayers) {
      // Add markers to the map
      this.map.addLayer(this.sitesLayer);
    }
    else {
      this.sitesLayer = false;
    }

  }
  else {
    this.sitesLayer = false;
  }

  // Center and zoom the map
  if(featuresObj.length) {
    $("input:checkbox[name='taxonomy_filter[]']").change(function() {
      var checkbox_value = $(this).val();
      var is_checked = this.checked;

      if(checkbox_value == 'group_distributed' || checkbox_value == 'group_tower'){
        var temp_value = checkbox_value.replace("group_", "");
        for(var key in self.plotTypes) {
          if(key.includes(temp_value)) {
            if(is_checked) {
              $("input:checkbox[name='taxonomy_filter[]'][value='group_"+key+"']").prop("checked",true);
              self.map.addLayer(self.groupObj["group_"+key]);
            }
            else {
              $("input:checkbox[name='taxonomy_filter[]'][value='group_"+key+"']").prop("checked",false);
              self.map.removeLayer(self.groupObj["group_"+key]);
            }
          }
        }
      }
      else {
        if (is_checked)
        self.map.addLayer(self.groupObj[checkbox_value]);
        else
        self.map.removeLayer(self.groupObj[checkbox_value]);
      }
    });
  }
  else {
    this.fitBounds();
    if(nodeID) {
      this.map.setZoom(10);
    }
  }

  // If there's only one location, zoom out a bit.
  if (Object.keys(this.settings.fieldSitesData).length < 2 && !nodeID) {
    this.map.setZoom(13);
  }

}

Drupal.neonMap.prototype.fitBounds = function (layer) {
  //console.log('function fitBounds');

  if (layer == null) {
    layer = this.sitesLayer;
  }
  if (!layer) {
    this.map.fitBounds([
      [72.061259, -170.445646],
      [16.933436, -51.617526]
    ], {paddingBottomRight: this.settings.paddingBottomRight, paddingTopLeft: this.settings.paddingTopLeft});
  }
  else {
    this.map.fitBounds(layer.getBounds(), {paddingBottomRight: this.settings.paddingBottomRight, paddingTopLeft: this.settings.paddingTopLeft, maxZoom: 7});
  }

},

Drupal.neonMap.prototype.makePopup = function(data, site_type) {
  // console.log('function makePopup');
  // console.log(site_type);
  // console.log(data);

  var body = '';

  // TODO: this is the inside of the popup I've laid out a simple template
  // with html but no classes. Maybe you want to modify this.

  body += '<div class="map-popup-container">';

  if (data.title) {
    body += '<div class="map-popup-title">';


    if (data.url) {
      body += '<a href="' + data.url + '" class="">';
    }

    body += '<h3>'+data.title+'</h3>';

    if (data.url) {
      body += '</a>';
    }

    body += '</div>';
  }

  body += '<div class="map-popup-content">';

  if (data.state || data.domainNumber || data.domainName) {
    body += '<p class="map-popup-id">';
    if (data.state) {
      body += '<b>' + data.state + ',</b> ';
    }
    body += '<i>';
    if (data.domainNumber) {
      body += data.domainNumber + ' ';
    }
    if (data.domainName) {
      body += data.domainName;
    }
    body += '</i>';
    body += '</p>';
  }

  body += '<div class="tooltip-content clearfix">';
  if ( site_type !== "Aquatic" ) {
    if (data.thumbnail) {
      body += '<div class="tooltip-content--left">';
      body += data.thumbnail;
      body += '</div>';
    }
  }

  if (data.construction_progress || data.data_progress || data.body) {
    body += '<div class="tooltip-content--right map-popup-content">';
    if (data.construction_progress) {
      body += '<div class="icon--status-' + data.construction_progress.replace(/[^a-zA-Z0-9\-]+/, '_').toLowerCase() + '--small">Construction Status: ' + data.construction_progress + '</div>';
    }

    if (data.data_progress) {
      body += '<div class="icon--status-' + data.data_progress.replace(/[^a-zA-Z0-9\-]+/, '_').toLowerCase() + '--small">Data Status: ' + data.data_progress + '</div>';
    }

    if ( site_type !== "Aquatic" ) {
      if (data.body) {
        body += data.body;
      }
    }

    if ( site_type === "Aquatic" ) {
      if ( data.geo.coordinates ) {
        body += "<div class=\"map-popup-latitude\">Latitude: " + data.geo.coordinates[0] + "</div>";
        body += "<div class=\"map-popup-longitude\">Longitude: " + data.geo.coordinates[1] + "</div>";
      }
    }

    body += '</div>';
  }

  body += '</div></div></div>';

  //console.log(body);
  return body;
}

Drupal.neonMap.prototype.showDataOnMap = function(data, site_type) {
  //console.log('function showDataOnMap');

  // console.log("data");
  // console.log(data);

  var bounds,
  data_marker,
  data_marker_MS,
  data_marker_SS,
  icons = [];

  var LeafIcon = L.Icon.extend({
    options: {
      iconSize:     [18, 18],
      popupAnchor:  [0, -4]
    }
  });
  // console.log('LeafIcon');
  // console.log(LeafIcon);

  /** TERRESTRIAL **/
  // console.log("this.plotTypes");
  // console.log(this.plotTypes);
  for(var key in this.plotTypes) {
    if(this.plotTypes[key] != '') {
      var iconUrl = '/sites/all/themes/neon/img/fieldsiteicons/'+this.plotTypes[key]+'.png';
      icons[key] = new LeafIcon({iconUrl: iconUrl});
    }
  }
  /** AQUATIC **/
  // console.log("this.locationTypes");
  // console.log(this.locationTypes);
  for(var key in this.locationTypes) {
    //console.log('location type key');
    //console.log(key);
    //console.log(this.locationTypes[key]);
    if(this.locationTypes[key] != '') {

      var iconUrl = '/sites/all/themes/neon/img/fieldsiteicons/'+this.locationTypes[key]+'.png';
      icons[key] = new LeafIcon({iconUrl: iconUrl});

      if (key === 'BUOY') {
        icons[key]['MS'] = new LeafIcon({iconUrl: '/sites/all/themes/neon/img/fieldsiteicons/metStation.png'});
        icons[key]['SS'] = new LeafIcon({iconUrl: '/sites/all/themes/neon/img/fieldsiteicons/sensorStation.png'});
      }

    }
  }
  // console.log('ICONS');
  // console.log(icons);

  for (var i in data) {
    // console.log('i');
    // console.log(i);
    for (var j = 0; j < data[i].length; j++) {
      // console.log('j');
      // console.log(j);

      // console.log('data[i].length');
      // console.log(data[i].length);


      // console.log('data[i][j]');
      // console.log(data[i][j]);

      var resName = this.makePopupContent(data[i][j], site_type);
      // console.log('resName');
      // console.log(resName);

      var x = data[i][j][5];
      var y = data[i][j][4];
      // console.log('coords');
      // console.log(x);
      // console.log(y);

      if(i === 'distributed_birdGrid') {
        bounds = new L.circle([y, x], 250).getBounds();
        data_marker = new L.rectangle(bounds, {color: "#4074af", weight: 3, fillOpacity: '0', opacity: '1'}).addTo(this.map).bindPopup(resName);
      } else if (i === 'BUOY') {
        console.log('create data markers for buoy');
        //data_marker = L.marker([y, x], {icon: icons[i]}).addTo(this.map).bindPopup(resName);
        data_marker_MS = L.marker([y, x], {icon: icons[i]['MS']}).addTo(this.map).bindPopup(resName);
        data_marker_SS = L.marker([y, x], {icon: icons[i]['SS']}).addTo(this.map).bindPopup(resName);

      }
      else {
        // console.log('setting data marker');
        // console.log('L.marker(['+y+', '+x+'], {icon: '+icons[i]+'})');
        data_marker = L.marker([y, x], {icon: icons[i]}).addTo(this.map).bindPopup(resName);
      }

      //console.log('data_marker');
      //console.log(data_marker);

      switch(i) {
        /** TERRESTRIAL **/
        case 'distributed_birdGrid':
        this.markersDBG.push(data_marker);
        break;
        case 'distributed_basePlot':
        this.markersDBP.push(data_marker);
        break;
        case 'distributed_mammalGrid':
        this.markersDMG.push(data_marker);
        break;
        case 'distributed_mosquitoPlot':
        this.markersDMP.push(data_marker);
        break;
        case 'distributed_tickPlot':
        this.markersDTP.push(data_marker);
        break;
        case 'tower_basePlot':
        this.markersTBP.push(data_marker);
        break;
        case 'tower_phenology':
        this.markersTP.push(data_marker);
        break;
        /** AQUATIC **/
        case 'MET_STATION':
        this.markersMS.push(data_marker);
        break;
        case 'S1_LOC':
        this.markersSS.push(data_marker);
        break;
        case 'S2_LOC':
        this.markersSS.push(data_marker);
        break;
        case 'STAFF_GAUGE':
        this.markersSG.push(data_marker);
        break;
        case 'AOSreachTop':
        this.markersAR.push(data_marker);
        break;
        case 'AOSreachBottom':
        this.markersAR.push(data_marker);
        break;
        case 'riparian':
        this.markersRA.push(data_marker);
        break;
        case 'GROUNDWATER_WELL':
        this.markersGW.push(data_marker);
        break;
        case 'BUOY':
        this.markersMS.push(data_marker_MS);
        this.markersSS.push(data_marker_SS);
        break;
        case 'INLET_LOC':
        this.markersSS.push(data_marker);
        break;
        case 'OUTLET_LOC':
        this.markersSS.push(data_marker);
        break;
      }
    }
  }

  return true;
}

Drupal.neonMap.prototype.makePopupContent = function(data, site_type){
  //console.log('function makePopupContent');

  var map_project_keys = this.map_project_keys;

  var possible_modules_list = [];
  if( data[7] ) {
    var modules_list = data[7].split("|");
    if (modules_list.length) {
      for (var i = 0; i < modules_list.length; i++) {
        possible_modules_list.push(map_project_keys['appMods'][modules_list[i]]);
      }

      var possible_modules = possible_modules_list.join(", ");
    }
  }
  var markup = '';

  // console.log(site_type);

  if ( site_type == "Terrestrial" ) {
    markup += '<div class="map-popup-container">';
    markup += '<div class="map-popup-title">' + map_project_keys['plotTyp'][data[0]] + ' ' + map_project_keys['subtype'][data[1]] + ' (' + data[3] + ')</div>';
    markup += '<div class="map-popup-content">';
    markup += '<div class="map-popup-id">Plot ID: ' + data[2] + '</div>';
    markup += '<div class="map-popup-latitude">Latitude: ' + data[4] + '</div>';
    markup += '<div class="map-popup-longitude">Longitude: ' + data[5] + '</div>';
    if (data[6] != '') {
      markup += '<div class="map-popup-nlcd">NLCD Class: ' + map_project_keys['nlcdCls'][data[6]] + '</div>';
    }
    if (possible_modules_list.length) {
      markup += '<div class="map-popup-modules">Possible Sampling Modules: <div>' + possible_modules + '</div></div>';
    }
    markup += '</div>';
    markup += '</div>';

  } else if ( site_type == "Aquatic" ) {
    // console.log('before markup');

    var popupDesc = '';
    var popup2ndTitle = '';

    switch (data[0]) {
      case 'MET_STATION':
      popupDesc = 'Data collected via the shore meteorological station are comparable with flux tower measurements at terrestrial sites. Above water met stations on buoys are unique with different sensors and data frequencies due to power and data storage constraints.';
      break;
      case 'S1_LOC':
      popup2ndTitle = 'Upper Reach Sensor Station';
      popupDesc = 'Wadeable stream measurements include: water temperature, conductivity, water level (pressure transducer-based), PAR (below water), chlorophyll a, dissolved oxygen, pH, and turbidity. At non-wadeable rivers only water level (pressure transducer-based) is measured.';
      break;
      case 'S2_LOC':
      popup2ndTitle = 'Lower Reach Sensor Station';
      popupDesc = 'Wadeable stream measurements include: water temperature, conductivity, water level (pressure transducer-based), PAR (below water), chlorophyll a, dissolved oxygen, pH, turbidity, SUNA nitrate analyzer, and fluorescent dissolved organic matter (fDOM)';
      break;
      case 'STAFF_GAUGE':
      popupDesc = 'Gauge height, in meters, measured at lakes, wadeable rivers and non-wadeable streams. A phenocam is installed near most gauges. It collects RGB and IR images of the lake, river, or stream vegetation, stream surface, and stream gauge every 15 minutes.';
      break;
      case 'AOSreachTop':
      popupDesc = 'This marks the top of the aquatic observational sampling reach for streams and rivers. Observational sampling activities may include: Reaeration sampling;  water chemistry, isotopes, dissolved gas; zooplankton, phytoplankton; secchi depth profile; bathymetric and morphologic mapping; discharge; sediment chemistry; riparian assessment; macroinvertebrates, plants, algae, and microbes; and fish.';
      break;
      case 'AOSreachBottom':
      popupDesc = 'This marks the bottom of the aquatic observational sampling reach for streams and rivers. Observational sampling activities may include: Reaeration sampling; water chemistry, isotopes, dissolved gas; zooplankton, phytoplankton; secchi depth profile; bathymetric and morphologic mapping; discharge; sediment chemistry; riparian assessment; macroinvertebrates, plants, algae, and microbes; and fish.';
      break;
      case 'riparian':
      popupDesc = 'Locations for assessment of riparian vegetation composition and physical structure in lakes, non-wadeable rivers and wadeable streams; and assessment of riparian vegetation percent cover in wadeable streams.';
      break;
      case 'GROUNDWATER_WELL':
      popupDesc = 'Sensors measure high temporal resolution groundwater elevation (pressure transducer-based), temperature, and specific conductance.';
      break;
      case 'BUOY':
      popupDesc = 'Data collected include: water temperature, conductivity, water depth relative to bottom of the water body, PAR (below water), chlorophyll a, dissolved oxygen, pH, turbidity, SUNA nitrate analyzer, fluorescent dissolved organic matter (fDOM)';
      break;
      case 'INLET_LOC':
      popupDesc = 'INLET SENSOR STATION: Data collected include: water temperature, water level (pressure transducer-based), and PAR (below water)';
      break;
      case 'OUTLET_LOC':
      popupDesc = 'OUTLET SENSOR STATION: Data collected include: water temperature, water level (pressure transducer-based), PAR (below water)';
      break;

    } // end switch

    markup += '<div class="map-popup-container">';
    markup += '<div class="map-popup-title">' + map_project_keys['locationType'][data[0]] + '</div>';
    markup += '<div class="map-popup-content">';
    if(popup2ndTitle.length > 1) {
      markup += '<div class="map-popup-title-secondary">' + popup2ndTitle + '</div>';
    }
    markup += '<div class="map-popup-id">Plot ID: ' + data[2] + '</div>';
    markup += '<div class="map-popup-latitude">Latitude: ' + data[4] + '</div>';
    markup += '<div class="map-popup-longitude">Longitude: ' + data[5] + '</div>';
    markup += '<div class="map-popup-description">Description: ' + popupDesc + '</div>';
    markup += '</div>';
    markup += '</div>';

    // console.log('after markup');

  }

  return markup;
}

Drupal.neonMap.prototype.makeTowerContent = function(data){
  //console.log('function makeTowerContent');

  var tower_data = JSON.parse(data.field_tower_location_data);

  var markup = '';

  markup += '<div class="map-popup-container">';

  markup += '<div class="map-popup-title">Tower</div>';
  markup += '<div class="map-popup-content">';
  markup += '<div class="map-popup-id">Elevation: '+ tower_data['elevation (m)'] + ' m</div>';
  markup += '<div class="map-popup-latitude">Latitude: '+ data.geo.coordinates[0] + '</div>';
  markup += '<div class="map-popup-longitude">Longitude: '+ data.geo.coordinates[1] + '</div>';
  markup += '<div class="map-popup-towerheight">Tower Height: '+ tower_data['towerheight'] + '\'</div>';
  markup += '<div class="map-popup-modules">No. of measurement levels: '+ tower_data['num of mls'] + '</div>';

  markup += '</div>';
  markup += '</div>';

  return markup;
}

Drupal.neonMap.prototype.makeMarker = function(data, site_type){
  //console.log('function makeMarker');

  // some fancy string manipulation to
  // dynamically turn site-types into css classes
  var iconClass = 'map-marker-icon ',
  _self = this,
  marker;
  data.types.forEach(function(type, i) {
    iconClass += "map-icon-" + type
    .replace(/[^a-zA-Z0-9\-]+/, '-') // map-icon-Core Terrestrial -> map-icon-Core-Terrestrial
    .toLowerCase(); // map-icon-core-terrestrial
    iconClass += ' ';
  });

  var icon = L.divIcon({
    className: iconClass, // defined above
    //TODO: Design Decision: icon size
    iconSize: new L.Point(35, 35), //design decision
    iconAnchor: [12, 34],
    html: '<div class="marker"></div><div class="marker-shadow"></div>', //optional
    popupAnchor: [12,-21],
  });
  if (typeof(data.geo) == 'string') {
    data.geo = JSON.parse(data.geo);
  }

  // have to reverse the points because the lat and long were wrong
  if ($('body').hasClass('node-type-field-site') && typeof(data.field_tower_location_data) != 'undefined') {
    marker = L.marker(data.geo.coordinates.reverse(), {icon: icon, iconAnchor: [11, 15]}).bindPopup(this.makeTowerContent(data));
  } else {
    marker = L.marker(data.geo.coordinates.reverse(), {icon: icon })
    .bindPopup(this.makePopup(data, site_type));
  }

  marker.on('click', function(){
    var targetLatLng = marker.getLatLng(),
    targetZoom = 8,
    map = _self.map,
    targetPoint = map.project(targetLatLng, map.getZoom()).add([_self.settings.paddingBottomRight[0] / 2, _self.settings.paddingBottomRight[1] / 2]),
    targetLatLng = map.unproject(targetPoint, map.getZoom());

    map.setView(targetLatLng, map.getZoom());
    if(this._popup._container.clientHeight > 290) {
      map.panBy([0, 290-this._popup._container.clientHeight]);
    }
  })

  // Set Z-index lower so main marker icon is below other data markers on field site maps
  // and thus does not interfere with clicking on them
  marker.setZIndexOffset(-250);
  // And we havet to do it again any time a user zooms
  marker.on('zoomend', function () {
    marker.setZIndexOffset(-250);
  });

  return marker;
}

Drupal.neonMap.prototype.addDomainLayer = function() {
  //console.log('function addDomainLayer');

  // ADD DOMAINS
  // ==========
  var domainsUrl = this.settings.domainsDataUrl,
  domainLayer;

  var _self = this;

  var myStyle = {
    "color": "#00a1b1",
    "weight": 2,
    "opacity": 0.65
  };

  $.getJSON(domainsUrl, function (domains) {
    domainLayer = L.geoJson(domains, {
      style: myStyle
    });

    domainLayer.on('dblclick', function(e){
      _self.map.fire('dblclick', e);
    });

    var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    });

    var enabledUILayers = {"Domain Outlines" : domainLayer, "Satellite": googleSat}

    L.control.layers(null, enabledUILayers , {position: 'topleft', collapsed: false}).addTo(_self.map);

    window.mapState.enabledUILayers = enabledUILayers;
  });
}

Drupal.behaviors.neon_map = {
  detach: function() {

    // Track which layers are active in order to re-enable them after the map is drawn.
    var activeLayers = [];

    window.mapState = {};

    $('.leaflet-control-layers-overlays label').each(
      function(i, k, l){
        var checked = $(k).find('input:checked');

        if(checked.length > 0){
          activeLayers.push($(k).find('span').text());
        }
      }
    );

    window.mapState.activeLayers = activeLayers;
  },

  attach: function() {

    var neonMap,
    fieldSitesData = {},
    domainsDataUrl,
    mapSettings = {};

    fieldSitesData = Drupal.settings.neon_map[Drupal.settings.neon_map.latest_map_data];
    domainsDataUrl = '/' + Drupal.settings.neon_map.domain_geojson;

    mapSettings = {
      domId: 'neon_map',
      fieldSitesData: fieldSitesData,
      domainsDataUrl: domainsDataUrl
    }

    // Individual field site:
    $('#field-site-map-container').once('attach-neon-map', function(){
      $(this).prepend('<div style="height: 350px" id="neon_map"></div>');
      neonMap = new Drupal.neonMap({domId: 'neon_map', fieldSitesData: fieldSitesData, domainsDataUrl: domainsDataUrl});
    });

    // Map page with all sites:
    $('.view-field-sites.view-display-id-field_sites_page').once('neon-field-sites', function(){

      // Hide extra filter options and add more button:
      //var $extraFilters = $(".neon-map--filters--4up");
      var $extraFilters = $("#edit-field-field-site-type-tid-wrapper");

      var $filters = $(this).find('.neon-map--filters');
      // $extraFilters.addClass("is-hidden");
      $('#edit-combine').attr('placeholder', 'Site Name/ID Search');

      $('#map-toggle-more').click(function(){
        $extraFilters.toggleClass("is-hidden");
        $(this).toggleClass('is-open');

        if ($extraFilters.hasClass("is-hidden")){
          mfo = 0;
        }
        else {
          mfo = 1;
          sot = 0;
        }

        return false;
      });

      $('#toggle-fst').click(function(e){
        $(this).toggleClass('open');

        if ($(this).hasClass('open')){
          $('.form-item-field-field-site-type-tid').show();
          fst = 1;
          sot = 0;
        }
        else {
          $('.form-item-field-field-site-type-tid').hide();
          fst = 0;
        }
        return false;
      });


      // Set up autosubmit:
      $('.neon-map--filters').neonAutoSubmit({container: '.view-field-sites'});

      // Make the map:
      $('#neon-map-container').append('<div style="height: 587px" id="neon_map"></div>');

      mapSettings.paddingBottomRight = [$('#block-bean-about-our-field-sites.about--second').find('.block-content').width(), 0]
      neonMap = new Drupal.neonMap(mapSettings);
      neonMap.addDomainLayer();

      $("#neon_map").wrap("<div class='map--wrapper'></div>");

      mapToggle = function() {

        $this = $(this);
        $wrapper = $this.parent();
        $wrapper.find('.link--map-toggle').removeClass('active');
        $this.addClass('active');

        if ($this.hasClass('link--map-toggle--list')) {
          $('.view-field-sites .map--wrapper').hide();
          $('.view-field-sites .view-content').show();
          $('body').data('activeMapToggle', 'map-toggle-list');

          if (history.pushState) {
            history.pushState({}, "List View", Drupal.settings.basePath+'field-sites/field-sites-map/list');
          }
          else {
            window.location.href = Drupal.settings.basePath+"field-sites/field-sites-map#list";
          }
        }
        else {
          $('.view-field-sites .map--wrapper').show();
          $('.view-field-sites .view-content').hide();
          $('body').data('activeMapToggle', 'map-toggle-map');

          if (history.pushState) {
            history.pushState({}, "Map View", Drupal.settings.basePath+'field-sites/field-sites-map');
          }
          else {
            window.location.href = Drupal.settings.basePath+"field-sites/field-sites-map#map";
          }
        }

        return false;
      }

      $('#map-toggle-map').click(mapToggle);
      $('#map-toggle-list').click(mapToggle);

      // Manually check if we are on the list page:
      var suffix = 'list';
      var str = window.location.href;

      if (str.indexOf(suffix, str.length - suffix.length) !== -1) {
        $('#map-toggle-list').trigger('click');
      }

      // If there is already an active toggle, switch to that:
      else if (activeToggleID = $('body').data('activeMapToggle')) {
        $('#' + activeToggleID).trigger('click');
      }
      // Otherwise toggle to map initially:
      else {
        $('#map-toggle-map').trigger('click');
      }
    });

    // Set the active layers based on what was selected prior to ajax.
    setTimeout(function(){
      if(typeof(window.mapState.activeLayers) !== 'undefined'){
        window.mapState.activeLayers.forEach(
          function(activeLayer){
            activeLayer = activeLayer.trim();

            $('.leaflet-control-layers-overlays label').each(
              function(i, control, l){

                var layerText = $(control).find('span').text().trim();

                if(layerText === activeLayer){

                  if(!$(control).find('input:checkbox').prop('checked')) {
                    $(control).click();//attr("checked", true);
                  }
                }
              }
            );
          }
        );
      }
    }, 250);
  }
}

})(jQuery);


(function($) {
  Drupal.behaviors.formUpdate = {
    attach: function(context, settings) {
      $('#views-exposed-form-field-sites-field-sites-page', context).ajaxSuccess(function(){
        if (sot == 0){
          setTimeout(stay_open_menu, 100);
          sot = 1;
        }
      });
    }
  };
})(jQuery);


jQuery(document).ready(function(){
  jQuery('input[name="field_field_site_type_tid[]"]').each(function(){
    jQuery(this).prop("checked", true);
    jQuery(this).parent().addClass("is-checked");
    jQuery(this).parent().addClass("highlight");
  });
});


function stay_open_menu(){
  if (fst == 1){
    jQuery('#toggle-fst').trigger('click');
  }
  if (mfo == 1){
    jQuery('#map-toggle-more').trigger('click');
  }
  console.log('stay_open_menu fst:'+ fst + 'mfo: '+mfo);
}
