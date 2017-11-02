$(function() {

  // ------------------------------------------------------------
  // Preliminary stuff

  var tableURL = "tables.json";

  var bibURL = "biblio-filtered.json";
  var bibData = null;

  var processBib2JSONEntry = function(entry) {
    var fields = entry.Fields;
    fields.ObjectType = entry.ObjectType;
    fields.EntryType  = entry.EntryType;
    fields.EntryKey   = entry.EntryKey;
    return fields;
  };

  // ------------------------------------------------------------
  // Custom field for entry with bibrefs

  // TODO: Make a custom field for entry with bibrefs

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
      var myName = theory + ':' + this.name;
      var innerHTML = '<input type="checkbox" id="' + myName
          + '" class="bibCheck"><label for="' + myName + '">';
      innerHTML += entry.val;
      if (entry.refs.length > 0) {
        innerHTML += ' [' + entry.refs.length.toString();
        innerHTML += '&nbsp;<i class="fa fa-files-o" aria-hidden="true"></i>]';
      }
      innerHTML += '</label>';

      var el = document.createElement('span');
      el.innerHTML = innerHTML;

      // el.addEventListener('click',function(event) {
      //   console.log($(this).parent());
      //   $(this).parent().toggleClass("active");
      //   return false;
      // });

      return innerHTML;
    },
  });

  jsGrid.fields.textBib = MyTextBibField;

  // ------------------------------------------------------------
  // Make the magic happen

  $.ajax({
    type: "GET",
    url: tableURL,
    dataType: "JSON"
  }).done( function(response) {

    // Grid 1
    $("#theoryPropGrid").jsGrid({
      height: "20em",
      width: "100%",

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
        { name: "scalar", type: "checkbox", title: "S", width: 20 },
        { name: "pseudoscalar", type: "checkbox", title: "P", width: 20 },
        { name: "vector", type: "checkbox", title: "V", width: 20 },
        { name: "tensor", type: "checkbox", title: "T", width: 20 },
        { name: "strongEP", type: "checkbox", title: "Strong EP", width: 25 },
        { name: "masslessGraviton", type: "checkbox", title: "Massless graviton", width: 25 },
        { name: "localLorentz", type: "checkbox", title: "Lorentz symmetry", width: 25 },
        { name: "linearT", type: "checkbox", title: "Linear \\(T_{\\mu\\nu}\\)", width: 25 },
        { name: "weakEP", type: "checkbox", title: "Weak EP", width: 25 },
        { name: "wellPosed", type: "textBib", title: "Well posed", width: 30 },
      ],
    });

    // Grid 2
    $("#BHPropGrid").jsGrid({
      height: "20em",
      width: "100%",

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

  // TODO make a custom row renderer for bib entries
  
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
        loadData: function(filter) {
          // - Check if filter is an array. If not, ignore.
          // - If an empty array, ignore.
          // - If an array of strings, only return those elements from
          //   bibData whose EntryKey fields appear in the filter

          if (!Array.isArray(filter))
            filter = [];

          if (filter.length == 0)
            return bibData;
          else
            return bibData.filter(function(bibEntry) {
              return filter.includes(bibEntry.EntryKey);
            });
        }
      },

      fields: [
        { name: "title", type: "text", title: "Title" },
        { name: "year", type: "text", title: "Year" },
        { name: "journal", type: "text", title: "Journal" },
      ]
    });

  }).fail( function(jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  });

});
