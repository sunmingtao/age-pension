<template>
    <div class="container" v-if="isDataFetched">
        <div class="row">
            <div class="col-md-6 col-md-offset-3">
                <h3>Foreign currency exchange rate</h3>
                <div class="form-row">
                    <div class="form-group col-md-12">
                        <label for="currency-cny">CNY</label>
                        <input id="currency-cny" type="number" v-model.number="currencyReferenceData.cny" class="form-control" @keypress="isNumber($event)">
                    </div>
                </div>
                <h3>Age pension reference data</h3>
                <div class="form-row">
                    <div class="form-group col-md-12">
                        <h5>Income limit</h5>
                    </div>

                    <div class="form-group col-md-6">
                        <label for="income-limit-single">Single</label>
                        <input id="income-limit-single" type="number" v-model.number="pensionReferenceData.incomeLimit.single" class="form-control" @keypress="isNumber($event)">
                    </div>

                    <div class="form-group col-md-6">
                        <label for="income-limit-couple">Couple</label>
                        <input id="income-limit-couple" type="number" v-model.number="pensionReferenceData.incomeLimit.couple" class="form-control" @keypress="isNumber($event)">
                    </div>

                    <div class="form-group col-md-12">
                        <h5>Max age pension amount</h5>
                    </div>

                    <div class="form-group col-md-6">
                        <label for="max-age-pension-amount-single">Single</label>
                        <input id="max-age-pension-amount-single" type="number" v-model.number="pensionReferenceData.maxPensionAmount.single" class="form-control" @keypress="isNumber($event)">
                    </div>

                    <div class="form-group col-md-6">
                        <label for="max-age-pension-amount-couple">Couple</label>
                        <input id="max-age-pension-amount-couple" type="number" v-model.number="pensionReferenceData.maxPensionAmount.couple" class="form-control" @keypress="isNumber($event)">
                    </div>

                    <div class="form-group col-md-12">
                        <h5>Deemd earning asset threshold</h5>
                    </div>

                    <div class="form-group col-md-6">
                        <label for="deemed-earning-asset-threshold-single">Single</label>
                        <input id="deemed-earning-asset-threshold-single" type="number" v-model.number="pensionReferenceData.deemedEarningAssetThreshold.single" class="form-control" @keypress="isNumber($event)">
                    </div>

                    <div class="form-group col-md-6">
                        <label for="deemed-earning-asset-threshold-couple">Couple</label>
                        <input id="deemed-earning-asset-threshold-couple" type="number" v-model.number="pensionReferenceData.deemedEarningAssetThreshold.couple" class="form-control" @keypress="isNumber($event)">
                    </div>
                </div>
                <hr>
                <button class="btn btn-primary" @click="saveReferenceData">Save</button>
            </div>
        </div>
    </div>
</template>


<script>

    import myMixin from '../mixin';

    export default {
        mixins: [myMixin],
        methods: {
            saveReferenceData(){
                const data = {};
                data.pension = this.pensionReferenceData;
                data.currency = this.currencyReferenceData;
                this.$http.put('https://age-pension.firebaseio.com/refData.json', data)
                    .then(response => {
                        if (response.status == '200') {
                            alert('Data saved successfully');
                        }
                    }, error => {
                        console.log(error);
                        alert('Error!');
                    });
            }
        },
        beforeMount: function(){
            this.fetchReferenceData();
        },
    }
</script>