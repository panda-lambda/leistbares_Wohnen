
      var dictAff = {};
      var dataLayer;
      var popup;

      /*______________________SLIDER AND CALCULATIONS_________________________*/
      var slider = document.getElementById("myRange");
      var output = document.getElementById("demo");
      var miete = document.getElementById("miete");
      slider.value = 1872;
      output.innerHTML = slider.value;
      miete.innerHTML = formatNumber((slider.value * 0.4).toFixed(2)); // Display the default slider value
      var num = slider.value * 0.4;

      /*_______________calculate percentage of affordable housing per zählbezirk________*/
      function percentAfford(data) {
        for (var i in data) {
          if (!(data[i].ZBEZ + "percent" in dictAff)) {
            if (dictAff[data[i].ZBEZ + "count"] > 0)
              dictAff[data[i].ZBEZ + "percent"] =
                (100 * dictAff[data[i].ZBEZ + "afford"]) /
                dictAff[data[i].ZBEZ + "count"];
            else dictAff[data[i].ZBEZ + "percent"] = 0;
          }
        }
      }

      /*________________calculate affordable housing ads________________________*/
      function calcAfford(data) {
        for (var i in data) {
          if (!(data[i].ZBEZ + "afford" in dictAff))
            dictAff[data[i].ZBEZ + "afford"] = 0;
           if (data[i].PRICE <= num) dictAff[data[i].ZBEZ + "afford"]++;
        }
      }

      /*______________reset and recalculate for slider input_________________________*/
      function resetAfford(data) {
        console.log(num);
        for (var j in data) {
          delete dictAff[data[j].ZBEZ + "afford"];
          delete dictAff[data[j].ZBEZ + "percent"];
        }
        calcAfford(data);
        percentAfford(data);
      }

      /*_____ create a dictionary for every zählbezirk and count number of ads_______*/
      function initDict(data) {
        for (var i in data) {
          //console.log(data[i]);
          if (!(data[i].ZBEZ + "count" in dictAff))
            dictAff[data[i].ZBEZ + "count"] = 1;
          else dictAff[data[i].ZBEZ + "count"]++;
        }
        calcAfford(data);
        percentAfford(data);
      }

      /*____________ Read markers data from data.csv_________________*/
      var test = {};
      $.get("./data/scraped_data.csv", function (csvString) {
        // Use PapaParse to convert string to array of objects
        var data = Papa.parse(csvString, {
          header: true,
          dynamicTyping: false,
        }).data;
        //console.log(data);
        data.pop();
        //console.log(data);
        initDict(data);

        //console.log(dictAff);

        // Update the current slider value (each time you drag the slider handle)
        slider.oninput = function () {
          output.innerHTML = this.value;
          miete.innerHTML = formatNumber((this.value * 0.4).toFixed(2));
          num = this.value * 0.4;
          resetAfford(data);
          //console.log(dictAff)
          dataLayer.eachLayer(function (layer) {
            layer.setStyle(getStyle(num, layer.feature.properties.ZBEZ))
            if (
              layer.feature.properties.ZBEZ + "percent" in dictAff &&
              dictAff[layer.feature.properties.ZBEZ + "count"] > 2
            )
            layer.bindPopup(

              "<h3>Bezirk:" +
                layer.feature.properties.BEZNR+
                ". </h3>Prozent: " +
                (dictAff[layer.feature.properties.ZBEZ+"afford"]/dictAff[layer.feature.properties.ZBEZ + "count"]*100).toFixed(2)
               
               + "%<br> ("+
               dictAff[layer.feature.properties.ZBEZ+"afford"]+
                " von "+                dictAff[layer.feature.properties.ZBEZ + "count"] +
                ") leistbar."
            );
            ;
          });


        };

        //set polygons
        $.getJSON("/data/zaehlbezirke.json", function (geojson) {
          dataLayer = L.geoJson(geojson, {
            style: function (feature) {
              return getStyle(num, feature.properties.ZBEZ);
            },
            onEachFeature: function (feature, layer) {
              if (
                feature.properties.ZBEZ + "percent" in dictAff &&
                dictAff[feature.properties.ZBEZ + "count"] > 2
              )
                layer.bindPopup(
                  "<div class='lead'><h3 >Bezirk: " +
              feature.properties.BEZNR +
              ".</h3>Prozent: " +
                    dictAff[feature.properties.ZBEZ + "percent"].toFixed(2) +
                    " %<br>"+ dictAff[feature.properties.ZBEZ +"afford"]+ " von " +
                    dictAff[feature.properties.ZBEZ + "count"] +
                    " leistbar.</div>"
                );
              else {
                layer.bindPopup("Weniger als drei Anzeigen gefunden!");
              }
            },
          });
          dataLayer.addTo(map);
        });
      }).data;

      var colors = [
        "#d7191c",
        "#d7191c",
        "#FF5733",
        "#FFBF00",
        "#b0ee69",
        "#1a9641",
      ];

      function getStyle(num, bez) {
        //var colors = ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850']
        //var colors = ['#d7191c','#fdae61','#ffffbf','#a6d96a','#1a9641']
        if (dictAff[bez + "count"] > 2)
          return {
            color: "white",
            weight: 0.7,
            fillColor: colors[Math.ceil(dictAff[bez + "percent"] / 20)],
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
      function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      }
      /*_______________________MAP______________________*/
      var corner1 = L.latLng(48.592068608972926, 15.00),
corner2 = L.latLng(47.68861574350476, 18.69546045333536),
bounds = L.latLngBounds(corner1, corner2);
      
      var map = L.map("map",{
        minZoom: 11 //limit zooming out
    }).setView([48.21934, 16.37], 11);
      map.setMaxBounds(bounds);
         
      $.getJSON("/data/vienna.geojson", function (data) {
        var invertLayer =L.geoJson(data, {
          color: "white",
            fillColor: "#6a2452",
            fillOpacity: 1,
            weight: 0.0,
        invert:true,
        renderer: L.svg({ padding: 1 })
      }).addTo(map);})

      var tiles = L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 17,
          minZoom: 8,
          //opacity: 0.2,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }
      ).addTo(map);

     //var invertLayer; 
     
        

      /*Legend specific*/
      var legend = L.control({ position: "bottomleft" });

      legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Legende</h4>";
        div.innerHTML +=
          '<i style="background:' + colors[1] + ' "></i><span>0-20%</span><br>';
        div.innerHTML +=
          '<i style="background:' + colors[2] + '"></i><span>20-40%</span><br>';
        div.innerHTML +=
          '<i style="background: ' +
          colors[3] +
          '"></i><span>40-60%</span><br>';
        div.innerHTML +=
          '<i style="background: ' +
          colors[4] +
          '"></i><span>60-80%</span><br>';
        div.innerHTML +=
          '<i style="background: ' +
          colors[5] +
          '"></i><span>80-100%</span><br>';
        div.innerHTML +=
          '<i style="background: #D3D3D3"></i><span>weniger als 3 Anzeigen</span><br>';
        //div.innerHTML += '<i class="icon" style="background-image: url(https://d30y9cdsu7xlg0.cloudfront.net/png/194515-200.png);background-repeat: no-repeat;"></i><span>Grænse</span><br>';

        return div;
      };

      legend.addTo(map);
    