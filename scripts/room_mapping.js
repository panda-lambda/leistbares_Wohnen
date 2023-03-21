var dictAff2 = {};
var dataLayer2;

/*______________________SLIDER AND CALCULATIONS_________________________*/
var slider2 = document.getElementById("myRange2");
var output2 = document.getElementById("demo2");
var miete2 = document.getElementById("miete2");
var roomnum= document.getElementById("roomnum");

slider2.value = 1;
var income = 25345; //18046 25% perzentil 25345 50%(median)
output2.innerHTML = formatNumber((income / 12).toFixed(2));
miete2.innerHTML = formatNumber(((income / 12) * 0.4).toFixed(2));
var households = document.getElementById("numofhouseholds");
roomnum.innerHTML=" für <strong>1 bis 2</strong> Zimmer-Wohnungen"

households.innerHTML = slider2.value;

var num2 = (income / 12) * 0.4;

function setIncome(chosenIncome){
  if (chosenIncome==25)
income =18046 ; 
else if(chosenIncome==50)
income = 25345;
slider2.oninput()

}
// Display the default slider2 value

/*_______________calculate percentage of affordable housing per zählbezirk________*/
function percentAfford2(data2) {
  for (var i in data2) {
    if (!(data2[i].ZBEZ + "percent" in dictAff2)) {
      if (dictAff2[data2[i].ZBEZ + "count"] > 0)
        dictAff2[data2[i].ZBEZ + "percent"] =
          (100 * dictAff2[data2[i].ZBEZ + "afford"]) /
          dictAff2[data2[i].ZBEZ + "count"];
      else dictAff2[data2[i].ZBEZ + "percent"] = 0;
    }
  }
}

/*________________calculate affordable housing ads________________________*/
function calcAfford2(data2) {
  hzahl = parseFloat(households.innerHTML);
  console.log(hzahl);
  for (var i in data2) {
    //überbelag -> https://wohnberatung-wien.at/footer/glossar
    if (!(data2[i].ZBEZ + "afford" in dictAff2))
      dictAff2[data2[i].ZBEZ + "afford"] = 0;
    if (parseFloat(data2[i].PRICE) <= num2) {
      switch (hzahl) {
        case 1:
          if (parseFloat(data2[i].NUMBER_OF_ROOMS) < 3)
            dictAff2[data2[i].ZBEZ + "afford"]++;
          break;
        case 2:
          if (
            parseFloat(data2[i].NUMBER_OF_ROOMS) > 1 &&
            parseFloat(data2[i].NUMBER_OF_ROOMS) < 4
          )
            dictAff2[data2[i].ZBEZ + "afford"]++;
          break;
        case 3:
          if (
            parseFloat(data2[i].NUMBER_OF_ROOMS) > 2 &&
            parseFloat(data2[i].NUMBER_OF_ROOMS) < 5
          )
            dictAff2[data2[i].ZBEZ + "afford"]++;
          break;
        case 4:
          if (
            parseFloat(data2[i].NUMBER_OF_ROOMS) > 2 &&
            parseFloat(data2[i].NUMBER_OF_ROOMS) < 6
          )
            dictAff2[data2[i].ZBEZ + "afford"]++;
          break;
        case 5:
          if (
            parseFloat(data2[i].NUMBER_OF_ROOMS) > 3 &&
            parseFloat(data2[i].NUMBER_OF_ROOMS) < 7
          )
            dictAff2[data2[i].ZBEZ + "afford"]++;
          break;
       
      }
    }
  }
}

/*______________reset and recalculate for slider2 input_________________________*/
function resetAfford2(data2) {
  console.log(num2);
  for (var j in data2) {
    delete dictAff2[data2[j].ZBEZ + "afford"];
    delete dictAff2[data2[j].ZBEZ + "percent"];
  }
  calcAfford2(data2);
  percentAfford2(data2);
}

/*_____ create a dictionary for every zählbezirk and count number of ads_______*/
function initDict2(data2) {
  for (var i in data2) {
    //console.log(data[i]);
    if (!(data2[i].ZBEZ + "count" in dictAff2))
      dictAff2[data2[i].ZBEZ + "count"] = 1;
    else dictAff2[data2[i].ZBEZ + "count"]++;
  }
  calcAfford2(data2);
  percentAfford2(data2);
}

/*____________ Read markers data from data.csv_________________*/
var test = {};

//$.get("/data/data_mitZaehlbez.csv", function (csvString) {
$.get("./data/scraped_data.csv", function (csvString2) {
  // Use PapaParse to convert string to array of objects
  var data2 = Papa.parse(csvString2, {
    header: true,
    dynamicTyping: false,
  }).data;
  console.log("2.map");
   console.log(data2);
  data2.pop();
  //console.log(data2);
  initDict2(data2);

  //console.log(dictAff2);

  // Update the current slider2 value (each time you drag the slider2 handle)
  slider2.oninput = function () {
     slider2 = document.getElementById("myRange2");
     output2 = document.getElementById("demo2");
     miete2 = document.getElementById("miete2");
    roomnum= document.getElementById("roomnum");
    households = document.getElementById("numofhouseholds");

    households.innerHTML = slider2.value;

    switch (slider2.value) {
      case "1":
        output2.innerHTML = formatNumber((income / 12).toFixed(2));
        miete2.innerHTML = formatNumber(((income / 12) * 0.4).toFixed(2));
        roomnum.innerHTML=" für <strong>1 bis 2</strong> Zimmer-Wohnungen"
        num2 = (income / 12) * 0.4;
        break;

      case "2":
        output2.innerHTML = formatNumber(((income / 12) * 1.5).toFixed(2));
        miete2.innerHTML = formatNumber(((income / 12) * 0.4 * 1.5).toFixed(2));
        num2 = (income / 12) * 0.4 * 1.5;
        roomnum.innerHTML=" für <strong>2 bis 3</strong> Zimmer-Wohnungen"
        break;

      case "3":
        output2.innerHTML = formatNumber(((income / 12) * 1.8).toFixed(2));
        miete2.innerHTML = formatNumber(((income / 12) * 0.4 * 1.8).toFixed(2));
        num2 = (income / 12) * 0.4 * 1.8;
        roomnum.innerHTML=" für <strong>3 bis 4</strong> Zimmer-Wohnungen"
        break;
      case "4":
        output2.innerHTML = formatNumber(((income / 12) * 2).toFixed(2));
        miete2.innerHTML = formatNumber(((income / 12) * 0.4 * 2).toFixed(2));
        num2 = (income / 12) * 0.4 * 2.1;
        roomnum.innerHTML=" für <strong>3 bis 4</strong> Zimmer-Wohnungen"
        break;
      case "5":
        output2.innerHTML = formatNumber(((income / 12) * 2.3).toFixed(2));
        miete2.innerHTML = formatNumber(((income / 12) * 0.4 * 2.3).toFixed(2));
        num2 = (income / 12) * 0.4 * 2.4;
        roomnum.innerHTML=" für <strong>4 bis 5</strong> Zimmer-Wohnungen"
        break;
    }
    resetAfford2(data2);
    console.log(dictAff2);
    dataLayer2.eachLayer(function (layer2) {
      layer2.setStyle(getStyle2(num2, layer2.feature.properties.ZBEZ));
      if (
        layer2.feature.properties.ZBEZ + "percent" in dictAff2 &&
        dictAff2[layer2.feature.properties.ZBEZ + "count"] > 2
      )
        layer2.bindPopup(
          "<h3>Bezirk: " +
            layer2.feature.properties.BEZNR +
            ".</h3>Prozent: " +
            (
              (dictAff2[layer2.feature.properties.ZBEZ + "afford"] /
                dictAff2[layer2.feature.properties.ZBEZ + "count"]) *
              100
            ).toFixed(2) +
            "%<br> (" +
            dictAff2[layer2.feature.properties.ZBEZ + "afford"] +
            " von " + //dictAff2[layer.feature.properties.ZBEZ +"afford"]+ " von " +
            dictAff2[layer2.feature.properties.ZBEZ + "count"] +
            ") leistbar sowie zwischen " +
            slider2.value +
            " und " +
            (parseFloat(slider2.value) + 1) +
            " Zimmer."
        );
    });
  };

  //set polygons
  $.getJSON("/data/zaehlbezirke.json", function (geojson) {
    dataLayer2 = L.geoJson(geojson, {
      style: function (feature2) {
        return getStyle2(num2, feature2.properties.ZBEZ);
      },
      onEachFeature: function (feature2, layer2) {
        if (
          feature2.properties.ZBEZ + "percent" in dictAff2 &&
          dictAff2[feature2.properties.ZBEZ + "count"] > 2
        )
          layer2.bindPopup(
            "<div class='lead'><h3 >Bezirk: " +
              feature2.properties.BEZNR +
              ".</h3>Prozent: " +
              dictAff2[feature2.properties.ZBEZ + "percent"].toFixed(2) +
              " %<br>" +
              dictAff2[feature2.properties.ZBEZ + "afford"] +
              " von " +
              dictAff2[feature2.properties.ZBEZ + "count"] +
              " leistbar sowie zwischen " +
              slider2.value +
              " und " +
              (parseFloat(slider2.value) + 1) +
              " Zimmer.</div>"
          );
        else {
          layer2.bindPopup("Weniger als drei Anzeigen gefunden!");
        }
      },
    });
    dataLayer2.addTo(map2);
  });
}).data2;

var colors = ["#d7191c", "#d7191c", "#FF5733", "#FFBF00", "#b0ee69", "#1a9641"];

function getStyle2(num2, bez) {
  //var colors = ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850']
  //var colors = ['#d7191c','#fdae61','#ffffbf','#a6d96a','#1a9641']
  if (dictAff2[bez + "count"] > 2)
    return {
      color: "white",
      weight: 0.7,
      fillColor: colors[Math.ceil(dictAff2[bez + "percent"] / 20)],
      fillOpacity: 0.6,
    };
  else
    return {
      color: "white",
      fillColor: "#D3D3D3",
      fillOpacity: 0.6,
      weight: 0.7,
    };
}
function formatNumber(num2) {
  return num2.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
/*_______________________MAP______________________*/
var corner1 = L.latLng(48.592068608972926, 15.0),
  corner2 = L.latLng(47.68861574350476, 18.69546045333536),
  bounds = L.latLngBounds(corner1, corner2);

var map2 = L.map("map2", {
  minZoom: 11, //limit zooming out
}).setView([48.21934, 16.37], 11);
map2.setMaxBounds(bounds);

$.getJSON("/data/vienna.geojson", function (data2) {
  var invertLayer = L.geoJson(data2, {
    color: "white",
    fillColor: "#6a2452",
    fillOpacity: 1,
    weight: 0.0,
    invert: true,
    renderer: L.svg({ padding: 1 }),
  }).addTo(map2);
});

var tiles2 = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  minZoom: 8,
  //opacity: 0.2,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map2);

//var invertLayer;

/*Legend specific*/
var legend2 = L.control({ position: "bottomleft" });

legend2.onAdd = function (map2) {
  var div2 = L.DomUtil.create("div", "legend");
  div2.innerHTML += "<h4>Legende</h4>";
  div2.innerHTML +=
    '<i style="background:' + colors[1] + ' "></i><span>0-20%</span><br>';
  div2.innerHTML +=
    '<i style="background:' + colors[2] + '"></i><span>20-40%</span><br>';
  div2.innerHTML +=
    '<i style="background: ' + colors[3] + '"></i><span>40-60%</span><br>';
  div2.innerHTML +=
    '<i style="background: ' + colors[4] + '"></i><span>60-80%</span><br>';
  div2.innerHTML +=
    '<i style="background: ' + colors[5] + '"></i><span>80-100%</span><br>';
  div2.innerHTML +=
    '<i style="background: #D3D3D3"></i><span>weniger als 3 Anzeigen</span><br>';
  //div.innerHTML += '<i class="icon" style="background-image: url(https://d30y9cdsu7xlg0.cloudfront.net/png/194515-200.png);background-repeat: no-repeat;"></i><span>Grænse</span><br>';

  return div2;
};

legend2.addTo(map2);
