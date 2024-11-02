document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById('menuItems')) {
        loadMenuItems();
    }
    if (document.getElementById('branchInfo')) {
        loadBranchInfo();
    }
    if (document.getElementById('contactFormSection')) {
        loadContactForm();
    }
});

// Função para enviar o formulário com alerta
function submitForm(event) {
    event.preventDefault();
    alert("Thank you for reaching out! Your message has been sent.");
    document.getElementById("contactForm").reset();
}

// Função para carregar informações de Branch
function loadBranchInfo() {
    fetch('branches.xml')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "application/xml");
            const branches = xml.getElementsByTagName('branch');
            const container = document.getElementById('branchInfo');
            container.innerHTML = '';

            Array.from(branches).forEach(branch => {
                const address = branch.getElementsByTagName('address')[0].textContent;
                const contact = branch.getElementsByTagName('contact')[0].textContent;
                const hours = branch.getElementsByTagName('hours')[0].textContent;
                const mapLink = branch.getElementsByTagName('mapLink')[0].textContent;

                container.innerHTML += `
                    <div class="branch">
                        <h3>${address}</h3>
                        <p>Contact: ${contact}</p>
                        <p>Hours: ${hours}</p>
                        <a href="${mapLink}" target="_blank">View on Map</a>
                    </div>
                `;
            });
        })
        .catch(error => console.error('Error loading the branch XML:', error));
}

// Função para carregar o Formulário de Contato
function loadContactForm() {
    fetch('branches.xml')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "application/xml");
            const fields = xml.getElementsByTagName('field');
            const button = xml.getElementsByTagName('button')[0];

            let formHTML = '<form id="contactForm" onsubmit="submitForm(event)">';

            Array.from(fields).forEach(field => {
                const type = field.getElementsByTagName('type')[0].textContent;
                const id = field.getElementsByTagName('id')[0].textContent;
                const name = field.getElementsByTagName('name')[0].textContent;
                const placeholder = field.getElementsByTagName('placeholder')[0].textContent;
                const required = field.getElementsByTagName('required')[0].textContent === 'true' ? 'required' : '';

                if (type === 'textarea') {
                    formHTML += `<textarea id="${id}" name="${name}" placeholder="${placeholder}" ${required}></textarea>`;
                } else {
                    formHTML += `<input type="${type}" id="${id}" name="${name}" placeholder="${placeholder}" ${required}>`;
                }
            });

            formHTML += `<button type="${button.getElementsByTagName('type')[0].textContent}">${button.getElementsByTagName('text')[0].textContent}</button>`;
            formHTML += '</form>';
            formHTML += '<div id="messageSent" style="display:none;">Thank you for your message. It has been sent.</div>';

            document.getElementById('contactFormSection').innerHTML = formHTML;
        })
        .catch(error => console.error('Error loading the form XML:', error));
}

// Load Menu Items
function loadMenuItems() {
    fetch('menu.xml')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "application/xml");
            const menuItemsContainer = document.getElementById('menuItems');
            menuItemsContainer.innerHTML = ''; // Clear existing content

            const categories = xml.getElementsByTagName('category');
            Array.from(categories).forEach(category => {
                const categoryType = category.getAttribute('type');
                let categoryHTML = `<section class="menu-category"><h2>${categoryType}</h2>`;

                const items = category.getElementsByTagName('item');
                Array.from(items).forEach(item => {
                    const name = item.getAttribute('name');
                    const price = item.getAttribute('price');
                    const description = item.getElementsByTagName('description')[0].textContent;
                    const imagePath = item.getElementsByTagName('image')[0].textContent;

                    categoryHTML += `
                        <div class="menu-item">
                            <img src="${imagePath}" alt="${name}">
                            <div class="item-details">
                                <h3>${name} - $${price}</h3>
                                <p>${description}</p>
                            </div>
                        </div>
                    `;
                });

                categoryHTML += '</section>';
                menuItemsContainer.innerHTML += categoryHTML;
            });
        })
}