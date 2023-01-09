const personal = document.querySelector('.personal-info')
const account = document.querySelector('.account-info')
const confirmation = document.querySelector('.confirmation')
const step1 = document.getElementById('step-1')
const step2 = document.getElementById('step-2')
const first = document.getElementById('first')
const second = document.getElementById('second')
const last = document.getElementById('last')
const doneSvg = '<svg aria-hidden="true" class="w-4 h-4 mr-2 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>'

const userData = {
    first_name: '',
    last_name: '',
    username: '',
    password: ''
}

step1.addEventListener('click', () => {
    const firstn = document.querySelector('#first_name').value
    const lastn = document.querySelector('#last_name').value
    const errors = ['.error-firstn', '.error-lastn']

    errors.forEach(er => {
        document.querySelector(er).innerHTML = ''
    });

    if (firstn === '' || lastn === '') {
        if (firstn === '') {
            document.querySelector(errors[0]).innerHTML = 'The first name field is required'
        }
        if (lastn === '') {
            document.querySelector(errors[1]).innerHTML = 'The last name field is required'
        }
    } else {
        userData.first_name = firstn
        userData.last_name = lastn
        personal.style.display = 'none'
        account.style.display = 'block'
        document.querySelector('#first .mr-2').innerHTML = doneSvg
        second.classList.add('text-blue-600')
    }
})

step2.addEventListener('click', () => {
    const username = document.querySelector('#username').value
    const password = document.querySelector('#password').value
    const errors = ['.error-username', '.error-password']

    errors.forEach(er => {
        document.querySelector(er).innerHTML = ''
    });

    if (username === '' || password === '') {
        if (username === '') {
            document.querySelector(errors[0]).innerHTML = 'The username field is required'
        } 
        if (password === '') {
            document.querySelector(errors[1]).innerHTML = 'The password field is required'
        } 
    } else {
        userData.username = username
        userData.password = password
        account.style.display = 'none'
        confirmation.style.display = 'block'
        document.querySelector('#second .mr-2').innerHTML = doneSvg
        last.classList.add('text-blue-600')
        saveData( ).then(result => console.log(result));
    }
})

async function saveData() {
    console.log(JSON.stringify(userData))
    const response = await fetch('/setup/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    const result = await response.json();
    return result;
}