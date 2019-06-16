Component({
  data: {

  },
  properties: {
    type: {
      type: String,
      observer(newVal) {
        newVal == 'loading' ? this.loadModal() : this.hideModal();
      }
    },
    isLoading:{
      type:Boolean
    },
    loadColor:{
      type:String
    },
    loadText:{
      type:String
    },
    loadLogo:{
      type:String
    },
    loadOpacity:{
      type:Number
    }
  },
  methods: {
    loadModal() {
      this.setData({
        loadModal: true
      })
    },
    hideModal(){
      this.setData({
        loadModal:false
      })
    }
  }
})