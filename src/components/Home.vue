<template>
  <div class="container" v-if="isDataFetched">
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <h1>{{ msg }}</h1>
        <div class="form-group col-md-12">
          <label for="single"> <input type="radio" v-model="singleCouple" id="single" value="single"> Single </label>
          <label for="couple"> <input type="radio" v-model="singleCouple" id="coupld" value="couple"> Couple </label>
        </div>
        <p>
          Maximum pension amount a {{singleCouple }} can get fortnightly: {{ maxPensionAmount | toCurrency }}
        </p>
        <h3>Income test</h3>
        <br>
        <div class="form-row">
          <div class="form-group col-md-9">
            <label for="income">Income amount</label>
            <input id="income" type="number" v-model.number="incomeAmount" class="form-control" @keypress="isNumber($event)">
          </div>
          <div class="form-group col-md-3">
              <label for="currency">Currency</label>
              <select id="currency" class="form-control" v-model="selectedCurrency">
                <option v-for="currency in currencies" :key="currency">{{ currency }}</option>
              </select>
              <small v-show="selectedCurrency != 'AUD'" class="form-text text-muted">1 AUD = {{this.currencyReferenceData.cny}} CNY</small>
          </div>
        </div>
        <div class="form-group col-md-12">
          <label class="custom-control-label" for="fortnightly"> <input type="radio" v-model="frequency" id="fortnightly" value="fortnightly"> Fortnightly </label>
          <label class="custom-control-label" for="monthly"> <input type="radio" v-model="frequency" id="monthly" value="monthly"> Monthly </label>
        </div>
        <hr>
        <p>Fortnightly income (AUD) = <b> {{ fortnightlyIncomeAud | toCurrency }}</b></p>
        <h3>Asset test</h3>
        <br>
        <div class="form-group col-md-12">
          <label for="investment-property-value">Total investment property value (AUD)</label>      
          <div class="input-group">
            <span class="input-group-addon">$</span><input id="investment-property-value" type="number" v-model.number="investmentPropertyValue" @keypress="isNumber($event)" class="form-control">
          </div>
        </div>
        <div class="form-group col-md-12">
          <label for="saving-balance">Total savings account balance (AUD)</label>      
          <div class="input-group">
            <span class="input-group-addon">$</span><input id="saving-balance" type="number" v-model.number="savingBalance" @keypress="isNumber($event)" class="form-control">
          </div>
        </div>
        <div class="form-group col-md-12">
          <label for="super-balance">Total superannuation balance (AUD)</label>     
          <div class="input-group"> 
            <span class="input-group-addon">$</span><input id="super-balance" type="number" v-model.number="superBalance" @keypress="isNumber($event)" class="form-control">
          </div>
        </div>
        <p>Total asset value = {{totalAssetValue | toCurrency}}</p>
        <p>Deemed earning from asset threshold for {{ singleCouple }} = {{deemedEarningAssetThreshold | toCurrency }}</p>
        <p>Deemed earning below threshold = {{assetAmountBelowThreshold | toCurrency }} * 1% = {{ deemedEarningAmountBelowThreshold | toCurrency }}</p>
        <p>Deemed earning above threshold = {{assetAmountAboveThreshold | toCurrency }} * 3% = {{ deemedEarningAmountAboveThreshold | toCurrency }}</p>
        <p>Total yearly deemed earning = {{totalYearlyDeemedEarningAmount | toCurrency }}</p>
        <p>Total fortnightly deemed earning = <b>{{ totalFortnightlyDeemedEarningAmount | toCurrency }}</b></p>
        <hr>
        <p>Total fortnightly income plus deemed earning = {{fortnightlyIncomeAud | toCurrency }} + {{totalFortnightlyDeemedEarningAmount | toCurrency }} = {{totalFortnightlyIncomePlusDemmedEarningAmount | toCurrency }}</p>
        <p>Fortnightly income limit for {{ singleCouple }}= {{fortnightlyIncomeLimit | toCurrency }}</p>
        <p>The amount above limit = {{totalFortnightlyIncomePlusDemmedEarningAmount | toCurrency }} - {{fortnightlyIncomeLimit | toCurrency }} = {{fortnightlyIncomeAboveLimit | toCurrency}}</p>
        <p>The pension amount is deducted by {{fortnightlyIncomeAboveLimit | toCurrency}} / 2 = {{ fortnightlyIncomeAboveLimit / 2 | toCurrency}} </p>
        <p>The remaining pension amount after deduction = {{ maxPensionAmount | toCurrency }} - {{fortnightlyIncomeAboveLimit / 2 | toCurrency}} = <b>{{ pensionAmountAfterIncomeDeduction | toCurrency}}</b></p>
      </div>
    </div>
  </div>  
</template>

<script>

import myMixin from '../mixin';

export default {
  mixins: [myMixin],
  data(){
    return {
      singleCouple: 'couple',
      deemedEarningAssetThresholdFor: {
        single: 51800,
        couple: 86200,
      },
      incomeAmount: 0,
      frequency: 'monthly',
      currencies: ['AUD', 'CNY'],
      selectedCurrency: 'CNY',
      investmentPropertyValue: 0,
      savingBalance: 0,
      superBalance: 0,
    }
  },
  props: {
    msg: String
  },
  beforeMount: function(){
    this.fetchReferenceData();
  },
  filters: {
    toCurrency: function (value) {
      if (typeof value !== "number") {
        return value;
      }
      var formatter = new Intl.NumberFormat('en-AU', {
          style: 'currency',
          currency: 'AUD',
          minimumFractionDigits: 0
      });
      return formatter.format(value);
    }
  },
  computed: {
    maxPensionAmount() {
      if (this.singleCouple == 'single'){
        return this.pensionReferenceData.maxPensionAmount.single * 1;
      }else {
        return this.pensionReferenceData.maxPensionAmount.couple * 1;
      }
    },
    fortnightlyIncomeLimit() {
      if (this.singleCouple == 'single'){
        return this.pensionReferenceData.incomeLimit.single * 1;
      }else {
        return this.pensionReferenceData.incomeLimit.couple * 1;
      }
    },
    fortnightlyIncomeAud() {
      let fortnightlyIncome = this.incomeAmount * 1;
      if (this.frequency == 'monthly') {
        fortnightlyIncome = fortnightlyIncome * 12 / 26;
      }
      if (this.selectedCurrency == 'CNY') {
        fortnightlyIncome = fortnightlyIncome / this.currencyReferenceData.cny;
      }
      return fortnightlyIncome.toFixed(2) * 1;
    },
    totalAssetValue() {
      return (this.investmentPropertyValue + this.savingBalance + this.superBalance).toFixed(2) * 1;
    }, 
    deemedEarningAssetThreshold() {
      if (this.singleCouple == 'single'){
        return this.pensionReferenceData.deemedEarningAssetThreshold.single;
      }else {
        return this.pensionReferenceData.deemedEarningAssetThreshold.couple;
      }
    },
    assetAmountBelowThreshold() {
      if (this.totalAssetValue > this.deemedEarningAssetThreshold) {
        return this.deemedEarningAssetThreshold;
      }else {
        return this.totalAssetValue;
      }
    },
    deemedEarningAmountBelowThreshold() {
      return (this.assetAmountBelowThreshold * 0.01).toFixed(2) * 1;
    },
    assetAmountAboveThreshold() {
      if (this.totalAssetValue > this.deemedEarningAssetThreshold) {
        return this.totalAssetValue - this.deemedEarningAssetThreshold;
      }else {
        return 0;
      }
    },
    deemedEarningAmountAboveThreshold() {
      return (this.assetAmountAboveThreshold * 0.03).toFixed(2) * 1;
    },
    totalYearlyDeemedEarningAmount() {
      return (this.deemedEarningAmountBelowThreshold * 1 + this.deemedEarningAmountAboveThreshold * 1).toFixed(2) * 1;
    },
    totalFortnightlyDeemedEarningAmount() {
      return (this.totalYearlyDeemedEarningAmount / 26).toFixed(2) * 1;
    },
    totalFortnightlyIncomePlusDemmedEarningAmount() {
      return (this.fortnightlyIncomeAud * 1 + this.totalFortnightlyDeemedEarningAmount * 1).toFixed(2) * 1;
    },
    fortnightlyIncomeAboveLimit(){
      let income = this.totalFortnightlyIncomePlusDemmedEarningAmount;
      let incomeLimit = this.fortnightlyIncomeLimit;
      if (income < incomeLimit) {
        return 0;
      }else {
        return (income - incomeLimit).toFixed(2) * 1;
      }
    },
    pensionAmountAfterIncomeDeduction() {
      if (this.maxPensionAmount > this.fortnightlyIncomeAboveLimit / 2) {
        return (this.maxPensionAmount - this.fortnightlyIncomeAboveLimit / 2).toFixed(2) * 1;
      }else{
        return 0;
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  label {
    display: inline;
  }
</style>
