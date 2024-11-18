

* ~~TODO: add map of cluster to display panel.~~
* ~~TODO: make cluster map image responsive.~~ 
* ~~TODO: import and export clusters using JSON files.~~
* ~~TODO: Autogenerate new clusters~~
* ~~TODO: Add new clusters, systems, connect systems.~~
* TODO: auto-layout for cluster map. Maybe just make the map editable.
  * Partially done with autogenerate new clusters feature.  Need to rework that code
    to be able to choose either the locations stored in the cluster data, or different algorithmic views of
    the current cluster, like a straight line view, a circle view. Possibly implement a force directed
    graph algorithm.
* TODO: 3D positions of systems, imported from real world near space astronomical data, per
  * https://www.projectrho.com/starmap.html
* TODO: be able to rotate orientation of map. (currently commented out code to do this 
  as it was problematic and needs to be revisted. Working with the cluster orientation setting now by manually setting
  the setting. Need to roll that code into a form that can be triggered with a media query.  Needs more thought.)
* TODO: add persistence layer, first cut just use LocalStorage
* TODO: Implement server side APIs for storage using something like MongoDB
* TODO: Edit cluster and system in the UI, save in persistence layer.
* TODO: Connect clusters.
* TODO: Add user accounts, including separate storage space per user.
* TODO: Add groups, permissions on data structures.

* THOUGHT: Add ships, characters and where they are in the cluster.
