

* ~~TODO: add map of cluster to display panel.~~
* ~~TODO: make cluster map image responsive.~~ 
* ~~TODO: import and export clusters using JSON files.~~
* ~~TODO: Autogenerate new clusters~~
* ~~TODO: Add new clusters, systems, connect systems.~~
* ~~TODO: Implement JSON schema validation for imported / exported data files.~~
* ~~TODO: be able to rotate orientation of map.~~ 
  ~~* Currently commented out code to do this as it was problematic and needs to be revisted.~~
~~* Feature working with the cluster orientation setting now by manually changing a setting.~~
~~* Need to roll that code into a form that can be triggered with a media query.~~
~~* Needs more thought.~~
  ~~* There are two "layout" options:~~
    ~~* First relies on the cluster's systems' position attribute for system positions.~~
    ~~* Second uses a circular layout, and calculates each systems' position based on a circle that fits within the
        viewport, each consecutive system is spaced evenly around the circle, with the first system at 3:00 (0 degrees).~~
  ~~* There is a portrait/landscape setting rotates the positions of the systems 90 degrees counterclockwise, regardless
      of the layout selected.~~
~~* Implementation plan~~
  ~~* Remove portrait/landscape setting, keep the code that rotates the system positions.~~
  ~~* Render 1 or 2 versions of the cluster map:~~
    ~~* Calculate the bounding box aspect ratio for the systems' position attributes.~~
    ~~* If the layout setting is "circular" OR the aspect ratio is squarish (between 0.8 and 1.2?)~~
      ~~* Render 1 version based on the layout's positions~~
      ~~* Do not apply any container queries, as the circular layout or the native aspect ratio looks fine regardless of
          the aspect ratio of the viewport.~~
    ~~* Else the setting is not "circular" and the aspect ratio is either landscape or portrait.~~
      ~~* Render 2 versions of the map, 1 with the native system positions, and 1 with the rotated system positions.~~
      ~~* Mark each of the versions as "landscape" or "portrait".~~
      ~~* Use a container query to choose which of the 2 versions need to be displayed, either the landscape or the portrait
      version.~~
* ~~TODO: add persistence layer, first cut just use LocalStorage~~
  * ~~Only store `clusters` data.~~
  * ~~Also stored mapStyles data. Will put clusters into server-side storage, but not mapStyles, until we get users.~~
* ~~TODO: Move Vue watch() calls that push pinia stores data to LocalStorage into the store definition file instead of main.ts.~~
* TODO: Connect clusters.
  * Render cluster straits different from system straits, and leading off to the nearest edge of cluster map.
  * Implement a scaled out map view showing all clusters and their connections? 
  * Use that map to navigate between clusters?
  * Support trip planning across clusters using the cluster straits.
  * Implement a setting to control whether cluster connections for auto-generating clusters should be created. (e.g. 
    when on, new clusters get connected to the existing clusters randomly.)
* TODO: auto-layout for cluster map. Maybe just make the map editable.
  * Partially done with autogenerate new clusters feature.  Need to rework that code
    ~~to be able to choose either the locations stored in the cluster data, or~~ different algorithmic views of
    the current cluster, like ~~a straight line view, a circle view. Possibly implement~~ a force directed
    graph algorithm.
* TODO: 3D positions of systems, imported from real world near space astronomical data, per
  * https://www.projectrho.com/starmap.html
* TODO: Edit cluster and system in the UI, save in persistence layer.
* ~~TODO: Implement server side APIs for storage using something like MongoDB~~
* TODO: Add user accounts, including separate storage space per user.
* TODO: Add groups, permissions on data structures.

* THOUGHT: Add ships, characters and where they are in the cluster.
