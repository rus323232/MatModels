var math    = require('math'),
    dataSet = require('publisher');

var _calculate = {
        _incomingData: {},
        _calcStack: [],
        init: function (obj) {
            for (i in obj) {
                obj[i] = parseInt(obj[i]);
                if (isNaN(obj[i])) {
                    alert('Only integer params');
                    return;
                }
        }
        this._incomingData = obj;
        this.selectOptimalStrategy(); //!!! not optimal eval 
        },
        _poisson: function (lambda, count) { 
            var Limit = Math.exp(-lambda),
                answer, i;
            for (i = 0; i < count; i++) {
                var p = 0.1, k = 0;
                do {
                k++;
                p *= Math.random();
                console.log(k, p, Limit);
                } 
                while (p > Limit);
                answer[i] = k-1;
            }
            return answer;
        },
        _generateRandomTime: function (freq) {
            var proposalFreq = freq || 4,
                period       = 24 / proposalFreq,
                proposalTime = 0,
                i,
                timeLine     = [];
            for (i = 0; i < proposalFreq; i++) {
                proposalTime = math.round(math.random(period), 1);
                timeLine[i]  = proposalTime;
            }
            return timeLine;
        },
        _calcQTIndicators: function () {
            var incomingData = this._incomingData,
                calcStack    = [];
            this._calcStack.splice(0, this._calcStack.length); // refresh QTIndicators stack

            calcStack.payForDowntime   = incomingData.pay_for_downtime;
            calcStack.period           = incomingData.period;
            calcStack.proposalIncome   = incomingData.proposal_income;
            calcStack.lambda           = incomingData.proposal_freq;
            calcStack.adsEffect        = incomingData.ads_effect;
            calcStack.budget           = incomingData.budget;
            calcStack.equipCoast       = incomingData.equip_coast;
            calcStack.adsCoast         = incomingData.ads_coast;
            calcStack.TObs             = math.round(math.eval("1 / equip_proposal", incomingData), 5);
            calcStack.mu               = incomingData.equip_proposal;
            calcStack.maxEqiupCount    = math.round(math.eval("budget / equip_coast", incomingData), 0);
            calcStack.equipCoefficient = [];

            this._calcStack = calcStack;
        },
        _getResult: function (adsCount, equipCount) {
            this._calcQTIndicators(); //определить входные параметры для расчета
            for (var i in arguments) { 
                if ((typeof arguments[i] != "number") || (arguments[i] === Infinity) || (isNaN(arguments[i]))) {
                    throw "getResult`s args is not valid (only integer type)";
                }  
                arguments[i] = parseInt(arguments[i]);
            }

            var incomingData         = this._incomingData,
                calcStack            = this._calcStack, 
                cleanProfit;

                calcStack.adsCount   = adsCount;
                calcStack.equipCount = equipCount;
                
            calcStack.lambda  = math.round(math.eval("lambda + adsCount * adsEffect", calcStack), 0);
            /* console.log('Lambda', calcStack.lambda);*/
            calcStack.budget  = math.round(math.eval("budget - ((equipCount * equipCoast) + (adsCount * adsCoast))", calcStack), 2);
            /*   console.log(calcStack.budget);*/
            if (calcStack.budget <= 0 ) {
                /* console.log('Бюджет израсходован');*/
                return -1;
            }
            calcStack.rho = math.round(math.eval('lambda / mu', calcStack), 5);
            if ((calcStack.rho / calcStack.equipCount) >= 1) {
                /* console.log('Очередь будет расти до бесконечности');*/
                return 0;
            }
            //расчет коэффициентов для вычисления P отказа
            for (var i = 1; i <= equipCount; i++) {
                    if (i === 1) {
                        calcStack.equipCoefficient = math.round(math.eval("1 + rho ^ "+i+" / "+i+"!", calcStack), 5);
                        continue;
                    }
                    if (i === equipCount) {
                        calcStack.equipCoefficient = math.round(math.eval("equipCoefficient + rho ^ "+i+" / "+i+"! + rho ^ "+(i+1)+" / "+i+"! * ("+i+" - rho)", calcStack), 5);
                    }
                    calcStack.equipCoefficient = math.round(math.eval("equipCoefficient + rho ^ "+i+" / "+i+"!", calcStack), 5);
                
            }

       /*   for (var i = 1; i <= calcStack.maxEqiupCount; i++) {
                    if (i === 1) {
                        calcStack.equipCoefficient[i] = math.round(math.eval("1 + rho ^ "+i+" / "+i+"!", calcStack), 5);
                        continue;
                    }
                calcStack.equipCoefficient[i] = math.round(math.eval(calcStack.equipCoefficient[i-1]+" + rho ^ "+i+" / "+i+"! + rho ^ "+(i+1)+" / "+i+"! * ("+i+" - rho)", calcStack), 5);
            }*/
            //Вероятность, что канал свободен (доля времени простоя каналов).
            calcStack.RhoOtk = math.round(math.eval("equipCoefficient^(-1)", calcStack), 6);
            calcStack.RhoOch = math.round(math.eval("rho ^ (equipCount + 1) * RhoOtk / equipCount! * (equipCount - rho)", calcStack), 5);
            calcStack.LOch   = math.round(math.eval("equipCount * RhoOch / (equipCount - rho)", calcStack), 5);
            calcStack.TOch   = math.round(math.eval("LOch / lambda", calcStack), 5);
            calcStack.LSyst  = math.round(math.eval("LOch + rho", calcStack), 5); // Среднее число заявок в системе (т.е. заявки, которые уже обслуживаются, и те, которые еще стоят в очереди и ждут обслуживания).
            calcStack.TSyst  = math.round(math.eval("LSyst / lambda", calcStack), 5);

            calcStack.moneyForDowntime = math.round(math.eval("payForDowntime * TOch * period",calcStack), 0);
            calcStack.profit           = math.round(math.eval("LSyst * proposalIncome * period",calcStack), 0);
            
            cleanProfit     = math.round(math.eval("profit - moneyForDowntime",calcStack), 0); //? включать ли в статистику оставшийся бюджет

            this._calcStack = calcStack;
            console.log('При оборуд. = ', equipCount, 'И рекламе равной  ', adsCount);
            console.log('Индикаторы равны');
            console.dir(this._calcStack);
            
            return cleanProfit;
        },
        selectOptimalStrategy: function () {
            var eqiupCount       = 0,
                adsCount         = 0,
                cache            = [],
                incomingData     = this._incomingData, number,
                maxAdsCount      = math.round(math.eval("budget / ads_coast", incomingData), 0),
                maxEquipCount    = math.round(math.eval("budget / equip_coast", incomingData), 0),
                optimalEquipment = 0,
                optimalAds       = 0,
                maxIncome        = 0,
                answer           = {};

                for(adsCount = 0; adsCount < maxAdsCount; adsCount++) {
                    cache[adsCount] = [];
                    for (eqiupCount = 1; eqiupCount <= maxEquipCount; eqiupCount++) {
                        cache[adsCount][eqiupCount] = this._getResult(adsCount, eqiupCount);
                        if (cache[adsCount][eqiupCount] == -1) {
                            break;
                        }
                    }
                    if (cache[adsCount].length < 1) {
                        break;
                    }
                }

                for (var i = 0; i < cache.length; i++) {
                    for (var j = 0; j <= cache[i].length; j++) {
                        if (cache[i][j] > maxIncome) {
                            maxIncome=cache[i][j];
                            optimalAds=i;
                            optimalEquipment=j;
                        } 
                    }
                }    
            
/*            console.log("Оптимальная стратегия равна: ", "Доход:", maxIncome, "Реклама", optimalAds, "Оборудование", optimalEquipment);
              console.dir(cache);*/ 
            answer = {
                maxIncome       : maxIncome,
                optimalAds      : optimalAds,
                optimalEquipment: optimalEquipment
            };
            this._getResult(optimalAds, optimalEquipment); //расчитать значения индикаторов по оптимальной стратегии (dummy_method)

            dataSet.trigger('optimalStrategy', answer);
            dataSet.trigger('QTIndicators', this._calcStack);
        },
        getQTIndicators: function () {
            dataSet.trigger('QTIndicators', this._calcStack);
        }
};


module.exports = _calculate;