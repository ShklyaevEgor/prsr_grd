const puppeteer = require('puppeteer');
const fs = require("fs");
const cheerio = require("cheerio");
const cheerioTableparser = require("cheerio-tableparser");

start()

async function start() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://istu.ru/abiturients/page/11?eduProgram=392&faculty=5&edu_level_requirement=4&eduProgramForm=1&compensationType=1&main=1')
    //await page.screenshot({path:'example.png'})
    const htmltable = await page.$eval('body > div.site-wrapper > div.site-main > section:nth-child(2) > div > div.wall-content > div > table:nth-child(3)', el => el.outerHTML)
    //console.log(htmltable)
    await fs.writeFileSync('table.html', htmltable)
    await browser.close()
    let customer = [];
    const html = fs.readFileSync(`table.html`).toString();
    const $ = cheerio.load(html);
    cheerioTableparser($);
    var data = $("table").parsetable(true, true, true);
    let razmer = data[0].length - 1
    for (let j = 1; j < razmer; j++) {
        //new User(data[1][j], data[5][j])
        customer.push(new User(data[1][j], data[5][j] * 100))
    }
    function User(nomer, rate) {
        this.nomer = nomer;
        this.rate = rate;
    }
    function sortByRate(arr) {
        arr.sort((a, b) => a.rate < b.rate ? 1 : -1);
    }
    //Добавляю доп балы
    sumator(customer)
    function sumator(customers){
        customers.forEach(element => {
            if(element.nomer=='400242'){
                element.rate+=1000
            }
        });
    }
    sortByRate(customer)
    const index = customer.findIndex(object => {
        return object.nomer == '400242';
    });

    let srarifm = 0
    for (z = 0; z < 60; z++) {
        srarifm += customer[z].rate
    }
    console.log("Средний рейтинг: " + srarifm / 60 / 100)
    console.log("Моя позиция: " + index)

    for(i=0;i<customer.length;i++){
        if(i%10==0){
            console.log('----------------'+i+'----------------')
        }
        if(customer[i].nomer=='400242'){
            console.log('----------------'+'Я'+'----------------')
        }
        console.log(customer[i])
    }
}



/*$('td').each(function(i,elem){
    if($(this).text()=='Отлично')
    grade.push(5);
    if($(this).text()=='Хорошо')
    grade.push(4);
    if ($(this).text()=='Удовлетворительно')
    grade.push(3);
});*/
//}
//grade.push(5);
//sr_arifm();

/*function sr_arifm(){
    let sum=0;
    grade.forEach(element => {
        sum+=element;
    });
    console.log(sum/grade.length)
}*/

//fs.writeFileSync("customers.json", JSON.stringify(grade));