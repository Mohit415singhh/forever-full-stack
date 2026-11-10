import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import PropTypes from 'prop-types'
import { ShopContext } from './ShopContextDefinition'

const ShopContextProvider = ({ children }) => {

    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [cartReady, setCartReady] = useState(false);
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('')
    const navigate = useNavigate();


    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const sizes of Object.values(cartItems)) {
            for (const quantity of Object.values(sizes || {})) {
                if (quantity > 0) {
                    totalCount += quantity;
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData)

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            const itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                const quantity = cartItems[items][item];
                if (itemInfo && quantity > 0) {
                    totalAmount += itemInfo.price * quantity;
                }
            }
        }
        return totalAmount;
    }

    const getProductsData = useCallback(async () => {
        try {

            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products.reverse())
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }, [backendUrl])

    const getUserCart = useCallback(async (token) => {
        setCartReady(false);
        try {
            
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            } else {
                toast.error(response.data.message || 'Unable to load your cart.')
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Unable to load your cart.')
        } finally {
            setCartReady(true)
        }
    }, [backendUrl])

    useEffect(() => {
        getProductsData()
    }, [getProductsData])

    useEffect(() => {
        if (token) {
            getUserCart(token)
        } else {
            const storedToken = localStorage.getItem('token')
            if (storedToken) {
                setToken(storedToken)
            } else {
                setCartReady(true)
            }
        }
    }, [getUserCart, token])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart,setCartItems,
        cartReady,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token
    }

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    )

}

ShopContextProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export default ShopContextProvider;