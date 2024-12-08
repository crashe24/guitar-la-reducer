import { db } from '../data/db';
import { CartItem, Guitar } from '../types/index';

const MIN_ITEMS = 1
const MAX_ITEMS = 5


// acciones
export type CartActions = 
    {type: 'add-to-cart', payload: {item: Guitar}} |
    {type: 'remove-from-cart', payload: {id: Guitar['id']}} |
    {type: 'decrease-quantity', payload: {id: Guitar['id']}} |
    {type: 'increase-quantity', payload: {id: Guitar['id']}} |
    {type: 'clear-item' } 

// estado 
export type CartState = {
    data: Guitar[],
    cart: CartItem[]
}

const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
}
// estado inicial 
export const initialState = {
    data: db,
    cart: initialCart()
}

// reducer
export const cartReducers = (state: CartState = initialState, action: CartActions ) => {
    if (action.type === 'add-to-cart') {
        const itemExists = state.cart.find(guitar => guitar.id === action.payload.item.id)
        let updateCart : CartItem[] = []
        if(itemExists) { // existe en el carrito
            updateCart = state.cart.map( item => {
                if (item.id  === action.payload.item.id) {
                    if(item.quantity < MAX_ITEMS)  {
                        return {...itemExists, quantity: itemExists.quantity + 1}
                    } else {
                        return item 
                    }
                       
                } else { return item}
            })

        } else {
            const newItem : CartItem = {...action.payload.item, quantity : 1}
            //setCart([...cart, newItem])
            updateCart = ([...state.cart, newItem])
        }
        localStorage.setItem('cart', JSON.stringify(updateCart))
        return {
            ...state,
            cart:  updateCart
        }
    }
    if (action.type === 'remove-from-cart') {
        const newCartAfterRemove =  state.cart.filter(guitar => guitar.id !== action.payload.id)
        localStorage.setItem('cart', JSON.stringify(newCartAfterRemove))
        return {
            ...state,
            cart: newCartAfterRemove
        }
    }
    if (action.type === 'increase-quantity') {
        const updatedCart = state.cart.map( item => {
            
                if(item.id === action.payload.id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity  + 1
                }
            }
            return item
        })
        localStorage.setItem('cart', JSON.stringify(updatedCart))
        //setCart(updatedCart)
        return {
            ...state,
            cart: updatedCart
        }
    }
    if (action.type === 'decrease-quantity') {
        const updatedCart = state.cart.map( item => {
            if(item.id === action.payload.id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        localStorage.setItem('cart', JSON.stringify(updatedCart))
        return {
            ...state,
            cart: updatedCart
        }
    }
    if (action.type === 'clear-item') {
        localStorage.setItem('cart', JSON.stringify([]))
        return {
            ...state, 
            cart: []
        }
    }
    return state 
}