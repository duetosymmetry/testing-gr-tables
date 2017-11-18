---
layout: archive
permalink: /testing-gr-tables/
title: "Testing GR tables"
author_profile: true
scripts: |
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid.min.js"></script>
  <script type="text/javascript" src="testing-gr-tables.js"></script>
---

{% include toc %}

These tables were born in the review article,
Berti et al. (2015), _Testing General Relativity With Present and
Future Astrophysical Observations_,
[Class. Quantum Grav. **32** 243001](http://dx.doi.org/10.1088/0264-9381/32/24/243001)
[[arXiv:1501.07274](https://arxiv.org/abs/1501.07274)]
as Tables 1, 2, and 3.  These were static LaTeX tables, and as this
field is rapidly evolving, were soon out of date.
{:.archive__item-title}

This project is trying to keep them up to date, in a more uniform and
both human- and computer-readable format, as a dynamic web page.
{:.archive__item-title}

# Tables

Click on any cell with a [#&nbsp;<i class="fa fa-files-o"
aria-hidden="true"></i>] symbol
to show those references in the
[references table](#selected-references) below.
Hover over any <a class="tooltip" title="Extra info!">underlined
item</a> to see more information.
{:.archive__item-title}

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

# Sources/How to contribute

The
[git repo for this project is here](https://github.com/duetosymmetry/testing-gr-tables).
TODO more here.
{:.archive__item-title}
