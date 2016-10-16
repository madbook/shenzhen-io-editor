# Shenzhen I/O Editor

A simple editor for displaying and modifying Shenzhen I/O save files.

## Save file parser

Currently, this consists only of a save file parser with a simple web interface.
Load up `index.html` to access it.  It converts the save file to a JSON blob.  Neat!
You can also edit the resulting JSON and convert it back to the original format.

### Trace editor

There's also the start of the visual editor, which currently only supports editing
traces.  Click and drag between adjacent cells to add or remove traces.
