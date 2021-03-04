import region from "@/javascripts/libs/region";
// var region = require('./region.json')
export function getProvinces() {
  let provinces = [];
  for (var p in region) {
    let obj = {
      id: p,
      name: region[p]["n"]
    };
    provinces.push(obj);
  }
  return provinces;
}
export function getCities(provinceId) {
  let cities = [];
  for (var c in region[provinceId]) {
    if (c === "n") {
      continue;
    }
    let obj = {
      id: c,
      name: region[provinceId][c]["n"]
    };
    cities.push(obj);
  }
  return cities;
}
export function getCountries(provinceId, cityId) {
  let countries = [];
  let other = null;
  for (var c in region[provinceId][cityId]) {
    if (c === "n") {
      continue;
    }
    let obj = {
      id: c,
      name: region[provinceId][cityId][c]
    };
    if (obj.name == "其他区") {
      other = obj;
    } else {
      countries.push(obj);
    }
  }
  countries.push(other);
  return countries;
}

export function getProvinceName(provinceID) {
  // console.log(region[provinceID + ''], 'in region')
  return (region[provinceID + ""] && region[provinceID + ""].n) || "";
}
export function getCityName(provinceID, cityID) {
  // console.log(region[provinceID + ''][cityID + ''])
  return (
    (region[provinceID + ""] &&
      region[provinceID + ""][cityID + ""] &&
      region[provinceID + ""][cityID + ""].n) ||
    ""
  );
}
export function getCountryName(provinceID, cityID, countryID) {
  // console.log(region[provinceID + ''][cityID + ''][countryID + ''])
  return (
    (region[provinceID + ""] &&
      region[provinceID + ""][cityID + ""] &&
      region[provinceID + ""][cityID + ""] &&
      region[provinceID + ""][cityID + ""][countryID + ""]) ||
    ""
  );
}
