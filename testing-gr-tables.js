$(function() {

  // ------------------------------------------------------------
  // Preliminary stuff

  // This code comes from Mike Boyle
  //
  // We want to add tooltips to every column header, if applicable
  //
  var tooltipHeader = function() {
    var tooltip = this.tooltip;
    if (typeof tooltip !== "undefined") {
      return $("<a>").addClass("tooltip").prop("title", tooltip).text(this.title);
    } else {
      return $("<div>").text(this.title);
    }
  };

  // Add the tooltip to any text fields
  jsGrid.fields.text.prototype.headerTemplate = tooltipHeader;
  jsGrid.fields.checkbox.prototype.headerTemplate = tooltipHeader;

  // ------------------------------------------------------------

  var tableURL = "tables.json";

  var bibURL = "biblio-filtered.json";
  var bibData = null;

  var mangleAuthors = function(authString) {
    var auths = authString
        .split(" and ")
        .map(str =>  str.split(",", 1)[0]);

    switch (auths.length) {
    case 1:
      return auths[0];
    case 2:
      return auths.join(' and ');
    default:
      return auths[0] + ' et al.';
    }
  }

  var processBib2JSONEntry = function(entry) {
    var fields = entry.Fields;
    fields.ObjectType = entry.ObjectType;
    fields.EntryType  = entry.EntryType;
    fields.EntryKey   = entry.EntryKey;
    fields.author     = mangleAuthors(fields.author);
    return fields;
  };

  // ------------------------------------------------------------

  var selectedBibs = {};

  // ------------------------------------------------------------
  // Custom field for entry with bibrefs

  var MyTextBibField = function(config) {
    jsGrid.TextField.call(this, config);
  };

  MyTextBibField.prototype = new jsGrid.TextField({

    css: "ref-cell",            // redefine general property 'css'
    align: "center",            // redefine general property 'align'

    // customProp: "",                 // custom property
    headerTemplate: tooltipHeader,

    sorter: function(entry1, entry2) {
      if (entry1.val < entry2.val)
        return -1;
      if (entry1.val > entry2.val)
        return 1;
      return 0;
    },

    itemTemplate: function(entry, item) {
      var theory = item.theory;
      var myName = theory + ':' + this.name; // this.name is the name of the *field*

      var haveBibs = entry.refs.length > 0;
      var disabledText = haveBibs ? '' : ' disabled';

      var shouldBeChecked = myName in selectedBibs;
      var checkedText = shouldBeChecked ? ' checked' : '';

      var innerHTML = '<div><input type="checkbox" id="' + myName
          + '" class="bibCheck"' + checkedText + disabledText
          + '><label for="' + myName + '">';
      innerHTML += entry.val;
      if (haveBibs) {
        innerHTML += ' [' + entry.refs.length.toString();
        innerHTML += '&nbsp;<i class="fa fa-files-o" aria-hidden="true"></i>]';
      }
      innerHTML += '</label></div>';

      var el =
          haveBibs ? // Yes, have biblios, make clickable:
          $(innerHTML)
          .find("input")
          .on("change", function() {
            if ( $(this).is(":checked") ) {
              selectedBibs[myName] = entry.refs;
            } else {
              delete selectedBibs[myName];
            };
            $("#bibGrid").jsGrid("loadData", selectedBibs);
          })
          .end()
          : // No, don't have biblios, not clickable
          $(innerHTML);

      return el;
    },
  });

  jsGrid.fields.textBib = MyTextBibField;

  // ------------------------------------------------------------
  // Make the magic happen

  // Thanks to Mike Boyle for the following tip
  var reJax = function() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  };

  $.ajax({
    type: "GET",
    url: tableURL,
    dataType: "JSON"
  }).done( function(response) {

    // Grid 1
    $("#theoryPropGrid").jsGrid({
      height: "18em",
      width: "99%",

      onRefreshed: reJax,
      onDataLoaded: reJax,

      sorting: true,
      paging: false,
      pageLoading: false,
      autoload: true,
      selecting: false,

      controller: {
        loadData: function(filter) {
          return response;
        }
      },

      fields: [
        { name: "theory", type: "text", title: "Theory", width: "15em" },
        { name: "scalar", type: "checkbox", title: "S", width: "2em" },
        { name: "pseudoscalar", type: "checkbox", title: "P", width: "2em" },
        { name: "vector", type: "checkbox", title: "V", width: "2em" },
        { name: "tensor", type: "checkbox", title: "T", width: "2em" },
        { name: "weakEP", type: "checkbox", title: "Weak EP", width: "4em" },
        { name: "strongEP", type: "checkbox", title: "Strong EP", width: "4em" },
        { name: "masslessGraviton", type: "checkbox", title: "Massless graviton", width: "5.5em" },
        { name: "localLorentz", type: "checkbox", title: "Lorentz symmetry", width: "5.5em" },
        { name: "linearT", type: "checkbox", title: "Linear \\(T_{\\mu\\nu}\\)", width: "4em" },
        { name: "wellPosed", type: "textBib", title: "Well posed", width: "5em" },
      ],
    });

    // Grid 2
    $("#BHPropGrid").jsGrid({
      height: "18em",
      width: "99%",

      onRefreshed: reJax,
      onDataLoaded: reJax,

      sorting: true,
      paging: false,
      pageLoading: false,
      autoload: true,
      selecting: false,

      controller: {
        loadData: function(filter) {
          return response;
        }
      },

      fields: [
        { name: "theory", type: "text", title: "Theory", width: "15em" },
        { name: "BHNR", type: "textBib", title: "Non-rotating", width: "5.5em" },
        { name: "BHSR", type: "textBib", title: "Slow rotation", width: "5.5em" },
        { name: "BHFR", type: "textBib", title: "Rapid rotation",  width: "5.5em" },
        { name: "BHstab", type: "textBib", title: "Stability", width: "5.5em" },
        { name: "BHgeod", type: "textBib", title: "Geodesics", width: "5.5em" },
        { name: "BHquad", type: "textBib", title: "Quadrupole", width: "auto" },
      ],
    });

    // Grid 3
    $("#NSPropGrid").jsGrid({
      height: "18em",
      width: "99%",

      onRefreshed: reJax,
      onDataLoaded: reJax,

      sorting: true,
      paging: false,
      pageLoading: false,
      autoload: true,
      selecting: false,

      controller: {
        loadData: function(filter) {
          return response;
        }
      },

      fields: [
        { name: "theory", type: "text", title: "Theory", width: "15em" },
        { name: "NSNR", type: "textBib", title: "Non-rotating", width: "5em" },
        { name: "NSSR", type: "textBib", title: "Slow rotation", width: "5em" },
        { name: "NSFR", type: "textBib", title: "Rapid rotation", width: "5em" },
        { name: "NScollapse", type: "textBib", title: "Collapse", width: "5em" },
        { name: "NSsens", type: "textBib", title: "Sensitivities", width: "6em" },
        { name: "NSstab", type: "textBib", title: "Stability", width: "5em" },
        { name: "NSgeod", type: "textBib", title: "Geodesics", width: "auto" },
      ],
    });

    // Grid 4
    $("#ConsGrid").jsGrid({
      height: "18em",
      width: "99%",

      onRefreshed: reJax,
      onDataLoaded: reJax,

      sorting: true,
      paging: false,
      pageLoading: false,
      autoload: true,
      selecting: false,

      controller: {
        loadData: function(filter) {
          return response;
        }
      },

      fields: [
        { name: "theory", type: "text", title: "Theory", width: "15em" },
        { name: "weakFieldConstr", type: "textBib", title: "Weak-field constraints", width: "auto" },
      ],
    });

    // End 'done()' loading AJAX

  }).fail( function(jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  });

  // ---------- Biblio stuff ----------

  // TODO make a custom row renderer for bib entries?

  var formatTitle = function(titleText, bibEntry) {
    var hasDOI    = 'doi' in bibEntry;
    var hasEprint = 'eprint' in bibEntry;

    var itemText = '';

    if (hasDOI) {
      itemText = '<a href="https://dx.doi.org/'
        + bibEntry.doi + '">' + titleText + '</a>';
    } else {
      itemText = titleText;
    };

    if (hasEprint) {
      itemText += ' [<a href="https://arxiv.org/abs/'
        + bibEntry.eprint + '">' + bibEntry.eprint
        + '</a>]';
    };

    return itemText;
  };

  // Load the biblio table

  $.ajax({
    type: "GET",
    url: bibURL,
    dataType: "JSON"
  }).done( function(response) {

    bibData = response.map(processBib2JSONEntry);

    $("#bibGrid").jsGrid({
      height: "18em",
      width: "99%",

      sorting: true,
      paging: false,
      pageLoading: false,
      autoload: true,
      selecting: false,

      controller: {
        loadData: function(bibDict) {

          var filter = [];

          if(bibDict instanceof Object)
            for (key in bibDict)
              if (bibDict[key] instanceof Array)
                filter = filter.concat(bibDict[key]);

          if (filter.length == 0)
            return bibData;
          else
            return bibData.filter(function(bibEntry) {
              return filter.includes(bibEntry.EntryKey);
            });
        }
      },

      fields: [
        { name: "author", type: "text", title: "Author(s)", width: "14em" },
        { name: "year", type: "text", title: "Year", width: "3.5em" },
        { name: "title", type: "text", title: "Title", width: "auto",
          itemTemplate: formatTitle, },
        { name: "journal", type: "text", title: "Journal", width: "10em" },
        { name: "volume", type: "text", title: "Vol.", width: "4em" },
      ]
    });

  }).fail( function(jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  });

});
