// logic
// . asynchronous | posting sign up form values to the database
// .. es6 | async & await | error handling, replaces then().catch()
async function signupFormHandler(e) {
    e.preventDefault();

    const username = document.getElementById('username-signup').value.trim();
    const email = document.getElementById('email-signup').value.trim();
    const password = document.getElementById('password-signup').value.trim();

    // if sign up parameters are met, json data is posted through route /api/users as a string. 
    if (username && email && password) {
      const response = await fetch('/api/users', {
        method: 'post',
        body: JSON.stringify({
          username,
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json'}
      });
      console.log(response);
      }
    }

// calls
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);