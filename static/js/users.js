const addUserModal = document.getElementById('add-user-modal')
const addUserButton = document.getElementById('add-user')
const closeButtons = document.querySelector('.close-button')

addUserButton.addEventListener('click', () => {
    addUserModal.style.display = 'flex'
})

closeButtons.addEventListener('click', () => {
    addUserModal.style.display = 'none'
})