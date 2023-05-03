/*const trigget = document.getElementById('select_trigger');
const selectOptions = document.getElementById('select_options');
const options = document.querySelectorAll('.option');
// const theOption = trigget.children[0]; // for modifict the span's textContent and not of the div
const theOption = document.getElementById('trigger'); // for modifict the span's textContent and not of the div

// trigget.addEventListener('click', () => {
//     selectOptions.classList.toggle('show');
// })

export function handleClickSelect() {
    selectOptions.classList.toggle('show');
}

let selectedOption;
options.forEach(option => {
    option.addEventListener('click',() => {
        theOption.dataset.value = option.dataset.value;
        theOption.textContent = option.textContent;

        if(selectedOption) selectedOption.classList.remove('selected');
        option.classList.add('selected');
        selectedOption = option;

        selectOptions.classList.remove('show');
    })
});*/

// document.addEventListener('click', e => {
//     if (!trigget.contains(e.target)) selectOptions.classList.remove('show');
// });
  
/*document.addEventListener('DOMContentLoaded', () => {
    const trigget = document.getElementById('select_trigger');
    const selectOptions = document.getElementById('select_options');
    const options = document.querySelectorAll('.option');
    // const theOption = trigget.children[0]; // for modifict the span's textContent and not of the div
    const theOption = document.getElementById('trigger'); // for modifict the span's textContent and not of the div

    trigget.addEventListener('click', () => {
        selectOptions.classList.toggle('show');
    })

    let selectedOption;
    options.forEach(option => {
        option.addEventListener('click',() => {
            theOption.dataset.value = option.dataset.value;
            theOption.textContent = option.textContent;

            if(selectedOption) selectedOption.classList.remove('selected');
            option.classList.add('selected');
            selectedOption = option;

            selectOptions.classList.remove('show');
        })
    });
});*/

export function idk(selecOptionRef){
    function handleClickOutside(event) {
        if (selecOptionRef.current && !selecOptionRef.current.contains(event.target)) {
            selecOptionRef.current.classList.remove('show');
        }
      }
  
      document.addEventListener('click', handleClickOutside);
  
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
}