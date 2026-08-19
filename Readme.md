# Product Catalog Application

A responsive, interactive product catalog web application built with Vanilla JavaScript, HTML5, CSS3, and Bootstrap 5. This project allows users to browse, search, filter, and manage products in a local shopping cart.

## Features

- **Product Listing:** Dynamically fetches and renders products from the [DummyJSON API](https://dummyjson.com/) using JavaScript `fetch`.
- **Real-Time Search:** Instant filtering of products by title as you type.
- **Category Filtering:** Filter products dynamically based on categories retrieved from the API.
- **Price Sorting:** Sort products by price from Low to High or High to Low.
- **Product Details Modal:** View extended information about individual items through an interactive modal.
- **Interactive Shopping Cart:** Full cart management supporting quantity updates, item removal, subtotal calculation, and local persistence via `localStorage`.
- **Responsive Layout:** Designed to scale smoothly across different screen sizes using CSS Grid, Flexbox, and Bootstrap utilities.

## Technologies Used

- **HTML5:** Semantic markup structure.
- **CSS3:** Custom styles, styling variables, hover transitions, and grid/flexbox layouts.
- **Vanilla JavaScript (ES6+):** Handles asynchronous API requests, DOM manipulation, state management, and event handling.
- **Bootstrap 5:** Used for structural UI components (modals, dropdown elements, and responsive grids).
- **DummyJSON API:** External backend service providing product records.

## Project Structure

- `index.html`: The main document containing the application layout, header, container grids, and modals.
- `css/style.css`: Custom stylesheet overriding and enhancing default styles for cards, headers, carts, and responsive breakpoints.
- `js/script.js`: Core vanilla JS script handling application state, API integration, rendering logic, and local storage synchronization.

## How to Run

1. Clone or download this repository to your local machine.
2. Ensure you have an active internet connection to load CDN resources and fetch remote product data.
3. Open `index.html` directly in your web browser.

