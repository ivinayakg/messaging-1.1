let requestQue = [];

function subscribe(id, object) {
  requestQue[`${id}`] = object;
  return;
}

function unSubscribe(id) {
  delete requestQue[id];
}

module.exports = { subscribe, requestQue, unSubscribe };
