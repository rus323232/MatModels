var math = require('math');

var _calculate = {
    _incomingData: {},
    _calcStack: {},
    init: function (obj) {
        for (i in obj) {
            obj[i] = parseInt(obj[i]);
            if (isNaN(obj[i])) {
                alert('Только целочисленные значения');
                return;
            }
       }
       
       this._incomingData = obj;
       this.selectOptimalStrategy();
      
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
    
            console.log(k-1);
        }
    },
    _generateRandomTime: function (freq) {
        var proposalFreq = freq || 4,
            period = 24 / proposalFreq,
            proposalTime = 0, i, timeLine = [];
        for (i = 0; i < proposalFreq; i++) {
            proposalTime = math.round(math.random(period), 1);
            timeLine[i] = proposalTime;
        }
        
        return timeLine;
    },
    _calcQTIndicators: function () {
       var incomingData = this._incomingData;
       var calcStack = this._calcStack;

       /*console.log(incomingData);*/
       calcStack.payForDowntime = incomingData.pay_for_downtime;
       calcStack.period = incomingData.period;
       calcStack.proposalIncome = incomingData.proposal_income;
       calcStack.lambda = incomingData.proposal_freq;
       calcStack.adsEffect = incomingData.ads_effect;
       calcStack.budget = incomingData.budget;
       calcStack.equipCoast = incomingData.equip_coast;
       calcStack.adsCoast = incomingData.ads_coast;
       calcStack.TObs = math.round(math.eval("1 / equip_proposal", incomingData), 5);
       calcStack.mu =  math.round(math.eval("1 / TObs", calcStack), 5);
       calcStack.maxEqiupCount = math.round(math.eval("budget / equipCoast", calcStack), 0);
       calcStack.equipCoefficient = [];

       
       this._calcStack = calcStack;
    },
    getResult: function (adsCount, equipCount) {
      this._calcQTIndicators(); //определить входные параметры для расчета
        //добавить проверку входных данных
      var incomingData = this._incomingData, calcStack = this._calcStack, cleanProfit;
          calcStack.adsCount = adsCount;
          calcStack.equipCount = equipCount;
           
      calcStack.lambda = math.round(math.eval("lambda + adsCount * adsEffect", calcStack), 0);
      calcStack.budget  = math.round(math.eval("budget - ((equipCount * equipCoast) - (adsCount * adsCoast))", calcStack), 2);

      if (calcStack.budget <= 0 ) {
          console.log('Бюджет израсходован');
          return -1;
      }
      calcStack.rho = math.round(math.eval('lambda * TObs', calcStack), 5);
      if ((calcStack.rho / calcStack.equipCount) >= 1) {
          console.log('Очередь будет расти до бесконечности');
          return 0;
      }

      for (var i = 1; i <= calcStack.maxEqiupCount; i++) {
            if (i === 1) {
                calcStack.equipCoefficient[i] = math.round(math.eval("1 + rho ^ "+i+" / "+i+"!", calcStack), 5);
                continue;
            }
            calcStack.equipCoefficient[i] = math.round(math.eval(calcStack.equipCoefficient[i-1]+" + rho ^ "+i+" / "+i+"!", calcStack), 5);
      }
      
      calcStack.RhoOtk = math.round(math.eval(calcStack.equipCoefficient[calcStack.equipCount]+"^-1"), 6);
      calcStack.RhoOch = math.round(math.eval("rho ^ (equipCount + 1) / equipCount! * (equipCount - rho) * RhoOtk", calcStack), 5);
      calcStack.LOch   = math.round(math.eval("(rho ^ (equipCount + 1) * RhoOtk) / (equipCount * equipCount! ) * (1 - rho / equipCount)^-2", calcStack), 5);
      calcStack.TOch   = math.round(math.eval("LOch / lambda", calcStack), 5);
      calcStack.LSyst  = math.round(math.eval("LOch + rho", calcStack), 5);
      calcStack.TSyst  = math.round(math.eval("LSyst / lambda", calcStack), 5);

      calcStack.moneyForDowntime = math.round(math.eval("(payForDowntime * TOch) * period",calcStack), 0);
      calcStack.profit           = math.round(math.eval("(LSyst * proposalIncome) * period",calcStack), 0);

      cleanProfit      = math.round(math.eval("profit - moneyForDowntime + budget",calcStack), 0);

      this._calcStack = calcStack;
      
      return cleanProfit;
    },

    selectOptimalStrategy: function () {
        var eqiupCount=0, adsCount = 0, cache = [], incomingData = this._incomingData, number,
             maxAdsCount = math.round(math.eval("budget / ads_coast", incomingData), 0);

             do { 
                 cache[adsCount] = [];
                 do {
                     eqiupCount++;
                    /* number = String(adsCount)+String(eqiupCount);*/
                     cache[adsCount][eqiupCount] = this.getResult(adsCount, eqiupCount);
                 } while (cache[adsCount][eqiupCount] != -1);
                 adsCount++;
                 eqiupCount = 0;
             } while (adsCount != 2);
     
        console.dir(cache);
        
    }
};


module.exports = _calculate;