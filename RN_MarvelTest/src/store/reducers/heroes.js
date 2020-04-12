const INICIAL_STATE = {
    status: "inicial state",
    list_heroes: []
};

export default function heroes(_state = INICIAL_STATE, _action) {
    console.log("::: REDUCER heroes ::::");
    console.log(_state);
    console.log(_action);

    if (_action.type === 'LOAD_HEROES'){
        return {
            ... _state,
            list_heroes: _action.list_heroes
        }
    }
    return _state;
}
