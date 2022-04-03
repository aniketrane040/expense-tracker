import { ADD_TRANSACTION, DELETE_TRANSACTION } from "../constants/constants";

const reducer = (state = [],action) =>{

    let transactions;
    switch (action.type) {
    
        case ADD_TRANSACTION : 
            return [...state,action.payload];

        case DELETE_TRANSACTION:
            transactions = state.filter((transaction) => transaction.id !== action.payload);
            return transactions;
            
        default:
            return state;
    }
}

export default reducer;