import './index.scss';
import axios from 'axios';

// document.querySelector('h1').addEventListener('click', e => {
//   alert('Hello World!');
// });




//--------------------------variable--------------------------
//--------------------------variable--------------------------
//--------------------------variable--------------------------

const postAPI = axios.create({
  baseURL: process.env.API_URL
})

const templates = {
  anchor : document.querySelector('.root')
  ,todolist : document.querySelector('.toDoList').content
}



//-----------------------function----------------------------------
//-----------------------function----------------------------------
//-----------------------function----------------------------------


function login(res) {
  let token;
    if(localStorage.getItem('token')) {
      token = localStorage.getItem('token')
      postAPI.defaults.headers['Authorization'] = `Bearer ${token}`
      templates.root.classList.add('root--authed')
    } else if (res){
    localStorage.setItem('token', res.data.token)
    token = localStorage.getItem('token')
    postAPI.defaults.headers['Authorization'] = `Bearer ${token}`
    templates.root.classList.add('root--authed')
    }
  }
  
  function logout(){
    delete postAPI.defaults.headers['Authorization']
    localStorage.removeItem('token')
    templates.root.classList.remove('root--authed')
  }
  
  
  function render(fragment) {
    templates.root.textContent = ""; 
    templates.root.appendChild(fragment);
  }



//----------------template section-----------------------------
//----------------template section-----------------------------
//----------------template section-----------------------------


