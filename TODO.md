

* ~~TODO: add map of cluster to display panel.~~
* ~~TODO: make cluster map image responsive.~~ 
* ~~TODO: import and export clusters using JSON files.~~
* ~~TODO: Autogenerate new clusters~~
* ~~TODO: Add new clusters, systems, connect systems.~~
* ~~TODO: Implement JSON schema validation for imported / exported data files.~~
* TODO: be able to rotate orientation of map. 
  * Currently commented out code to do this as it was problematic and needs to be revisted. 
  * Feature working with the cluster orientation setting now by manually changing a setting. 
  * Need to roll that code into a form that can be triggered with a media query.  
  * Needs more thought.
* TODO: Connect clusters.
  * Render cluster straits different from system straits, and leading off to the nearest edge of cluster map.
  * Implement a scaled out map view showing all clusters and their connections? 
  * Use that map to navigate between clusters?
  * Support trip planning across clusters using the cluster straits.
  * Implement a setting to control whether cluster connections for auto-generating clusters should be created. (e.g. 
    when on, new clusters get connected to the existing clusters randomly.)
* TODO: add persistence layer, first cut just use LocalStorage
* TODO: auto-layout for cluster map. Maybe just make the map editable.
  * Partially done with autogenerate new clusters feature.  Need to rework that code
    to be able to choose either the locations stored in the cluster data, or different algorithmic views of
    the current cluster, like a straight line view, a circle view. Possibly implement a force directed
    graph algorithm.
* TODO: 3D positions of systems, imported from real world near space astronomical data, per
  * https://www.projectrho.com/starmap.html
* TODO: Edit cluster and system in the UI, save in persistence layer.
* TODO: Implement server side APIs for storage using something like MongoDB
* TODO: Add user accounts, including separate storage space per user.
* TODO: Add groups, permissions on data structures.

* THOUGHT: Add ships, characters and where they are in the cluster.
