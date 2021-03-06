import { makeObservable, observable, action, computed } from "mobx";
import { CurrencyStore } from "./CurrencyStore";

class CartStoreImpl {
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    constructor() {
        makeObservable(this, {
            cart: observable,
            addProductToCart: action,
            removeProductFromCart: action,
            itemsInCart: computed,
            totalProducts: computed,
            totalPrice: computed,
            tax: computed,
        });
    }

    addProductToCart(productId, attributeName, attribute, prices) {
        if (!attribute) return;

        // creating a uniqueId because user can add one product with different attributes to the cart ( for example,
        // coat with size M is one product & coat with size L another)
        let uniqueId;
        let product;

        if (Array.isArray(attribute)) {
            let attributeNameString = "";
            attribute.forEach((attribute) => {
                attributeNameString += attribute.attribute;
            });
            uniqueId = productId + attributeNameString;

            product = {
                uniqueId: uniqueId,
                productId: productId,
                attributeName: null,
                attribute: attribute,
                prices: prices,
                count: 1,
            };
        } else {
            uniqueId = productId + attribute;

            product = {
                uniqueId: uniqueId,
                productId: productId,
                attributeName: attributeName,
                attribute: attribute,
                prices: prices,
                count: 1,
            };
        }

        const index = this.cart.findIndex(
            (product) => product.uniqueId === uniqueId
        );
        const noMatchFound = index === -1;

        if (noMatchFound) {
            this.cart.push(product);
        } else {
            this.cart[index].count++;
        }

        localStorage.setItem("cart", JSON.stringify(this.cart));
    }

    removeProductFromCart(uniqueId) {
        const index = this.cart.findIndex(
            (product) => product.uniqueId === uniqueId
        );
        if (this.cart[index].count === 1) {
            this.cart.splice(index, 1);
        } else {
            this.cart[index].count--;
        }

        localStorage.setItem("cart", JSON.stringify(this.cart));
    }

    get totalProducts() {
        let total = 0;
        this.cart.forEach((product) => {
            total += product.count;
        });

        return total;
    }

    get totalPrice() {
        let total = 0;
        this.cart.forEach((product) => {
            const index = product.prices.findIndex(
                (price) => price.currency.symbol === CurrencyStore.currency
            );

            total += product.prices[index].amount * product.count;
        });

        // rounding the total price to two decimal places:
        return Math.round(total * 100) / 100;
    }

    get tax() {
        const totalPrice = this.totalPrice;
        const tax = 21;
        const calculatedTax = Math.round(((totalPrice * 21) / 100) * 100) / 100;

        return { tax, calculatedTax };
    }

    get itemsInCart() {
        return this.cart.length;
    }
}

export const CartStore = new CartStoreImpl();
