
const products = {
    mono: {
        name: "Mono",
        price: 990
    },
    obsidian: {
        name: "Obsidian",
        price: 1490
    },
    "soft-touch": {
        name: "Soft Touch",
        price: 1090
    }
};

// Корзина хранит количество каждого товара.
const cart = {};

const cartOverlay = document.querySelector("#cart-overlay");
const cartToggle = document.querySelector("#cart-toggle");
const cartClose = document.querySelector("#cart-close");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const checkoutButton = document.querySelector("#checkout-button");

// Форматируем числа как цены в рублях.
function formatPrice(price) {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

// Открываем корзину.
function openCart() {
    cartOverlay.hidden = false;
    document.body.classList.add("cart-open");
    cartClose.focus();
}

// Закрываем корзину.
function closeCart() {
    cartOverlay.hidden = true;
    document.body.classList.remove("cart-open");
    cartToggle.focus();
}

cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);

// Закрываем окно, если нажали на затемнение.
cartOverlay.addEventListener("click", function (event) {
    if (event.target === cartOverlay) {
        closeCart();
    }
});

// Закрываем корзину клавишей Escape.
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !cartOverlay.hidden) {
        closeCart();
    }
});

// Добавляем товар по нажатию кнопки в карточке.
document.querySelectorAll(".add-to-cart").forEach(function (button) {
    button.addEventListener("click", function () {
        const id = button.dataset.id;

        if (!products[id]) {
            return;
        }

        if (!cart[id]) {
            cart[id] = 0;
        }

        cart[id] += 1;

        renderCart();

        // Кратко меняем надпись кнопки.
        button.textContent = "Добавлено ✓";

        setTimeout(function () {
            button.textContent = "+ В корзину";
        }, 1000);
    });
});

// Меняем количество или удаляем товар.
cartItems.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const id = button.dataset.id;

    if (!products[id] || !cart[id]) {
        return;
    }

    if (button.dataset.action === "increase") {
        cart[id] += 1;
    }

    if (button.dataset.action === "decrease") {
        cart[id] -= 1;

        if (cart[id] <= 0) {
            delete cart[id];
        }
    }

    if (button.dataset.action === "remove") {
        delete cart[id];
    }

    renderCart();
});

// Обновляем список товаров, количество и сумму.
function renderCart() {
    let totalCount = 0;
    let totalPrice = 0;

    cartItems.replaceChildren();

    Object.keys(cart).forEach(function (id) {
        const product = products[id];
        const quantity = cart[id];

        totalCount += quantity;
        totalPrice += product.price * quantity;

        const item = document.createElement("article");
        item.className = "cart-item";

        const details = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.className = "cart-item-price";
        price.textContent = formatPrice(product.price) + " за шт.";

        const actions = document.createElement("div");
        actions.className = "cart-item-actions";

        const decrease = createActionButton("−", "decrease", id);
        decrease.className = "quantity-button";
        decrease.setAttribute("aria-label", "Уменьшить количество");

        const quantityText = document.createElement("span");
        quantityText.textContent = quantity;

        const increase = createActionButton("+", "increase", id);
        increase.className = "quantity-button";
        increase.setAttribute("aria-label", "Увеличить количество");

        const remove = createActionButton("Удалить", "remove", id);
        remove.className = "remove-button";

        actions.append(decrease, quantityText, increase, remove);
        details.append(name, price, actions);

        const subtotal = document.createElement("strong");
        subtotal.textContent = formatPrice(product.price * quantity);

        item.append(details, subtotal);
        cartItems.append(item);
    });

    if (totalCount === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "cart-empty";
        emptyMessage.textContent = "Твоя корзина пока пуста.";

        cartItems.append(emptyMessage);
    }

    cartCount.textContent = totalCount;
    cartTotal.textContent = formatPrice(totalPrice);
    checkoutButton.disabled = totalCount === 0;
}

// Создаём безопасные кнопки действий внутри корзины.
function createActionButton(label, action, id) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = label;
    button.dataset.action = action;
    button.dataset.id = id;

    return button;
}

// Демонстрационная кнопка не оформляет реальный заказ.
checkoutButton.addEventListener("click", function () {
    if (Object.keys(cart).length === 0) {
        return;
    }

    alert(
        "Это демонстрационная корзина KeyCapSolid.\n" +
        "Реальные заказы и оплата не поддерживаются."
    );
});

// Показываем корректную пустую корзину при запуске.
renderCart();
