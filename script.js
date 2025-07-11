const inputSlider = document.querySelector(".slider");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");

const Symbols='<>?/:;[]{}()*&^%$#@!+=~|';

let password ="";
let passwordLength = 8;
let checkCount = 0;
handleSlider();
//button grey
setIndicator("#ccc");

function handleSlider(){
    //iska kaam bs UI pr update krna h 
    inputSlider.value = passwordLength
    lengthDisplay.innerHTML= passwordLength; 
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =((passwordLength-min)*100/(max-min)) + "% 100%" 
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}  

function getrandomNumber(min , max){
    return Math.floor(Math.random()*(max- min))+ min;
}
function generateRandomNum(){
    return getrandomNumber(0 , 9);
}
function generateRandomUpper(){
    return String.fromCharCode(getrandomNumber(65, 91));
}
function generateRandomLower(){
    return String.fromCharCode(getrandomNumber(97, 123));
}
function generateSymbols(){
    const rndNum = getrandomNumber(0 , Symbols.length);
    return Symbols.charAt(rndNum);
}
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercase.checked) hasUpper = true;
    if (lowercase.checked) hasLower = true;
    if (numbers.checked) hasNum = true;
    if (symbols.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
     passwordLength >= 6
    ) {
    setIndicator("#ff0");
    } else {
    setIndicator("#f00");
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerHTML='copied';
    }
    catch(e){
        copyMsg.innerHTML='failed';
    }
    copyMsg.classList.add('active');

    setTimeout(()=>{
        copyMsg.classList.remove('active');
    },2000)

}
function shufflePassword(array){
   //Fisher Yates Method
   for (let i=array.length-1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
function handlecheckbox(){
    checkCount=0;
    allcheckbox.forEach((checkbox)=>{
        if (checkbox.checked)
            checkCount++;
        
    })
}
allcheckbox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handlecheckbox);
})

inputSlider.addEventListener('input',(e)=> {
    passwordLength=e.target.value;
    handleSlider();
})
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
})
  
generateBtn.addEventListener('click', ()=>{
    if(checkCount <= 0) 
        return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
        
    password="";
    console.log('starting');

    let funcArr=[];
    
    if(uppercase.checked){
        funcArr.push(generateRandomUpper);
    }
    if(lowercase.checked){
        funcArr.push(generateRandomLower);
    }
    if(numbers.checked){
        funcArr.push(generateRandomNum);
    }
    if(symbols.checked){
        funcArr.push(generateSymbols);
    }
    //complusory addition
    for (let i=0;  i<funcArr.length; i++){
        password += funcArr[i]();//
    }
    console.log('complusory addition');

    //remaining addition
    for (let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getrandomNumber(0 , funcArr.length);
        console.log(randIndex);
        password+=funcArr[randIndex]();
    }
    console.log('remaining addition');

    //shuffle
    password = shufflePassword(Array.from(password));
    console.log('shuffling')
    //UI
    passwordDisplay.value = password; 
    console.log('Ui addition ')
    calcStrength();
}) 
