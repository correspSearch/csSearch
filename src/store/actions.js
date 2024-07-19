const validate = (state, options = [/* Type, Value */]) => {
    // TODO: continue on validation script for all possible situations during
    // search use...
    switch (options[0]) {
      default:
      case 'ref': {
        const rp = new RegExp(/^(http(s)?:\/\/correspSearch\.net\/unknown?)|^(http(s)?:\/\/d-nb\.info\/gnd\/?)|^(http(s)?:\/\/viaf\.org\/viaf\/?)|^(http(s)?:\/\/catalogue\.bnf\.fr\/?)|^(http(s)?:\/\/lccn\.loc\.gov\/?)|^(http(s)?:\/\/correspSearch\.net\/?)/g);
        return rp.test(options[1]);
      }
    }
  };

const liveAndDeath = (state, dates) => {
    // convert live dates into String for display
    const [birth, death] = dates;
    let liveDates = '';
    if (!isNaN(parseInt(birth, 10)) && !isNaN(parseInt(death, 10))) liveDates += `(${parseInt(birth, 10)}`;
    if (!isNaN(parseInt(birth, 10)) && isNaN(parseInt(death, 10))) liveDates += `(* ${parseInt(birth, 10)}`;
    if (!isNaN(parseInt(birth, 10)) && !isNaN(parseInt(death, 10))) liveDates += '-';
    if (!isNaN(parseInt(birth, 10)) && isNaN(parseInt(death, 10))) liveDates += ')';
    if (isNaN(parseInt(birth, 10)) && !isNaN(parseInt(death, 10))) liveDates += '(d. ';
    if (!isNaN(parseInt(death, 10))) liveDates += ')';
    return liveDates;
  };

const checkForObjInArr = (state, options = {
    // Helper function to check, if an object exists in an Array
    obj: {},
    arr: [],
  }) => {
    for (let i = 0; i < options.arr.length; i += 1) {
      if (JSON.stringify(options.arr[i]) === JSON.stringify(options.obj)) return true;
    }
    return false;
  };

const esSetDate = (state, dateArray = []) => {
    // convert date in format yyyy or yyyy-mm into yyyy-mm-dd
    const result = [];
    dateArray.map((date) => {
      const resultDate = {
        from: String,
        to: String,
      };
      if (date[0] !== undefined && date[0] !== null) {
        if (date[0].match(/[1-2][0-9][0-9][0-9]$/g)) resultDate.from = `${date[0]}-01-01`;
        if (date[0].match(/[1-2][0-9][0-9][0-9]-[0-9][0-9]$/g)) resultDate.from = `${date[0]}-01`;
        if (date[0].match(/[1-2][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/g)) [resultDate.from] = date;
      } else resultDate.from = '0000-01-01';
      if (date[1] !== undefined && date[1] !== null) {
        if (date[1].match(/[1-2][0-9][0-9][0-9]$/g)) resultDate.to = `${date[1]}-12-31`;
        if (date[1].match(/[1-2][0-9][0-9][0-9]-[0-9][0-9]$/g)) resultDate.to = `${date[1]}-31`;
        if (date[1].match(/[1-2][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/g)) [, resultDate.to] = date;
      } else resultDate.to = new Date().toISOString().split('T')[0];
      result.push(resultDate);
    });
    return result;
  };

const unsetResults = (state, bool = true) => {
  this.commit('unsetResults', bool);
};

const updateUrl = (state) => {
  this.commit('updateUrl');
};

export default {
  validate,
  liveAndDeath,
  checkForObjInArr,
  esSetDate,
  unsetResults,
  updateUrl,
};
