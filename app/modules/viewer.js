var $       = require ('jquery'),
    dataSet = require('publisher');

var _viewer = {
       createQTIndicatorsTable: function (QTI) {
           var tableContainer = $('.answer_block .QTIndicatorsTable'),
               table, qt = QTI;
           table = '<table class="QTindicators"><tr><th>Показатели эффективности работы системы</th><th> Литерал </th><th> Значение </th></tr>';
           table+= '<tr><td>Интенсивность поступления заявок</td><td>&lambda;</td><td>'+qt.lambda+'</td></tr>';
           table+= '<tr><td>Коэффициент загрузки оборудования</td><td>&rho;</td><td>'+qt.rho+'</td></tr>';
           table+= '<tr><td>Вероятность отсутствия требований в системе</td><td>&Rho;<sub>отк.</sub></td><td>'+qt.RhoOtk+'</td></tr>';
           table+= '<tr><td>Вероятность, что заявка окажется в очереди</td><td>&Rho;<sub>оч.</sub></td><td>'+qt.RhoOch+'</td></tr>';
           table+= '<tr><td>Среднее число заявок в очереди</td><td>L<sub>оч.</sub></td><td>'+qt.LOch+'</td></tr>';
           table+= '<tr><td>Среднее время ожидания заявки в очереди</td><td>T<sub>оч.</sub></td><td>'+qt.TOch+'</td></tr>';
           table+= '<tr><td>Среднее число заявок в системе</td><td>L<sub>сист.</sub></td><td>'+qt.LSyst+'</td></tr>';
           table+= '<tr><td>Среднее время пребывания заявки в системе</td><td>T<sub>сист.</sub></td><td>'+qt.TSyst+'</td></tr>';
           table+= '</table>';
           tableContainer.empty();
           tableContainer.append(table);
       },
       answerOut: function (data) {
           var answerContainer = $('.answer_block .optimal_strategy'),
               answer = data, html, notIncome;
            notIncome = '<span> При данном сочетании параметров любая стратегия убыточна</span>';
            if (answer.maxIncome === 0) {
                answerContainer.empty();
                answerContainer.append(notIncome);
                return;
            }
            html  = '<h4>Проанализировав все возможные варианты получим:</h4>';   
            html += '<span class="equipment">При количестве оборудования = <b>'+answer.optimalEquipment+'</b></span>';
            html += '<span class="ads">Проведя при этом <b>'+answer.optimalAds+'</b> рекламные кампании </span>';
            html += '<span class="income">Получим максимальную прибыль = <b>'+answer.maxIncome+' ₽</b> с одного станка.</span>';
            answerContainer.empty();
            answerContainer.append(html);
       } 
}

module.exports = _viewer;