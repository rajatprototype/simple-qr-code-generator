var blob = null;

const app = new Vue({
  el: "#app",

  data() {
    return {
      qrvalue: '',
      qrStaticValue: '',
      qrsource: null,
      qrExpand: false,
      loadingState: false
    }
  },
  mounted() {
    const lastAccess = this.lastAccessQRValue;

    if (lastAccess) {
      this.qrvalue = lastAccess;
      this.generateQRCode()
    }
  },
  methods: {
    async reGenerateQRCode() {
      this.qrsource = null;
      await this.generateQRCode()
    },
    async generateQRCode() {
      if (this.qrvalue.length === 0) {
        alert("Require input value");
        return null;
      } 
      this.loadingState = true;

      const blob = await this.getBlobObject();
      const imageurl = this.getImageUrl(blob);

      this.loadingState = false;

      this.qrsource = imageurl;

      this.qrStaticValue = this.qrvalue;

      // For later use
      this.setHistory(this.qrvalue);
    },

    clearInputs() {
      this.qrvalue = '';
      this.qrStaticValue = '';
      this.qrsource = null;
      localStorage.clear();
    },

    toggleExpandState(ev) {
      console.log(ev);
    },

    /**
     * Get BLOB object
     * @returns {Promise<Blob>}
     */
    async getBlobObject() {
      const response = await fetch(this.buildUrl(this.qrvalue || "Test"));
      return await response.blob();
    },

    /**
     * Get Image url from BLOB
     * @param {Blob} data - Blob object 
     * @returns {string}
     */
    getImageUrl(data) {
      return URL.createObjectURL(data)
    },

    /**
     * Save value in localStorage
     * @param {string} value - Value
     * @returns {string}
     */
    setHistory(value) {
      return localStorage.setItem("LAST_ACCESS_QR", value) || value;
    },

    /**
     * Build URL string
     * @param {string} data - Data string
     * @param {number} size - Image size
     * @returns {string}
     */
    buildUrl(data = 'Example', size = 350) {
      return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}`;
    }
  },

  computed: {
    lastAccessQRValue() {
      return localStorage.getItem('LAST_ACCESS_QR');
    }
  }
});