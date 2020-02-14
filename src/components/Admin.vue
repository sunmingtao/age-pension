<template>
    <div class="container" v-if="isDataFetched">
        <div class="row">
            <div class="col-md-6 col-md-offset-3">
                
                <form class="form-horizontal">
                    <div class="form-row col-md-12">
                        <h3>Foreign currency exchange rate</h3>
                    </div>
                    <div class="form-row">
                        <label for="currency-cny" class="col-md-4 control-label">CNY</label>
                        <div class="form-group col-md-6">
                            <input step="any" id="currency-cny" type="number" v-model.number="currencyReferenceData.cny" class="form-control" @keypress="isNumber($event)">
                        </div>
                    </div>
                    <div class="form-row col-md-12">
                        <h3>Age pension reference data</h3>
                    </div>
                    <div class="form-row">
                        <label class="col-md-4 control-label">Income limit</label>
                        <div class="form-group col-md-3">
                            <input step="any" id="income-limit-single" type="number" v-model.number="pensionReferenceData.incomeLimit.single" class="form-control" @keypress="isNumber($event)">
                            <small>single</small>
                        </div>

                        <div class="form-group col-md-1">
                        </div>

                        <div class="form-group col-md-3">
                            <input step="any" id="income-limit-couple" type="number" v-model.number="pensionReferenceData.incomeLimit.couple" class="form-control" @keypress="isNumber($event)">
                            <small>couple</small>
                        </div>
                    </div>

                    <div class="form-row">
                        <label class="col-md-4 control-label">Max age pension amount</label>
                        <div class="form-group col-md-3">
                            <input step="any" id="max-age-pension-amount-single" type="number" v-model.number="pensionReferenceData.maxPensionAmount.single" class="form-control" @keypress="isNumber($event)">
                            <small>single</small>
                        </div>

                        <div class="form-group col-md-1">
                        </div>

                        <div class="form-group col-md-3">
                            <input step="any" id="max-age-pension-amount-couple" type="number" v-model.number="pensionReferenceData.maxPensionAmount.couple" class="form-control" @keypress="isNumber($event)">
                            <small>couple</small>
                        </div>
                    </div>

                    <div class="form-row">
                        <label class="col-md-4 control-label">Deemd earning asset threshold</label>
                        <div class="form-group col-md-3">
                            <input step="any" id="deemed-earning-asset-threshold-single" type="number" v-model.number="pensionReferenceData.deemedEarningAssetThreshold.single" class="form-control" @keypress="isNumber($event)">
                            <small>single</small>
                        </div>

                        <div class="form-group col-md-1">
                        </div>

                        <div class="form-group col-md-3">
                            <input step="any" id="deemed-earning-asset-threshold-couple" type="number" v-model.number="pensionReferenceData.deemedEarningAssetThreshold.couple" class="form-control" @keypress="isNumber($event)">
                            <small>couple</small>
                        </div>
                    </div>

                    <div class="form-row col-md-12 col-md-offset-5">
                        <button class="btn btn-primary" @click.prevent="saveReferenceData">Save</button>
                    </div>
                </form>        
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
                data.currency['usd'] = 0.7;
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


<style scoped>
  label {
    display: inline;
  }

  h3 {
      text-align: center;
  }

  .btn {
      text-align: center;
  }
</style>