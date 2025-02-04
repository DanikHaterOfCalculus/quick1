let currentPage = 1;
const itemsPerPage = 5;
let currentSortDir = "asc";

// Отображение элементов меню
function renderMenu(items) {
    const menuGrid = document.getElementById("menuGrid");
    menuGrid.innerHTML = "";
    items.forEach(item => {
        const menuItem = document.createElement("div");
        menuItem.classList.add("menu-item");
        menuItem.innerHTML = `
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <p>Price: $${item.price.toFixed(2)}</p>
        `;
        menuGrid.appendChild(menuItem);
    });
}

// Отображение пагинации
function renderPagination(totalItems, currentPage, itemsPerPage) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.classList.add("pagination-button");
        if (i === currentPage) button.classList.add("active");
        button.addEventListener("click", () => {
            currentPage = i; // Обновляем текущую страницу
            loadMenu(currentPage, itemsPerPage, currentSortDir);
        });
        pagination.appendChild(button);
    }
}

// Загрузка меню из API
async function loadMenu(page = 1, limit = itemsPerPage, sortDir) {
    try {
        const response = await fetch(`http://localhost:8080/items?page=${page}&limit=${limit}&sort=price&sortDir=${sortDir}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch menu. Status: ${response.status}`);
        }

        const { data, total } = await response.json();
        renderMenu(data);
        renderPagination(total, page, limit);
    } catch (error) {
        console.error("Error loading menu:", error);
    }
}

// Установка обработчиков для кнопок сортировки
document.querySelectorAll(".sort-button").forEach(button => {
    button.addEventListener("click", e => {
        currentSortDir = e.target.dataset.sort; // Получаем направление сортировки
        console.log("Current sort direction:", currentSortDir);
        currentPage = 1; // Сбрасываем на первую страницу
        loadMenu(currentPage, itemsPerPage, currentSortDir);
    });
});

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    loadMenu(currentPage, itemsPerPage, currentSortDir); // Загрузка начальной страницы
});
