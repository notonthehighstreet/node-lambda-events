export default class {
  constructor(raw) {
    this.raw = raw;
  }

  get data() {
    return this.mapObj(this.raw);
  }

  mapObj(obj) {
    return new Map(Object.entries(obj).forEach(([key, val]) => {
      const type = Object.keys(val)[0];
      return [key, this.mapVal(type, val[type])];
    }));
  }

  mapList(list) {
    return list.map((val) => {
      try {
        switch (typeof val) {
          case 'number':
            return parseFloat(val);
          case 'object':
            if (Object.prototype.toString.call(val).match(/array/i)) {
              return this.mapList(val);
            }
            return this.mapObj(val);
          default:
            return val;
        }
      } catch (e) { return val; }
    });
  }

  mapVal(type, val) {
    switch (type) {
      case 'N':
        return parseFloat(val);
      case 'B':
        return new Buffer(val, 'utf-8');
      case 'BS':
        return val.map(r => new Buffer(r, 'utf-8'));
      case 'NS':
        return val.map(r => parseFloat(r));
      case 'M':
        return this.mapObj(val);
      case 'L':
        return this.mapList(val);
      case 'NULL':
        return null;
      default:
        return val;
    }
  }
}
