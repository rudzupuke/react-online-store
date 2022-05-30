import { gql } from "@apollo/client";

const getCurrenciesQuery = gql`
    query Currencies {
        currencies {
            label
            symbol
        }
    }
`;

const getCategoriesQuery = gql`
    query Categories {
        categories {
            name
        }
    }
`;

const getAllDataQuery = gql`
    query AllProducts {
        categories {
            name
            products {
                name
                id
                inStock
                gallery
                description
                category
                attributes {
                    id
                    name
                    type
                    items {
                        displayValue
                        value
                    }
                }
                prices {
                    currency {
                        label
                        symbol
                    }
                    amount
                }
                brand
            }
        }
    }
`;

const getProductQuery = gql`
    query Product($id: String!) {
        product(id: $id) {
            name
            inStock
            gallery
            description
            category
            attributes {
                name
                type
                items {
                    displayValue
                    value
                    id
                }
            }
            prices {
                currency {
                    label
                    symbol
                }
                amount
            }
            brand
        }
    }
`;

export {
    getAllDataQuery,
    getCurrenciesQuery,
    getCategoriesQuery,
    getProductQuery,
};
