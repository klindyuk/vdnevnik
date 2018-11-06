input_dom_element = document.getElementById('xlf');
input_dom_element.addEventListener('change', handleFile, false);
var processButton = document.getElementById('processButton');
processButton.addEventListener('click', processReport, false);
var reloadButton = document.getElementById('reloadButton');
reloadButton.addEventListener('click', reloadPage, false);

const ERROR_MSG = '<h2>Что-то пошло не так...</h2><p>Не удалось прочитать файл. Вероятно, он не является отчетом об успеваемости ИС Сетевой город.</p>'

// Глобальные переменные отчета
var schoolTitle;
var reportYear;
var reportGrade;
var reportPeriod;
var students = [];
var processedReportDiv;

function handleFile(e) {
    var files = e.target.files, f = files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;
        var newDiv = document.createElement('div');
        newDiv.innerHTML = data;
        var report = newDiv.querySelector('#report');
        processedReportDiv = document.getElementById('processedReport');
        try {
            processedReportDiv.innerHTML = report.innerHTML;
            newDiv.innerHTML = report.innerHTML;
            document.querySelector('#step1').className = 'done';
            input_dom_element.disabled = true;
            processButton.disabled = false;
            reloadButton.disabled = false;
        } catch (err) {
            processedReportDiv.innerHTML = ERROR_MSG;
            console.log(err);
        }
    };
    reader.readAsText(f)
}

function processReport() {
    processButton.disabled = true;
    var e = document.getElementById('processedReport');
    // Заполняем глобальные переменные отчета
    schoolTitle = e.getElementsByTagName('h5')[0].innerText;
    var resultTables = e.getElementsByTagName('table');
    var reportGlobals = resultTables[0].querySelectorAll('span.select');
    reportYear = reportGlobals[0].innerText.split('/')[1];
    reportGrade = reportGlobals[1].innerText;
    reportPeriod = reportGlobals[2].innerText;
    //console.log(reportYear, reportGrade, reportPeriod);
    for (var i = 0; i < resultTables.length / 3; i++) {
        createStudent(resultTables[i * 3], resultTables[i * 3 + 1], resultTables[i * 3 + 2]);
    }
    //console.log(students);
    document.getElementById('step2').classList.add('done');
    //document.getElementById('printSettings').style.display = 'block';
    $('#printSettings').show("slide");
    printButton.disabled = false;
    viewReport();    
}

function getMonthNumberByName(name) {
    var months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    return months.indexOf(name) + 1;
}

function createStudent(t1, t2, t3) {
    var student = {
        name: '',
        subjects: []
    }
    student.name = t1.querySelectorAll('span.select')[3].innerText;
    
    // Разбираем таблицу с оценками
    var daysForMonth = [];
    var dates = [];
    var trs = t2.querySelectorAll('tr');
    var ths = trs[0].querySelectorAll('th');
    
    for (var i = 1; i < ths.length - 1; i++) {
        var e = {
            month: ths[i].innerText,
            days: ths[i].getAttribute('colspan')
        }
        daysForMonth.push(e);
    }
    ths = trs[1].querySelectorAll('th');
    var i = 0;
    daysForMonth.forEach(element => {
        monthNumber = getMonthNumberByName(element.month);
        var currentYear = monthNumber > 8 ? reportYear - 1 : reportYear;
        for (var j = 0; j < element.days; j++) {
            dates.push(new Date(currentYear, monthNumber - 1, ths[i].innerText));
            i++;
        }
    });
    for (i = 2; i < trs.length; i++) {
        var td = trs[i].querySelector('td');
        var subject = {
            title: td.innerText,
            grades: [],
            averageGrade: 0,
            misses: 0
        }

        // считаем пропуски и средний балл
        var missesReg = /УП|Б|НП|ОТ/g;
        if (trs[i].innerText.match(missesReg)) {
            subject.misses = trs[i].innerText.match(missesReg).length;
        }
        
        trs[i].querySelector('td.cell-num').remove();
        
        var grades = trs[i].innerText.match(/\d/g);
        if (grades) {
            grades = grades.map(Number);
            subject.grades = grades;
            var sumOfGrades = 0;
            grades.forEach(element => {
                sumOfGrades += element;
            });
            subject.averageGrade = sumOfGrades / grades.length;
        }

        student.subjects.push(subject);
    }
    students.push(student);
}

function reloadPage() {
    window.location.reload();
}

//modals
$('#about').on('click', function() {
    $('#about-message').dialog();
    return false;
});
$('#personal').on('click', function() {
    $('#personal-message').dialog();
    return false;
});