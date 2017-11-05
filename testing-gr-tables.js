$(function() {

  // ------------------------------------------------------------
  // Preliminary stuff

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

      var el = $(innerHTML)
          .find("input")
          .on("change", function() {
            if ( $(this).is(":checked") ) {
              selectedBibs[myName] = entry.refs;
            } else {
              delete selectedBibs[myName];
            };
            $("#bibGrid").jsGrid("loadData", selectedBibs);
          })
          .end();

      return el;
    },
  });

  jsGrid.fields.textBib = MyTextBibField;

  // ------------------------------------------------------------
  // Make the magic happen

  // Thanks to Mike Boyle for the following tip
  var reJax = function() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "grid"]);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "column_selectors"]);
  };

  $.ajax({
    type: "GET",
    url: tableURL,
    dataType: "JSON"
  }).done( function(response) {

    // Grid 1
    $("#theoryPropGrid").jsGrid({
      height: "20em",
      width: "100%",

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
        { name: "theory", type: "text", title: "Theory" },
        { name: "scalar", type: "checkbox", title: "S", width: 15 },
        { name: "pseudoscalar", type: "checkbox", title: "P", width: 15 },
        { name: "vector", type: "checkbox", title: "V", width: 15 },
        { name: "tensor", type: "checkbox", title: "T", width: 15 },
        { name: "strongEP", type: "checkbox", title: "Strong EP", width: 25 },
        { name: "masslessGraviton", type: "checkbox", title: "Massless graviton", width: 25 },
        { name: "localLorentz", type: "checkbox", title: "Lorentz symmetry", width: 25 },
        { name: "linearT", type: "checkbox", title: "Linear \\(T_{\\mu\\nu}\\)", width: 25 },
        { name: "weakEP", type: "checkbox", title: "Weak EP", width: 25 },
        { name: "wellPosed", type: "textBib", title: "Well posed", width: 25 },
      ],
    });

    // Grid 2
    $("#BHPropGrid").jsGrid({
      height: "20em",
      width: "100%",

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
        { name: "theory", type: "text", title: "Theory" },
      ],
    });

    // Grid 3
    $("#NSPropGrid").jsGrid({
      height: "20em",
      width: "100%",

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
        { name: "theory", type: "text", title: "Theory" },
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
  
  $.ajax({
    type: "GET",
    url: bibURL,
    dataType: "JSON"
  }).done( function(response) {

    bibData = response.map(processBib2JSONEntry);

    $("#bibGrid").jsGrid({
      height: "20em",
      width: "100%",

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
        { name: "author", type: "text", title: "Author(s)", width: 60 },
        { name: "year", type: "text", title: "Year", width: 15 },
        { name: "title", type: "text", title: "Title",
          itemTemplate: formatTitle, },
        { name: "journal", type: "text", title: "Journal", width: 60 },
        { name: "volume", type: "text", title: "Vol.", width: 25 },
      ]
    });

  }).fail( function(jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  });

});
