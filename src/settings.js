var Settings = new Class({
  // "static" methods
  extend: {
    getInstance: function() {
      if (!this.instance) {
        this.instance = new Settings(localStorage);
      }

      return this.instance;
    }
  },

  // "nonstatic" methods
  initialize: function(file) {
    // sanity check
    if (!file) {
      throw new Error("Missing parameter: file (settings container)");
    }

    this.file = file;
  },

  getProperty: function(name) {
    // sanity check
    if (!name) {
      throw new Error("Missing parameter: name (the setting's name)");
    }

    return this.file[name];
  },

  setProperty: function(name, value) {
    // sanity checks
    if (!name) {
      throw new Error("Missing parameter: name (the setting's name)");
    } else if (!value) {
      throw new Error("Missing parameter: value (the setting's value)");
    }

    this.file[name] = value;
  },

  removeProperty: function(name) {
    // sanity check
    if (!name) {
      throw new Error("Missing parameter: name (the setting's name)");
    }

    if (this.file[name]) {
      delete this.file[name];
    }
  },

  clear: function() {
    this.file.clear();
  }
});
