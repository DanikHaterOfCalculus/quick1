let currentPage = 1;
const itemsPerPage = 5;
let currentSortDir = "asc";

// ����������� ��������� ����
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

// ����������� ���������
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
            currentPage = i; // ��������� ������� ��������
            loadMenu(currentPage, itemsPerPage, currentSortDir);
        });
        pagination.appendChild(button);
    }
}

// �������� ���� �� API
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

// ��������� ������������ ��� ������ ����������
document.querySelectorAll(".sort-button").forEach(button => {
    button.addEventListener("click", e => {
        currentSortDir = e.target.dataset.sort; // �������� ����������� ����������
        console.log("Current sort direction:", currentSortDir);
        currentPage = 1; // ���������� �� ������ ��������
        loadMenu(currentPage, itemsPerPage, currentSortDir);
    });
});

// �������������
document.addEventListener("DOMContentLoaded", () => {
    loadMenu(currentPage, itemsPerPage, currentSortDir); // �������� ��������� ��������
});
