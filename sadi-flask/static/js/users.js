const addUserModal = document.getElementById('add-user-modal')
const addUserButton = document.getElementById('add-user')
const closeButtons = document.querySelector('.close-button')
const userDeleteButton = document.querySelectorAll('.user-delete')
const addUserSubmit = document.getElementById('add-user-submit')
const userItem = document.querySelectorAll('.user-item')

addUserButton.addEventListener('click', () => {
    addUserModal.classList.remove('hidden')
    addUserModal.classList.add('flex')
})

closeButtons.addEventListener('click', () => {
    addUserModal.classList.add('hidden')
    addUserModal.classList.remove('flex')
})

userDeleteButton.forEach((button) => {
    button.addEventListener('click', async (event) => {
        const userName = event.target.dataset.name
        try {
            const response = await fetch('/user/delete', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: userName })
            });
            const result = await response.json()
            if (result.status === 'success') window.location.reload();
        } catch (error) {
            console.error(error)
        }
    })
})

addUserSubmit.addEventListener('click', () => {
    const name = document.getElementById('name').value
    window.location.href = `/user/add/${name}`
})

userItem.forEach((item) => {
    item.addEventListener('click', () => {
        const name = item.dataset.name
        window.location.href = `/user/${name}`
    })
})