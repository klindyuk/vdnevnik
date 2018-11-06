const PROG_VERSION = 'ВДневник! Сетевой город с человеческим лицом. Версия 2.0';
const PROG_URL = 'http://rzhevinfo.ru/vdnevnik';
var printButton = document.getElementById('printButton');
printButton.addEventListener('click', printReport, false);
document.getElementById('h2size').addEventListener('change', setFontSize, false);
document.getElementById('h4size').addEventListener('change', setFontSize, false);
document.getElementById('thsize').addEventListener('change', setFontSize, false);
document.getElementById('tdsize').addEventListener('change', setFontSize, false);
document.getElementById('psize').addEventListener('change', setFontSize, false);

function viewReport() {
    processedReportDiv.innerText = '';
    students.forEach(student => {
        var studentDiv = document.createElement('div');
        studentDiv.className = 'studentDiv';
        studentDiv.innerHTML = "<h2>" + schoolTitle + "</h2>" + "<h4>" + student.name.replace(/\d/g, '') + ". " + reportPeriod + "</p>";
        var studenDivTable = document.createElement('table');
        var studenDivTableHeader = document.createElement('tr');
        studenDivTableHeader.innerHTML = "<th>Предмет</th><th>Отметки за период</th><th>Ср. балл</th><th>Пропущено</th>"
        studenDivTable.appendChild(studenDivTableHeader);
        
        student.subjects.forEach(subject => {
            var subjectRow = document.createElement('tr');
            var td = document.createElement('td');
            td.innerText = subject.title;
            subjectRow.appendChild(td);
            td = document.createElement('td');
            td.innerText = subject.grades.join(' ');
            subjectRow.appendChild(td);
            td = document.createElement('td');
            td.innerText = subject.averageGrade.toPrecision(3);
            subjectRow.appendChild(td);
            td = document.createElement('td');
            td.innerText = subject.misses;
            subjectRow.appendChild(td);
            studenDivTable.appendChild(subjectRow);
        });
        studentDiv.appendChild(studenDivTable);
        var cr = document.createElement('p');
        var d = new Date();
        cr.innerText = 'Распечатано ' + d.toLocaleDateString() +' в программе ' + PROG_VERSION + '. ' + PROG_URL;
        studentDiv.appendChild(cr);
        processedReportDiv.appendChild(studentDiv);
    });
}

function printReport() {
    document.getElementById('step3').classList.add('done');
    window.print();
}

function setFontSize(e) {
    console.log(e.target.id);
    var qs = e.target.id.replace(/size/, '');
    console.log(qs);
    processedReportDiv.querySelectorAll(qs).forEach(f => {
        f.style.fontSize = e.target.value + 'pt';
    });
}