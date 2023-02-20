const {createStore} =require('redux') ;

const BUY_CAKE="BUY_CAKE"

// action
function buycake(){
    return {
    type:BUY_CAKE
}};

// Reducer is function having state and action as argument reutnr new state
const initial={
    noofcake:23
}
function shopkeeper( state=initial,action ){
    switch( action.type ){
        case BUY_CAKE: return {...state,noofcake:state.noofcake-1};
        default: return state
    }
}

const store = createStore(shopkeeper);

// getState()---> get the data from store
console.log("intial cakes"+store.getState().noofcake);
// dispatch()---> to change state inside store (it takes action)
store.dispatch(buycake())
store.dispatch(buycake())
store.dispatch(buycake())
store.dispatch(buycake())

console.log("after selling"+store.getState().noofcake);