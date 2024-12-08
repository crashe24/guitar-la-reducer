import {  useMemo, useReducer } from 'react'
import type { Guitar } from '../types'
import { cartReducers, initialState } from '../reducers/guitar-reducer'

export const useCart = () => {

    const [state, dispatch] = useReducer(cartReducers, initialState)


    function addToCart(item : Guitar) {
       dispatch({type: 'add-to-cart', payload: {item}})
    }

    function removeFromCart(id : Guitar['id']) {
        dispatch({type: 'remove-from-cart', payload: {id}})
       // setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    function decreaseQuantity(id : Guitar['id']) {
        dispatch({type: 'decrease-quantity', payload:{id}})
    }

    function increaseQuantity(id : Guitar['id']) {
        dispatch({type: 'increase-quantity', payload:{id}})
    }

    function clearCart() {
        dispatch({type:'clear-item'})
    }

    // State Derivado
    const isEmpty = useMemo( () => state.cart.length === 0, [state?.cart])
    const cartTotal = useMemo( () => state.cart.reduce( (total, item ) => total + (item.quantity * item.price), 0), [state.cart] )

    return {
        state,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}