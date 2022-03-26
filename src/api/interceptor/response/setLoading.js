const setLoading = ({id, store} = {}) => {
  return function (data) {
    if (!id || !store) return;
    store.commit('removeAnimateId', id);
    return data;
  }
}

const setError = error => {
  console.log(error)
}

export default {
  SUCCESS: setLoading,
  ERROR: setError
}