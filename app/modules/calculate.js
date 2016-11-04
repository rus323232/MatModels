var _calculate = {
    init: function (obj) {
        this._incomingData = obj;
        for (i in this._incomingData) {
            this._incomingData[i] = parseInt(this._incomingData[i]);
            if (isNaN(this._incomingData[i])) {
                alert('Только целочисленные значения');
                return;
            }
       }
       console.log(obj.proposal_freq);
       this._generateRandomProposal(obj.proposal_freq);
       
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
       

        /*return k-1;*/
    },
    _getRandom: function (min, max) {
        var min = min || 1, 
            max = max || 24,
            answer;
            
        answer = Math.random() * (max - min + 1) + min;

        return answer;
    },
    _generateRandomProposal: function (freq) {
        var proposal_freq = freq || 4,
            period = 24 / proposal_freq;
            proposal_time = 0, i,
            randomTime = this._getRandom;
        for (i = 0; i < proposal_freq; i++) {

            proposal_time = randomTime(0, period);
           
            console.log('Period = '+period);
            console.log('Proposal_time'+proposal_time);
    
        }
      
    }

};


module.exports = _calculate;