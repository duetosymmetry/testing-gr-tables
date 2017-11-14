---
layout: archive
permalink: /testing-gr-tables/
title: "Testing GR tables"
author_profile: true
scripts: |
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid.min.js"></script>
  <script type="text/javascript" src="testing-gr-tables.js"></script>
---

<p>Write some intro text here</p>

<link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid.min.css" />
<link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid-theme.min.css" />

<link type="text/css" rel="stylesheet" href="testing-gr-table-tweaks.css" />

<div id="mainTablesAndSels">
<!-- radio button selectors -->
<input id="theoryPropSel" type="radio" name="tabSelect" checked>
<label for="theoryPropSel" class="tabSelectLabel">Theory properties</label>
<input id="BHPropSel" type="radio" name="tabSelect">
<label for="BHPropSel" class="tabSelectLabel">Black holes</label>
<input id="NSPropSel" type="radio" name="tabSelect">
<label for="NSPropSel" class="tabSelectLabel">Neutron stars</label>
<input id="consSel" type="radio" name="tabSelect">
<label for="consSel" class="tabSelectLabel">Constraints</label>
<!-- main tables -->
<div id="theoryPropGrid" class="defaultHidden"></div>
<div id="BHPropGrid" class="defaultHidden"></div>
<div id="NSPropGrid" class="defaultHidden"></div>
<div id="ConsGrid" class="defaultHidden"></div>
</div>


# (Selected) References

<div id="bibGrid"></div>
