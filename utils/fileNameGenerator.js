function fileName() {
  let now = new Date().toISOString();
  var date = now
    .replace(/:/g, "-")
    .match(/\d{4}-\d{2}-\d{2}/g)
    .toString()
    .replace(/-/g, "");

  var time = now
    .replace(/:/g, "-")
    .match(/T\d\d-\d\d-\d\d.\d/g)
    .toString()
    .replace(/-/g, "")
    .replace(/\./g, "")
    .substr(1);

    let name = date + '_' + time

    return { date, time, name }
}

module.exports = fileName
