export default {
    data(){
        return {
            currencies: ['aud'],
            pensionReferenceData: {
                incomeLimit: {
                    single: 0,
                    couple: 0
                },
                maxPensionAmount: {
                    single: 0,
                    couple: 0
                },
                deemedEarningAssetThreshold: {
                    single: 0,
                    couple: 0
                },
            },
            currencyReferenceData: {
                cny: 1,
            },
            isDataFetched: false,
        }
    },
    methods: {
        isNumber(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        fetchReferenceData(){
            this.$http.get('')
                .then(response => {
                return response.json();
                }).then(data => {
                this.pensionReferenceData = data.pension;
                this.currencyReferenceData = data.currency;
                Array.prototype.push.apply(this.currencies, Object.keys(this.currencyReferenceData));
                this.isDataFetched = true;
                });
        },
    },
    filters: {
        toUpperCase: function (value) {
          if (value){
            return value.toUpperCase();
          }else{
            return '';
          }
        }
    },
}